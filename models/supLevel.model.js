const mongoose = require("mongoose");

const supportLevelSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true }, // หุ้น เช่น AAPL
    supportPrice: { type: Number, required: true }, // แนวรับ
    notify: { type: Boolean, default: true }, // แจ้งเตือนเปิด-ปิด
});

module.exports = mongoose.model("SupportLevel", supportLevelSchema);
