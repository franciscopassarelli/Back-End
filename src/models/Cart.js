const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true, default: 1 },
    }],
    totalPrice: { type: Number, required: true, default: 0 } // Consider adding a default value if the total price is always calculated
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
