"use strict";
var REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var REGEX_ALFANUMERICO = /^[a-zA-Z0-9\s]+$/;
var formularioContacto;
var inputNombreContacto;
var inputEmailContacto;
var inputMensajeContacto;
var spanErrorNombre;
var spanErrorEmail;
var spanErrorMensaje;

function validarNombre(valor) {
    if (valor.trim().length === 0) {
        return "El nombre es obligatorio.";
    }
    if (!REGEX_ALFANUMERICO.test(valor)) {
        return "El nombre debe ser alfanumérico.";
    }
    return "";
}

function validarEmail(valor) {
    if (!REGEX_EMAIL.test(valor)) {
        return "Ingresá un email válido.";
    }
    return "";
}

function validarMensaje(valor) {
    if (valor.trim().length <= 5) {
        return "El mensaje debe tener más de 5 caracteres.";
    }
    return "";
}

function manejarEnvioFormulario(evento) {
    var errorNombre;
    var errorEmail;
    var errorMensaje;
    var asunto;
    var cuerpo;
    var urlMailto;
    evento.preventDefault();
    errorNombre = validarNombre(inputNombreContacto.value);
    errorEmail = validarEmail(inputEmailContacto.value);
    errorMensaje = validarMensaje(inputMensajeContacto.value);
    spanErrorNombre.textContent = errorNombre;
    spanErrorEmail.textContent = errorEmail;
    spanErrorMensaje.textContent = errorMensaje;
    if (errorNombre !== "" || errorEmail !== "" || errorMensaje !== "") {
        return;
    }
    asunto = encodeURIComponent("Contacto desde Futbolle - " + inputNombreContacto.value.trim());
    cuerpo = encodeURIComponent(inputMensajeContacto.value.trim());
    urlMailto = "mailto:QueMirasBOBO@gmail.com?subject=" + asunto + "&body=" + cuerpo;
    console.log(urlMailto);
    window.location.href = urlMailto;
}

function iniciarContacto() {
    formularioContacto = document.getElementById("formularioContacto");
    inputNombreContacto = document.getElementById("nombreContacto");
    inputEmailContacto = document.getElementById("emailContacto");
    inputMensajeContacto = document.getElementById("mensajeContacto");
    spanErrorNombre = document.getElementById("errorNombre");
    spanErrorEmail = document.getElementById("errorEmail");
    spanErrorMensaje = document.getElementById("errorMensaje");
    formularioContacto.addEventListener("submit", manejarEnvioFormulario);
}

document.addEventListener("DOMContentLoaded", iniciarContacto);