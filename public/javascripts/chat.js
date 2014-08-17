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
    if ( !_.isEmpty(messages) ) {
      console.log(new Date(messages[1].messageTime))
      $('#oldmessages').html('')
      $('#oldmessages').append('<hr>')
      for (var i = 0; i < messages.length; i++) {
        var date = ''
        var dateTime = new Date(messages[i].messageTime)
        date = date + dateTime.getDate() + '/' + (dateTime.getMonth() + 1) + '/' + dateTime.getFullYear() + ' @ ' + dateTime.getHours() + ":" + dateTime.getMinutes()
        $('#oldmessages').append(messages[i].userName + ' said: ' + messages[i].message+ ' at '+ date + '<br />')
      }
      $('#oldmessages').append('<p>Past Stuff</P><hr>')
    }
    // $('#messages')
  })

  $('#send').on('click', sendMessage)

  socket.on('incomingMessage', function(data) {
    var message = data.message
    $("#messages").append(message+'<br/ >')
  })
})