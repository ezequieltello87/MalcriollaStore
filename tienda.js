import { obtenerProductos, inicializarEventosComunes } from './carrito.js';

document.addEventListener("DOMContentLoaded", async () => {
    inicializarEventosComunes();
    const productos = await obtenerProductos();
    
    const grillaProductos = document.getElementById("grilla-productos");
    if (!grillaProductos) return;

    const urlParams = new URLSearchParams(window.location.search);
    const categoriaActual = urlParams.get('cat');

    let filtrados = categoriaActual ? productos.filter(p => p.categoria === categoriaActual) : productos;

    if (filtrados.length === 0) {
        grillaProductos.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #777;">No hay productos en esta categoría.</p>`;
        return;
    }

    grillaProductos.innerHTML = filtrados.map(prod => {
        let foto = prod.imagen || (prod.imagenes ? prod.imagenes[0] : '');
        return `
            <div class="tarjeta-producto">
                <a href="producto.html?id=${prod.id}"><img src="${foto}" alt="${prod.nombre}"></a>
                <h3><a href="producto.html?id=${prod.id}" style="color:inherit; text-decoration:none;">${prod.nombre}</a></h3>
                <p class="precio">$${prod.precio.toLocaleString()}</p>
                <p class="talle">Talle: ${prod.talle}</p>
                <button onclick="window.agregarAlCarrito(${prod.id}, event)">Añadir al Carrito</button>
            </div>
        `;
    }).join('');
});