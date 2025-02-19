const express = require("express");
const { getStockPrice } = require("../services/stock.service");
const Stock = require("../models/stock.model");

const router = express.Router();

// ดึงราคาหุ้นแบบเรียลไทม์
router.get("/:symbol", async (req, res) => {
    const { symbol } = req.params;
    const stock = await getStockPrice(symbol.toUpperCase());

    if (!stock) {
        return res.status(404).json({ error: "Stock not found" });
    }

    const price = stock.price.raw || stock.price.fmt || stock.price;

    await Stock.findOneAndUpdate(
        { symbol: stock.symbol },
        { price: Number(price), lastUpdated: new Date() },
        { upsert: true }
    );

    res.json(stock);
});

module.exports = router;
