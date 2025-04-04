import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: false }); // Usa headless: false para depuración
        const page = await browser.newPage();

        await page.goto("https://tiendasdaka.com/", { waitUntil: "networkidle2" });

        let productos = [];
        let pagina = 1;

        while (true) {
            console.log(`📄 Extrayendo datos de la página ${pagina}...`);

            // Esperar a que los productos carguen
            await page.waitForSelector(".v-card", { timeout: 10000 });

            // Extraer los datos de los productos
            const productosPagina = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".v-card")).map(item => ({
                    imagen: item.querySelector(".v-image__image")?.style.backgroundImage.replace('url("', '').replace('")', '') || "Sin imagen",
                    titulo: item.querySelector(".v-card__text p")?.textContent.trim() || "Sin título",
                    precio: item.querySelector(".v-card__actions .precio")?.textContent.trim() || "Sin precio"
                }));
            });

            productos.push(...productosPagina);

            // Intentar hacer clic en el botón "Siguiente"
            const siguienteBtn = await page.$(".v-pagination__next");
            if (siguienteBtn) {
                await siguienteBtn.click();
                await page.waitForTimeout(3000); // Esperar para cargar nuevos productos
                pagina++;
            } else {
                console.log("🚀 No hay más páginas. Finalizando scraping...");
                break;
            }
        }

        // Guardar los datos en JSON
        fs.writeFileSync("productos_daka.json", JSON.stringify(productos, null, 2));
        console.log("✅ Scraping completado. Datos guardados en productos_daka.json");

        await browser.close();
    } catch (error) {
        console.error("❌ Error en el scraping:", error);
    }
})();
