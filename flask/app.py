from os.path import join
from flask import Flask, flash, request, render_template, url_for, session
from werkzeug.utils import redirect, secure_filename
import icdutils

UPLOAD_FOLDER = "./static/img/"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'pdf', 'tiff', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowedFile(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return redirect('/submit')

@app.route('/quiz', methods=['POST', 'GET'])
def quiz():
    back_url = url_for('quiz')
    if request.method == 'POST':
        query = request.form['search']
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
        if request.form['results'] != "Search diagnosis":
            # check for no file
            if 'filename' not in request.files:
                return redirect(request.url);
            
            file = request.files['filename']
            
            # check for empty file name
            if file.filename == '':
                return redirect(request.url)
            
            # file exists
            if file and allowedFile(file.filename):
                print("## EMPTY FILENAME ##")
                filename = secure_filename(file.filename)
                print(join(app.config['UPLOAD_FOLDER']))
                file.save(join(app.config['UPLOAD_FOLDER'], filename))
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
    imgs = ['imgq1.jpg', 'wide.jpg', 'tall.jpg', 'square.png']
    return render_template("verify.html", imgs=imgs)

if __name__ == "__main__":
    app.run(debug = True)