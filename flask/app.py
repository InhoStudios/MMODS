from os.path import join
from os import listdir
from flask import Flask, flash, request, render_template, url_for, session
from werkzeug.utils import redirect, secure_filename
from time import time
import icdutils
import csv

UPLOAD_FOLDER = "./static/img/"
METADATA_FILE = "meta.csv"
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
    query = ""
    if request.method == 'POST':
        if request.form['results'] != "null":
            # check for no file
            if 'filename' not in request.files:
                return redirect(request.url);
            
            file = request.files['filename']
            
            # check for empty file name
            if file.filename == '':
                return redirect(request.url)
            
            # file exists
            if file and allowedFile(file.filename):
                utc_code = str(round(time() * 1000))
                uri = request.form['results']
                fileEnding = file.filename.split('.')[1]

                filename_str = utc_code + "." + fileEnding;

                filename = secure_filename(filename_str)
                file.save(join(app.config['UPLOAD_FOLDER'], filename))

                # get exact query and search results
                query = request.form['search']
                test = [utc_code, uri, query, 0]
                
                with open(join(app.static_folder, METADATA_FILE), "a") as f:
                    writer = csv.writer(f)
                    writer.writerow(test)

                # confirmation page configuration
                confirmation = "Uploaded successfully!"
                return redirect(url_for('confirm', confirmation=confirmation, back_url=back_url))
        else:
            query = request.form['search']
            if query == "":
                return redirect(request.url)
            results = icdutils.searchGetPairs(query)
    return render_template("submit.html", results=results, query=query)

@app.route('/confirm', methods=['POST', 'GET'])
def confirm():
    confirmation = request.args['confirmation']
    back_url = request.args['back_url']
    if request.method == 'POST':
        return redirect(back_url)
    return render_template("confirmation.html", confirmation=confirmation, back_url=back_url)

@app.route('/verify', methods=['POST', 'GET'])
def verify():

    imgs = listdir(join(app.static_folder, "img"))
    entries = []

    # load CSV, find file, requery query to show all diagnoses options
    meta = open(join(app.static_folder, METADATA_FILE), 'r')
    metadata = list(csv.reader(meta))

    for img in imgs:
        # get basic metadata
        id = img.split('.')[0]

        i, data = getCorrespondingEntry(metadata, id)

        uri = data[1]
        query = data[2]

        title = icdutils.getEntityByID(uri)
        results = icdutils.searchGetPairs(query)

        if int(data[3]) == 1:
            title += " ✅";

        entry = {
            'id': id,
            'file': img,
            'title': title,
            'uri': uri,
            'results': results
        }
        entries.append(entry)
    if request.method == "POST":
        # get ID from verify button
        id = request.form['verify'].split(" ")[1]

        # get corresponding entry index to insert into
        i, data = getCorrespondingEntry(metadata, id)
        correctedURI = request.form['results']

        # change URI to new URI from form, change verified to 1
        data[1] = correctedURI
        data[3] = 1
        metadata[i] = data

        # write data to csv
        with open(join(app.static_folder, METADATA_FILE), 'w') as f:
            writer = csv.writer(f)
            writer.writerows(metadata)
        return redirect(request.url)
    return render_template("verify.html", entries=entries)

def getCorrespondingEntry(data, id):
    for i in range(len(data)):
        entry = data[i]
        if (entry[0] == id):
            return i, entry
    return None

if __name__ == "__main__":
    app.run(debug = True)