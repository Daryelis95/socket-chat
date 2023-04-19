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
function renderizarMensajes(mensaje) {

    var html = '';

    html += '<li class="animated fadeIn">';
    html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
    html += '    <div class="chat-content">';
    html += '        <h5>'+ mensaje.nombre +'</h5>';
    html += '        <div class="box bg-light-info">'+ mensaje.mensaje +'</div>';
    html += '    </div>';
    html += '    <div class="chat-time">10:56 am</div>';
    html += '</li>';

    divChatbox.append(html);
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
        renderizarMensajes(resp)
    });
})