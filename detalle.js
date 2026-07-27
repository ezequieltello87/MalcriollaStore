import { obtenerProductos, inicializarEventosComunes } from './carrito.js';

document.addEventListener("DOMContentLoaded", async () => {
    inicializarEventosComunes();
    const productos = await obtenerProductos();
    
    const contenedorDetalle = document.getElementById("detalle-producto");
    if (!contenedorDetalle) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productoId = parseInt(urlParams.get('id'));
    const producto = productos.find(p => p.id === productoId);

    if (!producto) {
        contenedorDetalle.innerHTML = `<p style="text-align: center; color: #777;">Producto no encontrado.</p>`;
        return;
    }

    let imagenesArray = producto.imagenes || [producto.imagen];

    contenedorDetalle.innerHTML = `
        <div class="galeria-detalle">
            <div class="imagen-principal-container">
                <img id="img-principal" src="${imagenesArray[0]}" alt="${producto.nombre}">
            </div>
            <div class="minis-galeria">
                ${imagenesArray.map((img, i) => `<img src="${img}" alt="Miniatura ${i + 1}" class="miniatura-img" data-img="${img}">`).join('')}
            </div>
        </div>
        <div class="info-detalle">
            <h1>${producto.nombre}</h1>
            <p class="precio-detalle">$${producto.precio.toLocaleString()}</p>
            <p class="talle-detalle"><strong>Talle:</strong> ${producto.talle}</p>
            <p class="descripcion-detalle">${producto.descripcion || "Sin descripción disponible."}</p>
            <button class="btn-agregar-detalle" onclick="window.agregarAlCarrito(${producto.id}, event)">Añadir al Carrito</button>
        </div>
    `;

    // Interactividad de miniaturas limpia sin funciones globales sueltas
    document.querySelectorAll('.miniatura-img').forEach(mini => {
        mini.addEventListener('click', (e) => {
            document.getElementById('img-principal').src = e.target.getAttribute('data-img');
        });
    });
});