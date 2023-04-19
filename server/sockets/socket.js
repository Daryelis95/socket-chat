const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades')

const usuarios = new Usuarios();

io.on('connection', (client) => {
    
    client.on('entrarChat', (data, callback) => {
       
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y sala es requerido'
            });
        }

        // unir usuarios en una sala (join)
        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);
        //emitir a todas las pantallas listado de personas que pertenecen a la misma sala
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasSala(data.sala));

        callback( usuarios.getPersonasSala(data.sala) );
    });

    // Escuchar evento de un usuario y emitir al resto
    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona( client.id );
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    });

     // Escuchar evento de un usuario y un usuario especifico
    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona( client.id );
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        //to para un id especifico o sala
        client.broadcast.to(data.para).emit('crearMensaje', mensaje);

    });

    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona( client.id );

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador',`${personaBorrada.nombre} abandono el chat`));

        //emitir a todas las pantallas listado de personas
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasSala(personaBorrada.sala));
    });
});