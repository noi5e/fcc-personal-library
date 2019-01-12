/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
const Book = require('../models/book')

chai.use(chaiHttp);

let testBookId = ''

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Norwegian Wood' })
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body.title, 'Norwegian Wood')
            assert.property(res.body, '_id')
            assert.property(res.body, 'comments')
          
            testBookId = res.body._id
          
            done()
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 400)
            assert.equal(res.error.text, 'Title is required.')
            done()
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200)
            
            res.body.forEach(book => {
              assert.property(book, 'comment_count')
            })
          
            Book.countDocuments((error, count) => {
              assert.equal(count, res.body.length)
              done()
            })
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/blahblah')
          .end(function(err, res) {
            assert.equal(res.status, 500)
            assert.equal(res.error.text, 'error finding book')
            done()
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/' + testBookId)
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body._id, testBookId)
            assert.equal(res.body.title, 'Norwegian Wood')
            assert.property(res.body, 'comments')
            done()
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/' + testBookId)
          .send({'comment': 'Test comment.'})
          .end(function(err, res) {
            assert.equal(res.status, 200)
            assert.equal(res.body._id, testBookId)
            assert.equal(res.body.comments[0], 'Test comment.')
            done()
        })
        
      });
      
    });

  });

});
