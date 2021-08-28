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
    query = "";
    if request.method == 'POST':
        query = request.form['search']

        print(search(query).text)
        # r_dict = json.loads(search(query).text)
        # for entity in r_dict['destinationEntities']:
        #     print(entity)
        #     print(entity['id'])
        #     id_uri = entity['id']
        #     tokens = id_uri.split("/")
        #     token = tokens[5]
        #     print(token)
        #     break
    return render_template("quiz.html", query=query)

def getToken():
    r = requests.post(token_endpoint, data=payload, verify=False).json();
    token = r['access_token']
    return token

def search(query):
    token = getToken()
    useFlexisearch = 'true'
    headers = {
        "Authorization": "Bearer" + token,
        "Accept": "application/json",
        "Accept-Language": "en",
        "API-Version": "v2"
    }
    url = f'https://id.who.int/icd/entity/search?q={query}&useFlexisearch={useFlexisearch}'

    r = requests.post(url, headers=headers, verify=False)

    return r


if __name__ == "__main__":
    app.run(debug = True)