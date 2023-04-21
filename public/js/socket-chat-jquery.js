// funcione para renderizar usuarios
var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');
// referencia jquery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var textMensaje = $('#textMensaje');
var divChatbox = $('#divChatbox');

const renderizarUsuarios = (personas) => {

    console.log(personas);
    // nombre del chat
    var html = "";
    html +='<li>';
    html +='    <a href="javascript:void(0)" class="active"> Chat de <span>'+params.get('sala')+'</span></a>';
    html +='</li>';

    // nombre de las personas que pertenecen al mismo chat
    for (let index = 0; index < personas.length; index++) {
        
        html += '<li>';
        html += '    <a data-id="'+ personas[index].id +'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ personas[index].nombre +'<small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    divUsuarios.html(html);
}
// funcion para renderizar mensaje al html
function renderizarMensajes(mensaje, yo) {
    console.log(mensaje)

    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours()+ ': ' +fecha.getMinutes();

    var adminclass = 'info';
    if (mensaje.nombre === 'Administrador') {
        adminclass = 'danger';
    }

    if (yo) {
        
        html+= '<li class="reverse">';
        html+= '    <div class="chat-content">';
        html+= '        <h5>'+ mensaje.nombre +'</h5>';
        html+= '        <div class="box bg-light-inverse">'+ mensaje.mensaje +'</div>';
        html+= '    </div>';
        html+= '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html+= '    <div class="chat-time">'+ hora +'</div>';
        html+= '    </li>';
    } else {
        
        html += '<li class="animated fadeIn">';
        if (mensaje.nombre !== 'Administrador') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '    <div class="chat-content">';
        html += '        <h5>'+ mensaje.nombre +'</h5>';
        html += '        <div class="box bg-light-'+ adminclass +'">'+ mensaje.mensaje +'</div>';
        html += '    </div>';
        html += '    <div class="chat-time">'+ hora +'</div>';
        html += '</li>';
    }


    divChatbox.append(html);
}

// calcula si tiene que mover hacia abajo o arriba cuando llega un msj 
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}
// listeners
divUsuarios.on('click', 'a', function(){

    var id = $(this).data('id'); //$(this) hace referencia a todas las propiedades de etiqueta a
    
    if (id) {
        console.log(id);
    }
});

formEnviar.on('click', function(e){
    e.preventDefault();

    if(textMensaje.val().trim().length === 0){
        return
    }
    //Enviar mensaje a la persona
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: textMensaje.val()
    }, function(resp) {
        textMensaje.val('').focus();
        renderizarMensajes(resp, true)
        scrollBottom();
    });
})