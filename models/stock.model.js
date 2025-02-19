const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true }, // ชื่อหุ้น เช่น AAPL
    price: { type: Number, required: true }, // ราคาปัจจุบัน
    lastUpdated: { type: Date, default: Date.now } // เวลาล่าสุดที่อัปเดต
});

module.exports = mongoose.model("Stock", stockSchema);
