import puppeteer from "puppeteer";

async function scrapeData() {
    const browser = await puppeteer.launch({ headless: false, slowMo: 400 });
    const page = await browser.newPage();
    
    await page.goto("https://multimax.com.ve/lavado-2/#lavadoras", { waitUntil: "domcontentloaded" });

    // Extraer nombres y precios de los productos
    const products = await page.evaluate(() => {
        const items = document.querySelectorAll(".product"); // Ajustar según el selector correcto
        return Array.from(items).map(item => {
            const title = item.querySelector(".product-title")?.innerText || "No disponible";
            const price = item.querySelector(".woocommerce-Price-amount")?.innerText || "No disponible";
            return { title, price };
        });
    });

    console.log(products);
    await browser.close();
}

scrapeData();
// Ejecutar la función de scraping