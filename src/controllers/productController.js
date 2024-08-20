const fs = require('fs');
const path = require('path');

// Ruta del archivo donde se almacenan los productos
const productsFilePath = path.join(__dirname, '../data/products.json');

// Leer productos del archivo JSON
const readProducts = () => {
    const data = fs.readFileSync(productsFilePath, 'utf-8');
    return JSON.parse(data);
};

// Escribir productos en el archivo JSON
const writeProducts = (products) => {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

module.exports = {
    readProducts,
    writeProducts
};
