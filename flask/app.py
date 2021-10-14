from os.path import join
from os import listdir
from flask import Flask, flash, request, render_template, url_for, session
from werkzeug.utils import redirect, secure_filename
from time import time
import icdutils

UPLOAD_FOLDER = "./static/img/"
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
                diag = request.form['results'].replace("——","")
                fileEnding = file.filename.split('.')[1]

                filename_str = utc_code + "__" + diag + "." + fileEnding;

                filename = secure_filename(filename_str)
                print(join(app.config['UPLOAD_FOLDER']))
                file.save(join(app.config['UPLOAD_FOLDER'], filename))

                # confirmation page configuration
                confirmation = "Uploaded successfully!"
                return redirect(url_for('confirm', confirmation=confirmation, back_url=back_url))
        else:
            query = request.form['search']
            if query == "":
                return redirect(request.url)
            results = icdutils.searchGetPairs(query)
    return render_template("submit.html", results=results)

@app.route('/confirm', methods=['POST', 'GET'])
def confirm():
    confirmation = request.args['confirmation']
    back_url = request.args['back_url']
    if request.method == 'POST':
        return redirect(back_url)
    return render_template("confirmation.html", confirmation=confirmation, back_url=back_url)

@app.route('/verify')
def verify():

    imgs = listdir(join(app.static_folder, "img"))
    entries = []
    for img in imgs:
        tokens = img.split("__")
        id = tokens[0]
        title = tokens[1].split(".")[0].replace("_", " ")
        uri = icdutils.getExactQueryID(title)
        entry = {
            'id': id,
            'file': img,
            'title': title,
            'uri': uri
        }
        entries.append(entry)
    return render_template("verify.html", entries=entries)

if __name__ == "__main__":
    app.run(debug = True)