import credentials
import requests
import json
from spellchecker import SpellChecker
from datetime import datetime, timezone

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

class ICDManager:
    def __init__(self):
        self.token = ""
        self.headers = {}

        # set token
        self.refresh_token()
        return
    
    def use_headers(self):
        # now = int(str(datetime.now(timezone.utc).timestamp()).split('.')[0])
        # if now >= self.expiry:
        self.refresh_token()
        return self.headers

    def refresh_token(self):
        r = requests.post(token_endpoint, data=payload, verify=False).json()
        token = r['access_token']
        now = int(str(datetime.now(timezone.utc).timestamp()).split('.')[0])
        self.expiry = now + int(r['expires_in'])
        self.token = token
        print(now, self.expiry)

        self.headers = {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json',
            'Accept-Language': 'en', # Perhaps make language toggle-able from a select list
            'API-Version': 'v2'
        }
        return

    # Helper search function
    # PRE: Takes a plaintext search query
    # POST: Returns all ICD entities as a json object
    def search(self, query):
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
        url = f'https://id.who.int/icd/entity/search?q={squery}&useFlexisearch={useFlexisearch}&flatResults={flatResults}'

        # query icd-11 api for specific diagnosis
        r = requests.post(url, headers=self.use_headers(), verify=False)

        # return data as a json object
        return json.loads(r.text)

    # PRE: Takes in a valid ICD ID number (numerical ID following ICD uri)
    # POST: Returns exact disease diagnosis
    def getEntityByID(self, id):
        # get request headers
        url = f'https://id.who.int/icd/entity/{id}'

        # submit post request
        print(self.headers)
        r = requests.post(url, headers=self.use_headers(), verify=False)
        
        r_dict = json.loads(r.text)

        # get diagnosis title
        title = r_dict["title"]["@value"]

        return title

    # PRE: Takes in a valid ICD ID number (numerical ID following ICD uri)
    # POST: Returns description for specific diagnosis
    def getDescriptionByID(self, id):
        # get request headers
        url = f'https://id.who.int/icd/entity/{id}'
        # search for a diagnosis definition: if none found, use default text
        # try:
        self.refresh_token()
        print(self.headers, "\n\n\n")
        r = requests.post(url, headers=self.headers, verify=False)
        print("found: " + r.text)
        r_dict = json.loads(r.text)
        desc = r_dict["definition"]["@value"]
        # except:
        #     desc = "No definition found."

        return desc

    # PRE: Takes a plaintext search query
    # POST: Returns a list of all diagnoses names
    def searchGetTitles(self, query):
        r_dict = self.search(query)
        titles = []
        str = ""

        # recurse through list for nested elements
        for entity in r_dict['destinationEntities']:
            str = str + indexDescendants(entity, 1, 'title')
        
        titles = str.split("\n")

        return titles

    # PRE: Takes a plaintext search query
    # POST: Returns a list of all diagnoses numerical IDs
    def searchGetIDs(self, query):
        r_dict = self.search(query)
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
    def getExactQueryID(self, query):
        r_dict = self.search(query)
        id = ""
        for entity in r_dict['destinationEntities']:
            id_uri = entity['id']
            id = id_uri.replace("http://id.who.int/icd/entity/", "")
            return id

    # PRE: Takes a plain text query to send to the ICD-API
    # POST: Returns all search queries as a list of dictionaries containing the title, the id, and a selected tag
    def searchGetPairs(self, query, current_uri="null"):
        r_dict = self.search(query)
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