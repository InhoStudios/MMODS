var { ICD, METHODS } = require("./Structures");
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

async function headers() {
    return {
        "Authorization": `Bearer ${await useToken()}`,
        "Accept": "application/json",
        "Accept-Language": "en",
        "API-Version": "v2"
    };
}

async function request(endpoint, params, method) {
    let reqHeaders = await headers();
    let path = `${ICD.QUERY_HOST}${endpoint}?${formatParams(params)}`;
    let options = {
        method: method,
        headers: reqHeaders,
    };
    return await fetch(path, options)
        .then(res => res.json())
        .catch(err => console.log(`Error on ${method} request to ${endpoint} `, err))
}

async function search(query) {
    let params = {
        "q": query,
        "useFlexisearch": "true",
        "flatResults": "false"
    };
    let endpoint = "/icd/entity/search";
    return await request(endpoint, params, METHODS.POST);
}

async function getEntity(id, include) {
    params = {
        "include": include,
    };
    let endpoint = `/icd/entity/${id}`;
    return await request(endpoint, params, METHODS.GET);
}

module.exports = {
    useToken: useToken,
    search: search,
    getEntity: getEntity,
};