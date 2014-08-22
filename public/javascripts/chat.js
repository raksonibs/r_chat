$(document).on('ready', function() {

  var serverUrl = document.domain;

  var socket = io.connect(serverUrl);
  var sessionId = '';

  $('.room_name').click(function() {
    var room = $(this).attr('id');
    socket.emit('room', room)
  })

  if ( $('#room-name').length !== 0 ) {
    var room = $('#room-name').data('value');
    room = room.split(' ').join()
    socket.emit('room', room)
  }

  socket.on('connect', function() {
    sessionId = socket.io.engine.id
    socket.emit('newUser', {id: sessionId, name: 'new User'})
  });

  function sendMessage() {
    var outgoingMessage = $('#outgoingMessage').val();
    var user = $('#userField').val();
    var userImage = $('#userImage').val();
    var room = $('.room-name').text()

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
    var room = $('.room-name').text()
    room = room.split(' ').join()

    $.ajax({
      url:  '/messages',
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json',
      data: {room: room}
    })
  }

  function makeRooms() {
    if ( $('.invisible').data('run') === true ) {
      console.log('should make rooms')
      $.getJSON(
    "http://www.reddit.com/.json?jsonp=?",
    function foo(data)
    {
      $('#container-rows').append('<div class="row">')
      $.each(
        data.data.children.slice(0, 6),
        function (i, post) {
          console.log(post.data)
          if ( post.data.thumbnail == 'self' || post.data.thumbnail == '') {
            post.data.thumbnail = '/images/reddit-black.png'
          }
          $('#container-rows').append('<div class="col-sm-4 portfolio-item"><a href="#portfolioModal'+i+'" class="portfolio-link" data-toggle="modal"><div class="caption"><div class="caption-content"><p>'+post.data.title.split(" ").join()+'</p><i class="fa fa-search-plus fa-3x"></i></div></div><img src="/images/portfolio/cabin.png" class="img-responsive" alt=""></a></div>'
                              // '<div class="col-sm-4 portfolio-item">'+
                              //   '<a href="/rooms/' + post.data.title.split(" ").join() + '" class="room_name" id="' + post.data.title.split(" ").join() + '">' +
                              //     '<div class="caption">' +
                              //       post.data.title +
                              //       '<div class="caption-content">' +
                              //         '<i class="fa fa-search-plus fa-3x"></i>'+
                              //       '</div>'+
                              //     '</div>'+
                              //     '<img src="' + post.data.thumbnail + '" class="img-responsive chatroom-image" alt="">'+
                              //   '</a>'+
                              // '</div>')
          )
        }
      )
    $('#container-rows').append('</div>');
    }
  )
  .success(function() { })
      // need to retrieve the top posts, and then make a room with their name by
      // by pushing to room array in backend that holds all the rooms
    }
  }

  makeRooms()

  $('.get-messages').click(function() {
    getMessages()
  })

  socket.on('gettingMessages', function(data) {
    var messages = data.messages

    if ( !_.isEmpty(messages) ) {

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
  })

  $('#send').on('click', sendMessage)

  socket.on('incomingMessage', function(data) {
    var message = data.message
    var dateTime = new Date(data.messageTime)
    var timeArray = [dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), dateTime.getHours(), dateTime.getMinutes()]
    var timeAgo = moment(timeArray).fromNow()
    var image = data.messageImage

    $("#messages").append('<div class="message"><div class="message-image"><img class="smaller" src="'+image+'"></div>'
                          +'<div class="message-content"><p class="user-name">'+data.userName + ': </p>'
                          +'<p class="user-message">' + message + ' </p>'
                          +'<p class="user-time">(' + timeAgo + ')</p>' +'<br/ ></div></div><div class="clear"></div>')
  })
})


