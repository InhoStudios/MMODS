import credentials
import requests
import json
from spellchecker import SpellChecker

# Static class that contains helper functions for accessing the ICD-11 API

# icd-11 api access variables
token_endpoint = "https://icdaccessmanagement.who.int/connect/token"
scope = "icdapi_access"
grant_type = "client_credentials"
payload = {
    'client_id': credentials.client_id,
    'client_secret': credentials.client_secret,
    'scope': scope,
    'grant_type': grant_type
}

# get access token to access icd-11 api
# POST: returns token for client access to ICD-API
def getToken():
    # request token from the token endpoint
    r = requests.post(token_endpoint, data=payload, verify=False).json()
    token = r['access_token']
    return token

# generates all headers for post request
# POST: returns headers
def generateHeaders():
    token = getToken()
    return {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'Accept-Language': 'en', # Perhaps make language toggle-able from a select list
        'API-Version': 'v2'
    }

# Helper search function
# PRE: Takes a plaintext search query
# POST: Returns all ICD entities as a json object
def search(query):
    # employ spellcheck in case users misspell diagnosis
    spellCheck = SpellChecker()
    # convert query into array of characters
    uk = [query]
    if (" " in query):
        # separate phrase into words
        word_tokens = query.split(" ")
        uk = spellCheck.unknown(word_tokens)
    squery = ""
    
    # apply spellcheck to each word
    for word in uk:
        squery += spellCheck.correction(word) + " "
    
    # if there were no words to correct, use original query
    if squery == "":
        squery = query
    
    # initialize headers
    useFlexisearch = 'true'
    flatResults = 'false'
    headers = generateHeaders()
    url = f'https://id.who.int/icd/entity/search?q={squery}&useFlexisearch={useFlexisearch}&flatResults={flatResults}'

    # query icd-11 api for specific diagnosis
    r = requests.post(url, headers=headers, verify=False)

    # return data as a json object
    return json.loads(r.text)

# PRE: Takes in a valid ICD ID number (numerical ID following ICD uri)
# POST: Returns exact disease diagnosis
def getEntityByID(id):
    # get request headers
    headers = generateHeaders()
    url = f'https://id.who.int/icd/entity/{id}'

    # submit post request
    r = requests.get(url, headers=headers, verify=False)
    r_dict = json.loads(r.text)

    # get diagnosis title
    title = r_dict["title"]["@value"]

    return title

# PRE: Takes in a valid ICD ID number (numerical ID following ICD uri)
# POST: Returns description for specific diagnosis
def getDescriptionByID(id):
    # get request headers
    headers = generateHeaders()
    url = f'https://id.who.int/icd/entity/{id}'
    # search for a diagnosis definition: if none found, use default text
    try:
        r = requests.get(url, headers=headers, verify=False)
        r_dict = json.loads(r.text)
        desc = r_dict["definition"]["@value"]
    except:
        desc = "No definition found."

    return desc

# PRE: Takes a plaintext search query
# POST: Returns a list of all diagnoses names
def searchGetTitles(query):
    r_dict = search(query)
    titles = []
    str = ""

    # recurse through list for nested elements
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

# PRE: Takes a plaintext search query
# POST: Returns the exact first result
def getExactQueryID(query):
    r_dict = search(query)
    id = ""
    for entity in r_dict['destinationEntities']:
        id_uri = entity['id']
        token = id_uri.replace("http://id.who.int/icd/entity/", "")
        id = token
        return id

# PRE: Takes a plain text query to send to the ICD-API
# POST: Returns all search queries as a list of dictionaries containing the title, the id, and a selected tag
def searchGetPairs(query, current_uri="null"):
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
        selected = ""
        if ids[i] == current_uri:
            selected = "selected"
        id_title_pair = {
            'title': titles[i],
            'id': ids[i],
            'selected': selected
        }

        pairs.append(id_title_pair)
    return pairs

# PRE: Takes an entity json object returned from the ICD-API, a level of indentation (nesting), and the key to index
# POST: Returns a string of all the query results formatted in a nested format
def indexDescendants(entity, indentationLevel, key):
    # find values
    entityValue = entity[key]
    returnString = entityValue + "\n"
    indent = "——"
    descendants = entity['descendants']

    # recurse through descendants
    for descendant in descendants:
        returnString = returnString + indent * indentationLevel + indexDescendants(descendant, indentationLevel + 1, key)
    return returnString
    
class HierarchyManager():
    def __init__(self):
        self.categories = set()
    
    def getCategoryParent(self, id):
        # get headers
        headers = generateHeaders()
        include="ancestor"
        url = f'https://id.who.int/icd/entity/{id}?include={include}'

        # find ancestor
        r = requests.get(url, headers=headers, verify=False)
        r_dict = json.loads(r.text)
        parents = r_dict['ancestor']
        parent_list = str(id)
        for parent in parents:
            parent_id = parent.split("/")[-1]
            if (parent_id != '455013390' and parent_id != '448895267'):
                self.categories.add(parent_id)
                parent_list = parent_list + f" {parent_id}"
        print(parent_list)
        return parent_list

    def getCategories(self):
        return self.categories
