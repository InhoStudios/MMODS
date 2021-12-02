from os.path import join, exists
from os import listdir, remove
from flask import Flask, flash, request, render_template, url_for, session
from werkzeug.utils import redirect, secure_filename
from time import time
import icdutils
import csv
import json

UPLOAD_FOLDER = "./static/img/"
METADATA_FILE = "meta.csv"
METADATA_JSON = "meta.json"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'pdf', 'tiff', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# pre: filename is a valid file name with a file extension
# post: returns if the file is within the accepted files in ALLOWED_EXTENSIONS
def allowedFile(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# redirects homepage to submission page for convenience
@app.route('/')
def home():
    return redirect('/submit')

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
        if request.form['results'] != "null":
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
                return redirect(url_for('upload', imgname = filename, uri = uri, back_url = back_url, query = query))
        else:
            query = request.form['search']
            if query == "":
                return redirect(request.url)
            results = icdutils.searchGetPairs(query)
            hideclass = ""
    return render_template("submit.html", results = results, query = query, hideclass = hideclass)

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

            unit = {
                'id':utc_code,
                'uri':uri,
                'file':imgname,
                'title':diagnosis,
                'results':icdutils.searchGetPairs(query),
                'verified':0
            }
            DATA[utc_code] = unit

            with (open(join(app.static_folder, METADATA_JSON), "w") as f):
                json.dump(DATA, f, ensure_ascii=False, indent=4)
            
            confirmation = "Uploaded successfully!"
            return redirect(url_for("confirm", confirmation = confirmation, back_url = back_url))
    
    return render_template("upload.html", imgname = imgname, diagnosis = diagnosis)

@app.route('/verify', methods=['POST', 'GET'])
def verify():

    try:
        with (open(join(app.static_folder, METADATA_JSON), "r") as f):
            DATA = json.load(f)
    except:
        DATA = {}
    entries = []

    for key in DATA.keys():
        entries.append(DATA[key])
        if (DATA[key]['verified'] == 1):
            DATA[key]['title'] += " ✅"
    
    if request.method == "POST":
        reqid = request.form['imgID']
        DATA[reqid]

        # get ID from verify button
        postMethod = request.form['verify']
        if postMethod == "Delete":
            # TODO: Add deletion confirmation pop up
            filePath = join(app.config['UPLOAD_FOLDER'], DATA[reqid]['file'])
            if exists(filePath):
                print ("File exists at " + filePath)
                remove(filePath)
                print ("File deleted")
            del DATA[reqid]
        elif postMethod == "Verify":
            # TODO: Add diagnosis modification confirmation pop up
            # get data from form
            correctedURI = request.form['results']
            correctedTitle = icdutils.getEntityByID(correctedURI)

            # change URI to new URI from form, change verified to 1
            DATA[reqid]['uri'] = correctedURI
            DATA[reqid]['title'] = correctedTitle
            DATA[reqid]['verified'] = 1

        # write data to json
        with (open(join(app.static_folder, METADATA_JSON), "w") as f):
            json.dump(DATA, f, ensure_ascii=False, indent=4)

        return redirect(request.url)
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