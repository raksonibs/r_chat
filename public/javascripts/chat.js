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
    var user = $('#userField').val()
    $.ajax({
      url:  '/message',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({message: outgoingMessage, userName: user, timeSubmit: new Date()})
    })
  }

  function getMessages() {
    $.ajax({
      url:  '/messages',
      type: 'GET',
      success: function(data) {
        console.log(data)
      },
      error: function(e) {
        console.log(e)
      }
    })
  }

  getMessages()

  socket.on('gettingMessages', function(data) {
    var messages = data.messages
    console.log(messages)
    // $('#messages')
  })

  $('#send').on('click', sendMessage)

  socket.on('incomingMessage', function(data) {
    var message = data.message
    $("#messages").prepend(message+'<br/ >')
  })

  // if ( window.location.href.split('/').length === 6) {

  //   $.ajax({
  //     url: '/auth/reddit/callback',
  //     type: 'GET'
  //   })
  // }


})