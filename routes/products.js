const express = require('express');
const router = express.Router();
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

// Ruta para listar todos los productos
router.get('/', (req, res) => {
    const products = readProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
});

// Ruta para obtener un producto por id
router.get('/:pid', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send({ message: 'Producto no encontrado' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', (req, res) => {
    const products = readProducts();
    const newProduct = {
        id: (products.length + 1).toString(),
        ...req.body,
        status: req.body.status !== undefined ? req.body.status : true,
    };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

// Ruta para actualizar un producto
router.put('/:pid', (req, res) => {
    let products = readProducts();
    const index = products.findIndex(p => p.id === req.params.pid);
    if (index !== -1) {
        const updatedProduct = { ...products[index], ...req.body };
        products[index] = updatedProduct;
        writeProducts(products);
        res.json(updatedProduct);
    } else {
        res.status(404).send({ message: 'Producto no encontrado' });
    }
});

// Ruta para eliminar un producto
router.delete('/:pid', (req, res) => {
    let products = readProducts();
    const newProducts = products.filter(p => p.id !== req.params.pid);
    if (newProducts.length !== products.length) {
        writeProducts(newProducts);
        res.status(204).send();
    } else {
        res.status(404).send({ message: 'Producto no encontrado' });
    }
});

module.exports = router;