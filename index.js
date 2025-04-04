import puppeteer from "puppeteer";

async function openWebPage() {
    const browser = await puppeteer.launch({
    headless: false,
    slowMo: 400,
});
const page = await browser.newPage();
await page.goto("https://multimax.com.ve/");
await browser.close();
}

//openWebPage();

async function captureScreenshot() {
    const browser = await puppeteer.launch({
    headless: false,
    slowMo: 400,
});
const page = await browser.newPage();
await page.goto("https://multimax.com.ve/lavado-2/#lavadoras");
await page.screenshot({ path: "example.png", fullPage: true });
await browser.close();
}
captureScreenshot()