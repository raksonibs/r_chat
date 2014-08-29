$(document).on('ready page:load', function() {

  $('div')
    .filter(function() {
      return this.id.match(/portfolioModal\d/)
    })
    .on('show.bs.modal', function (e) {
      var thisModal = this
      setTimeout(function() {
        $('.modal-backdrop').hide();

        var roomUrl = $(document).find('a[href="#portfolioModal1"]').find('p').text()
        var roomString = '/rooms/Because,Family,Matters'
        $.ajax({
          url: '/rooms/Because,Family,Matters',
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

            // maybe wrap this on ajax complete. or page load for document, not only read

            $('#chat-room-specifics').html(user)
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

  var seedData = [{"kind":"t3","data":{"domain":"i.imgur.com","banned_by":null,"media_embed":{},"subreddit":"funny","selftext_html":null,"selftext":"","likes":null,"secure_media":null,"link_flair_text":null,"id":"2eunpd","gilded":0,"secure_media_embed":{},"clicked":false,"stickied":false,"author":"KidROFL","media":null,"score":4519,"approved_by":null,"over_18":false,"hidden":false,"thumbnail":"http://a.thumbs.redditmedia.com/mZp--1EhorriXQ-06zjlZbSX6rHXIip8rEMZ_ZKm1Q4.jpg","subreddit_id":"t5_2qh33","edited":false,"link_flair_css_class":null,"author_flair_css_class":null,"downs":0,"saved":false,"is_self":false,"permalink":"/r/funny/comments/2eunpd/a_kid_at_my_school_had_been_hiding_these_behind/","name":"t3_2eunpd","created":1409283837,"url":"http://i.imgur.com/aGGs3oJ.jpg","author_flair_text":null,"title":"A kid at my school had been hiding these behind the windows.","created_utc":1409255037,"ups":4519,"num_comments":390,"visited":false,"num_reports":null,"distinguished":null}},{"kind":"t3","data":{"domain":"i.imgur.com","banned_by":null,"media_embed":{},"subreddit":"aww","selftext_html":null,"selftext":"","likes":null,"secure_media":null,"link_flair_text":null,"id":"2eukk2","gilded":0,"secure_media_embed":{},"clicked":false,"stickied":false,"author":"dwojityv","media":null,"score":3336,"approved_by":null,"over_18":false,"hidden":false,"thumbnail":"http://a.thumbs.redditmedia.com/i4LuWa-jJnCKjNqFwU72UWpj9DAO-F_bllFSFb7K084.jpg","subreddit_id":"t5_2qh1o","edited":false,"link_flair_css_class":null,"author_flair_css_class":null,"downs":0,"saved":false,"is_self":false,"permalink":"/r/aww/comments/2eukk2/my_friend_has_a_pet_fox/","name":"t3_2eukk2","created":1409282158,"url":"http://i.imgur.com/5E9BdhR.jpg","author_flair_text":null,"title":"My friend has a pet fox","created_utc":1409253358,"ups":3336,"num_comments":352,"visited":false,"num_reports":null,"distinguished":null}},{"kind":"t3","data":{"domain":"robertehall.com","banned_by":null,"media_embed":{},"subreddit":"todayilearned","selftext_html":null,"selftext":"","likes":null,"secure_media":null,"link_flair_text":null,"id":"2eua4j","gilded":0,"secure_media_embed":{},"clicked":false,"stickied":false,"author":"Overclass","media":null,"score":3651,"approved_by":null,"over_18":false,"hidden":false,"thumbnail":"http://b.thumbs.redditmedia.com/ZDbZ4tvBAJrTpnVoTR6qExZMR0zHU0iqKuMjjvuievg.jpg","subreddit_id":"t5_2qqjc","edited":false,"link_flair_css_class":null,"author_flair_css_class":null,"downs":0,"saved":false,"is_self":false,"permalink":"/r/todayilearned/comments/2eua4j/til_35_of_polled_american_workers_said_they_would/","name":"t3_2eua4j","created":1409276492,"url":"http://robertehall.com/2014/03/disengagement-economy-robert-hall-huffington-post/","author_flair_text":null,"title":"TIL 35% of polled American workers said they would be willing to forego a significant pay raise in exchange for having their boss fired.","created_utc":1409247692,"ups":3651,"num_comments":568,"visited":false,"num_reports":null,"distinguished":null}},{"kind":"t3","data":{"domain":"i.imgur.com","banned_by":null,"media_embed":{},"subreddit":"pics","selftext_html":null,"selftext":"","likes":null,"secure_media":null,"link_flair_text":null,"id":"2euhmr","gilded":0,"secure_media_embed":{},"clicked":false,"stickied":false,"author":"Venetic","media":null,"score":2951,"approved_by":null,"over_18":false,"hidden":false,"thumbnail":"http://a.thumbs.redditmedia.com/YphDR481e1CJ5pTC6GkvBWe1yKjGTHiTOr3F9ijJ3_8.jpg","subreddit_id":"t5_2qh0u","edited":false,"link_flair_css_class":null,"author_flair_css_class":null,"downs":0,"saved":false,"is_self":false,"permalink":"/r/pics/comments/2euhmr/bought_a_99_pack_of_beer_today_my_work_even_let/","name":"t3_2euhmr","created":1409280583,"url":"http://i.imgur.com/rUKxJdJ.jpg","author_flair_text":null,"title":"Bought a 99 pack of beer today. My work even let me expense it!","created_utc":1409251783,"ups":2951,"num_comments":246,"visited":false,"num_reports":null,"distinguished":null}},{"kind":"t3","data":{"domain":"imgur.com","banned_by":null,"media_embed":{},"subreddit":"gaming","selftext_html":null,"selftext":"","likes":null,"secure_media":null,"link_flair_text":null,"id":"2eu99o","gilded":0,"secure_media_embed":{},"clicked":false,"stickied":false,"author":"detraceur","media":null,"score":3517,"approved_by":null,"over_18":false,"hidden":false,"thumbnail":"http://b.thumbs.redditmedia.com/z_elas9mhzzSgDcDjz93N8MgYqbe3HaXG6CSsIEMFCk.jpg","subreddit_id":"t5_2qh03","edited":false,"link_flair_css_class":null,"author_flair_css_class":null,"downs":0,"saved":false,"is_self":false,"permalink":"/r/gaming/comments/2eu99o/it_just_got_real_in_my_dorm/","name":"t3_2eu99o","created":1409250810,"url":"http://imgur.com/9ytsL7b","author_flair_text":null,"title":"It just got real in my dorm","created_utc":1409247210,"ups":3517,"num_comments":264,"visited":false,"num_reports":null,"distinguished":null}},{"kind":"t3","data":{"domain":"i.imgur.com","banned_by":null,"media_embed":{},"subreddit":"gifs","selftext_html":null,"selftext":"","likes":null,"secure_media":null,"link_flair_text":null,"id":"2eu8f7","gilded":0,"secure_media_embed":{},"clicked":false,"stickied":false,"author":"SinisterWaffles","media":null,"score":3258,"approved_by":null,"over_18":false,"hidden":false,"thumbnail":"/images/reddit-black.png","subreddit_id":"t5_2qt55","edited":false,"link_flair_css_class":null,"author_flair_css_class":null,"downs":0,"saved":false,"is_self":false,"permalink":"/r/gifs/comments/2eu8f7/me_me_its_me_i_want_it_i_want_it/","name":"t3_2eu8f7","created":1409275555,"url":"http://i.imgur.com/xTJti34.gif","author_flair_text":null,"title":"\"Me... ME! Its me! I want it. I WANT IT!\"","created_utc":1409246755,"ups":3258,"num_comments":111,"visited":false,"num_reports":null,"distinguished":null}}]

  function makeSeedRooms(seedData) {
    $('#container-rows').append('<div class="row">')
    $.each(seedData, function(i, post) {
      if ( post.data.thumbnail == 'self' || post.data.thumbnail == '') {
        post.data.thumbnail = '/images/reddit-black.png'
      }
      $('#container-rows').append('<div class="col-sm-4 portfolio-item"><a id="'+post.data.title.split(" ").join()+'" href="#portfolioModal'+(i+1)+'" class="portfolio-link room_name" data-toggle="modal"><div class="caption"><div class="caption-content"><p>'+post.data.title.split(" ").join()+'</p><i class="fa fa-search-plus fa-3x"></i></div></div><img src="/images/portfolio/cabin.png" class="img-responsive" alt=""></a></div>'
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

function trackSockets() {

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

    console.log(socket)


    $("#messages").append('<div class="message"><div class="message-image"><img class="smaller" src="'+image+'"></div>'
                          +'<div class="message-content"><p class="user-name">'+data.userName + ': </p>'
                          +'<p class="user-message">' + message + ' </p>'
                          +'<p class="user-time">(' + timeAgo + ')</p>' +'<br/ ></div></div><div class="clear"></div>')
  })

  $(document).on('click','.room_name', function() {
    var room = $(this).attr('id');

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
}

$(document).on('click', '.close-btn', function(){
  var room = $('#room-name').data('value');
  room = room.split(' ').join()
  socket.emit('leaveRoom', {roomName: room})
})

// the message is going to the request, but the socket isn't being registered.
// is it in the room?
// it is, but doesn't update on every even number click. why? what changes?

trackSockets()


