# system related imports
from os.path import join, exists
from os import remove
from time import time
import json

# flask imports
from flask import Flask, request, render_template, url_for, send_file
from werkzeug.utils import redirect, secure_filename

# local library imports
from ziputils import InMemoryZip
import icdutils
from sqlhandler import SQLHandler

UPLOAD_FOLDER = "./static/img/"
METADATA_FILE = "meta.csv"
METADATA_JSON = "meta.json"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'pdf', 'tiff', 'gif'}

# configure app variables
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# add sql variables to access sql server
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'wasd8064.MSL'
app.config['MYSQL_DB'] = 'skinimages'

# create instances
sqlhandler = SQLHandler(app)
icd = icdutils.ICDManager()

# pre: filename is a valid file name with a file extension
# post: returns if the file is within the accepted files in ALLOWED_EXTENSIONS
def allowedFile(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# redirects homepage to submission page for convenience
@app.route('/', methods=['POST', 'GET'])
def home():
    # get images to load onto home screen
    DATA = sqlhandler.read_from_metadata()

    # min and max number of images to show on home screen
    entries = []
    max_entries = 6
    num_entries = 0

    # load data into webpage
    for key in DATA.keys():
        entry = DATA[key].copy()
        if (entry['verified'] == 1):
            if (num_entries >= max_entries):
                break
            entries.append(entry)
            num_entries += 1
    
    # user requesting images
    if request.method == "POST":
        post_method = request.form['download']
        if post_method == "Download":
            # get list of files to download and the format of metadata the user requested
            filesToDownload = request.form['filelist'].split(';')[:-1]
            metaformat = request.form['metaformat']

            # create empty dictionary for metadata
            meta = {}

            # create zip archive for files
            zf = InMemoryZip()
            for file in filesToDownload:
                # get metadata and add to metadata dictionary
                id = file.split('.')[0]
                meta[id] = DATA[id].copy()
                del meta[id]['results']

                # add images to zip archive
                filepath = join(app.config['UPLOAD_FOLDER'], file)
                zf.add_image(filepath)
            if metaformat == "csv":
                # create headers
                meta_csv = "image file,diagnosis,icd-11 code,image id,anatomic site,size of lesion,disease severity,difficulty of diagnosis,age,sex,family history,image type\n"
                # create csv string
                for key in meta.keys():
                    image = meta[key]
                    meta_csv = meta_csv + "{},{},{},{},{},{},{},{},{},{},{},{}\n".format(
                        image['file'], image['title'], 
                        str(image['uri']), str(image['id']), 
                        image['site'], str(image['size']), 
                        image['severity'], image['diffofdiag'],
                        str(image['age']), image['sex'], 
                        image['hist'], image['imgtype'])
                # add csv to archive
                zf.add_file("meta.csv", meta_csv)
            elif metaformat == "json":
                # get metadata as json string
                meta_str = json.dumps(meta, ensure_ascii=False, indent=4, sort_keys=True)
                # add csv to archive
                zf.add_file("meta.json", meta_str)
            # send complete zip file
            return send_file(zf.to_byte_stream(), attachment_filename="images.zip", as_attachment=True)

    return render_template("index.html", entries=entries)

# quiz interface: example
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
        IDs = icd.searchGetIDs(query)
        confirmID = IDs[0]
        confirmation = "Incorrect"
        if confirmID == '1627987797':
            confirmation = "Correct!"
        return redirect(url_for('confirm', confirmation=confirmation, back_url=back_url))
    return render_template("quiz.html")

# submission page
@app.route('/submit', methods=['POST', 'GET'])
def submit():
    # initialize default text for fields
    definition = "No definition found."
    desc_hide = "hidden-passthrough"
    back_url = url_for('submit')
    # create array of diagnoses results from search
    results=[]

    # search diagnosis on ICD-11 from redirect
    if 'query' in request.args.keys():
        query = request.args['query']
        if query == "":
            return redirect(request.url)
        results = icd.searchGetPairs(query)
        # show other fields
        hideclass = ""
    else:
        # no query: clear the search box and hide other fields
        query = ""
        results=[]
        hideclass = "hidden-passthrough"

    # user submitting a post request
    if request.method == 'POST':
        submit_method = request.form['submit']

        # user searching for a diagnosis
        if submit_method == "Search":
            query = request.form['search']

            # empty query
            if query == "":
                return redirect(request.url)
            results = icd.searchGetPairs(query)
            hideclass = ""

        # search icd-11 api for diagnosis definition
        elif submit_method == "Check Definition":
            uri = request.form['results']

            # query icd-11 api
            definition = icd.getDescriptionByID(uri)
            desc_hide = ""
            hideclass = ""
            query = request.form['search']
            if query == "":
                return redirect(request.url)
            results = icd.searchGetPairs(query, current_uri=uri)

        # upload image to database
        elif submit_method == "Upload":

            # check for no file
            if 'filename' not in request.files:
                return redirect(request.url)
            
            # get filename
            file = request.files['filename']
            
            # check for empty file name
            if file.filename == '':
                return redirect(request.url)
            
            # file exists
            if file and allowedFile(file.filename):

                # generate id using utc_code
                utc_code = str(round(time() * 1000))

                # get icd-11 disease code
                uri = request.form['results']
                definition = icd.getDescriptionByID(uri)

                # get file type
                fileEnding = file.filename.split('.')[-1]

                # rename and save file
                filename_str = utc_code + "." + fileEnding
                filename = secure_filename(filename_str)
                file.save(join(app.config['UPLOAD_FOLDER'], filename))

                # get exact query and search results
                query = request.form['search']

                # get metadata
                site = request.form['anatomicsite']
                size = request.form['size']
                severity = request.form['presentation']
                diffofdiag = request.form['easeofdiag']
                age = request.form['age']
                sex = request.form['sex']
                hist = request.form['history']
                imgtype = request.form['imgtype']
                if (imgtype == "other"):
                    imgtype = request.form['otherimg']

                # redirect to upload confirmation page
                return redirect(url_for(
                    'upload', 
                    imgname=filename, 
                    uri=uri, 
                    back_url=back_url,
                    definition=definition, 
                    query=query, 
                    site=site,
                    size=size,
                    severity=severity,
                    diffofdiag=diffofdiag,
                    age=age,
                    sex=sex,
                    hist=hist,
                    imgtype=imgtype
                ))
    
    return render_template("submit.html", results=results, query=query, hideclass=hideclass, desc_hide=desc_hide, definition=definition)

# confirmation page template
@app.route('/confirm', methods=['POST', 'GET'])
def confirm():
    # get confirmation message
    confirmation = request.args['confirmation']

    # get redirect url
    back_url = request.args['back_url']

    # redirect on post request
    if request.method == 'POST':
        return redirect(back_url)
    
    return render_template("confirmation.html", confirmation = confirmation, back_url = back_url)

# image upload confirmation page
@app.route('/upload', methods=['POST', 'GET'])
def upload():
    # get data from url for image upload request
    imgname = request.args['imgname']
    uri = request.args['uri']
    back_url = request.args['back_url']
    query = request.args['query']
    definition = request.args['definition']

    # get metadata from upload
    site=request.args['site']
    size=request.args['size']
    severity=request.args['severity']
    diffofdiag=request.args['diffofdiag']
    age=request.args['age']
    sex=request.args['sex']
    hist=request.args['hist']
    imgtype=request.args['imgtype']

    # get diagnoses and definitions from icd-11 api to show to user
    diagnosis = icd.getDiagnosisByID(uri)

    # handle post request
    if request.method == "POST":
        postMethod = request.form["upload"]
        # user wants to change submission
        if postMethod == "Edit":
            # get image file
            filePath = join(app.config['UPLOAD_FOLDER'], imgname)

            # delete image if it has been uploaded
            if exists(filePath):
                remove(filePath)

            # return to previous page with metadata intact
            return redirect(url_for('submit', query = query, hideclass = ""))

        # user is uploading image
        elif postMethod == "Confirm":
            # get image id
            utc_code = imgname.split('.')[0]

            # get alternative diagnoses to save into database
            results = icd.searchGetPairs(query)

            # create dictionary to save into database
            unit = {
                'id':utc_code,
                'uri':uri,
                'file':imgname,
                'title':diagnosis,
                'results':results,
                'site':site,
                'size':size,
                'severity':severity,
                'diffofdiag':diffofdiag,
                'age':age,
                'sex':sex,
                'hist':hist,
                'imgtype':imgtype,
                'verified':0,
                'parents':""
            }

            # save into SQL database
            sqlhandler.save_into_metadata(unit, icd)
            
            # redirect to confirmation page
            confirmation = "Uploaded successfully!"
            return redirect(url_for("confirm", confirmation = confirmation, back_url = back_url))
    
    return render_template(
        "upload.html", 
        imgname=imgname, 
        diagnosis=diagnosis, 
        definition=definition, 
        uri=uri, 
        site=site,
        size=size,
        severity=severity,
        diffofdiag=diffofdiag,
        age=age,
        sex=sex,
        hist=hist,
        imgtype=imgtype
    )

# verification / image browser page
@app.route('/verify', methods=['POST', 'GET'])
def verify():
    # get image data from SQL database
    DATA = sqlhandler.read_from_metadata()

    # create array of entries to show on page
    entries = []

    # copy data from SQL into array
    for key in DATA.keys():
        entry = DATA[key].copy()
        if (entry['verified'] == 1):
            entry['title'] += " ✅"
        entries.append(entry)
    
    categories = sqlhandler.get_categories()

    # handle post request
    if request.method == "POST":

        # get ID from verify button
        post_method = request.form['verify']

        # delete current image from database
        if post_method == "Delete":
            # get image id from form
            reqid = request.form['imgID']

            # TODO: Add deletion confirmation pop up

            filePath = join(app.config['UPLOAD_FOLDER'], DATA[reqid]['file'])

            # remove file
            if exists(filePath):
                remove(filePath)

            # remove metadata
            sqlhandler.delete_from_metadata(reqid)

            # delete field from array
            del DATA[reqid]

            # reload
            return redirect(request.url)
        # verify image diagnoses and metadata
        elif post_method == "Verify":
            # get image id from form
            reqid = request.form['imgID']

            # TODO: Add diagnosis modification confirmation pop up

            # get updated metadata from form
            correctedURI = request.form['results']
            correctedTitle = icd.getDiagnosisByID(correctedURI)

            # change URI to new URI from form, change verified to 1
            DATA[reqid]['uri'] = correctedURI
            DATA[reqid]['title'] = correctedTitle
            DATA[reqid]['verified'] = 1
            
            # update SQL database
            sqlhandler.update_image(reqid, correctedURI, correctedTitle)
            
            # reload
            return redirect(request.url)
        # download images
        elif post_method == "Download":
            # get initial variables
            filesToDownload = request.form['filelist'].split(';')[:-1]
            metaformat = request.form['metaformat']

            # create empty dictionary for metadata
            meta = {}

            # create zip archive for files
            zf = InMemoryZip()
            for file in filesToDownload:
                # get metadata and add to metadata dictionary
                id = file.split('.')[0]
                meta[id] = DATA[id].copy()
                del meta[id]['results']

                # add images to zip archive
                filepath = join(app.config['UPLOAD_FOLDER'], file)
                zf.add_image(filepath)

            # choose metadata format
            if metaformat == "csv":
                # create headers
                meta_csv = "image file,diagnosis,icd-11 code,image id,anatomic site,size of lesion,disease severity,difficulty of diagnosis,age,sex,family history,image type\n"
                # create csv string
                for key in meta.keys():
                    image = meta[key]
                    meta_csv = meta_csv + "{},{},{},{},{},{},{},{},{},{},{},{}\n".format(
                        image['file'], image['title'], 
                        str(image['uri']), str(image['id']), 
                        image['site'], str(image['size']), 
                        image['severity'], image['diffofdiag'],
                        str(image['age']), image['sex'], 
                        image['hist'], image['imgtype'])

                # add csv to archive
                zf.add_file("meta.csv", meta_csv)
            elif metaformat == "json":
                # get metadata as json string
                meta_str = json.dumps(meta, ensure_ascii=False, indent=4, sort_keys=True)
                
                # add csv to archive
                zf.add_file("meta.json", meta_str)
            
            # send complete zip file
            return send_file(zf.to_byte_stream(), attachment_filename="images.zip", as_attachment=True)

    return render_template("verify.html", entries=entries, categories=categories)

@app.route('/test')
def test():
    sqlhandler.get_categories()
    return redirect(url_for("submit"))

# Helper function to search CSV for corresponding entry with ID
# PRE: Takes metadata as array and valid image ID
# POST: Returns i, data as index in metadata and list of data, respectively
def getCorrespondingEntry(data, id):
    for i in range(len(data)):
        entry = data[i]
        if (entry[0] == id):
            return i, entry
    return None

# main function: run flask app in debugging mode
if __name__ == "__main__":
    app.run(debug = True)