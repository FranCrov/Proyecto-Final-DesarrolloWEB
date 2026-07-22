"use strict";
var API_BASE_URL = "https://futbolle-daw-uai-2026.onrender.com";

function manejarRespuestaFetch(respuesta) {
    if (!respuesta.ok) {
        throw new Error("La respuesta del servidor no fue exitosa");
    }
    return respuesta.json();
}

function pedirJugadorAleatorio(onExito, onError) {
    var url;
    url = API_BASE_URL + "/api/players/random";
    fetch(url)
        .then(manejarRespuestaFetch)
        .then(onExito)
        .catch(onError);
}