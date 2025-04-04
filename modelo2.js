import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        const productos = [];
        let paginaActual = 1;

        while (true) {
            console.log(`📄 Extrayendo datos de la página ${paginaActual}...`);

            // URL dinámica para cada página del catálogo
            const url = `https://tiendasdaka.com/page/${paginaActual}/`;
            await page.goto(url, { waitUntil: "networkidle2" });

            // Espera a que los productos carguen
            await page.waitForSelector(".v-card", { timeout: 10000 });

            // Extrae la información de los productos
            const productosPagina = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".v-card")).map(item => ({
                    imagen: item.querySelector(".v-image__image")?.style.backgroundImage.replace('url("', '').replace('")', '') || "Sin imagen",
                    titulo: item.querySelector(".v-card__text p")?.textContent.trim() || "Sin título",
                    precio: item.querySelector(".v-card__actions .precio")?.textContent.trim() || "Sin precio"
                }));
            });

            // Si no hay productos en la página, termina el scraping
            if (productosPagina.length === 0) {
                console.log("🚀 No hay más productos. Finalizando scraping...");
                break;
            }

            productos.push(...productosPagina);
            paginaActual++;
        }

        // Guarda los datos en un archivo JSON
        fs.writeFileSync("productos_daka.json", JSON.stringify(productos, null, 2));
        console.log("✅ Scraping completado. Datos guardados en productos_daka.json");

        await browser.close();
    } catch (error) {
        console.error("❌ Error en el scraping:", error);
    }
})();
