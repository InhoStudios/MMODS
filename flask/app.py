import os
from flask import Flask, flash, request, render_template, url_for, session
from werkzeug.utils import redirect, secure_filename
import icdutils

UPLOAD_FOLDER = "/static/img"
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
    if request.method == 'POST':
        query = request.form['search']
        IDs = icdutils.searchGetIDs(query)
        confirmID = IDs[0]
        confirmation = "Incorrect"
        if confirmID == '1627987797':
            confirmation = "Correct!"
        return redirect(url_for('confirm', confirmation=confirmation))
    return render_template("quiz.html")

@app.route('/submit', methods=['POST', 'GET'])
def submit():
    results=[]
    if request.method == 'POST':
        if request.form['results'] != "Search diagnosis":
            if 'file' not in request.files:
                return redirect(request.url);
            file = request.files['file']
            if file.filename == '':
                return redirect(request.url)
            if file and allowedFile(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                return redirect(url_for(request.url))
        else:
            query = request.form['search']
            results = icdutils.searchGetPairs(query)
    return render_template("submit.html", results=results)

@app.route('/confirm', methods=['POST', 'GET'])
def confirm():
    confirmation = request.args['confirmation']
    if request.method == 'POST':
        print("submitted?")
        return redirect(url_for('quiz'))
    return render_template("confirmation.html", confirmation=confirmation)

@app.route('/verify')
def verify():
    imgs = ['imgq1.jpg', 'wide.jpg', 'tall.jpg', 'square.png']
    return render_template("verify.html", imgs=imgs)

if __name__ == "__main__":
    app.run(debug = True)