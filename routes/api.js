/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
// var MongoClient = require('mongodb').MongoClient;
// var ObjectId = require('mongodb').ObjectId;
// const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
const Book = require('../models/book')

module.exports = function (app) {
  
  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err, allBooks) => {
        const booksWithCommentCounts = allBooks.map(book => {
          return { 
            _id: book._id,
            title: book.title,
            comment_count: book.comments.length
          }
        })
        
        res.status(200).json(booksWithCommentCounts)
      })
    
    })
    
    .post(function (req, res){    
      if (req.body.title === undefined) {
        res.status(400).send('Title is required.')
        res.end()
      } else {
        const newBook = new Book({ title: req.body.title })
         
        newBook.save((err, book) => {
          if (err) {
            console.log(err)
            res.status(500).send('Error saving new book.')
          }
          
          res.status(200).json(book)
        })
      }
    })
    
    .delete(function(req, res){
      Book.deleteMany({}, error => {
        res.status(200).send('complete delete successful')
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      // I can get /api/books/{_id} to retrieve a single object of a book containing title, _id, & an array of comments (empty array if no comments present).
      // If I try to request a book that doesn't exist I will get a 'no book exists' message.
    
      if (bookid === undefined) {
          res.status(400).send('no book exists')
      } else {
        Book.findOne({ _id: bookid }, (error, book) => {
          if (error) {
            res.status(500).send('error finding book')
          }
          
          res.status(200).json(book)
        })
      }
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    
      if (comment === undefined || bookid === undefined) {
        res.status(400).send('book id and comment required for post request')
      } else {
        Book.findOne({ _id: bookid }, (error, book) => {
          if (error) {
            res.status(500).send('error finding book')
          }
          book.comments = book.comments.concat([comment])
          book.markModified('comments')
          book.save((error, newBook) => {
            if (error) { res.status(500).send('error saving book') }
            
            res.status(200).json(newBook)            
          })
        })
      }
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      
      Book.deleteOne({ _id: bookid }, (error) => {
        if (error) {
          res.status(500).send('Error deleting book.')
        }
        
        res.status(200).send('delete successful')
      })
    });
  
};
