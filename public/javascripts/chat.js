$(document).on('ready page:load', function() {

  $('.clickable').click(function() {
    console.log('this was clicked baby this was clicked baby this was clicked baby this was clicked baby this was clicked baby this was clicked baby')
  })

  $('div')
    .filter(function() {
      return this.id.match(/portfolioModal\d/)
    })
    .on('show.bs.modal', function (e) {
      var thisModal = this
      setTimeout(function() {
        $('.modal-backdrop').hide();
        console.log(thisModal)
        var roomUrl = $(document).find('a[href="#portfolioModal1"]').find('p').text()
        var roomString = '/rooms/Because,Family,Matters'
        $.ajax({
          url: '/rooms/Because,Family,Matters',
          type: 'GET',
          success: function(data) {
            console.log(data)
            window.location.hash = roomString.substring(1)
            var user = ich.user({
              room: data.room,
              user: {
                image: data.user.image,
                name: data.user.name
              }
            })

            // maybe wrap this on ajax complete. or page load for document, not only read

            $('#chat-room-specifics').html(user)
          }
        })
      })
    })
    .on('hidden.bs.modal', function (e) {
      console.log('maybe show')
    })
  //now that i can haz works, we build the template of jade room into each hash for url
  // getting data for room and passing it in the template. huzzah

  function makeRooms() {
    if ( $('.invisible').data('run') === true ) {
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
          $('#container-rows').append('<div class="col-sm-4 portfolio-item"><a id="'+post.data.title.split(" ").join()+'" href="#portfolioModal'+(i+1)+'" class="portfolio-link room_name" data-toggle="modal"><div class="caption"><div class="caption-content"><p>'+post.data.title.split(" ").join()+'</p><i class="fa fa-search-plus fa-3x"></i></div></div><img src="/images/portfolio/cabin.png" class="img-responsive" alt=""></a></div>'
          )
          $($('#portfolioModal'+(i+1)).find('h2')).text(post.data.title)
          $($('#portfolioModal'+(i+1)).find('img')).attr('src',post.data.thumbnail)
          $('#portfolioModal'+(i+1)).find('ul.list-inline').find('li').find('a').attr('href', post.data.url)
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
})

//to track injected html

var serverUrl = document.domain;

var socket = io.connect(serverUrl);
var sessionId = '';

socket.on('connect', function() {
  sessionId = socket.io.engine.id
  socket.emit('newUser', {id: sessionId, name: 'new User'})
});

socket.on('incomingMessage', function(data) {
  var message = data.message
  var dateTime = new Date(data.messageTime)
  var timeArray = [dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), dateTime.getHours(), dateTime.getMinutes()]
  var timeAgo = moment(timeArray).fromNow()
  var image = data.messageImage
  console.log('we want to see the message')

  $("#messages").append('<div class="message"><div class="message-image"><img class="smaller" src="'+image+'"></div>'
                        +'<div class="message-content"><p class="user-name">'+data.userName + ': </p>'
                        +'<p class="user-message">' + message + ' </p>'
                        +'<p class="user-time">(' + timeAgo + ')</p>' +'<br/ ></div></div><div class="clear"></div>')
})

$(document).on('click','.room_name', function() {
  var room = $(this).attr('id');
  console.log("should be sending room event, let's see")
  socket.emit('room', room)
})

if ( $('#room-name').length !== 0 ) {
  var room = $('#room-name').data('value');
  room = room.split(' ').join()
  socket.emit('room', room)
}

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

$(document).on('click', '#send', function() {
  sendMessage()
})

$(document).on('click', '.get-messages', function() {
  getMessages()
})


