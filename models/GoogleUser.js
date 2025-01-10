const mongoose = require('mongoose');

const UserGoogleSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  displayName: String,
  firstName: String,
  lastName: String,
  email: { type: String, required: true },
  imageUrl: String
});

module.exports = mongoose.model('UserGoogle', UserGoogleSchema);

