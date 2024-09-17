const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');

// Ruta para crear un nuevo carrito
router.post('/', cartController.createCart);

// Ruta para obtener todos los carritos
router.get('/', cartController.getCarts);

// Ruta para obtener un carrito por ID
router.get('/:cid', cartController.getCartById);

// Ruta para actualizar un carrito por ID
router.put('/:cid', cartController.updateCart);

// Ruta para eliminar un carrito por ID
router.delete('/:cid', cartController.deleteCart);

module.exports = router;
