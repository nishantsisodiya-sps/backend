const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/scrape/:companyName", async (req, res) => {
  let companyName = req.params.companyName.split(" ")[0];
  companyName = companyName.replace(/[^a-zA-Z0-9 ]/g, "");
  try {
    const url = `https://ticker.finology.in/company/${encodeURIComponent(
      companyName
    )}`;

    const response = await axios.get(url);

    const html = response.data;

    const $ = cheerio.load(html);
    const companiesData = [];

    const todayHigh = $("#mainContent_ltrlTodayHigh").text();
    const todayLow = $("#mainContent_ltrlTodayLow").text();
    const WeekHigh = $("#mainContent_ltrl52WH").text();
    const WeekLow = $("#mainContent_ltrl52WL").text();
    const debt = $("#mainContent_ltrlDebt").text();

    const companyNames = $("#mainContent_ltrlCompName").text();
    const priceSummary = $("#mainContent_pricesummary").text();
    const finStar = $("#mainContent_finstarrating").text();
    const companyEssentials = $("#mainContent_divCompanyEssentials").text();
    // const profitGrowth = $(".compess .Number").first().text().trim();
    $(".compess small").each((index, element) => {
      const label = $(element).text().trim();
      if (label === "Profit Growth") {
        profitGrowth = $(element).next().find(".Number").text().trim();
        return false; // Exit the loop once found
      }
    });

    $(".compess small").each((index, element) => {
      const label = $(element).text().trim();
      if (label === "No. of Shares") {
        noOfShares = $(element).next().find(".Number").text().trim();
        return false; // Exit the loop once found
      }
    });

    const extractedData = {
      companyNames,
      todayHigh,
      todayLow,
      WeekHigh,
      WeekLow,
      debt,
      profitGrowth,
      noOfShares,
    };

    res.json(extractedData);

    // res.json(html);
  } catch (error) {
    res.status(500).json({ error: "Error occurred during scraping" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
