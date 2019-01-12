const mongoose = require('mongoose')

const BookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  comments: [String]
})

const Book = module.exports = mongoose.model('Book', BookSchema)