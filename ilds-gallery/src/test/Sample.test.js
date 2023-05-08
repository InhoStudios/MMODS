import { ICD_ENDPOINT, ICD_GRANT_TYPE, ICD_SCOPE } from "../utilities/IICDManager";
import * as https from "https";

describe('fetch request tests', () => {
    let client_id;
    let client_secret;
    const scope = "icdapi_access";
    const grant_type = "client_credentials";
    let token, headers, options;

    beforeAll(async () => {
        client_id = process.env.ICD_ID;
        client_secret = process.env.ICD_SECRET;

        // http header fields to set
        const Authorization = `Basic ${new Buffer.from(`${client_id}:${client_secret}`).toString("base64").toString("utf-8")}`;
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "scope": scope,
            "grant-type": grant_type,
            Authorization
        };

        // http options
        const options = {
            hostname: "icdaccessmanagement.who.int",
            port: 443,
            path: "/connect/token",
            method: "POST",
            headers
        };
        const data = `grant_type=${grant_type}&scope=${scope}`;

        // make request
        token = await new Promise((resolve, reject) => {
            let req = https.request(options, res => {
                let data = "";

                res.on("data", chunk => {
                    data += chunk;
                });

                res.on("end", () => {
                    console.log(data);
                    resolve(JSON.parse(data.toString()).access_token);
                });
            });

            req.on("error", error => {
                console.error("ERR", error);
                reject(error);
            });

            req.write(data, "utf-8");
            req.end();
        });
    });

    it('should resolve a new token', async () => {

    });
})