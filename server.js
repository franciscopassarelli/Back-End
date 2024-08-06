const express = require('express');
const app = express();
const PORT = 8080;

// Importa las rutas de productos y carritos
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');

// Middleware para permitir que la app procese JSON
app.use(express.json());

// Define las rutas para productos y carritos
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Inicia el servidor en el puerto 8080
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
