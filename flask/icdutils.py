import credentials
import requests
import json
# import nltk

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
    flatResults = 'false'
    headers = {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'Accept-Language': 'en',
        'API-Version': 'v2'
    }
    url = f'https://id.who.int/icd/entity/search?q={query}&useFlexisearch={useFlexisearch}&flatResults={flatResults}'

    r = requests.post(url, headers=headers, verify=False)

    return json.loads(r.text)

def searchGetTitles(query):
    r_dict = search(query)
    titles = []
    str = ""
    for entity in r_dict['destinationEntities']:
        str = str + indexDescendants(entity, 1, 'title')
    
    titles = str.split("\n")

    return titles

def searchGetIDs(query):
    r_dict = search(query)
    IDs = []
    str = ""
    for entity in r_dict['destinationEntities']:
        str = str + indexDescendants(entity, 1, 'id')
    str = str.replace(" ", "")
    ID_URLs = str.split("\n")
    for ID_URL in ID_URLs:
        id = ID_URL.replace("http://id.who.int/icd/entity/", "")
        IDs.append(id)
    return IDs

def getExactQueryID(query):
    r_dict = search(query)
    id = ""
    for entity in r_dict['destinationEntities']:
        id_uri = entity['id']
        token = id_uri.replace("http://id.who.int/icd/entity/", "")
        id = token
        return id

def searchGetPairs(query):
    r_dict = search(query)
    pairs = []
    str_titles = ""
    str_ids = ""
    for entity in r_dict['destinationEntities']:
        str_titles = str_titles + indexDescendants(entity, 1, 'title')
        str_ids = str_ids + indexDescendants(entity, 1, 'id')

    print(str_titles)
    titles = str_titles.split('\n')
    ids = str_ids.split('\n')

    for i in range(len(titles)):
        titles[i] = titles[i].replace("<em class='found'>", "")
        titles[i] = titles[i].replace("</em>", "")
        ids[i] = ids[i].replace("——","").replace("http://id.who.int/icd/entity/", "")
        id_title_pair = {
            'title': titles[i],
            'id': ids[i]
        }

        pairs.append(id_title_pair)
    return pairs

def indexDescendants(entity, indentationLevel, key):
    entityValue = entity[key]
    returnString = entityValue + "\n"
    indent = "——"
    descendants = entity['descendants']
    for descendant in descendants:
        returnString = returnString + indent * indentationLevel + indexDescendants(descendant, indentationLevel + 1, key)
    return returnString