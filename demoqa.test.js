const { test, expect } = require('@playwright/test');
const app = require("./demoqa");


test.describe("Testing Elements", async () => {

    test.beforeAll(async () => {
        await app.initiateBrowser();
    })


    test("Test Homepage", async () => {
        await app.browseHomepage();
        const title = await app.getElementText("title");
        expect(title).toBe("ToolsQA");
    })

    test("Test Text Boxes", async () => {
        const name = "Test User";
        const email = "test@test.com";
        const currentAddress = "Test current address";
        const permanentAddress = "Test permanent address";
        await app.fillTextBox(name, email, currentAddress, permanentAddress);
        expect(await app.getElementText("p#name")).toBe("Name:" + name);
        expect(await app.getElementText("p#email")).toBe("Email:" + email);
        expect(await app.getElementText("p#currentAddress")).toBe("Current Address :" + currentAddress);
        expect(await app.getElementText("p#permanentAddress")).toBe("Permananet Address :" + permanentAddress); // There is typo on web app
    })

    test("Test Check Boxes", async () => {
        await app.selectAllCheckBoxes();
        const expectedValues = "You have selected :\nhome\ndesktop\nnotes\ncommands\ndocuments\nworkspace\nreact\nangular\nveu\noffice\npublic\nprivate\nclassified\ngeneral\ndownloads\nwordFile\nexcelFile";
        expect(await app.getElementText("#result")).toBe(expectedValues);
    })

    test("Test Radio Button", async () => {
        let status = await app.selectRadioButton("#yesRadio");
        expect(status).toBeTruthy();
        let message = await app.getElementText(".text-success");
        expect(message).toBe("Yes");

        status = await app.selectRadioButton("#impressiveRadio");
        expect(status).toBeTruthy();
        message = await app.getElementText(".text-success");
        expect(message).toBe("Impressive");

        status = await app.isElementEnabled("#noRadio");
        expect(status).toBeFalsy();
    })

    test("Test Web Tables", async () => {
        const rows = await app.getWebTablesRows();
        const updatedRows = await app.addWebTableRow("Test", "User", "test@test.com", "99", "100000", "Tester");
        expect(updatedRows).toBeGreaterThan(rows);
    })

    test("Test Buttons", async () => {
        await app.browseElements();
        await app.clickElement("text='Buttons'");
        
        await app.clickElement("text='Click Me'");
        let message = await app.getElementText("#dynamicClickMessage");
        expect(message).toBe("You have done a dynamic click");

        await app.doubleClickElement("#doubleClickBtn");
        message = await app.getElementText("#doubleClickMessage");
        expect(message).toBe("You have done a double click");

        await app.rightClickElement("#rightClickBtn")
        message = await app.getElementText("#rightClickMessage");
        expect(message).toBe("You have done a right click");
    })

    test("Test Links", async () => {
        const title = await app.openNewTabLink();
        expect(title).toBe("ToolsQA");
    })

    test("Test Upload & Download", async () => {
        await app.uploadFile(app.uploadFilePath);
        let message = await app.getElementText("#uploadedFilePath");
        expect(message).toBe("C:\\fakepath\\sampleFile.jpeg");

        // TODO: Need to add check for download
    })

    test("Test Dynamic Properties", async () => {
        await app.browseDynamicPropertiesElements();
        let status = await app.isElementEnabled("#enableAfter");
        expect(status).toBeFalsy();
        const color = await app.getElementColor("#colorChange");

        await app.delay(5000)

        status = await app.isElementEnabled("#enableAfter");
        expect(status).toBeTruthy();
        const updatedColor = await app.getElementColor("#colorChange");
        expect(updatedColor).not.toBe(color);
        expect(await app.isElementVisible("#visibleAfter"));
    })

    test.afterAll(async () => {
        await app.closeBrowser();
    })

})