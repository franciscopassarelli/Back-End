const express = require('express');
const router = express.Router();
const { readCarts, writeCarts } = require('../controllers/cartController');

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
