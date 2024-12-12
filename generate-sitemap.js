const fs = require("fs");
const path = require("path");
const util = require("util");
const readdir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);

// Base URL of your website
const BASE_URL = "https://abdevndesign.com";

// Function to get all HTML files recursively
async function getHtmlFiles(dir) {
  const files = [];
  const items = await readdir(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      files.push(...(await getHtmlFiles(fullPath)));
    } else if (path.extname(item) === ".html") {
      // Get relative path and convert Windows backslashes to forward slashes
      const relativePath = path.relative(".", fullPath).replace(/\\/g, "/");
      files.push(relativePath);
    }
  }

  return files;
}

// Function to generate sitemap XML
async function generateSitemap() {
  try {
    const files = await getHtmlFiles(".");

    // Create XML content
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add each HTML file to sitemap
    for (const file of files) {
      const url = `${BASE_URL}/${file}`;
      xml += "  <url>\n";
      xml += `    <loc>${url}</loc>\n`;
      xml += "    <lastmod>${new Date().toISOString()}</lastmod>\n";
      xml += "  </url>\n";
    }

    xml += "</urlset>";

    // Write sitemap.xml
    await writeFile("sitemap.xml", xml);
    console.log("Sitemap generated successfully!");

    // Generate index.html with site structure
    let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
    html += '  <meta charset="UTF-8">\n';
    html += "  <title>Site Index - AB Development & Design</title>\n";
    html += "  <style>\n";
    html +=
      "    body { font-family: Arial, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }\n";
    html += "    h1 { color: #333; }\n";
    html += "    ul { list-style-type: none; padding: 0; }\n";
    html += "    li { margin: 0.5rem 0; }\n";
    html += "    a { color: #0066cc; text-decoration: none; }\n";
    html += "    a:hover { text-decoration: underline; }\n";
    html += "  </style>\n";
    html += "</head>\n<body>\n";
    html += "  <h1>Site Index</h1>\n";
    html += "  <ul>\n";

    // Add each file to the index
    for (const file of files) {
      html += `    <li><a href="/${file}">${file}</a></li>\n`;
    }

    html += "  </ul>\n</body>\n</html>";

    // Write index.html
    await writeFile("site-index.html", html);
    console.log("Site index generated successfully!");
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }
}

// Run the generator
generateSitemap();
