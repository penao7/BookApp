import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const schema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username field cannot be empty'],
    unique: [true, 'username is already taken'],
    uniqueCaseInsensitive: true,
    minlength: [3, 'username has to have at least 3 characters']
  },
  password: {
    type: String,
    required: [true, 'password field cannot be empty'],
    minlength: [7, 'password should contain at least 7 charactes'],
    maxlenght: [64, 'password cannot be longer than 64 characters']
  },
  role: {
    type: String,
    required: [true, 'role field cannot be empty'],
  },
  favoriteGenre: {
    type: String,
    minlength: [4, 'you favourite genre should have at least 4 characters']
  }

});

schema.plugin(uniqueValidator, { message: 'username is already taken' });


export default mongoose.model('User', schema);