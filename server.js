require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const cors = require("cors")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())

const mongoose = require('mongoose');
const uri = process.env.URI;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (err) => console.error("❌ MongoDB Connection Error:", err));
db.once("open", () => console.log("✅ Connected to MongoDB Successfully"));

const stockRoutes = require("./routes/stock.route");

app.use(express.json());

app.use("/api/stocks", stockRoutes);
const supportRoutes = require("./routes/support.route");

app.use("/api/support", supportRoutes);

require("./cron/checkStock");

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
