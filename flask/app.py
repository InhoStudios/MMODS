from flask import Flask, request, Response, render_template
import credentials
import requests
import json

token_endpoint = "https://icdaccessmanagement.who.int/connect/token"
scope = "icdapi_access"
grant_type = "client_credentials"

payload = {
    "client_id": credentials.client_id,
    "client_secret": credentials.client_secret,
    "scope": scope,
    "grant_type": grant_type
}

app = Flask(__name__)

@app.route('/', methods=['POST', 'GET'])
def home():
    if request.method == 'POST':
        query = request.form['search']

        r_dict = json.loads(search(query).text)
        for entity in r_dict['destinationEntities']:
            id_uri = entity['id']
            items = id_uri.split("/")
            id = items[5]
            print(id)
            name = entity['title']
            break
    return render_template("quiz.html")

def getToken():
    r = requests.post(token_endpoint, data=payload, verify=False).json();
    token = r['access_token']
    return token

def search(query):
    token = getToken()
    useFlexisearch = 'true'
    headers = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json",
        "Accept-Language": "en",
        "API-Version": "v2"
    }
    url = f'https://id.who.int/icd/entity/search?q={query}&useFlexisearch={useFlexisearch}'

    r = requests.post(url, headers=headers, verify=False)

    return r


if __name__ == "__main__":
    app.run(debug = True)