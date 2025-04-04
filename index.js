import puppeteer from "puppeteer";
import fs from "fs";

async function scrapeData() {
    const browser = await puppeteer.launch({ headless: false, slowMo: 200 });
    const page = await browser.newPage();

    await page.goto("https://multimax.com.ve/lavado-2/#lavadoras", { waitUntil: "networkidle2" });

    // Hacer scroll para cargar productos
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 500;
            const timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 500);
        });
    });

    // Esperar a que carguen los productos
    await page.waitForSelector(".woocommerce-LoopProduct-link", { timeout: 60000 });

    // Extraer nombres, precios y enlaces de los productos
    const products = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".woocommerce-LoopProduct-link")).map(item => {
            const titleElement = item.querySelector(".woocommerce-loop-product__title");
            const title = titleElement ? titleElement.innerText.trim() : "No disponible";

            const priceElement = item.querySelector(".woocommerce-Price-amount bdi");
            const price = priceElement ? priceElement.innerText.trim() : "No disponible";

            const link = item.href;

            const imageElement = item.querySelector("img");
            const image = imageElement ? imageElement.src : "No disponible";

            return { title, price, link, image };
        });
    });

    console.log(products);

    // Guardar los datos en un archivo JSON
    fs.writeFileSync("products.json", JSON.stringify(products, null, 2));

    console.log("✅ Datos guardados en products.json");

    await browser.close();
}

scrapeData();
