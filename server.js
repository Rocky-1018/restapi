// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// --- MongoDB Cloud Connection (MongoDB Atlas) ---
const MONGO_URI = "mongodb+srv://prashanth:admin@cluster0.un4kgqq.mongodb.net/UserList";


const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// --- Define Schema and Model ---
const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  email: { type: String, required: true },
  username: { type: String, required: true }
});


const User = mongoose.model("User", userSchema);

// --- ROUTES ---

//  GET /api/users → Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  GET /api/users/user/:id → Get user by ID
app.get("/api/users/user/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  POST /api/users/newuser → Create a new user
app.post("/api/users/newuser", async (req, res) => {
  try {
    const { id, email, username } = req.body;
    if (!id || !email || !username)
      return res.status(400).json({ message: "All fields (id, email, username) are required" });

    const existing = await User.findOne({ id });
    if (existing)
      return res.status(400).json({ message: "User ID already exists" });

    const newUser = await User.create({ id, email, username });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  PUT /api/users/modify/:id → Update user by ID
app.put("/api/users/modify/:id", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { username },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  DELETE /api/users/delete/:id → Delete user by ID
app.delete("/user/delete/:id", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ id: req.params.id });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Optional) GET /api/users/getrandomuser → Get one random user
app.get("/api/users/getrandomuser", async (req, res) => {
  try {
    const count = await User.countDocuments();
    const random = Math.floor(Math.random() * count);
    const user = await User.findOne().skip(random);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Start Server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

