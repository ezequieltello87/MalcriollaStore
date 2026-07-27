document.addEventListener("DOMContentLoaded", () => {
    // Agregamos la clase .reveal a las tarjetas y secciones principales automáticamente
    const elementos = document.querySelectorAll(".tarjeta-producto, .seccion-tienda h1, .seccion-detalle");
    elementos.forEach(el => el.classList.add("reveal"));

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // observer.unobserve(entry.target); // Descomentá si querés que la animación pase una sola vez
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
});