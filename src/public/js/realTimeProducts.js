const socket = io();

// Obtener el formulario y la lista de productos
const form = document.getElementById('product-form');
const productList = document.getElementById('product-list');

// Manejar la suma de un nuevo producto
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;

    // Emitir el evento de nuevo producto al servidor
    socket.emit('newProduct', { title, price });

    // Limpiar el formulario
    form.reset();
});

// Escuchar el evento de actualización de productos
socket.on('updateProducts', (product) => {
    const productItem = document.createElement('li');
    productItem.textContent = `${product.title} - ${product.price}`;
    productList.appendChild(productItem);
});
