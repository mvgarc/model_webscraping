import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
    try {
        // Lanza el navegador en modo headless
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Abre la página de Multimax
        await page.goto("https://multimax.com.ve/lavado-2/#lavadoras", { waitUntil: "networkidle2" });

        // Espera a que los productos se carguen
        await page.waitForSelector(".gspbgrid_item");

        // Extrae los datos
        const productos = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".gspbgrid_item")).map(item => ({
                imagen: item.querySelector(".gspb-product-featured-image img")?.src || "Sin imagen",
                titulo: item.querySelector(".gspb-dynamic-title-element a")?.textContent.trim() || "Sin título",
                precio: item.querySelector(".woocommerce-Price-amount bdi")?.textContent.trim() || "Sin precio",
                enlace: item.querySelector(".gspb-dynamic-title-element a")?.href || "Sin enlace"
            }));
        });

        // Guarda los datos en un archivo JSON
        fs.writeFileSync("productos.json", JSON.stringify(productos, null, 2));

        console.log("✅ Datos guardados en productos.json");

        // Cierra el navegador
        await browser.close();
    } catch (error) {
        console.error("❌ Error en el scraping:", error);
    }
})();
