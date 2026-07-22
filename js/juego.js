"use strict";

var inputNombre;
var selectDificultad;
var btnComenzar;
var seccionConfiguracion;
var seccionJuego;

function iniciarApp() {
    inputNombre = document.getElementById("nombreJugador");
    selectDificultad = document.getElementById("dificultad");
    btnComenzar = document.getElementById("btnComenzar");
    seccionConfiguracion = document.getElementById("configuracionJuego");
    seccionJuego = document.getElementById("seccionJuego");
}

document.addEventListener("DOMContentLoaded", iniciarApp);

