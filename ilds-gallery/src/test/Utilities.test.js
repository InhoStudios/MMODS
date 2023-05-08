import ICDManager from "../utilities/ICDManager";
import { METHODS } from "../utilities/IICDManager";

describe('ICDManager Tests', () => {
    let icdMan;

    beforeAll(async () => {
        icdMan = await new ICDManager().build();
    });

    describe('Token Management tests', () => {
        it('should have a defined token', async () => {
            let result = icdMan.token;
            expect(result).toBeDefined();
        });
        it ('should refresh a token successfully', async () => {
            icdMan.expiry = new Date().getTime() - 5;
            await icdMan.getToken();
            expect(icdMan.expiry).toBeGreaterThanOrEqual(new Date().getTime());
            expect(icdMan.expiry).toBeLessThanOrEqual(new Date().getTime() + 3600000);
        });
    });

    describe('Options formatting tests', () => {
       it('should return a properly formatted options string', () => {
           let data = {
               grant_type: "client_credentials",
               scope: "icdapi_access"
           }
           let expectedString = "grant_type=client_credentials&scope=icdapi_access";
           let optionsStr = icdMan.formatParams(data);
           console.log(optionsStr);
           expect(optionsStr).toEqual(expectedString);
       });

       it('should return an empty string for an empty object', () => {
           let params = {};
           expect(icdMan.formatParams(params)).toEqual("");
       })
    });

    describe('Request tests', () => {
        it('should successfully return an entity for a valid entity request', async () => {
            let endpoint = "/icd/entity/215767047";
            let params = {
            };
            let res = await icdMan.request(endpoint, params, METHODS.GET);
            let expectedObj = {
                "@context":"http://id.who.int/icd/contexts/contextForFoundationEntity.json",
                "@id":"http://id.who.int/icd/entity/215767047",
                "parent":[
                    "http://id.who.int/icd/entity/1887882424",
                    "http://id.who.int/icd/entity/1047945302"
                ],
                "child":[
                    "http://id.who.int/icd/entity/1444425291",
                    "http://id.who.int/icd/entity/1205902774",
                    "http://id.who.int/icd/entity/1314630323",
                    "http://id.who.int/icd/entity/1198890025"
                ],
                "browserUrl":"NA",
                "title":{
                    "@language":"en",
                    "@value":"Atopic eczema"
                },
                "synonym":[
                    {"label":{
                        "@language":"en",
                            "@value":"Atopic dermatitis"}
                    },
                    {"label":{
                        "@language":"en",
                        "@value":"Besnier prurigo"}
                    }
                ],
                "definition":{
                    "@language":"en",
                    "@value":"A chronic inflammatory genetically-determined eczematous dermatosis associated with an atopic diathesis (elevated circulating IgE levels, Type I allergy, asthma and allergic rhinitis). Filaggrin mutations resulting in impaired epidermal barrier function are important in its pathogenesis. Atopic eczema is manifested by intense pruritus, exudation, crusting, excoriation and lichenification. The face and non-flexural areas are often involved in infants; involvement of the limb flexures may be seen at any age. Although commonly limited in extent and duration, atopic eczema may be generalised and life-long."
                },
                "inclusion":[
                    {"label":{
                        "@language":"en","@value":"Atopic dermatitis"}
                    }
                ]
            }

            expect(res).toEqual(expectedObj);
        });

        it ("should succeed on normal query", async () => {
            let query = "eczema";
            let res = await icdMan.search(query);
            expect(res).toHaveProperty("destinationEntities");
        });
    });

});