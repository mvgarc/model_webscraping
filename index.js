import puppeteer from "puppeteer";
import fs from "fs";

async function scrapeData() {
    const browser = await puppeteer.launch({ headless: false, slowMo: 400 });
    const page = await browser.newPage();
    
    await page.goto("https://multimax.com.ve/lavado-2/#lavadoras", { waitUntil: "domcontentloaded" });

    // Esperar a que carguen los productos
    await page.waitForSelector(".product");

    // Extraer nombres, precios y enlaces de los productos
    const products = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".product")).map(item => {
            const titleElement = item.querySelector("a[href*='/producto/']");
            const title = titleElement ? titleElement.innerText.trim() : "No disponible";
            const priceElement = item.querySelector(".woocommerce-Price-amount bdi");
            const price = priceElement ? priceElement.innerText.trim() : "No disponible";
            const link = titleElement ? titleElement.href : "No disponible";
            
            return { title, price, link };
        });
    });

    console.log(products);

    // Guardar los datos en un archivo JSON
    fs.writeFileSync("products.json", JSON.stringify(products, null, 2));

    console.log("✅ Datos guardados en products.json");

    // Esperar unos segundos antes de cerrar para visualizar el proceso
    await new Promise(resolve => setTimeout(resolve, 5000));

    await browser.close();
}

scrapeData();
