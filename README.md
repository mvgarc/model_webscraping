# Prueba de Web Scraping - First Scraper
Este repositorio contiene dos scripts desarrollados en Node.js utilizando Puppeteer para realizar **web scraping** de un catálogo de productos en línea.

## 📁 Estructura del Proyecto

- `index.js`: Automatiza la navegación y extracción de productos a través de múltiples páginas del catálogo.
- `modelo2.js`: Captura datos directamente desde las respuestas de red (network response), ideal para sitios que cargan contenido dinámico mediante APIs.
- `productos.json`: Archivo generado con los productos extraídos por `index.js`.
- `productos_2.json`: Archivo generado por `modelo2.js` al interceptar respuestas de red.

## 🚀 Requisitos

- Node.js >= 18
- Puppeteer

### Instalación

```bash
git clone https://github.com/mvgarc/model_webscraping.git
cd model_webscraping
npm install puppeteer
```

## 🧠 Uso

### 1. `index.js`

Extrae datos de productos navegando por varias páginas del sitio web:

```bash
node index.js
```

**Lo que hace:**

- Navega por 80 páginas (`https://X/1/`, `https://X/2/`, ..., `https://X/80/`)
- Extrae información como:
  - Imagen
  - Título
  - Precio
  - Enlace
- Guarda los datos en `productos.json`.

---

### 2. `modelo2.js`

Captura datos directamente de una API interceptando respuestas de red:

```bash
node modelo2.js
```

**Lo que hace:**

- Abre el sitio `https://X` con el navegador visible.
- Escucha las respuestas de red que contienen `/productos`.
- Guarda los datos en `productos_2.json`.

## ⚠️ Consideraciones

- Asegúrate de reemplazar `https://X` con la URL real del sitio objetivo.
- Verifica que el scraping cumpla con los términos de uso del sitio web.

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).

---

✨ Desarrollado por [@mvgarc](https://github.com/mvgarc)
