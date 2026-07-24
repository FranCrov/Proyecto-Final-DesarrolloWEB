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
var idIntervaloCronometro = null;
var inputBusqueda;
var listaSugerencias;
var idTimeoutBusqueda = null;
var ultimasSugerencias = [];
var tableroIntentos;
var intentosHechos = [];
var btnReiniciar;
var dificultadElegida;
var fotoSecreta;


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

function configurarPistaDificultad() {
    if (dificultadElegida === "facil") {
        fotoSecreta.src = jugadorSecreto.photo;
        fotoSecreta.className = "fotoSecreta blur8";
    } else {
        fotoSecreta.classList.add("oculto");
    }
}

function actualizarPistaFoto() {
    if (dificultadElegida === "facil") {
        fotoSecreta.className = "fotoSecreta blur" + intentosRestantes;
    }
}

function getJugadorSecreto(jugador) {
    jugadorSecreto = jugador;
    intentosRestantes = 8;
    seccionConfiguracion.classList.add("oculto");
    seccionJuego.classList.remove("oculto");
    actualizarContador();
    horaInicio = new Date().getTime();
    idIntervaloCronometro = setInterval(actualizarCronometro, 1000);
    configurarPistaDificultad();
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
    dificultadElegida = selectDificultad.value;
    pedirJugadorAleatorio(getJugadorSecreto, fallaConexion);
}


function mostrarSugerencias(jugadores) {
    var i;
    var item;
    ultimasSugerencias = jugadores;
    listaSugerencias.textContent = "";
    for (i = 0; i < jugadores.length; i++) {
        item = document.createElement("li");
        item.className = "itemSugerencia";
        item.textContent = jugadores[i].name;
        item.setAttribute("data-indice", i);
        listaSugerencias.appendChild(item);
    }
    listaSugerencias.classList.remove("oculto");
}

function manejarClickSugerencia(evento) {
    var elementoClickeado;
    var indice;
    var jugadorElegido;
    elementoClickeado = evento.target;
    if (!elementoClickeado.classList.contains("itemSugerencia")) {
        return;
    }
    indice = parseInt(elementoClickeado.getAttribute("data-indice"), 10);
    jugadorElegido = ultimasSugerencias[indice];
    registrarIntento(jugadorElegido);
}

function ejecutarBusqueda() {
    var textoBuscado;
    textoBuscado = inputBusqueda.value.trim();
    if (textoBuscado.length < 2) {
        listaSugerencias.classList.add("oculto");
        return;
    }
    pedirSugerencias(textoBuscado, mostrarSugerencias, fallaConexion);
}

function manejarEscrituraBusqueda() {
    if (idTimeoutBusqueda !== null) {
        clearTimeout(idTimeoutBusqueda);
    }
    idTimeoutBusqueda = setTimeout(ejecutarBusqueda, 300);
}

function compararAtributoExacto(valorIntento, valorSecreto) {
    if (valorIntento === valorSecreto) {
        return "coincide";
    }
    return "noCoincide";
}

function compararAtributoNumerico(valorIntento, valorSecreto) {
    if (valorIntento === valorSecreto) {
        return "coincide";
    }
    if (valorSecreto > valorIntento) {
        return "mayor";
    }
    return "menor";
}

function compararJugadores(jugadorIntento, jugadorSecreto) {
    var resultado;
    resultado = {};
    resultado.nombre = jugadorIntento.id === jugadorSecreto.id ? "coincide" : "noCoincide";
    resultado.nacionalidad = compararAtributoExacto(jugadorIntento.nationality, jugadorSecreto.nationality);
    resultado.club = compararAtributoExacto(jugadorIntento.club, jugadorSecreto.club);
    resultado.posicion = compararAtributoExacto(jugadorIntento.position, jugadorSecreto.position);
    resultado.edad = compararAtributoNumerico(jugadorIntento.age, jugadorSecreto.age);
    resultado.overall = compararAtributoNumerico(jugadorIntento.overall, jugadorSecreto.overall);
    resultado.altura = compararAtributoNumerico(jugadorIntento.heightCm, jugadorSecreto.heightCm);
    return resultado;
}

function obtenerClaseColor(resultadoComparacion) {
    if (resultadoComparacion === "coincide") {
        return "celdaCoincide";
    }
    if (resultadoComparacion === "noCoincide") {
        return "celdaNoCoincide";
    }
    return "celdaNeutra";
}

function crearCelda(valor, resultadoComparacion) {
    var celda;
    celda = document.createElement("span");
    celda.className = "celda " + obtenerClaseColor(resultadoComparacion);
    celda.textContent = valor;
    return celda;
}

function crearCeldaNumerica(valor, resultadoComparacion) {
    var celda;
    var flecha;
    celda = crearCelda(valor, resultadoComparacion);
    if (resultadoComparacion === "mayor") {
        flecha = document.createElement("span");
        flecha.textContent = " \u2191";
        celda.appendChild(flecha);
    } else if (resultadoComparacion === "menor") {
        flecha = document.createElement("span");
        flecha.textContent = " \u2193";
        celda.appendChild(flecha);
    }
    return celda;
}

function crearFilaIntento(jugadorIntento, resultado) {
    var fila;
    fila = document.createElement("div");
    fila.className = "filaIntento";
    fila.appendChild(crearCelda(jugadorIntento.name, resultado.nombre));
    fila.appendChild(crearCelda(jugadorIntento.nationality, resultado.nacionalidad));
    fila.appendChild(crearCelda(jugadorIntento.club, resultado.club));
    fila.appendChild(crearCelda(jugadorIntento.position, resultado.posicion));
    fila.appendChild(crearCeldaNumerica(jugadorIntento.age, resultado.edad));
    fila.appendChild(crearCeldaNumerica(jugadorIntento.overall, resultado.overall));
    fila.appendChild(crearCeldaNumerica(jugadorIntento.heightCm, resultado.altura));
    return fila;
}

function yaFueIntentado(idJugador) {
    var i;
    for (i = 0; i < intentosHechos.length; i++) {
        if (intentosHechos[i] === idJugador) {
            return true;
        }
    }
    return false;
}


function registrarIntento(jugadorElegido) {
    var resultado;
    var fila;
    if (yaFueIntentado(jugadorElegido.id)) {
        mostrarModal("Intento inválido", "Ya intentaste con ese jugador.");
        return;
    }
    intentosHechos.push(jugadorElegido.id);
    resultado = compararJugadores(jugadorElegido, jugadorSecreto);
    fila = crearFilaIntento(jugadorElegido, resultado);
    tableroIntentos.appendChild(fila);
    intentosRestantes = intentosRestantes - 1;
    actualizarContador();
    actualizarPistaFoto();
    inputBusqueda.value = "";
    listaSugerencias.classList.add("oculto");
    if (resultado.nombre === "coincide") {
        mostrarModal("¡Ganaste!", "Adivinaste al jugador secreto: " + jugadorSecreto.name);
        return;
    }
    if (intentosRestantes === 0) {
        mostrarModal("Perdiste", "El jugador secreto era: " + jugadorSecreto.name);
    }
    
}

function reiniciarEstadoPartida() {
    if (idIntervaloCronometro !== null) {
        clearInterval(idIntervaloCronometro);
    }
    tableroIntentos.textContent = "";
    intentosHechos = [];
    intentosRestantes = 8;
    actualizarContador();
    inputBusqueda.value = "";
    listaSugerencias.classList.add("oculto");
}

function clickReiniciar() {
    reiniciarEstadoPartida();
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
    inputBusqueda = document.getElementById("inputBusqueda");
    listaSugerencias = document.getElementById("listaSugerencias");
    inputBusqueda.addEventListener("input", manejarEscrituraBusqueda);
    listaSugerencias.addEventListener("click", manejarClickSugerencia);
    tableroIntentos = document.getElementById("tableroIntentos");
    btnReiniciar = document.getElementById("btnReiniciar");
    btnReiniciar.addEventListener("click", clickReiniciar);
    fotoSecreta = document.getElementById("fotoSecreta");
}

document.addEventListener("DOMContentLoaded", iniciarApp);