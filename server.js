require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const cors = require("cors")

const app = express();
const PORT = 3000;

app.use(cors())

const mongoose = require('mongoose');
const uri = process.env.URI;
mongoose.connect(uri);

const db = mongoose.connection;
db.on("error", (err) => console.error("❌ MongoDB Connection Error:", err));
db.once("open", () => console.log("✅ Connected to MongoDB Successfully"));

const stockRoutes = require("./routes/stock.route");

app.use(express.json());

app.use("/api/stocks", stockRoutes);
const supportRoutes = require("./routes/support.route");

app.use("/api/support", supportRoutes);

require("./cron/checkStock");

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
