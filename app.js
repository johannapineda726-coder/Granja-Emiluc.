// ==========================================
// APP GRANJA EMILUC v2.0
// ==========================================

let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//===========================================
// CARGAR PRODUCTOS
//===========================================

async function cargarProductos() {

    actualizarCarrito();

    try {

        console.log("Cargando productos...");

        const respuesta = await fetch("products.json");

        console.log("Estado:", respuesta.status);

        productos = await respuesta.json();

        console.log(productos);

        mostrarProductos();

    } catch (error) {

        console.error(error);

    }

}

//===========================================
// MOSTRAR PRODUCTOS
//===========================================

function mostrarProductos(lista = productos){

    const contenedor = document.getElementById("listaProductos");

    contenedor.innerHTML = "";

    if(lista.length===0){

        contenedor.innerHTML=`

            <div class="col-12 text-center">

                <h3>No se encontraron productos</h3>

            </div>

        `;

        return;

    }

    lista.forEach(producto=>{

        contenedor.innerHTML+=`

        <div class="col-md-4 mb-4">

            <div class="card h-100 shadow">

                <img
                    src="${producto.imagen}"
                    class="card-img-top"
                    alt="${producto.nombre}">

                <div class="card-body d-flex flex-column">

                    <h4>${producto.nombre}</h4>

                    <p>${producto.descripcion}</p>

                    <h5 class="text-success">

                        $ ${producto.precio.toLocaleString("es-CO")}

                    </h5>

                    <button
                        class="btn btn-success mt-auto"
                        onclick="agregarCarrito(${producto.id})">

                        Agregar al carrito

                    </button>

                </div>

            </div>

        </div>

        `;

    });

}

//===========================================
// AGREGAR AL CARRITO
//===========================================

function agregarCarrito(id) {

    const producto = productos.find(p => p.id === id);

    const existe = carrito.find(p => p.id === id);

    if (existe) {

        existe.cantidad++;

    } else {

        carrito.push({

            ...producto,

            cantidad: 1

        });

    }

    actualizarCarrito();

}

//===========================================
// ACTUALIZAR CARRITO
//===========================================

function actualizarCarrito() {

    let cantidad = 0;

    let total = 0;

    carrito.forEach(producto => {

        cantidad += producto.cantidad;

        total += producto.precio * producto.cantidad;

    });

    document.getElementById("cantidadCarrito").innerText = cantidad;

    document.getElementById("totalCarrito").innerText =
        "$ " + total.toLocaleString("es-CO");

    actualizarDetalle();

guardarCarrito();

}

//===========================================
// ABRIR CARRITO
//===========================================

function abrirCarrito() {

    document.getElementById("panelCarrito").style.right = "0";

}

//===========================================
// CERRAR CARRITO
//===========================================

function cerrarCarrito() {

    document.getElementById("panelCarrito").style.right = "-420px";

}

//===========================================
// DETALLE DEL CARRITO
//===========================================

function actualizarDetalle() {

    const detalle = document.getElementById("detalleCarrito");

    detalle.innerHTML = "";

    let total = 0;

    if (carrito.length === 0) {

        detalle.innerHTML = `

        <p class="text-center mt-4">

            El carrito está vacío

        </p>

        `;

    }

    carrito.forEach(producto => {

        const subtotal = producto.precio * producto.cantidad;

        total += subtotal;

        detalle.innerHTML += `

        <div class="card mb-3">

            <div class="card-body">

                <img
                    src="${producto.imagen}"
                    style="width:100%;border-radius:10px;">

                <h5 class="mt-3">

                    ${producto.nombre}

                </h5>

                <p>

                    Cantidad:

                    <strong>${producto.cantidad}</strong>

                </p>

                <p>

                    Subtotal

                    <strong>

                        $${subtotal.toLocaleString("es-CO")}

                    </strong>

                </p>

                <div class="d-flex gap-2">

                    <button
                        class="btn btn-success"

                        onclick="sumar(${producto.id})">

                        +

                    </button>

                    <button
                        class="btn btn-warning"

                        onclick="restar(${producto.id})">

                        -

                    </button>

                    <button
                        class="btn btn-danger"

                        onclick="eliminar(${producto.id})">

                        Eliminar

                    </button>

                </div>

            </div>

        </div>

        `;

    });

    document.getElementById("granTotal").innerHTML =

        "TOTAL: $" + total.toLocaleString("es-CO");

}
//===========================================
// GUARDAR CARRITO
//===========================================

function guardarCarrito(){

    localStorage.setItem(

        "carrito",

        JSON.stringify(carrito)

    );

}
//===========================================
// NUMERO DE PEDIDO
//===========================================

function generarPedido(){

    let consecutivo=

        localStorage.getItem("pedido");

    if(!consecutivo){

        consecutivo=1000;

    }else{

        consecutivo=parseInt(consecutivo)+1;

    }

    localStorage.setItem(

        "pedido",

        consecutivo

    );

    return consecutivo;

}

//===========================================
// SUMAR
//===========================================

function sumar(id) {

    const producto = carrito.find(p => p.id === id);

    producto.cantidad++;

    actualizarCarrito();

}

//===========================================
// RESTAR
//===========================================

function restar(id) {

    const producto = carrito.find(p => p.id === id);

    producto.cantidad--;

    if (producto.cantidad <= 0) {

        carrito = carrito.filter(p => p.id !== id);

    }

    actualizarCarrito();

}

//===========================================
// ELIMINAR
//===========================================

function eliminar(id) {

    carrito = carrito.filter(p => p.id !== id);

    actualizarCarrito();

}

//===========================================
// ENVIAR WHATSAPP
//===========================================

function enviarWhatsApp(){
    const numeroPedido=generarPedido();

    if(carrito.length===0){

        alert("El carrito está vacío");

        return;

    }

    const nombre=document.getElementById("clienteNombre").value;

    const telefonoCliente=document.getElementById("clienteTelefono").value;

    const direccion=document.getElementById("clienteDireccion").value;

    const barrio=document.getElementById("clienteBarrio").value;

    const observaciones=document.getElementById("clienteObservaciones").value;

    let mensaje=

"🛒 *PEDIDO GRANJA EMILUC*%0A";

const fecha = new Date();

mensaje += "📅 " + fecha.toLocaleDateString("es-CO") + "%0A";
mensaje += "🕒 " + fecha.toLocaleTimeString("es-CO") + "%0A%0A";

mensaje+="Pedido No. "+numeroPedido+"%0A%0A";

    mensaje+="👤 Cliente: "+nombre+"%0A";

    mensaje+="📱 Teléfono: "+telefonoCliente+"%0A";

    mensaje+="📍 Dirección: "+direccion+"%0A";

    mensaje+="🏠 Barrio: "+barrio+"%0A";

    mensaje+="📝 Observaciones: "+observaciones+"%0A%0A";

    let total=0;

    carrito.forEach(item=>{

        const subtotal=item.precio*item.cantidad;

        total+=subtotal;

        mensaje+="• "+item.nombre+"%0A";

        mensaje+=item.cantidad+" x $"+item.precio.toLocaleString("es-CO")+" = $"+subtotal.toLocaleString("es-CO")+"%0A%0A";

    });

    mensaje+="💰 *TOTAL:* $"+total.toLocaleString("es-CO");
    if(!confirm("¿Deseas enviar este pedido por WhatsApp?")){

    return;

}

    window.open(

        "https://wa.me/573505182091?text="+mensaje,

        "_blank"

    );
    carrito=[];

guardarCarrito();

actualizarCarrito();

cerrarCarrito();

document.getElementById("clienteNombre").value="";

document.getElementById("clienteTelefono").value="";

document.getElementById("clienteDireccion").value="";

document.getElementById("clienteBarrio").value="";

document.getElementById("clienteObservaciones").value="";

}
//===========================================
// INICIAR APP
//===========================================

cargarProductos();
//===========================================
// BUSCADOR
//===========================================

document.addEventListener("DOMContentLoaded",()=>{

    const buscador=document.getElementById("buscarProducto");

    if(!buscador) return;

    buscador.addEventListener("keyup",()=>{

        const texto=buscador.value.toLowerCase();

        const filtrados=productos.filter(producto=>

            producto.nombre.toLowerCase().includes(texto) ||

            producto.descripcion.toLowerCase().includes(texto)

        );

        mostrarProductos(filtrados);

    });

});