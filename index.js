import { obtenerProductos, inicializarEventosComunes } from './carrito.js';

document.addEventListener("DOMContentLoaded", async () => {
    inicializarEventosComunes();
    const productos = await obtenerProductos();
    
    const grillaDestacados = document.getElementById("grilla-destacados");
    if (!grillaDestacados) return;

    grillaDestacados.innerHTML = productos.slice(0, 4).map(prod => {
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