import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: false }); // Abre Puppeteer con UI visible para depuración
        const page = await browser.newPage();

        await page.goto("https://X", { waitUntil: "networkidle2" });

        let productos = [];

        // Interceptar peticiones de red
        page.on("response", async (response) => {
            const url = response.url();
            
            if (url.includes("/productos")) { // Ajusta esto si es necesario
                try {
                    const jsonResponse = await response.json();
                    console.log("🔎 Datos de productos capturados:", jsonResponse);
                    
                    // Guardar los productos extraídos
                    productos.push(...jsonResponse.data);
                } catch (error) {
                    console.error("❌ No se pudo parsear la respuesta:", error);
                }
            }
        });

        // Simular la navegación a una categoría (si es posible)
        await page.waitForTimeout(5000); // Espera 5 segundos para que Vue.js cargue contenido

        // Guardar los datos en JSON
        fs.writeFileSync("productos_daka.json", JSON.stringify(productos, null, 2));
        console.log("✅ Datos guardados en productos_2.json");

        await browser.close();
    } catch (error) {
        console.error("❌ Error en el scraping:", error);
    }
})();
