const express = require("express");
const SupportLevel = require("../models/supLevel.model");

const router = express.Router();

// 📌 เพิ่มแนวรับหุ้น
router.post("/set-support", async (req, res) => {
    const { symbol, supportPrice } = req.body;

    try {
        const support = await SupportLevel.findOneAndUpdate(
            { symbol: symbol.toUpperCase() },
            { supportPrice, notify: true },
            { upsert: true, new: true }
        );

        res.json({ message: "Support level set successfully", support });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// 📌 ปิดแจ้งเตือน
router.post("/disable-notify/:symbol", async (req, res) => {
    const { symbol } = req.params;

    try {
        await SupportLevel.findOneAndUpdate(
            { symbol: symbol.toUpperCase() },
            { notify: false }
        );

        res.json({ message: `Notifications disabled for ${symbol}` });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
