"use strict";
var btnModoOscuro;

function alternarModoOscuro() {
    var esOscuro;
    document.body.classList.toggle("modoOscuro");
    esOscuro = document.body.classList.contains("modoOscuro");
    btnModoOscuro.textContent = esOscuro ? "Modo claro" : "Modo oscuro";
    localStorage.setItem("temaFutbolle", esOscuro ? "oscuro" : "claro");
}

function aplicarTemaGuardado() {
    var temaGuardado;
    temaGuardado = localStorage.getItem("temaFutbolle");
    if (temaGuardado === "oscuro") {
        document.body.classList.add("modoOscuro");
        btnModoOscuro.textContent = "Modo claro";
    }
}

function iniciarTema() {
    btnModoOscuro = document.getElementById("btnModoOscuro");
    aplicarTemaGuardado();
    btnModoOscuro.addEventListener("click", alternarModoOscuro);
}

document.addEventListener("DOMContentLoaded", iniciarTema);