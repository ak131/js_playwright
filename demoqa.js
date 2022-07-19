const {chromium} = require("playwright");
const os = require("os");
const path = require("path");

let browser = null;
let page = null;
const downloadPath = path.join(os.homedir(), "Downloads");
const uploadFilePath = path.join(downloadPath, "sampleFile.jpeg");
const URL = "https://demoqa.com";

function delay(time) {
    return new Promise(resolve => {setTimeout(resolve, time)});
}

async function initiateBrowser() {
    browser = await chromium.launch({headless: false, slowMo:500});
    page = await browser.newPage({baseURL: URL});
}

async function closeBrowser() {
    await page.close();
    await browser.close();
}

async function browseHomepage() {
    await page.goto("/");
}

async function getElementText(selector) {
    return page.innerText(selector);
}

function getPageURL() {
    return page.url();
}

async function isElementEnabled(selector) {
    return page.locator(selector).isEnabled();
}

async function isElementVisible(selector) {
    return page.locator(selector).isVisible(); 
}

async function getElementsCount(selector) {
    return page.locator(selector).count();
}

async function clickElement(selector) {
    const element = await page.locator(selector); 
    await element.scrollIntoViewIfNeeded();
    await element.click();
}

async function doubleClickElement(selector) {
    await page.locator(selector).dblclick();
}

async function rightClickElement(selector) {
    await page.locator(selector).click({button: "right"});
}

async function getElementColor(selector) {
    const element = await page.locator(selector);
    const color = await element.evaluate((element) => window.getComputedStyle(element).getPropertyValue("color"));

    return color;
}

async function browseElements() {
    await browseHomepage();
    await clickElement("text='Elements'");
}

async function browseForms() {
    await browseHomepage();
    await clickElement("text='Forms'");
}

async function browseAlertsFramesWindows() {
    await browseHomepage();
    await clickElement("text='Alerts, Frame & Windows'");
}

async function fillTextBox(name, email, currentAddress, permanentAddress) {
    await browseElements();
    await clickElement("text='Text Box'");
    await page.fill("#userName", name);
    await page.fill("#userEmail", email);
    await page.fill("#currentAddress", currentAddress);
    await page.fill("#permanentAddress", permanentAddress);
    await clickElement("#submit");
}

async function selectAllCheckBoxes() {
    await browseElements();
    await clickElement("text='Check Box'");
    await clickElement(".rct-option-expand-all");
    await page.check("label[for='tree-node-home'] span.rct-checkbox")
}

async function selectRadioButton(selector) {
    await browseElements();
    await clickElement("text='Radio Button'");
    await page.check(selector, {force:true});

    return page.isChecked(selector);
}

async function getWebTablesRows() {
    await browseElements()
    await clickElement("text='Web Tables'");

    return getElementsCount("xpath=//div[@class='rt-tbody']/div[@class='rt-tr-group']/div[not(contains(@class, 'padRow'))]");
}

async function addWebTableRow(firstName, lastName, email, age, salary, department) {
    await browseElements()
    await clickElement("text='Web Tables'");

    await clickElement("#addNewRecordButton");
    await page.locator("#firstName").fill(firstName);
    await page.locator("#lastName").fill(lastName);
    await page.locator("#userEmail").fill(email);
    await page.locator("#age").fill(age);
    await page.locator("#salary").fill(salary);
    await page.locator("#department").fill(department)
    await clickElement("#submit");

    return getElementsCount("xpath=//div[@class='rt-tbody']/div[@class='rt-tr-group']/div[not(contains(@class, 'padRow'))]");
}

async function uploadFile(filePath) {
    await browseElements();
    await clickElement("text='Upload and Download'");

    await page.locator("#uploadFile").setInputFiles(filePath);
}

async function browseDynamicPropertiesElements() {
    await browseElements();
    await clickElement("text='Dynamic Properties'");
}

async function openNewTabLink() {
    await browseElements();
    await clickElement("text='Links'");

    const [newPage] = await Promise.all([page.waitForEvent('popup'), page.click("#simpleLink")]);
    await newPage.waitForLoadState();
    const title = await newPage.title();
    await newPage.close();

    return title
}

module.exports = {
    URL, downloadPath, uploadFilePath, initiateBrowser, closeBrowser, getPageURL, browseHomepage, browseElements, browseForms, 
    browseAlertsFramesWindows, getElementText, fillTextBox, selectAllCheckBoxes, selectRadioButton, isElementEnabled, isElementVisible, 
    getElementsCount, getWebTablesRows, addWebTableRow, clickElement, doubleClickElement, rightClickElement, uploadFile, 
    browseDynamicPropertiesElements, getElementColor, delay, openNewTabLink
} ;