export const ICD = {
    TOKEN_HOST: "icdaccessmanagement.who.int",
    TOKEN_PATH: "/connect/token",
    TOKEN_URL: "https://icdaccessmanagement.who.int/connect/token",
    SCOPE: "icdapi_access",
    GRANT_TYPE: "client_credentials",
    QUERY_HOST: "id.who.int"
}

export const METHODS = {
    GET: "GET",
    POST: "POST"
}

export default class Case {
    caseID;
    age;
    sex;
    history;
    ethnicity;
    userEntity;
    clinicianEntity;
    pathologistEntity;
    anatomicSite;
    size;
    severity;
    fitzpatrickType;
    tags;
}