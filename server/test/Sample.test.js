import { ICD, METHODS } from "../utilities/Structures";
import ICDManager from "../utilities/ICDManager";

describe('fetch request tests', () => {

    let client_id, client_secret;

    beforeAll(async () => {
        client_id = process.env.ICD_ID;
        client_secret = process.env.ICD_SECRET;
    });

    it('test', async () => {
        // let data = ICDManager.formatParams({
        //     "client_id": client_id,
        //     "client_secret": client_secret,
        //     "grant_type": ICD.GRANT_TYPE,
        //     "scope": ICD.SCOPE
        // })
        // let options = {
        //     method: METHODS.POST,
        //     headers: {
        //         "Content-Type": "application/x-www-form-urlencoded"
        //     },
        //     body: data
        // }
        // console.log(data);
        // // let res = await fetch(ICD.TOKEN_PATH, options);
        // // let res2 = await fetch(ICD.TOKEN_URL, options);
        let res = await fetchToken();
    });
    async function fetchToken() {
        // Specify request configuration and options
        const options = {
            method: "POST",
            body: `client_id=${client_id}&client_secret=${client_secret}&grant_type=${ICD.GRANT_TYPE}&scope=${ICD.SCOPE}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        // Wait for response
        return await fetch(ICD.TOKEN_URL, options)
            .then((data) => data.json())
            .catch((err) => console.log("getToken()", err));
    }
})