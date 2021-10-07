from flask import Flask, flash, request, render_template, url_for, session
from werkzeug.utils import redirect, secure_filename
import icdutils

# UPLOAD_FOLDER = "/images"

app = Flask(__name__)
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def home():
    return redirect('/submit')

@app.route('/quiz', methods=['POST', 'GET'])
def quiz():
    if request.method == 'POST':
        query = request.form['search']
        IDs = icdutils.searchGetIDs(query)
        confirmID = IDs[0]
        confirmation = "Incorrect :("
        if confirmID == '1627987797':
            confirmation = "Correct!"
        return redirect(url_for('confirm', confirmation=confirmation))
    return render_template("quiz.html")

@app.route('/submit', methods=['POST', 'GET'])
def submit():
    results=[]
    if request.method == 'POST':
        query = request.form['search']
        results = icdutils.searchGetPairs(query)
        # if request.form['results'] != "Select diagnosis":
        #     img = request.files['filename']
        #     filename = secure_filename(img.filename)
        #     img.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
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
    return render_template("verify.html")

if __name__ == "__main__":
    app.run(debug = True)