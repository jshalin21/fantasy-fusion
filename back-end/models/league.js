const mongoose = require("mongoose");

const LeagueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  players: { type: [String], default: [] },
  createdBy: { type: String, required: false }, // Store userId as a plain string
});

module.exports = mongoose.model("League", LeagueSchema);
