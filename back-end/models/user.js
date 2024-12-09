const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateCreated: { type: Date, default: Date.now },
  activeLeagues: {type: [String],default: []}
});

module.exports = mongoose.model("User", UserSchema);
