from flask import Flask, request, Response, render_template
import json

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("apply.html")

if __name__ == "__main__":
    app.run(debug = True)