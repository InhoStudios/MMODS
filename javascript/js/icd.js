const client_id = "ad011ba7-1e96-4932-9d40-c1f28054e8fa_d0996b9f-08ef-4b74-a8a2-565d2550d266";
const client_secret = "F7nKrGPgfcGNQ7en2CBKZJhd4Pi4LP7F8wbe7nLUXqc=";
const scope = "icdapi_access";
const grant_type = "client_credentials";

let token_endpoint = "https://icdaccessmanagement.who.int/connect/token";

const payload = {
    "client_id": client_id,
    "client_secret": client_secret,
    "scope": scope,
    "grant_type": grant_type
};

function getToken() {
    
}

function searchICD() {

    fetch(token_endpoint, {
        credentials: 'include'
    });

    var endpoint = token_endpoint + "&" + client_id + "&" + client_secret;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret))
    xhr.addEventListener("load", listener);
    xhr.send();

    access_token = r['access_token'];

    var query = "seborrheic keratosis"; // replace with text from search box
}

function checkCorrect() {
    
}