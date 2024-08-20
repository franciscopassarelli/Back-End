const fs = require('fs');
const path = require('path');

// Ruta del archivo donde se almacenan los carritos
const cartsFilePath = path.join(__dirname, '../data/carts.json');

// Leer carritos del archivo JSON
const readCarts = () => {
    try {
        const data = fs.readFileSync(cartsFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo de carritos:', error);
        return [];
    }
};

// Escribir carritos en el archivo JSON
const writeCarts = (carts) => {
    try {
        fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
    } catch (error) {
        console.error('Error al escribir el archivo de carritos:', error);
    }
};

module.exports = {
    readCarts,
    writeCarts
};
