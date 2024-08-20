const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const PORT = 8080;

// Importa las rutas de productos y carritos
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');

// Middleware para permitir que la app procese JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para manejar formularios

// Configura Handlebars como motor de plantillas
app.engine('handlebars', engine({
    defaultLayout: 'main' // Usa 'main.handlebars' como layout por defecto
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configura el directorio público para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Define las rutas para productos y carritos
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Define rutas para vistas
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

// Crea el servidor HTTP y configura WebSockets
const server = http.createServer(app);
const io = socketIo(server);

// Productos en memoria para la demostración
let products = [
    { id: '1', title: 'Producto 1', price: 100 },
    { id: '2', title: 'Producto 2', price: 200 }
];

// Configura WebSocket
io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Emitir la lista de productos al cliente conectado
    socket.emit('updateProducts', products);

    socket.on('newProduct', (product) => {
        // Asignar un ID único (en un caso real, deberías usar una base de datos)
        product.id = (products.length + 1).toString();
        products.push(product);
        io.emit('updateProducts', products);
    });

    socket.on('deleteProduct', (productId) => {
        products = products.filter(p => p.id !== productId);
        io.emit('updateProducts', products);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Inicia el servidor en el puerto 8080
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
