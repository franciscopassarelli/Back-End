const socket = io();

// Obtener el formulario y la lista de productos
const form = document.getElementById('product-form');
const productList = document.getElementById('product-list');

// Manejar la suma de un nuevo producto
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const price = parseFloat(document.getElementById('price').value);
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    // Validar que el precio sea mayor a cero
    if (price <= 0 || isNaN(price)) {
        alert('El precio debe ser un número mayor a cero.');
        return;
    }

    // Emitir el evento de nuevo producto al servidor
    socket.emit('newProduct', { title, price, description, category });

    // Limpiar el formulario
    form.reset();
});

// Manejar la eliminación de un producto
productList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const li = e.target.parentElement;
        const productId = li.getAttribute('data-id');

        // Mostrar cuadro de confirmación antes de eliminar
        const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este producto?');

        if (confirmDelete) {
            // Emitir el evento de eliminación al servidor
            socket.emit('deleteProduct', productId);

            // Eliminar el producto de la lista
            li.remove();
        }
    }
});

// Escuchar el evento de actualización de productos
socket.on('updateProducts', (products) => {
    productList.innerHTML = ''; // Limpiar la lista actual
    products.forEach(product => {
        const productItem = document.createElement('li');
        productItem.setAttribute('data-id', product.id);
        productItem.innerHTML = `
            <strong>Nombre:</strong> ${product.title}<br>
            <strong>Precio:</strong> $${product.price}<br>
            <strong>Descripción:</strong> ${product.description}<br>
            <strong>Categoría:</strong> ${product.category}<br>
            <button class="delete-btn">Eliminar</button>
        `;
        productList.appendChild(productItem);
    });
});
