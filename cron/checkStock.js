const cron = require("node-cron");
const axios = require("axios");
const SupportLevel = require("../models/supLevel.model");
require("dotenv").config();

// ฟังก์ชันดึงราคาหุ้น
const getStockPrice = async (symbol) => {
    try {
        const options = {
            method: 'GET',
            url: `${process.env.RAPIDAPI_HOST}/price/${symbol}`,
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY,
                'x-rapidapi-host': process.env.RAPIDAPI_HOST_AUTH
            }
        };

        const response = await axios.request(options);
        return response.data.regularMarketPrice;
    } catch (error) {
        console.error(`❌ Error fetching price for ${symbol}:`, error);
        return null;
    }
};

// ตั้งค่า Cron Job ให้รันทุก 5 นาที
cron.schedule("*/5 * * * *", async () => {
    console.log("🔍 Checking stock prices...");

    const supportLevels = await SupportLevel.find({ notify: true });

    for (const stock of supportLevels) {
        const currentPrice = await getStockPrice(stock.symbol);
        console.log(parseInt(currentPrice.raw));
        if (currentPrice !== null && parseInt(currentPrice.raw) <= parseInt(stock.supportPrice)) {
            console.log(`🚨 Alert! ${stock.symbol} reached support level: ${currentPrice}`);

            // ส่งแจ้งเตือน (Email หรือ LINE Notify)
            await sendNotification(stock.symbol, currentPrice.raw);

            // ปิดแจ้งเตือนชั่วคราวเพื่อไม่ให้สแปม
            // await SupportLevel.findOneAndUpdate({ symbol: stock.symbol }, { notify: false });
        }
    }
});

// ฟังก์ชันส่งแจ้งเตือน (ใช้ LINE Notify หรือ Email)
const sendNotification = async (symbol, price) => {
    try {
        const message = `📉 หุ้น ${symbol} ร่วงถึงแนวรับที่ ${price} แล้ว!`;

        // ส่งแจ้งเตือน LINE Notify
        await axios.post("https://notify-api.line.me/api/notify", `message=${message}`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${process.env.LINE_NOTIFY_TOKEN}`
            }
        });

        console.log("✅ Notification sent!");
    } catch (error) {
        console.error("❌ Failed to send notification:", error);
    }
};
