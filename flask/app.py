from flask import Flask, request, render_template
import icdutils

app = Flask(__name__)

@app.route('/quiz', methods=['POST', 'GET'])
def quiz():
    if request.method == 'POST':
        query = request.form['search']
        # 
        # Implement quiz search and verification
        # 
    return render_template("quiz.html")

@app.route('/submit', methods=['POST', 'GET'])
def submit():
    results=[]
    if request.method == 'POST':
        query = request.form['search']
        results = icdutils.searchGetPairs(query)
    return render_template("submit.html", results=results)

if __name__ == "__main__":
    app.run(debug = True)