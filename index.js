import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        const totalPaginas = 80; // Número de páginas del catálogo
        const productos = [];

        for (let i = 1; i <= totalPaginas; i++) {
            console.log(`📄 Extrayendo datos de la página ${i}...`);

            // Abre la página correspondiente
            const url = `https://multimax.com.ve/productos/page/${i}/`;
            await page.goto(url, { waitUntil: "networkidle2" });

            // Espera a que los productos se carguen
            await page.waitForSelector(".gspbgrid_item", { timeout: 5000 });

            // Extrae los datos
            const productosPagina = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".gspbgrid_item")).map(item => ({
                    imagen: item.querySelector(".gspb-product-featured-image img")?.src || "Sin imagen",
                    titulo: item.querySelector(".gspb-dynamic-title-element a")?.textContent.trim() || "Sin título",
                    precio: item.querySelector(".woocommerce-Price-amount bdi")?.textContent.trim() || "Sin precio",
                    enlace: item.querySelector(".gspb-dynamic-title-element a")?.href || "Sin enlace"
                }));
            });

            // Agrega los productos extraídos al array general
            productos.push(...productosPagina);
        }

        // Guarda los datos en un archivo JSON
        fs.writeFileSync("productos.json", JSON.stringify(productos, null, 2));
        console.log("✅ Scraping completado. Datos guardados en productos.json");

        await browser.close();
    } catch (error) {
        console.error("❌ Error en el scraping:", error);
    }
})();
