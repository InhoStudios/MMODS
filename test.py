# icd-11 api access variables
import requests, credentials, json

token_endpoint = "https://icdaccessmanagement.who.int/connect/token"
scope = "icdapi_access"
grant_type = "client_credentials"
payload = {
    'client_id': credentials.client_id,
    'client_secret': credentials.client_secret,
    'scope': scope,
    'grant_type': grant_type
}

r = requests.post(token_endpoint, data=payload, verify=False)
token = r.json()['access_token']

headers = {
    'Authorization': 'Bearer ' + token,
    'accept': 'application/json',
    'Accept-Language': 'en', # Perhaps make language toggle-able from a select list
    'API-Version': 'v2'
}

print(headers)
# get request headers
url = f'https://id.who.int/icd/entity/1394940192'
# search for a diagnosis definition: if none found, use default text
print('=== POSTING ===')
r = requests.post(url, headers=headers, verify=False)
print('=== POST REQUEST RETURNED ===')
print("found: " + r.json())
# r_dict = json.loads(r.text)