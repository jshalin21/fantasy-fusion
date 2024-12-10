const mongoose = require("mongoose");
const secrets = require("../config/secrets");
const User = require("../models/user");

module.exports = function (router) {
  const usersRoute = router.route("/users");
  const usersIDRoute = router.route("/users/:id");

  // GET /users - Retrieve users with optional query filters
  usersRoute.get(async (req, res) => {
    try {
      const { email } = req.query;
  
      if (email) {
        const user = await User.findOne({ email });
  
        if (!user) {
          return res.status(404).json({
            message: "User not found",
            data: null,
          });
        }
  
        return res.status(200).json({
          message: "User retrieved successfully",
          data: [user], 
        });
      }
  
      const where = req.query.where ? JSON.parse(req.query.where) : {};
      const sort = req.query.sort ? JSON.parse(req.query.sort) : {};
      const select = req.query.select ? JSON.parse(req.query.select) : {};
      const skip = parseInt(req.query.skip) || 0;
      const limit = parseInt(req.query.limit) || 100;
      const count = req.query.count === "true";
  
      if (count) {
        const totalCount = await User.countDocuments(where);
        return res
          .status(200)
          .json({ message: "Count retrieved successfully", data: totalCount });
      }
  
      const result = await User.find(where)
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .exec();
  
      res.status(200).json({ message: "Users retrieved", data: result });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", data: err.message });
    }
  });
  

  // POST /users - Create or update a user
  usersRoute.post(async (req, res) => {
    const { uid, name, email } = req.body;

    if (!uid || !name || !email) {
      return res.status(400).json({
        message: "Missing required fields: uid, name, or email",
      });
    }

    try {
      let user = await User.findOne({ uid });

      if (!user) {
        // Create a new user if not found
        user = new User({ uid, name, email });
        await user.save();
      }

      res.status(201).json({
        message: "User created/updated successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating/updating user", error: error.message });
    }
  });

  // GET /users/:id - Retrieve a user by ID
  usersIDRoute.get(async (req, res) => {
    const userID = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({
        message: "Invalid user ID format",
        data: userID,
      });
    }

    try {
      const user = await User.findById(userID).exec();

      if (!user) {
        return res.status(404).json({
          message: "User not found",
          data: null,
        });
      }

      res.status(200).json({
        message: "User retrieved successfully",
        data: user,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error", data: err.message });
    }
  });

  // PUT /users/:id - Update a user by ID
  usersIDRoute.put(async (req, res) => {
    const userID = req.params.id;
    const { name, email } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({
        message: "Invalid user ID format",
        data: userID,
      });
    }

    try {
      const user = await User.findById(userID);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
          data: null,
        });
      }

      if (name) user.name = name;
      if (email) user.email = email;

      await user.save();

      res.status(200).json({
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating user", error: error.message });
    }
  });

  return router;
};
