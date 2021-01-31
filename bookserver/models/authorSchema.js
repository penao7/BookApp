import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'author field cannot be empty'],
    unique: true,
    minlength: [4, 'minimum length for author is 4 characters']
  },
  born: {
    type: Number,
    minlength: [4, 'there has to be 4 digits in a year of born'],
    maxlength: [4, 'there has to be 4 digits in a born year of born'],
  }
});

export default mongoose.model('Author', schema);