const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// Sample Schema
const ItemSchema = new mongoose.Schema({
  name: String,
  price: Number
});
const Item = mongoose.model("Item", ItemSchema);

// Test Home Route
app.get("/", (req, res) => {
  res.send("Node + MongoDB Running Successfully! 🚀");
});

// ✔ IMPORTANT: /items route
app.get("/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.listen(3000, () => console.log("Server running on port 3000"));
