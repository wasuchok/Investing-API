const axios = require("axios");
require("dotenv").config();

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
        const stockData = response.data;

        if (!stockData || !stockData.regularMarketPrice) {
            throw new Error("Invalid stock data");
        }

        return {
            symbol,
            price: stockData.regularMarketPrice
        };
    } catch (error) {
        console.error("Error fetching stock price:", error);
        return null;
    }
};

module.exports = { getStockPrice };
