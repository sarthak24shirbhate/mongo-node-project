const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("DB Error:", err));

app.get("/", (req, res) => {
    res.send("Node + MongoDB Running Successfully! 🚀");
});

app.get("/health", (req, res) => {
    res.json({ status: "OK", uptime: process.uptime() });
});

app.listen(3000, () => console.log("Server running on port 3000"));
