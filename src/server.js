const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const app = express();
const PORT = 8080;


// Conectar a MongoDB sin las opciones deprecadas
mongoose.connect('mongodb://localhost:27017/nombre-de-tu-base-de-datos')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });


// Importa las rutas de productos y carritos
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');

// Importa el modelo de producto
const Product = require('./models/Product'); // Este modelo lo tienes que crear

// Middleware para permitir que la app procese JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para manejar formularios

// Configura Handlebars como motor de plantillas
app.engine('handlebars', engine({
    extname: '.handlebars', // Especifica la extensión de los archivos
    defaultLayout: 'main', // Usa 'main.handlebars' como layout por defecto
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, // Permite acceso a propiedades prototípicas
        allowProtoMethodsByDefault: true,   // Permite métodos prototípicos (opcional)
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configura el directorio público para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Define las rutas para productos y carritos
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Ruta para la vista principal
app.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('home', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading products');
    }
});

app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading products');
    }
});

app.get('/productlist', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('productList', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error loading products');
    }
});

// Crea el servidor HTTP y configura WebSockets
const server = http.createServer(app);
const io = socketIo(server);

// Configura WebSocket
io.on('connection', async (socket) => {
    console.log('New client connected');
    
    // Emitir la lista de productos al cliente conectado
    try {
        const products = await Product.find();
        socket.emit('updateProducts', products);
    } catch (error) {
        console.error('Error loading products:', error);
    }

    socket.on('newProduct', async (productData) => {
        try {
            const product = new Product(productData);
            await product.save();
            const products = await Product.find();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error saving new product:', error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            await Product.findByIdAndDelete(productId);
            const products = await Product.find();
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Inicia el servidor en el puerto 8080
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
