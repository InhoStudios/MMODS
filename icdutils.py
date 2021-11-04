import credentials
import requests
import json
from spellchecker import SpellChecker
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

# Helper search function
# PRE: Takes a plaintext search query
# POST: Returns all ICD entities as a json object
def search(query):
    spellCheck = SpellChecker()
    uk = [query]
    if (" " in query):
        word_tokens = query.split(" ")
        uk = spellCheck.unknown(word_tokens)
    squery = ""
    for word in uk:
        squery += spellCheck.correction(word) + " "
    if squery == "":
        squery = query
    token = getToken()
    useFlexisearch = 'false'
    flatResults = 'false'
    headers = {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'Accept-Language': 'en',
        'API-Version': 'v2'
    }
    url = f'https://id.who.int/icd/entity/search?q={squery}&useFlexisearch={useFlexisearch}&flatResults={flatResults}'

    r = requests.post(url, headers=headers, verify=False)

    return json.loads(r.text)

# PRE: Takes in a valid ICD ID number (numerical ID following ICD uri)
# POST: Returns exact disease diagnosis
def getEntityByID(id):
    token = getToken()
    headers = {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'Accept-Language': 'en', # Perhaps make language toggle-able from a select list
        'API-Version': 'v2'
    }
    url = f'https://id.who.int/icd/entity/{id}'

    r = requests.get(url, headers=headers, verify=False)
    r_dict = json.loads(r.text)
    title = r_dict["title"]["@value"]

    return title

# PRE: Takes a plaintext search query
# POST: Returns a list of all diagnoses names
def searchGetTitles(query):
    r_dict = search(query)
    titles = []
    str = ""
    for entity in r_dict['destinationEntities']:
        str = str + indexDescendants(entity, 1, 'title')
    
    titles = str.split("\n")

    return titles

# PRE: Takes a plaintext search query
# POST: Returns a list of all diagnoses numerical IDs
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

# PRE: Takes a plain text query to send to the ICD-API
# POST: Returns all search queries as a list of dictionaries containing both the title and the id
def searchGetPairs(query):
    r_dict = search(query)
    pairs = []
    str_titles = ""
    str_ids = ""
    for entity in r_dict['destinationEntities']:
        str_titles = str_titles + indexDescendants(entity, 1, 'title')
        str_ids = str_ids + indexDescendants(entity, 1, 'id')

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

# PRE: Takes an entity json object returned from the ICD-API, a level of indentation (nesting), and the key to index
# POST: Returns a string of all the query results formatted in a nested format
def indexDescendants(entity, indentationLevel, key):
    entityValue = entity[key]
    returnString = entityValue + "\n"
    indent = "——"
    descendants = entity['descendants']
    for descendant in descendants:
        returnString = returnString + indent * indentationLevel + indexDescendants(descendant, indentationLevel + 1, key)
    return returnString