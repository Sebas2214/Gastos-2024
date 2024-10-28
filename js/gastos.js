// Selección de elementos del DOM
const formulario = document.getElementById('Agregar-gastos');
const listaGastos = document.querySelector('#gastos ul');

// Evento al cargar la página y al enviar el formulario
document.addEventListener('DOMContentLoaded', pedirPresupuesto);
formulario.addEventListener('submit', agregarGasto);

// Clase para manejar el presupuesto
class Presupuesto {
    constructor(cantidad) {
        this.presupuesto = Number(cantidad); // Cantidad total de presupuesto
        this.restante = Number(cantidad);    // Cantidad restante
        this.gastos = [];                    // Lista de gastos
    }

    // Agregar un gasto y recalcular el restante
    agregarGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    // Recalcula la cantidad restante después de cada gasto
    calcularRestante() {
        const totalGastado = this.gastos.reduce((total, gasto) => total + gasto.valor, 0);
        this.restante = this.presupuesto - totalGastado;
    }

    // Eliminar un gasto de la lista
    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

// Clase para manejar la interfaz
class UI {
    mostrarPresupuesto(cantidad) {
        document.querySelector('#total').textContent = cantidad.presupuesto;
        document.querySelector('#restante').textContent = cantidad.restante;
    }

    // Muestra un mensaje de alerta
    mostrarAlerta(mensaje, tipo) {
        const alerta = document.createElement('div');
        alerta.classList.add('alert', 'text-center', tipo === 'error' ? 'alert-danger' : 'alert-success');
        alerta.textContent = mensaje;
        document.querySelector('.contenido-gastos').insertBefore(alerta, formulario);

        // Eliminar alerta después de 3 segundos
        setTimeout(() => alerta.remove(), 3000);
    }

    // Agregar el gasto a la lista visualmente
    agregarGastoALista(gasto) {
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.dataset.id = gasto.id;

        item.innerHTML = `
            ${gasto.nombre} <span class="badge badge-primary badge-pill">$${gasto.valor}</span>
            <button class="btn btn-danger btn-sm borrar-gasto">Borrar</button>
        `;

        listaGastos.appendChild(item);

        // Evento para el botón de eliminar
        item.querySelector('.borrar-gasto').addEventListener('click', () => {
            presupuesto.eliminarGasto(gasto.id);
            this.actualizarListaGastos(presupuesto.gastos);
            this.mostrarPresupuesto(presupuesto);
        });
    }

    // Actualiza toda la lista de gastos en la interfaz
    actualizarListaGastos(gastos) {
        listaGastos.innerHTML = '';
        gastos.forEach(gasto => this.agregarGastoALista(gasto));
    }
}

// Crear instancia de UI y Presupuesto
const ui = new UI();
let presupuesto;

// Pedir el presupuesto al usuario
function pedirPresupuesto() {
    const cantidad = prompt('¿Cuál es tu presupuesto?');

    // Validar el presupuesto
    if (cantidad === '' || cantidad === null || isNaN(cantidad) || Number(cantidad) <= 0) {
        window.location.reload(); // Recargar si es inválido
    } else {
        presupuesto = new Presupuesto(cantidad);
        ui.mostrarPresupuesto(presupuesto);
    }
}

// Función para agregar un gasto
function agregarGasto(e) {
    e.preventDefault();

    // Obtener valores del formulario
    const nombre = document.querySelector('#gasto').value;
    const valor = Number(document.querySelector('#cantidad').value);

    // Validar los campos
    if (nombre === '' || valor === '') {
        ui.mostrarAlerta('Todos los campos son obligatorios', 'error');
    } else if (valor <= 0 || isNaN(valor)) {
        ui.mostrarAlerta('El valor debe ser positivo', 'error');
    } else {
        const gasto = { nombre, valor, id: Date.now() };
        presupuesto.agregarGasto(gasto);
        ui.mostrarAlerta('Gasto agregado correctamente', 'exito');
        ui.agregarGastoALista(gasto);
        ui.mostrarPresupuesto(presupuesto);
        formulario.reset();
    }
}
