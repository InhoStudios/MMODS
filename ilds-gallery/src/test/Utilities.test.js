import ICDManager from "../utilities/ICDManager";

describe('ICDManager Tests', () => {
    let icdMan;

    beforeAll(async () => {
        icdMan = await new ICDManager().build();
    });

    it('should pass example test', async () => {
        let result = icdMan.token;
        expect(result).toBeDefined();
    });
});