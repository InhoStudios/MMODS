const client_id = "ad011ba7-1e96-4932-9d40-c1f28054e8fa_d0996b9f-08ef-4b74-a8a2-565d2550d266";
const client_secret = "F7nKrGPgfcGNQ7en2CBKZJhd4Pi4LP7F8wbe7nLUXqc=";
const scope = "icdapi_access";
const grant_type = "client_credentials";

let token; // = "https://icdaccessmanagement.who.int/connect/token";

function getToken() {
    const payload = {
        "client_id": client_id,
        "client_secret": client_secret,
        "scope": scope,
        "grant_type": grant_type
    };
    
}

function searchICD() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", token_endpoint, false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    r = xhr.send(payload);

    access_token = r['access_token'];

    var query = "seborrheic keratosis"; // replace with text from search box
}

function checkCorrect() {
    
}