/*class Producto {
    constructor(id, nombre, precio, img) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.img = img;
        this.cantidad = 1;
    }
}

//Creo los distintos objetos 

const lavandina = new Producto(1, "Lavandina", 220.80, "img/lavandina.jpg");
const papelHigienico = new Producto(2, "Papel Higiénico", 828, "img/papel-higienico.jpg");
const jabonEnPolvo = new Producto(3, "Jabón en Polvo", 2680, "img/jabon-en-polvo.jpg");
const detergente = new Producto(4, "Detergente", 778, "img/detergente.jpg");
const liquidoParaPisos = new Producto(5, "Líquido para Pisos", 269.16, "img/liquido-para-pisos.jpg");
const lysoform = new Producto(6, "Lysoform", 547.65, "img/lysoform.jpg");
const cifBaño = new Producto(7, "Cif Baño", 235.17, "img/cif-baño.jpg");
const aromatizante = new Producto(8, "Aromatizante", 404.99, "img/aromatizante.jpg");
const bolsas = new Producto(9, "Bolsas", 430, "img/bolsas.jpg");
const esponja = new Producto(10, "Esponja", 115, "img/esponja.jpg");
const guantes = new Producto(11, "Guantes", 662, "img/guantes.jpg");
const rolloDeCocina = new Producto(12, "Rollo de Cocina", 519.41, "img/rollo-cocina.jpg");
const suavizante = new Producto(13, "Suavizante", 1203.65, "img/suavizante.jpg");
const jabon = new Producto(14, "Jabón", 473.68, "img/jabon.jpg");
const paniuelos = new Producto(15, "Pañuelos", 304.40, "img/pañuelos.jpg");
const limpiaVidrios = new Producto(16, "Limpia Vidrios", 235.17, "img/limpia-vidrios.jpg");

//CREAMOS LOS DIFERENTES OBJETOS QUE FORMARÁN PARTE DE ESA CLASE

const arrayProductos = [lavandina, papelHigienico, jabonEnPolvo, detergente, liquidoParaPisos, lysoform, cifBaño, aromatizante, bolsas, esponja, guantes, rolloDeCocina, suavizante, jabon, paniuelos, limpiaVidrios];*/

const listadoProductos = "json/productos.json";
let productos = [];

fetch(listadoProductos)
    .then(respuesta => respuesta.json())
    .then(datos => {
        productos = datos;
        console.log(datos);
        mostrarProductos(productos);
    })
    .catch(error => console.log(error))



// Creamos el array carrito donde se almacenarán las compras
let carrito = [];

// Cargamos desde localStorage
if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
}

// Modificamos el DOM
const contenedorProductos = document.getElementById("contenedorProductos");
const contenedorCarrito = document.getElementById("contenedorCarrito");
const verCarrito = document.getElementById("verCarrito");

// Función para mostrar productos
const mostrarProductos = (productos) => {
    productos.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
        card.innerHTML = `
                    <div class="card">
                    <img class="card-img-tom imgProductos" src="${producto.img}" alt="${producto.nombre}">
                         <div class="card-body">
                            <h3>${producto.nombre}</h3>
                            <p>${producto.precio}</p>
                            <button class="btn colorBoton" id="boton${producto.id}">Agregar al Carrito</button>
                        </div>
                 </div>`;

        contenedorProductos.appendChild(card);

        // Agregar el evento click al botón "Agregar al Carrito"
        const botonAgregar = document.getElementById(`boton${producto.id}`);
        botonAgregar.addEventListener("click", () => {
            agregarAlCarrito(producto.id);
        });
    });
};

// Agregar productos al carrito
const agregarAlCarrito = (id) => {
    const productoAgregado = carrito.find((producto) => producto.id === id);

    if (productoAgregado) {
        productoAgregado.cantidad++;
    } else {
        const producto = productos.find((producto) => producto.id === id);
        producto.cantidad = 1;
        carrito.push(producto);
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
    calcularTotal();
    actualizarContadorCarritoModal();
   
    const carritoModalAbierto = carritoModal.style.display === 'block';
    if (carritoModalAbierto) {
        mostrarCarrito();
    }
};

// Evento para mostrar el carrito de compras
verCarrito.addEventListener("click", () => {
    const modal = document.getElementById("carritoModal");
    modal.style.display = "block";
    mostrarCarrito(); 
});

// Obtener elementos del modal por Id
const carritoModal = document.getElementById('carritoModal');
const closeModalBtn = document.getElementsByClassName('close')[0];

// Función para cerrar el modal
const cerrarModal = () => {
    carritoModal.style.display = 'none';
};

// Evento click en el botón "Cerrar"
closeModalBtn.addEventListener('click', cerrarModal);

// Evento click fuera del modal para cerrarlo
window.addEventListener('click', (event) => {
    if (event.target === carritoModal) {
        cerrarModal();
    }
});

// Mostrar el carrito de compras
const mostrarCarrito = () => {
    carritoModal.style.display = 'block';
    contenedorProductosModal.innerHTML = ""; 

    carrito.forEach((producto) => {
        const productoElement = document.createElement("div");
        productoElement.classList.add("producto");

        const imagenElement = document.createElement("img");
        imagenElement.classList.add("producto-imagen");
        imagenElement.src = producto.img;
        imagenElement.alt = producto.nombre;

        const nombreElement = document.createElement("h3");
        nombreElement.textContent = producto.nombre;
        nombreElement.classList.add("producto-nombre");

        const precioElement = document.createElement("p");
        precioElement.textContent = `Precio: ${producto.precio}`;
        precioElement.classList.add("producto-precio");

        const cantidadElement = document.createElement("p");
        cantidadElement.textContent = `Cantidad: ${producto.cantidad}`;
        cantidadElement.classList.add("producto-cantidad");

        const eliminarButton = document.createElement("button");
        eliminarButton.textContent = "Eliminar";
        eliminarButton.classList.add("btn", "colorBoton", "producto-btn-eliminar");
        eliminarButton.addEventListener("click", () => eliminarDelCarrito(producto.id));

        const restarButton = document.createElement("button");
        restarButton.textContent = "-";
        restarButton.classList.add("btn", "colorBoton", "producto-btn-restar");
        restarButton.addEventListener("click", () => restarDelCarrito(producto.id));

        productoElement.appendChild(imagenElement);
        productoElement.appendChild(nombreElement);
        productoElement.appendChild(precioElement);
        productoElement.appendChild(cantidadElement);
        productoElement.appendChild(eliminarButton);
        productoElement.appendChild(restarButton);

        contenedorProductosModal.appendChild(productoElement);
    });

    calcularTotal();
};


// Eliminar productos del carrito
const eliminarDelCarrito = (id) => {
    carrito = carrito.filter((producto) => producto.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    calcularTotal();
    actualizarContadorCarrito()
    actualizarContadorCarritoModal();
};

// Restar productos del carrito
const restarDelCarrito = (id) => {
    const productoAgregadoIndex = carrito.findIndex((producto) => producto.id === id);

    if (productoAgregadoIndex !== -1) {
        if (carrito[productoAgregadoIndex].cantidad > 1) {
            carrito[productoAgregadoIndex].cantidad--;
        } else {
            carrito.splice(productoAgregadoIndex, 1);
        }
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    calcularTotal();
    actualizarContadorCarrito();
};

//Vaciar carrito
const vaciarCarrito = () => {
    carrito = [];
    localStorage.removeItem("carrito");
    mostrarCarrito();
    actualizarContadorCarrito();
    calcularTotal(); 
    actualizarContadorCarritoModal();
};

//Evento click vaciar carrito
const botonVaciarCarrito = document.getElementById("vaciarCarrito");
botonVaciarCarrito.addEventListener("click", () => {
    vaciarCarrito();
});

const eliminarCarrito = () => {
    carrito = [];
    localStorage.clear();
    mostrarCarrito();
    calcularTotal(); 
    actualizarContadorCarritoModal();
};

//Actualizar contador carrito
const actualizarContadorCarrito = () => {
    const contadorCarrito = document.getElementById("contadorCarrito");
    const botonVaciarCarrito = document.getElementById("vaciarCarrito");

    if (contadorCarrito) {
        if (carrito.length === 0) {
            contadorCarrito.textContent = "0";
        } else {
            contadorCarrito.textContent = carrito.length.toString();
        }
    }

    // Se oculta o muestra el botón según el estado del carrito
    botonVaciarCarrito.style.display = carrito.length === 0 ? "none" : "block";
};

const actualizarContadorCarritoModal = () => {
    const contadorCarritoModal = document.getElementById("contadorCarritoModal");

    if (contadorCarritoModal) {
        if (carrito.length === 0) {
            contadorCarritoModal.textContent = "0";
        } else {
            contadorCarritoModal.textContent = carrito.length.toString();
        }
    }
};



// Calcular el total del carrito
const calcularTotal = () => {
    let total = 0;

    carrito.forEach((producto) => {
        total += producto.precio * producto.cantidad;
    });

    const totalCarrito = document.getElementById("totalCarrito");
    totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
};

// Llamar a la función mostrarProductos para mostrar los productos inicialmente
mostrarProductos(productos);
// Calcular total del carrito
calcularTotal();
//Actualizar carrito
actualizarContadorCarrito();

