import puppeteer from "puppeteer";
import fs from "fs";

async function scrapeData() {
    const browser = await puppeteer.launch({ headless: false, slowMo: 400 });
    const page = await browser.newPage();
    
    await page.goto("https://multimax.com.ve/lavado-2/#lavadoras", { waitUntil: "domcontentloaded" });

    // Esperar a que carguen los productos
    await page.waitForSelector(".product");

    // Extraer nombres y precios de los productos
    const products = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".product")).map(item => {
            const title = item.querySelector(".woocommerce-loop-product__title")?.innerText || "No disponible";
            const price = item.querySelector(".woocommerce-Price-amount")?.innerText || "No disponible";
            return { title, price };
        });
    });

    console.log(products);

    // Guardar los datos en un archivo JSON
    fs.writeFileSync("products.json", JSON.stringify(products, null, 2));

    console.log("Datos guardados en products.json");

    // Esperar unos segundos antes de cerrar para visualizar el proceso
    await new Promise(resolve => setTimeout(resolve, 5000));

    await browser.close();
}

scrapeData();
