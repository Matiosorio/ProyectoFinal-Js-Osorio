
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
const resultado = document.getElementById("resultado");
const buscador = document.getElementById("buscador");

// Función para mostrar productos
const mostrarProductos = (productos) => {
    productos.forEach((producto) => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
        card.innerHTML = `
                    <div class="card">
                    <img class="card-img-tom imgProductos" src="${producto.img}" alt="${producto.nombre}">
                         <div class="card-productos">
                            <h3 class="card-title">${producto.nombre}</h3>
                            <p class="card-text">$${producto.precio}</p>
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

    const carritoModalAbierto = carritoModal.style.display === 'block';
    if (carritoModalAbierto) {
        mostrarCarrito();
    }

    Toastify({
        text: "Producto agregado al carrito",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #180c78, #007fff)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: "15px"
        },
    }).showToast()
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

    if (carrito.length === 0) {
        const carritoVacio = document.getElementById('carritoVacio');
        carritoVacio.style.display = 'block';
    } else {
        const carritoVacio = document.getElementById('carritoVacio');
        carritoVacio.style.display = 'none';

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

            const sumarButton = document.createElement("button");
            sumarButton.textContent = "+";
            sumarButton.classList.add("btn", "colorBoton", "producto-btn-sumar");
            sumarButton.addEventListener("click", () => sumarAlCarrito(producto.id));

            productoElement.appendChild(imagenElement);
            productoElement.appendChild(nombreElement);
            productoElement.appendChild(precioElement);
            productoElement.appendChild(cantidadElement);
            productoElement.appendChild(eliminarButton);
            productoElement.appendChild(restarButton);
            productoElement.appendChild(sumarButton);

            contenedorProductosModal.appendChild(productoElement);
        });

        calcularTotal();
    }
    const botonFinalizarCompra = document.getElementById("finalizarCompra");
    botonFinalizarCompra.style.display = carrito.length === 0 ? "none" : "block";

};

// Eliminar productos del carrito
const eliminarDelCarrito = (id) => {
    carrito = carrito.filter((producto) => producto.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    calcularTotal();
    actualizarContadorCarrito()

    Toastify({
        text: "¡Listo! Eliminaste el producto",
        duration: 3000,
        gravity: "bottom",
        position: "center",
        style: {
            background: "linear-gradient(to right, #180c78, #007fff)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: "15px"
        },
    }).showToast()
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

// Función para sumar productos al carrito
const sumarAlCarrito = (id) => {
    const productoAgregado = carrito.find((producto) => producto.id === id);

    if (productoAgregado) {
        productoAgregado.cantidad++;
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
    calcularTotal();
    actualizarContadorCarrito();
};

//Vaciar carrito
const vaciarCarrito = async () => {
    const confirmacion = await Swal.fire({
        title: '¿Estás seguro de vaciar el carrito?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar',
        backdrop: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
            container: 'my-swal-container',
            popup: 'my-swal-popup',
        },
    });

    if (confirmacion.isConfirmed) {
        // Vaciar el carrito y eliminar del LocalStorage
        carrito = [];
        localStorage.removeItem("carrito");
        mostrarCarrito();
        actualizarContadorCarrito();
        calcularTotal();

        Swal.fire(
            'Carrito vaciado',
            'El carrito ha sido vaciado correctamente.',
            'success'
        );
    }
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
};


// Actualizar contador del carrito en el botón "Ver Carrito"
const actualizarContadorCarrito = () => {
    const contadorCarrito = document.getElementById("contadorCarrito");
    const botonVaciarCarrito = document.getElementById("vaciarCarrito");

    if (contadorCarrito) {
        if (carrito.length === 0) {
            contadorCarrito.textContent = "0";
        } else {
            // Calcular la cantidad total de productos en el carrito sumando las cantidades individuales
            const cantidadTotal = carrito.reduce((total, producto) => total + producto.cantidad, 0);
            contadorCarrito.textContent = cantidadTotal.toString();
        }
    }

    // Se oculta o muestra el botón vaciarCarrito dependiendo de si hay productos o no
    botonVaciarCarrito.style.display = carrito.length === 0 ? "none" : "block";
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


//Buscador de articulos
const filtrar = () => {
    resultado.innerHTML = '';

    const texto = buscador.value.toLowerCase();
    if (texto === '') {
        // Si no se ingresa nada en el buscador, no se muestra ningún producto
        return;
    }

    for (let producto of productos) {
        let nombre = producto.nombre.toLowerCase();

        if (nombre.indexOf(texto) !== -1) {
            const card = document.createElement("div");
            card.classList.add("card", "resultado-card");
            card.innerHTML = `
            <div class="card">
            <img class="card-img-tom imgProductos" src="${producto.img}" alt="${producto.nombre}">
                 <div class="card-productos">
                    <h3 class="card-title">${producto.nombre}</h3>
                    <p class="card-text">$${producto.precio}</p>
                    <button class="btn colorBoton" id="boton${producto.id}">Agregar al Carrito</button>
                </div>
         </div>`;

            resultado.appendChild(card);

            // Agregar el evento click al botón "Agregar al Carrito" del producto filtrado
            const botonAgregar = card.querySelector(`#boton${producto.id}`);
            botonAgregar.addEventListener("click", () => {
                agregarAlCarrito(producto.id);
            });
        }
    }

    if (resultado.innerHTML === '') {
        resultado.innerHTML = `<li>Producto no encontrado</li>`;
    }
};

buscador.addEventListener('keyup', filtrar)
filtrar();

// Evento click en el botón de categoría "Limpieza"
const botonLimpieza = document.getElementById("botonLimpieza");
botonLimpieza.addEventListener("click", () => {
    filtrarPorCategoria("limpieza");
});

// Evento click en el botón de categoría "Pileta"
const botonPileta = document.getElementById("botonPileta");
botonPileta.addEventListener("click", () => {
    filtrarPorCategoria("pileta");
});

// Evento click en el botón de categoría "Accesorios de limpieza"
const botonAccesorios = document.getElementById("botonAccesorios");
botonAccesorios.addEventListener("click", () => {
    filtrarPorCategoria("accesorios");
});

// Evento click en el botón de categoría "Papeles"
const botonPapeles = document.getElementById("botonPapeles");
botonPapeles.addEventListener("click", () => {
    filtrarPorCategoria("papeles");
});

// Evento click en el botón de categoría "Insecticidas"
const botonInsecticidas = document.getElementById("botonInsecticidas");
botonInsecticidas.addEventListener("click", () => {
    filtrarPorCategoria("insecticidas");
});

// Evento click en el botón de categoría "Lavado"
const botonLavado = document.getElementById("botonLavado");
botonLavado.addEventListener("click", () => {
    filtrarPorCategoria("lavado");
});


//Función para filtrar por categoría
const filtrarPorCategoria = (categoria) => {
    // Limpio el contenedor de productos antes de mostrar los nuevos productos
    contenedorProductos.innerHTML = "";

    // Se filtran los productos por la categoría seleccionada
    const productosFiltrados = productos.filter(producto => producto.categoria.id === categoria);

    // Mostrar los productos filtrados en el contenedor de productos
    mostrarProductos(productosFiltrados);
};

// Función para mostrar todos los productos
const mostrarTodosLosProductos = () => {
    contenedorProductos.innerHTML = ""; // Limpia el contenedor de productos

    // Mostrar todos los productos en el contenedor
    mostrarProductos(productos);
};

// Evento click en el botón de categoría "Todos"
const botonTodos = document.getElementById("botonTodos");
botonTodos.addEventListener("click", () => {
    mostrarTodosLosProductos();
});

//FINALIZAR COMPRA
const finalizarCompra = async () => {
    await Swal.fire({
        title: '¡Operación finalizada con éxito!',
        text: '¡Gracias por tu compra!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });

    // Se vacia el carrito
    carrito = [];
    localStorage.removeItem("carrito");
    mostrarCarrito();
    actualizarContadorCarrito();
    calcularTotal();
};

// Llamada a la función finalizarCompra cuando se hace clic en el botón "Finalizar compra"
document.getElementById('finalizarCompra').addEventListener('click', finalizarCompra);



// Llamar a la función mostrarProductos para mostrar los productos inicialmente
mostrarProductos(productos);
// Calcular total del carrito
calcularTotal();
//Actualizar carrito
actualizarContadorCarrito();
