// carrito.js - Módulo centralizado de Carrito y Estado Global
export let productosGlobal = [];
export let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Guardar en localStorage automáticamente
export function guardarCarritoEnStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Actualizar la interfaz visual del carrito en cualquier vista
export function actualizarCarritoUI() {
    const contenedorCarritoItems = document.getElementById("carrito-items");
    const contadorCarrito = document.getElementById("contador-carrito");
    const carritoTotal = document.getElementById("carrito-total");

    if (!contenedorCarritoItems) return;
    contenedorCarritoItems.innerHTML = "";
    
    let total = 0;
    let totalItems = 0;

    carrito.forEach(item => {
        total += item.precio * item.cantidad;
        totalItems += item.cantidad;
        contenedorCarritoItems.innerHTML += `
            <div class="carrito-item">
                <img src="${item.imagen}" width="50" alt="${item.nombre}">
                <div>
                    <h4>${item.nombre}</h4>
                    <p>$${item.precio.toLocaleString()} x ${item.cantidad}</p>
                </div>
                <button onclick="window.eliminarDelCarrito(${item.id})">&times;</button>
            </div>
        `;
    });

    if (contadorCarrito) contadorCarrito.innerText = totalItems;
    if (carritoTotal) carritoTotal.innerText = `$${total.toLocaleString()}`;
    guardarCarritoEnStorage();
}

// Agregar al carrito (expuesto a window para los eventos inline de los botones)
window.agregarAlCarrito = function(id, event) {
    const productoEncontrado = productosGlobal.find(p => p.id === id);
    if (!productoEncontrado) return;

    const enCarrito = carrito.find(p => p.id === id);
    let foto = productoEncontrado.imagen || (productoEncontrado.imagenes ? productoEncontrado.imagenes[0] : '');

    if (enCarrito) {
        enCarrito.cantidad++;
    } else {
        carrito.push({ ...productoEncontrado, imagen: foto, cantidad: 1 });
    }
    
    actualizarCarritoUI();

    // Feedback visual optimizado en el botón
    if (event && event.target) {
        const boton = event.target;
        const textoOriginal = boton.innerText;
        boton.innerText = "✓ AGREGADO";
        boton.classList.add("agregado");
        setTimeout(() => {
            boton.innerText = textoOriginal;
            boton.classList.remove("agregado");
        }, 1200);
    }
};

window.eliminarDelCarrito = function(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarritoUI();
};

// Inicializar eventos globales (Modal y Menú Hamburguesa Móvil)
export function inicializarEventosComunes() {
    const carritoModal = document.getElementById("carrito-modal");
    const btnAbrirCarrito = document.getElementById("btn-abrir-carrito");
    const btnCerrarCarrito = document.getElementById("btn-cerrar-carrito");
    const btnFinalizar = document.getElementById("btn-finalizar");
    
    const btnMenuHamburguesa = document.getElementById("btn-menu-hamburguesa");
    const btnCerrarMenu = document.getElementById("btn-cerrar-menu");
    const menuMovil = document.getElementById("menu-movil");

    if (btnAbrirCarrito && carritoModal) {
        btnAbrirCarrito.addEventListener("click", () => carritoModal.classList.add("activo"));
    }
    if (btnCerrarCarrito && carritoModal) {
        btnCerrarCarrito.addEventListener("click", () => carritoModal.classList.remove("activo"));
    }

    if (btnMenuHamburguesa && menuMovil) {
        btnMenuHamburguesa.addEventListener("click", () => menuMovil.classList.add("activo"));
    }
    if (btnCerrarMenu && menuMovil) {
        btnCerrarMenu.addEventListener("click", () => menuMovil.classList.remove("activo"));
    }

    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", () => {
            if (carrito.length === 0) {
                alert("Tu carrito está vacío.");
                return;
            }

            let mensaje = "Hola! Vengo de la web MALCRIOLLA y quiero hacer el siguiente pedido:%0A";
            let total = 0;

            carrito.forEach(item => {
                mensaje += `- ${item.cantidad}x ${item.nombre} (Talle: ${item.talle}) - $${(item.precio * item.cantidad).toLocaleString()}%0A`;
                total += item.precio * item.cantidad;
            });

            mensaje += `%0A*Total a abonar: $${total.toLocaleString()}*`;
            window.open(`https://wa.me/5493413222628?text=${mensaje}`, '_blank');
        });
    }

    actualizarCarritoUI();
}

// Fetch global optimizado para evitar múltiples peticiones
export async function obtenerProductos() {
    if (productosGlobal.length > 0) return productosGlobal;
    try {
        const respuesta = await fetch('productos.json');
        productosGlobal = await respuesta.json();
        return productosGlobal;
    } catch (error) {
        console.error("Error al cargar productos.json:", error);
        return [];
    }
}