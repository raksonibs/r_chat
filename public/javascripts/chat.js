$(document).on('ready', function() {

  var serverUrl = document.domain;

  var socket = io.connect(serverUrl);
  var sessionId = '';

  socket.on('connect', function() {
    sessionId = socket.io.engine.id
    socket.emit('newUser', {id: sessionId, name: 'Oskar'});
  });

  function sendMessage() {
    var outgoingMessage = $('#outgoingMessage').val()
    $.ajax({
      url:  '/message',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({message: outgoingMessage})
    })
  }

  $('#send').on('click', sendMessage)

  socket.on('incomingMessage', function(data) {
    var message = data.message
    $("#messages").prepend(message+'<br/ >')
  })


})