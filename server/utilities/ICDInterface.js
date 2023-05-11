var { ICD } = require("./Structures");
let token = "";
let expiry = 0;

async function useToken() {
    if (isExpired()) {
        let tokenObj = await fetchToken();
        token = tokenObj.access_token;
        expiry = new Date().getTime() + tokenObj.expires_in * 1000;
        console.log(expiry);
        console.log(token);
    }
    return token;
}

async function fetchToken() {
    let body = formatParams({
        "client_id": process.env.ICD_ID,
        "client_secret": process.env.ICD_SECRET,
        "grant_type": ICD.GRANT_TYPE,
        "scope": ICD.SCOPE
    });
    console.log(body);
    const options = {
        method: "POST",
        body: body,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    return await fetch(ICD.TOKEN_URL, options)
        .then((data) => data.json())
        .catch((err) => console.log("getToken()", err));
}

function isExpired() {
    return new Date().getTime() > expiry;
}

function formatParams(params) {
    let optionsString = "";
    for (let key in params) {
        let stringFragment = `${key}=${params[key]}&`;
        optionsString += stringFragment;
    }
    optionsString = optionsString.substring(0, optionsString.length - 1);
    return optionsString;
}

module.exports = {
    useToken: useToken,
};