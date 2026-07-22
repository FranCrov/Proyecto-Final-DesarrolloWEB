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
var intentosRestantes;
var elementoContador;
var elementoCronometro;
var horaInicio;
var idIntervaloCronometro;


function formatearTiempo(segundosTotales) {
    var minutos;
    var segundos;
    minutos = Math.floor(segundosTotales / 60);
    segundos = segundosTotales % 60;
    if (segundos < 10) {
        return minutos + ":0" + segundos;
    }
    return minutos + ":" + segundos;
}

function actualizarCronometro() {
    var segundosTranscurridos;
    segundosTranscurridos = Math.floor((new Date().getTime() - horaInicio) / 1000);
    elementoCronometro.textContent = formatearTiempo(segundosTranscurridos);
}

function actualizarContador() {
    elementoContador.textContent = "Intentos restantes: " + intentosRestantes;
}

function mostrarModal(titulo, mensaje) {
    modalTitulo.textContent = titulo;
    modalCuerpo.textContent = mensaje;
    modalOverlay.classList.remove("oculto");
}

function ocultarModal() {
    modalOverlay.classList.add("oculto");
}

function getJugadorSecreto(jugador) {
    jugadorSecreto = jugador;
    intentosRestantes = 8;
    seccionConfiguracion.classList.add("oculto");
    seccionJuego.classList.remove("oculto");
    actualizarContador();
    horaInicio = new Date().getTime();
    idIntervaloCronometro = setInterval(actualizarCronometro, 1000);
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
    elementoContador = document.getElementById("contadorIntentos");
    elementoCronometro = document.getElementById("cronometro");
}

document.addEventListener("DOMContentLoaded", iniciarApp);