const express = require('express');
const router = express.Router();
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

// Ruta para crear un nuevo carrito (POST)
router.post('/', (req, res) => {
    const carts = readCarts();
    const newCart = {
        id: (carts.length + 1).toString(),
        products: req.body.products || []
    };
    carts.push(newCart);
    writeCarts(carts);
    res.status(201).json(newCart);
});

// Ruta para obtener todos los carritos (GET)
router.get('/', (req, res) => {
    const carts = readCarts();
    res.status(200).json(carts);
});

// Ruta para obtener un carrito por ID (GET /:cid)
router.get('/:cid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (cart) {
        res.status(200).json(cart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

// Ruta para actualizar un carrito por ID (PUT /:cid)
router.put('/:cid', (req, res) => {
    const carts = readCarts();
    const index = carts.findIndex(c => c.id === req.params.cid);
    if (index !== -1) {
        const updatedCart = { ...carts[index], ...req.body };
        carts[index] = updatedCart;
        writeCarts(carts);
        res.status(200).json(updatedCart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

// Ruta para eliminar un carrito por ID (DELETE /:cid)
router.delete('/:cid', (req, res) => {
    const carts = readCarts();
    const index = carts.findIndex(c => c.id === req.params.cid);
    if (index !== -1) {
        carts.splice(index, 1);
        writeCarts(carts);
        res.status(200).json({ message: 'Carrito eliminado' });
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

module.exports = router;
