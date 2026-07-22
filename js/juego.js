"use strict";

var inputNombre;
var selectDificultad;
var btnComenzar;
var seccionConfiguracion;
var seccionJuego;
var jugadorSecreto = null;
var modalOverlay;
var modalTitulo;
var modalCuerpo;
var btnCerrarModal;

function getJugadorSecreto(jugador) {
    jugadorSecreto = jugador;
    seccionConfiguracion.classList.add("oculto");
    seccionJuego.classList.remove("oculto");
}

function fallaConexion(error) {
    mostrarModal("Error de conexión", "No se pudo conectar con el servidor. Intentá nuevamente en unos segundos.");
}
function clickComenzar() {
    var nombreIngresado;
    nombreIngresado = inputNombre.value.trim();
    if (nombreIngresado.length < 3) {
        mostrarModal("Nombre inválido", "Ingresá un nombre de al menos 3 letras para comenzar.");
        return;
    }
    pedirJugadorAleatorio(getJugadorSecreto, fallaConexion);
}

function mostrarModal(titulo, mensaje) {
    modalTitulo.textContent = titulo;
    modalCuerpo.textContent = mensaje;
    modalOverlay.classList.remove("oculto");
}

function ocultarModal() {
    modalOverlay.classList.add("oculto");
}

function iniciarApp() {
    inputNombre = document.getElementById("nombreJugador");
    selectDificultad = document.getElementById("dificultad");
    btnComenzar = document.getElementById("btnComenzar");
    btnComenzar.addEventListener("click", clickComenzar);
    seccionConfiguracion = document.getElementById("configuracionJuego");
    seccionJuego = document.getElementById("seccionJuego");
    modalOverlay = document.getElementById("modalOverlay");
    modalTitulo = document.getElementById("modalTitulo");
    modalCuerpo = document.getElementById("modalCuerpo");
    btnCerrarModal = document.getElementById("btnCerrarModal");
    btnCerrarModal.addEventListener("click", ocultarModal);
}

document.addEventListener("DOMContentLoaded", iniciarApp);