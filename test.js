var superagent = require('superagent')
var expect = require('expect.js')
var scraperjs = require('scraperjs');

// tests
// test for loging in
// tests for logging out
// test for uploading image
// test for creating room
// test for posting  a message in a room both by visiting url and on home page
//     -> those rooms must have the same message if the homepage is visited by url
// make sure that room person is not in does not have messages setup

var sw = require('selenium-webdriver');
var driver = new sw.Builder()
  .withCapabilities(sw.Capabilities.chrome())
  .build()

// And then...
var chai = require('chai');
var chaiWebdriver = require('chai-webdriver');
chai.use(chaiWebdriver(driver));

// And you're good to go!
driver.get('http://github.com');
chai.expect('#site-container h1.heading').dom.to.not.contain.text("I'm a kitty!");

describe('testing chat.js', function(){
  var id

  it('it should have a home page', function(done){
    superagent.get('http://localhost:3000/')
      .end(function(e, res){
        var re = /Chatrooms/i
        expect(re.test(res.text)).to.eql(true)
        done()
      })
  })

  it('it should have a contact page', function(done){
    superagent.get('http://localhost:3000/contact')
      .end(function(e, res){
        var re = /Contact Me/i
        expect(re.test(res.text)).to.eql(true)
        done()
      })
  })

  it('it should have a rooms index page', function(done){
    superagent.get('http://localhost:3000/rooms')
      .end(function(e, res){
        var re = /All the Rooms/i
        expect(re.test(res.text)).to.eql(true)
        done()
      })
  })

  it('it should with created rooms have 24 on the main from reddit', function(done){
    superagent.get('http://localhost:3000/')
      .end(function(e, res){
        console.log(res.text)
        done()
      })

  })

  // only want to scrap from reddit when top change yes?

// it('it should, if 25 are created, have 25 on the room index page', function(done){
  //   superagent.get('http://localhost:3000/contact')
  //     .end(function(e, res){
  //       var re = /All the Rooms/i
  //       expect(re.test(res.text)).to.eql(true)
  //       done()
  //     })
  // })

  // it('create user on reddit', function(done){
  //   superagent.post('http://localhost:3000/collections/test')
  //     .send({ name: 'John'
  //       , email: 'john@rpjs.co'
  //     })
  //     //makes request to url and once done, does matching on response
  //     .end(function(e,res){
  //       // console.log(res.body)
  //       expect(e).to.eql(null)
  //       expect(res.body.length).to.eql(1)
  //       expect(res.body[0]._id.length).to.eql(24)
  //       id = res.body[0]._id
  //       done()
  //     })
  // })

  // it('it should logout users', function(done){
  //   superagent.get('http://localhost:3000/collections/test/'+id)
  //     .end(function(e, res){
  //       // console.log(res.body)
  //       expect(e).to.eql(null)
  //       expect(typeof res.body).to.eql('object')
  //       expect(res.body._id.length).to.eql(24)
  //       expect(res.body._id).to.eql(id)
  //       done()
  //     })
  // })

  // it('it should change image on upload', function(done){
  //   superagent.get('http://localhost:3000/collections/test')
  //     .end(function(e, res){
  //       // console.log(res.body)
  //       expect(e).to.eql(null)
  //       expect(res.body.length).to.be.above(0)
  //       expect(res.body.map(function (item){return item._id})).to.contain(id)
  //       done()
  //     })
  // })

  // it('it should create a room by homepage click', function(done){
  //   superagent.put('http://localhost:3000/collections/test/'+id)
  //     .send({name: 'Peter'
  //       , email: 'peter@yahoo.com'})
  //     .end(function(e, res){
  //       // console.log(res.body)
  //       expect(e).to.eql(null)
  //       expect(typeof res.body).to.eql('object')
  //       expect(res.body.msg).to.eql('success')
  //       done()
  //     })
  // })

  // it('should create a room by adding room', function(done){
  //   superagent.get('http://localhost:3000/collections/test/'+id)
  //     .end(function(e, res){
  //       // console.log(res.body)
  //       expect(e).to.eql(null)
  //       expect(typeof res.body).to.eql('object')
  //       expect(res.body._id.length).to.eql(24)
  //       expect(res.body._id).to.eql(id)
  //       expect(res.body.name).to.eql('Peter')
  //       done()
  //     })
  // })
  // it('it should post in homepage', function(done){
  //   superagent.del('http://localhost:3000/collections/test/'+id)
  //     .end(function(e, res){
  //       // console.log(res.body)
  //       expect(e).to.eql(null)
  //       expect(typeof res.body).to.eql('object')
  //       expect(res.body.msg).to.eql('success')
  //       done()
  //     })
  // })
  // it('it should post in homepage and the room url has message', function(done){
  //   superagent.del('http://localhost:3000/collections/test/'+id)
  //     .end(function(e, res){
  //       // console.log(res.body)
  //       expect(e).to.eql(null)
  //       expect(typeof res.body).to.eql('object')
  //       expect(res.body.msg).to.eql('success')
  //       done()
  //     })
  // })
  // it('it login two users and have an online of two', function(done){
  //   superagent.del('http://localhost:3000/collections/test/'+id)
  //     .end(function(e, res){
  //       // console.log(res.body)
  //       expect(e).to.eql(null)
  //       expect(typeof res.body).to.eql('object')
  //       expect(res.body.msg).to.eql('success')
  //       done()
  //     })
  // })
  // it('it should have an online number originally of zero', function(done){
  //   superagent.del('http://localhost:3000/collections/test/'+id)
  //     .end(function(e, res){
  //       // console.log(res.body)
  //       expect(e).to.eql(null)
  //       expect(typeof res.body).to.eql('object')
  //       expect(res.body.msg).to.eql('success')
  //       done()
  //     })
  // })
  // it('if not logged in cannot submit messages', function(done){
  //   superagent.del('http://localhost:3000/collections/test/'+id)
  //     .end(function(e, res){
  //       // console.log(res.body)
  //       expect(e).to.eql(null)
  //       expect(typeof res.body).to.eql('object')
  //       expect(res.body.msg).to.eql('success')
  //       done()
  //     })
  // })
})