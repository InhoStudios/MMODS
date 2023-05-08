import { ICD } from "./IICDManager";
import * as https from "https";

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

    async getToken() {
        if (this.isExpired()) {
            this.token = await this.refreshToken();
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
            "scope": ICD.SCOPE,
            "grant_type": ICD.GRANT_TYPE,
            Authorization
        };

        let options = {
            hostname: ICD.TOKEN_HOST,
            port: 443,
            path: ICD.TOKEN_PATH,
            method: "POST",
            headers
        };

        const data = `grant_type=${ICD.GRANT_TYPE}&scope=${ICD.SCOPE}`;

        return new Promise((resolve, reject) => {
            let req = https.request(options, res => {
                let data = "";

                res.on("data", chunk => {
                    data += chunk;
                });

                res.on("end", () => {
                    console.log(data);
                    resolve(JSON.parse(data.toString()));
                });
            });

            req.on("error", error => {
                console.error("ERR", error);
                reject(error);
            });

            req.write(data, "utf-8");
            req.end();
        })
    }

    performQuery(query) {
        return 1;
    }
}

export default ICDManager;