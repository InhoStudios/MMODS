import {ICD} from "./IICDManager";
import https from "https";

class ICDManager {

    payload;
    token;
    headers;
    constructor() {
        this.client_id = process.env.ICD_ID;
        this.client_secret = process.env.ICD_SECRET;
    }

    async build() {
        let tokenObj = await this.refreshToken();
        this.expiry = new Date().getTime() + tokenObj.expires_in * 1000;
        this.token = tokenObj.access_token;
        return this;
    }

    async getHeaders() {
        return {
            "Authorization": `Bearer ${await this.getToken()}`,
            "Accept": "application/json",
            "Accept-Language": "en",
            "API-Version": "v2"
        };
    }

    async getToken() {
        if (this.isExpired()) {
            let tokenObj = await this.refreshToken();
            this.expiry = new Date().getTime() + tokenObj.expires_in * 1000;
            this.token = tokenObj.access_token;
        }
        return this.token;
    }

    isExpired() {
        return new Date().getTime() > this.expiry;
    }

    async refreshToken() {
        let Authorization = `Basic ${new Buffer.from(`${this.client_id}:${this.client_secret}`).toString("base64").toString("utf-8")}`;
        let headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization
        };

        let options = {
            hostname: ICD.TOKEN_HOST,
            port: 443,
            path: ICD.TOKEN_PATH,
            method: "POST",
            headers
        };

        let data = {
            grant_type: ICD.GRANT_TYPE,
            scope: ICD.SCOPE,
        };

        return new Promise((resolve, reject) => {
            let req = https.request(options, res => {
                let data = "";

                res.on("data", chunk => {
                    data += chunk;
                });

                res.on("end", () => {
                    resolve(JSON.parse(data.toString()));
                });
            });

            req.on("error", error => {
                console.error("ERR", error);
                reject(error);
            });

            req.write(this.formatParams(data), "utf-8");
            req.end();
        });
    }

    async request(endpoint, params, method) {
        let headers = await this.getHeaders();
        let path = `${endpoint}?${this.formatParams(params)}`;
        let options = {
            hostname: ICD.QUERY_HOST,
            port: 443,
            path: path,
            method: method,
            headers
        };

        return await new Promise((resolve, reject) => {
            let req = https.request(options, res => {
                let data = "";

                res.on("data", chunk => {
                    data += chunk;
                });

                res.on("end", () => {
                    try {
                        let jsonObj = JSON.parse(data.toString());
                        resolve(jsonObj);
                    } catch (err) {
                        console.log(err);
                        reject(err);
                    }
                });
            });

            req.on("error", error => {
                console.error("ERR", error);
                reject(error);
            });

            req.end();
        })
    }

    async search(queryString) {
        let params = {
            "q": queryString,
            "useFlexisearch": "true",
            "flatResults": "false"
        };
        let endpoint = "/icd/entity/search";
        return await this.request(endpoint, params, "POST");
    }

    async getEntityByID(id) {

    }

    async getDiagnosisByID(id) {

    }

    formatParams(params) {
        let optionsString = "";
        for (let key in params) {
            let stringFragment = `${key}=${params[key]}&`;
            optionsString += stringFragment;
        }
        optionsString = optionsString.substring(0, optionsString.length - 1);
        return optionsString;
    }
}

export default ICDManager;