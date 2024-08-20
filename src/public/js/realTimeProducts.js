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
    socket.emit('newProduct', { title, price  });

    // Limpiar el formulario
    form.reset();
});

// Manejar la eliminación de un producto
productList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const li = e.target.parentElement;
        const productId = li.getAttribute('data-id');

        // Emitir el evento de eliminación al servidor
        socket.emit('deleteProduct', productId);

        // Eliminar el producto de la lista
        li.remove();
    }
});

// Escuchar el evento de actualización de productos
socket.on('updateProducts', (products) => {
    productList.innerHTML = ''; // Limpiar la lista actual
    products.forEach(product => {
        const productItem = document.createElement('li');
        productItem.setAttribute('data-id', product.id);
        productItem.innerHTML = `
            ${product.title} - $${product.price}
            <button class="delete-btn">Eliminar</button>
        `;
        productList.appendChild(productItem);
    });
});
