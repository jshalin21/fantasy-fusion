const mongoose = require("mongoose");
const secrets = require("../config/secrets");
const League = require("../models/league");
const User = require("../models/user");

module.exports = function (router) {
  const leaguesRoute = router.route("/leagues");
  const leagueIDRoute = router.route("/leagues/:id");

// GET /leagues - Fetch all leagues or leagues for a specific user
leaguesRoute.get(async (req, res) => {
    const { email } = req.query;
  
    try {
      let leagues;
  
      if (email) {
        const user = await User.findOne({ email });
  
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }
  
        leagues = await League.find({ _id: { $in: user.activeLeagues } });
      } else {
        leagues = await League.find();
      }
  
      res.status(200).json({ message: "Leagues retrieved successfully", data: leagues });
    } catch (error) {
      console.error("Error fetching leagues:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });
  

   // POST /leagues - Create a new league
  leaguesRoute.post(async (req, res) => {
    const { name, description, players, userId } = req.body;
    console.log("Incoming request data:", req.body);

    try {
      const league = new League({ name, description, players, createdBy: userId });
      await league.save();
      console.log("League saved:", league);


      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.activeLeagues.push(league._id); 
      await user.save();

      res.status(201).json({
        message: "League created successfully and added to user's activeLeagues",
        data: { league, user },
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating league", error: error.message });
    }
  });

  // GET /leagues/:id - Fetch a single league by ID
  leagueIDRoute.get(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid league ID format." });
    }

    try {
      const league = await League.findById(id);

      if (!league) {
        return res.status(404).json({ message: "League not found." });
      }

      res.status(200).json({ message: "League retrieved successfully", data: league });
    } catch (error) {
      console.error("Error fetching league:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });

  // DELETE /leagues/:id - Delete a league by ID
  leagueIDRoute.delete(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid league ID format." });
    }

    try {
      const league = await League.findByIdAndDelete(id);

      if (!league) {
        return res.status(404).json({ message: "League not found." });
      }

      await User.updateMany({ activeLeagues: id }, { $pull: { activeLeagues: id } });

      res.status(200).json({ message: "League deleted successfully", data: league });
    } catch (error) {
      console.error("Error deleting league:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });

  // PUT /leagues/:id - Update a league by ID
  leagueIDRoute.put(async (req, res) => {
    const leagueID = req.params.id;
    const { name, description, players } = req.body;

    if (!mongoose.Types.ObjectId.isValid(leagueID)) {
      return res.status(400).json({
        message: "Invalid league ID format",
        data: leagueID,
      });
    }

    try {
      const league = await League.findById(leagueID);

      if (!league) {
        return res.status(404).json({
          message: "League not found",
          data: null,
        });
      }

      if (name) league.name = name;
      if (description) league.description = description;
      if (players) league.players = players;

      await league.save();

      res.status(200).json({
        message: "League updated successfully",
        data: league,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating league", error: error.message });
    }
  });

  return router;
};
