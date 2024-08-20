const express = require('express');
const router = express.Router();
const { readProducts, writeProducts } = require('../controllers/productController');

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
    const { title, price } = req.body;

    // Validaciones
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).send({ message: 'El título es obligatorio y debe ser una cadena no vacía' });
    }

    if (price === undefined || typeof price !== 'number' || price <= 0) {
        return res.status(400).send({ message: 'El precio debe ser un número mayor a 0' });
    }

    const newProduct = {
        id: (products.length + 1).toString(),
        title,
        price,
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

        // Validaciones
        if (updatedProduct.price !== undefined && (typeof updatedProduct.price !== 'number' || updatedProduct.price <= 0)) {
            return res.status(400).send({ message: 'El precio debe ser un número mayor a 0' });
        }

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
