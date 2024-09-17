const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');

// Ruta para listar todos los productos con filtros, paginación y ordenamientos
router.get('/', productController.getProducts);

// Ruta para obtener un producto por id
router.get('/:pid', productController.getProductById);

// Ruta para agregar un nuevo producto
router.post('/', productController.createProduct);

// Ruta para actualizar un producto
router.put('/:pid', productController.updateProduct);

// Ruta para eliminar un producto
router.delete('/:pid', productController.deleteProduct);

module.exports = router;
