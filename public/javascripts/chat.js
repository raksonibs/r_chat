$(document).on('ready page:load', function() {

  if ( $('.separate-room').length !== 0 ) {
    var roomNameSeparate = $(this).find('.room-name').text()
    socket.emit('room', roomNameSeparate)

    socket.on('incomingMessage', function(data) {
      var message = data.message
      var dateTime = new Date(data.messageTime)
      var timeArray = [dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), dateTime.getHours(), dateTime.getMinutes()]
      var timeAgo = moment(timeArray).fromNow()
      var image = data.messageImage

      $('.separate-room').find(".messages").append('<div class="message"><div class="message-image"><img class="smaller" src="'+image+'"></div>'
                            +'<div class="message-content"><p class="user-name">'+data.userName + ': </p>'
                            +'<p class="user-message">' + message + ' </p>'
                            +'<p class="user-time">(' + timeAgo + ')</p>' +'<br/ ></div></div><div class="clear"></div>')
    })

    socket.on('gettingMessages', function(data) {
      var messages = data.messages
      var oldMessages = $('.separate-room').find('.oldmessages')

      if ( !_.isEmpty(messages) ) {

        oldMessages.html('')
        oldMessages.append('<hr>')
        for (var i = 0; i < messages.length; i++) {
          var date = ''
          var dateTime = new Date(messages[i].messageTime)
          date = date + dateTime.getDate() + '/' + (dateTime.getMonth() + 1) + '/' + dateTime.getFullYear() + ' @ ' + dateTime.getHours() + ":" + dateTime.getMinutes()
          oldMessages.append(messages[i].userName + ' said: ' + messages[i].message+ ' at '+ date + '<br />')
        }
        oldMessages.append('<p>Past Stuff</P><hr>')
      }
    })
  }

  $('div')
    .filter(function() {
      return this.id.match(/portfolioModal\d/)
    })
    .on('show.bs.modal', function (e) {
      var thisModal = this
      setTimeout(function() {
        $('.modal-backdrop').hide();

        var roomUrl = $(document).find('a[href="#' + thisModal.id + '"]').find('p').text()
        var roomString = '/rooms/'+roomUrl
        $.ajax({
          url: roomString,
          type: 'GET',
          success: function(data) {

            window.location.hash = roomString.substring(1)

            var user = ich.user({
              room: data.room,
              user: {
                image: data.user.image,
                name: data.user.name
              }
            })


            $(thisModal).find('.chat-room-specifics').html(user)
          }
        })
      })
    })
    .on('hidden.bs.modal', function (e) {

    })

  // function makeRooms() {
  //   if ( $('.invisible').data('run') === true ) {
  //     $.getJSON(
  //   "http://www.reddit.com/.json?jsonp=?",
  //   function foo(data)
  //   {
  //     $('#container-rows').append('<div class="row">')
  //     $.each(
  //       data.data.children.slice(0, 6),
  //       function (i, post) {
  //
  //         if ( post.data.thumbnail == 'self' || post.data.thumbnail == '') {
  //           post.data.thumbnail = '/images/reddit-black.png'
  //         }
  //         $('#container-rows').append('<div class="col-sm-4 portfolio-item"><a id="'+post.data.title.split(" ").join()+'" href="#portfolioModal'+(i+1)+'" class="portfolio-link room_name" data-toggle="modal"><div class="caption"><div class="caption-content"><p>'+post.data.title.split(" ").join()+'</p><i class="fa fa-search-plus fa-3x"></i></div></div><img src="/images/portfolio/cabin.png" class="img-responsive" alt=""></a></div>'
  //         )
  //         $($('#portfolioModal'+(i+1)).find('h2')).text(post.data.title)
  //         $($('#portfolioModal'+(i+1)).find('img')).attr('src',post.data.thumbnail)
  //         $('#portfolioModal'+(i+1)).find('ul.list-inline').find('li').find('a').attr('href', post.data.url)
  //       }
  //     )
  //   $('#container-rows').append('</div>');
  //
  //   }
  // )
  // .success(function() { })
  //   }
  // }

  function scrambleAddRoom() {
    var randomWord = '/rooms/'
    var letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var lengthRand = Math.random()*20 + 10
    for (var i = 0; i < lengthRand; i++) {
      randomWord = randomWord + ( letters[Math.floor(Math.random() * letters.length)] )
    }
    $('.add-room').find('a').attr('href', randomWord)
  }

  scrambleAddRoom()

  function subRedditImage() {
    var stringImage = '/images/portfolio/'
    var imageArray = ["alarm-clock.png", "Beer.png", "boat.png", "Boom Box.png", "Cabin.png", "cake.png", "case.png", "cashier.png", "Circus.png", "Clock.png", "cloud.png", "Coins.png", "cut.png", "Game Pad.png", "game.png", "GPS.png", "graph2.png", "graph4.png", "Guitar2.png", "Headphone.png", "lamp.png", "LCDTV.png", "Meteor.png", "newsletter.png", "package.png", "Pencil.png", "pill.png", "power.png", "recording-mic.png", "RetroTV.png", "Safe.png", "Satellite.png", "save.png", "Submarine.png", "temperature.png", "Tent.png", "tractor.png", "train.png", "UFO.png", "umbrella.png", "Vespa.png", "Wallet.png", "wooden-sign.png"]
    var additionString = imageArray[Math.floor(imageArray.length*Math.random())]
    var stringFinal = stringImage + additionString
    return stringFinal
  }

  var seedData = [{"kind":"t3","data":{"domain":"i.imgur.com","banned_by":null,"media_embed":{},"subreddit":"funny","selftext_html":null,"selftext":"","likes":null,"secure_media":null,"link_flair_text":null,"id":"2eunpd","gilded":0,"secure_media_embed":{},"clicked":false,"stickied":false,"author":"KidROFL","media":null,"score":4519,"approved_by":null,"over_18":false,"hidden":false,"thumbnail":"http://a.thumbs.redditmedia.com/mZp--1EhorriXQ-06zjlZbSX6rHXIip8rEMZ_ZKm1Q4.jpg","subreddit_id":"t5_2qh33","edited":false,"link_flair_css_class":null,"author_flair_css_class":null,"downs":0,"saved":false,"is_self":false,"permalink":"/r/funny/comments/2eunpd/a_kid_at_my_school_had_been_hiding_these_behind/","name":"t3_2eunpd","created":1409283837,"url":"http://i.imgur.com/aGGs3oJ.jpg","author_flair_text":null,"title":"A kid at my school had been hiding these behind the windows.","created_utc":1409255037,"ups":4519,"num_comments":390,"visited":false,"num_reports":null,"distinguished":null}},{"kind":"t3","data":{"domain":"i.imgur.com","banned_by":null,"media_embed":{},"subreddit":"aww","selftext_html":null,"selftext":"","likes":null,"secure_media":null,"link_flair_text":null,"id":"2eukk2","gilded":0,"secure_media_embed":{},"clicked":false,"stickied":false,"author":"dwojityv","media":null,"score":3336,"approved_by":null,"over_18":false,"hidden":false,"thumbnail":"http://a.thumbs.redditmedia.com/i4LuWa-jJnCKjNqFwU72UWpj9DAO-F_bllFSFb7K084.jpg","subreddit_id":"t5_2qh1o","edited":false,"link_flair_css_class":null,"author_flair_css_class":null,"downs":0,"saved":false,"is_self":false,"permalink":"/r/aww/comments/2eukk2/my_friend_has_a_pet_fox/","name":"t3_2eukk2","created":1409282158,"url":"http://i.imgur.com/5E9BdhR.jpg","author_flair_text":null,"title":"My friend has a pet fox","created_utc":1409253358,"ups":3336,"num_comments":352,"visited":false,"num_reports":null,"distinguished":null}},{"kind":"t3","data":{"domain":"robertehall.com","banned_by":null,"media_embed":{},"subreddit":"todayilearned","selftext_html":null,"selftext":"","likes":null,"secure_media":null,"link_flair_text":null,"id":"2eua4j","gilded":0,"secure_media_embed":{},"clicked":false,"stickied":false,"author":"Overclass","media":null,"score":3651,"approved_by":null,"over_18":false,"hidden":false,"thumbnail":"http://b.thumbs.redditmedia.com/ZDbZ4tvBAJrTpnVoTR6qExZMR0zHU0iqKuMjjvuievg.jpg","subreddit_id":"t5_2qqjc","edited":false,"link_flair_css_class":null,"author_flair_css_class":null,"downs":0,"saved":false,"is_self":false,"permalink":"/r/todayilearned/comments/2eua4j/til_35_of_polled_american_workers_said_they_would/","name":"t3_2eua4j","created":1409276492,"url":"http://robertehall.com/2014/03/disengagement-economy-robert-hall-huffington-post/","author_flair_text":null,"title":"TIL 35% of polled American workers said they would be willing to forego a significant pay raise in exchange for having their boss fired.","created_utc":1409247692,"ups":3651,"num_comments":568,"visited":false,"num_reports":null,"distinguished":null}},{"kind":"t3","data":{"domain":"i.imgur.com","banned_by":null,"media_embed":{},"subreddit":"pics","selftext_html":null,"selftext":"","likes":null,"secure_media":null,"link_flair_text":null,"id":"2euhmr","gilded":0,"secure_media_embed":{},"clicked":false,"stickied":false,"author":"Venetic","media":null,"score":2951,"approved_by":null,"over_18":false,"hidden":false,"thumbnail":"http://a.thumbs.redditmedia.com/YphDR481e1CJ5pTC6GkvBWe1yKjGTHiTOr3F9ijJ3_8.jpg","subreddit_id":"t5_2qh0u","edited":false,"link_flair_css_class":null,"author_flair_css_class":null,"downs":0,"saved":false,"is_self":false,"permalink":"/r/pics/comments/2euhmr/bought_a_99_pack_of_beer_today_my_work_even_let/","name":"t3_2euhmr","created":1409280583,"url":"http://i.imgur.com/rUKxJdJ.jpg","author_flair_text":null,"title":"Bought a 99 pack of beer today. My work even let me expense it!","created_utc":1409251783,"ups":2951,"num_comments":246,"visited":false,"num_reports":null,"distinguished":null}},{"kind":"t3","data":{"domain":"imgur.com","banned_by":null,"media_embed":{},"subreddit":"gaming","selftext_html":null,"selftext":"","likes":null,"secure_media":null,"link_flair_text":null,"id":"2eu99o","gilded":0,"secure_media_embed":{},"clicked":false,"stickied":false,"author":"detraceur","media":null,"score":3517,"approved_by":null,"over_18":false,"hidden":false,"thumbnail":"http://b.thumbs.redditmedia.com/z_elas9mhzzSgDcDjz93N8MgYqbe3HaXG6CSsIEMFCk.jpg","subreddit_id":"t5_2qh03","edited":false,"link_flair_css_class":null,"author_flair_css_class":null,"downs":0,"saved":false,"is_self":false,"permalink":"/r/gaming/comments/2eu99o/it_just_got_real_in_my_dorm/","name":"t3_2eu99o","created":1409250810,"url":"http://imgur.com/9ytsL7b","author_flair_text":null,"title":"It just got real in my dorm","created_utc":1409247210,"ups":3517,"num_comments":264,"visited":false,"num_reports":null,"distinguished":null}},{"kind":"t3","data":{"domain":"i.imgur.com","banned_by":null,"media_embed":{},"subreddit":"gifs","selftext_html":null,"selftext":"","likes":null,"secure_media":null,"link_flair_text":null,"id":"2eu8f7","gilded":0,"secure_media_embed":{},"clicked":false,"stickied":false,"author":"SinisterWaffles","media":null,"score":3258,"approved_by":null,"over_18":false,"hidden":false,"thumbnail":"/images/reddit-black.png","subreddit_id":"t5_2qt55","edited":false,"link_flair_css_class":null,"author_flair_css_class":null,"downs":0,"saved":false,"is_self":false,"permalink":"/r/gifs/comments/2eu8f7/me_me_its_me_i_want_it_i_want_it/","name":"t3_2eu8f7","created":1409275555,"url":"http://i.imgur.com/xTJti34.gif","author_flair_text":null,"title":"\"Me... ME! Its me! I want it. I WANT IT!\"","created_utc":1409246755,"ups":3258,"num_comments":111,"visited":false,"num_reports":null,"distinguished":null}}]

  function makeSeedRooms(seedData) {
    $('#container-rows').append('<div class="row">')
    $.each(seedData, function(i, post) {
      if ( post.data.thumbnail == 'self' || post.data.thumbnail == '') {
        post.data.thumbnail = '/images/reddit-black.png'
      }

      imagePNG = subRedditImage()
      $('#container-rows').append('<div class="col-sm-4 portfolio-item"><a id="'+post.data.title.split(" ").join()+'" href="#portfolioModal'+(i+1)+'" class="portfolio-link room_name" data-toggle="modal"><div class="caption"><div class="caption-content"><p>'+post.data.title+'</p><i class="fa fa-search-plus fa-3x"></i></div></div><img src="' + imagePNG + '" class="img-responsive" alt=""></a></div>'
      )
      $($('#portfolioModal'+(i+1)).find('h2')).text(post.data.title)
      $($('#portfolioModal'+(i+1)).find('img')).attr('src',post.data.thumbnail)
      $('#portfolioModal'+(i+1)).find('ul.list-inline').find('li').find('a').attr('href', post.data.url)
    })
    $('#container-rows').append('</div>');
  }

  makeSeedRooms(seedData)
})

//to track injected html

var serverUrl = document.domain;

var socket = io.connect(serverUrl);
var sessionId = '';

function trackSockets() {

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


    $('.container').find('[data-name="' + data.room + '"]').find(".messages").append('<div class="message"><div class="message-image"><img class="smaller" src="'+image+'"></div>'
                          +'<div class="message-content"><p class="user-name">'+data.userName + ': </p>'
                          +'<p class="user-message">' + message + ' </p>'
                          +'<p class="user-time">(' + timeAgo + ')</p>' +'<br/ ></div></div><div class="clear"></div>')
  })

  $(document).on('click','.room_name', function() {
    var room = $(this).attr('id');
    socket.emit('room', room)
  })

  socket.on('gettingMessages', function(data) {
    var messages = data.messages
    var oldMessages = $('.container').find('[data-name="' + data.room + '"]').find('.oldmessages')

    if ( !_.isEmpty(messages) ) {

      oldMessages.html('')
      oldMessages.append('<hr>')
      for (var i = 0; i < messages.length; i++) {
        var date = ''
        var dateTime = new Date(messages[i].messageTime)
        date = date + dateTime.getDate() + '/' + (dateTime.getMonth() + 1) + '/' + dateTime.getFullYear() + ' @ ' + dateTime.getHours() + ":" + dateTime.getMinutes()
        oldMessages.append(messages[i].userName + ' said: ' + messages[i].message+ ' at '+ date + '<br />')
      }
      oldMessages.append('<p>Past Stuff</P><hr>')
    }
  })

  function sendMessage(modal) {
    var outgoingMessage = $(modal).find('.outgoingMessage').val();
    var user = $(modal).find('.userField').val();
    var userImage = $(modal).find('.userImage').val();
    var room = $(modal).find('.room-name').text()

    $('.outgoingMessage').val('');
    $.ajax({
      url:  '/message',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({image: userImage, message: outgoingMessage, userName: user, timeSubmit: new Date(), room: room})
    })
  }

  //problematic when called.room-name because the room name will have multiple modals. need
  //to account which portfolio it is.

  function getMessages(modal) {
    var room = $(modal).find('.room-name').text()
    room = room.split(' ').join()

    $.ajax({
      url:  '/messages',
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json',
      data: {room: room}
    })
  }

  $(document).on('click', '.send', function() {
    var thisModal = $(this).closest('.portfolio-modal')
    sendMessage(thisModal)
  })

  $(document).on('click', '.get-messages', function() {
    var thisModal = $(this).closest('.portfolio-modal')
    getMessages(thisModal)
  })

  $(document).on('click', '.close-btn', function(){
    var room = $('.room-name').data('value');
    room = room.split(' ').join()
    socket.emit('leaveRoom', {roomName: room})
  })
}


trackSockets()


