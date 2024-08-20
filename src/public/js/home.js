document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on('updateProducts', (product) => {
        const productList = document.getElementById('product-list');
        const listItem = document.createElement('li');
        listItem.textContent = `${product.title} - ${product.price}`;
        productList.appendChild(listItem);
    });
});
