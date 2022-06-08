from os.path import join, exists
from os import listdir, remove
from flask import Flask, flash, request, render_template, url_for, session, send_file, Response
from flask_mysqldb import MySQL
from werkzeug.utils import redirect, secure_filename
from werkzeug.wsgi import FileWrapper
from time import time
import icdutils
import csv, json, io
from sqlhandler import SQLHandler

UPLOAD_FOLDER = "./static/img/"
METADATA_FILE = "meta.csv"
METADATA_JSON = "meta.json"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'pdf', 'tiff', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'wasd8064.MSL'
app.config['MYSQL_DB'] = 'skinimages'

sqlhandler = SQLHandler(app)

# pre: filename is a valid file name with a file extension
# post: returns if the file is within the accepted files in ALLOWED_EXTENSIONS
def allowedFile(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# redirects homepage to submission page for convenience
@app.route('/', methods=['POST', 'GET'])
def home():
    DATA = sqlhandler.read_from_metadata()
    entries = []
    max_entries = 6
    num_entries = 0

    for key in DATA.keys():
        entry = DATA[key].copy()
        if (entry['verified'] == 1):
            if (num_entries >= max_entries):
                break
            entries.append(entry)
            num_entries += 1
    
    if request.method == "POST":

        # get ID from verify button
        post_method = request.form['verify']
        if post_method == "Download":
            # get initial variables
            filesToDownload = request.form['filelist'].split(';')[:-1]
            metaformat = request.form['metaformat']

            # TODO: CREATE ZIP FROM IMAGES TO SEND AS FILE
            meta = {}
            for file in filesToDownload:
                id = file.split('.')[0]
                meta[id] = DATA[id].copy()
                del meta[id]['results']
                print(meta)
            if metaformat == "csv":
                pass
            elif metaformat == "json":
                metadata_file_path = join(app.static_folder, METADATA_JSON)
                with (open(metadata_file_path, "w") as f):
                    json.dump(meta, f, ensure_ascii=False, indent=4)
                return send_file(metadata_file_path, as_attachment=True)

    return render_template("index.html", entries=entries)

@app.route('/quiz', methods=['POST', 'GET'])
def quiz():
    # set up back_url for redirects
    back_url = url_for('quiz')

    # submission
    if request.method == 'POST':
        # searches answer
        query = request.form['search']

        # if the search is empty, refresh page
        if query == '':
            return redirect(request.url)
        
        # compile all numerical IDs from icdutils
        IDs = icdutils.searchGetIDs(query)
        confirmID = IDs[0]
        confirmation = "Incorrect"
        if confirmID == '1627987797':
            confirmation = "Correct!"
        return redirect(url_for('confirm', confirmation=confirmation, back_url=back_url))
    return render_template("quiz.html")

@app.route('/submit', methods=['POST', 'GET'])
def submit():
    definition = "No Description Found."
    desc_hide = "hidden-passthrough"
    back_url = url_for('submit')
    results=[]
    if 'query' in request.args.keys():
        query = request.args['query']
        if query == "":
            return redirect(request.url)
        results = icdutils.searchGetPairs(query)
        hideclass = ""
    else:
        query = ""
        results=[]
        hideclass = "hidden-passthrough"

    if request.method == 'POST':
        submit_method = request.form['submit']
        if submit_method == "Search":
            query = request.form['search']
            if query == "":
                return redirect(request.url)
            results = icdutils.searchGetPairs(query)
            hideclass = ""
        elif submit_method == "Check Definition":
            uri = request.form['results']
            definition = icdutils.getDescriptionByID(uri)
            desc_hide = ""
            hideclass = ""
            query = request.form['search']
            if query == "":
                return redirect(request.url)
            results = icdutils.searchGetPairs(query, current_uri=uri)
        elif submit_method == "Upload":
            # check for no file
            if 'filename' not in request.files:
                return redirect(request.url)
            
            file = request.files['filename']
            
            # check for empty file name
            if file.filename == '':
                return redirect(request.url)
            
            # file exists
            if file and allowedFile(file.filename):
                utc_code = str(round(time() * 1000))
                uri = request.form['results']
                fileEnding = file.filename.split('.')[-1]

                filename_str = utc_code + "." + fileEnding

                filename = secure_filename(filename_str)
                file.save(join(app.config['UPLOAD_FOLDER'], filename))

                # get exact query and search results
                query = request.form['search']
                return redirect(url_for('upload', imgname=filename, uri=uri, back_url=back_url, query=query))

    return render_template("submit.html", results=results, query=query, hideclass=hideclass, desc_hide=desc_hide, definition=definition)

@app.route('/confirm', methods=['POST', 'GET'])
def confirm():
    confirmation = request.args['confirmation']
    back_url = request.args['back_url']
    if request.method == 'POST':
        return redirect(back_url)
    return render_template("confirmation.html", confirmation = confirmation, back_url = back_url)

@app.route('/upload', methods=['POST', 'GET'])
def upload():
    imgname = request.args['imgname']
    uri = request.args['uri']
    back_url = request.args['back_url']
    query = request.args['query']
    diagnosis = icdutils.getEntityByID(uri)
    definition = icdutils.getDescriptionByID(uri)

    try:
        with (open(join(app.static_folder, METADATA_JSON), "r") as f):
            DATA = json.load(f)
    except:
        DATA = {}

    if request.method == "POST":
        postMethod = request.form["upload"]
        if postMethod == "Edit":
            filePath = join(app.config['UPLOAD_FOLDER'], imgname)

            if exists(filePath):
                remove(filePath)

            return redirect(url_for('submit', query = query, hideclass = ""))
        elif postMethod == "Confirm":
            utc_code = imgname.split('.')[0]

            results = icdutils.searchGetPairs(query)

            unit = {
                'id':utc_code,
                'uri':uri,
                'file':imgname,
                'title':diagnosis,
                'results':results,
                'verified':0
            }
            DATA[utc_code] = unit

            sqlhandler.save_into_metadata(unit)
            
            confirmation = "Uploaded successfully!"
            return redirect(url_for("confirm", confirmation = confirmation, back_url = back_url))
    
    return render_template("upload.html", imgname=imgname, diagnosis=diagnosis, definition=definition, uri=uri)

@app.route('/verify', methods=['POST', 'GET'])
def verify():

    DATA = sqlhandler.read_from_metadata()

    entries = []

    for key in DATA.keys():
        entry = DATA[key].copy()
        if (entry['verified'] == 1):
            entry['title'] += " ✅"
        entries.append(entry)
    
    if request.method == "POST":

        # get ID from verify button
        post_method = request.form['verify']
        if post_method == "Delete":
            reqid = request.form['imgID']
            # TODO: Add deletion confirmation pop up
            filePath = join(app.config['UPLOAD_FOLDER'], DATA[reqid]['file'])
            if exists(filePath):
                print ("File exists at " + filePath)
                remove(filePath)
                print ("File deleted")
            sqlhandler.delete_from_metadata(reqid)
            del DATA[reqid]
            return redirect(request.url)
        elif post_method == "Verify":
            reqid = request.form['imgID']
            # TODO: Add diagnosis modification confirmation pop up
            # get data from form
            correctedURI = request.form['results']
            correctedTitle = icdutils.getEntityByID(correctedURI)

            # change URI to new URI from form, change verified to 1
            DATA[reqid]['uri'] = correctedURI
            DATA[reqid]['title'] = correctedTitle
            DATA[reqid]['verified'] = 1
            sqlhandler.update_image(reqid, correctedURI, correctedTitle)
            return redirect(request.url)
        elif post_method == "Download":
            # get initial variables
            filesToDownload = request.form['filelist'].split(';')[:-1]
            metaformat = request.form['metaformat']

            # TODO: CREATE ZIP FROM IMAGES TO SEND AS FILE
            meta = {}
            for file in filesToDownload:
                id = file.split('.')[0]
                meta[id] = DATA[id].copy()
                del meta[id]['results']
                print(meta)
            if metaformat == "csv":
                print("Downloaded")
                metafile = io.BytesIO()
                json_data = str.encode(json.dumps(meta, ensure_ascii=False, indent=4, sort_keys=True))
                metafile.write(json_data)
                print(metafile.getvalue())
                metafile.seek(0)
                f = FileWrapper(metafile)
                headers = {
                    'Content-Disposition': 'attachment; filename="meta.json"'
                }
                return Response(f, mimetype="text/plain", direct_passthrough=True, headers=headers)
            elif metaformat == "json":
                metafile = io.BytesIO()
                json_data = str.encode(json.dumps(meta, ensure_ascii=False, indent=4, sort_keys=True))
                metafile.write(json_data)
                print(metafile.getvalue())
                metafile.seek(0)
                f = FileWrapper(metafile)
                headers = {
                    'Content-Disposition': 'attachment; filename="meta.json"'
                }
                return Response(f, mimetype="text/plain", direct_passthrough=True, headers=headers)

    return render_template("verify.html", entries=entries)

# Helper function to search CSV for corresponding entry with ID
# PRE: Takes metadata as array and valid image ID
# POST: Returns i, data as index in metadata and list of data, respectively
def getCorrespondingEntry(data, id):
    for i in range(len(data)):
        entry = data[i]
        if (entry[0] == id):
            return i, entry
    return None

if __name__ == "__main__":
    app.run(debug = True)