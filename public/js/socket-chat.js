var socket = io();

// obtener nombre de url
var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala es requerido');
}

var usuario = {
    nombre : params.get('nombre'),
    sala : params.get('sala')
}


socket.on('connect', function() {

    socket.emit('entrarChat', usuario, (resp) => {
        console.log('Usuarios conectados', resp)
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información al servidor
// socket.emit('crearMensaje', {
//     nombre: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información de desconexion 
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

// Escuchar cambios de usuarios (cuando usuario entra o sale del chat)
socket.on('listaPersona', (personas) => {
    console.log('listaPersonas:', personas)
})

// mensaje privado
socket.on('mensajePrivado', (mensaje) => {
    console.log(mensaje)
});