const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  //hashed password
  password: {
    type: String,
    required: true
  },

  //user/admin
  role: {
    type: String,
    required: true
  },

  // enable:true/disable:false
  userAccess: {
    type: Boolean,
    required: true
  },

  /*favourite books
  fav is an object with books array ,which consists of bookId's as an object */
  fav: {
    books: [
      {
        bookId: {
          type: Schema.Types.ObjectId,
          ref: 'Book',
          required: true
        }
      }
    ]
  }
});


module.exports = mongoose.model('User', userSchema);