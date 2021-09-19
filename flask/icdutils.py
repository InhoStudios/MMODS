import credentials
import requests
import json
import nltk

token_endpoint = "https://icdaccessmanagement.who.int/connect/token"
scope = "icdapi_access"
grant_type = "client_credentials"

payload = {
    'client_id': credentials.client_id,
    'client_secret': credentials.client_secret,
    'scope': scope,
    'grant_type': grant_type
}

def getToken():
    r = requests.post(token_endpoint, data=payload, verify=False).json();
    token = r['access_token']
    return token

def search(query):
    token = getToken()
    useFlexisearch = 'false'
    headers = {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'Accept-Language': 'en',
        'API-Version': 'v2'
    }
    url = f'https://id.who.int/icd/entity/search?q={query}&useFlexisearch={useFlexisearch}'

    r = requests.post(url, headers=headers, verify=False)

    return json.loads(r.text)

def searchGetTitles(query):
    r_dict = search(query)
    titles = []
    for entity in r_dict['destinationEntities']:
        title = entity['title']
        # title = nltk.clean_html(title)
        titles.append(title)

    return titles

def searchGetIDs(query):
    r_dict = search(query)
    IDs = []
    for entity in r_dict['destinationEntities']:
        id_uri = entity['id']
        tokens = id_uri.split('/')
        id = tokens[5]
        IDs.append(id)
    
    return IDs

def getExactQueryID(query):
    r_dict = search(query)
    id = ""
    for entity in r_dict['destinationEntities']:
        id_uri = entity['id']
        tokens = id_uri.split('/')
        id = tokens[5]
    return id

def searchGetPairs(query):
    r_dict = search(query)
    pairs = []
    for entity in r_dict['destinationEntities']:
        id_uri = entity['id']
        tokens = id_uri.split('/')
        id = tokens[5]
        title = entity['title']

        id_title_pair = {
            'id': id,
            'title': title
        }

        pairs.append(id_title_pair)
    return pairs