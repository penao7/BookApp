import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import mongoosePaginate from 'mongoose-paginate-v2';

const schema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'a book has to have a title'],
    unique: true,
    uniqueCaseInsensitive: true,
    minlength: [2, 'mininum length for a book title is 2 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  published: {
    type: Number,
    required: [true, 'a book has to have a year of publishion'],
  },
  genres: [{
    type: String,
  }]
});

schema.plugin(uniqueValidator, { message: 'there is a book already added with this title' });
schema.plugin(mongoosePaginate);

export default mongoose.model('Book', schema);