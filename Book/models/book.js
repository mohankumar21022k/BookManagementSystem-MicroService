
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({

  title: {
    type: String,
    required: true
  },
  authors: {
    type: String,
    required: true
  },
  average_rating: {
    type: Number,
    required: true
  },
  isbn: {
    type: String,
    required: true
  },
  isbn13: {
    type: String,
    required: true
  },
  language_code: {
    type: String,
    required: true
  },
  num_pages: {
    type: Number,
    required: true
  },
  ratings_count: {
    type: Number,
    required: true
  },
  text_reviews_count: {
    type: Number,
    required: true
  },
  publication_date: {
    type: Date,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Book', bookSchema);