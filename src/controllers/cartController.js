const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCarts = async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product'); // Populate to get product details
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los carritos' });
    }
};

const createCart = async (req, res) => {
    try {
        const newCart = new Cart(req.body);
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
};

const getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
};

const updateCart = async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.cid, req.body, { new: true }).populate('products.product');
        if (updatedCart) {
            res.status(200).json(updatedCart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
};

const deleteCart = async (req, res) => {
    try {
        const result = await Cart.findByIdAndDelete(req.params.cid);
        if (result) {
            res.status(200).json({ message: 'Carrito eliminado' });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el carrito' });
    }
};

module.exports = {
    getCarts,
    createCart,
    getCartById,
    updateCart,
    deleteCart
};
