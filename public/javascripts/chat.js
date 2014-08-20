$(document).on('ready', function() {

  var serverUrl = document.domain;

  var socket = io.connect(serverUrl);
  var sessionId = '';

  $('.room_name').click(function() {
    var room = $(this).attr('id');
    console.log(room)

    alert(room)
    socket.emit('room', room)
  })

  socket.on('connect', function() {
    sessionId = socket.io.engine.id
    socket.emit('newUser', {id: sessionId, name: 'new User'})
  });

  function sendMessage() {
    var outgoingMessage = $('#outgoingMessage').val();
    var user = $('#userField').val();
    var userImage = $('#userImage').val();
    var room = $('room-name').text()
    $('#outgoingMessage').val('');
    $.ajax({
      url:  '/message',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({image: userImage, message: outgoingMessage, userName: user, timeSubmit: new Date(), room: room})
    })
  }

  function getMessages() {
    var room = $('room-name').text()
    $.ajax({
      url:  '/messages',
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({room: room}),
      success: function(data) {
        console.log(data)
      },
      error: function(e) {
        console.log(e)
      }
    })
  }

  // each of these ten will be a room. it will update every day. (eventually will want to update each three hours)
  // basically each of these will have to be a room, ten rooms, top ten posts. would be better if subreddit maybe?
  // $.getJSON(
  //   "http://www.reddit.com/.json?jsonp=?",
  //   function foo(data)
  //   {
  //     $.each(
  //       data.data.children.slice(0, 3),
  //       function (i, post) {
  //         $("#rooms").append( '<br>' + post.data.title );
  //         $("#rooms").append( '<br>' + post.data.url );
  //         $("#rooms").append( '<br>' + post.data.permalink );
  //         $("#rooms").append( '<br>' + post.data.ups );
  //         $("#rooms").append( '<br>' + post.data.downs );
  //         $("#rooms").append( '<hr>' );

  //       }
  //     )
  //   }
  // )
  // .success(function() { console.log("second success"); })

  getMessages()

  socket.on('gettingMessages', function(data) {
    var messages = data.messages
    if ( !_.isEmpty(messages) ) {
      console.log(new Date(messages[1].messageTime))
      // these old messages need some formatting, but they also need to only be old
      // after a few hours. there is no point if someone doesn't know what is going on.
      // either last 100 messages are saved and the rest become old, or they all take standard
      // format. must make a decision here.
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
    var dateTime = new Date(data.messageTime)
    var timeArray = [dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), dateTime.getHours(), dateTime.getMinutes()]
    var timeAgo = moment(timeArray).fromNow()
    var image = data.messageImage
    console.log(data)
    $("#messages").append('<div class="message"><div class="message-image"><img class="smaller" src="'+image+'"></div>'
                          +'<div class="message-content"><p class="user-name">'+data.userName + ': </p>'
                          +'<p class="user-message">' + message + ' </p>'
                          +'<p class="user-time">(' + timeAgo + ')</p>' +'<br/ ></div></div><div class="clear"></div>')
  })
})


