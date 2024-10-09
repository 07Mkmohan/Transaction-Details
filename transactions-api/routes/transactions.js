const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const axios = require("axios");

router.post("/initialize", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    await Transaction.deleteMany({});
    const transactions = response.data.map((item) => ({
      title: item.title,
      description: item.description,
      price: item.price,
      dateOfSale: new Date(item.dateOfSale),
      category: item.category,
    }));
    await Transaction.insertMany(transactions);
    res.status(200).json({ message: "Database initialized!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const { search = "", page = 1, perPage = 10 } = req.query;

  const pageNumber = parseInt(page, 10) || 1;
  const itemsPerPage = parseInt(perPage, 10) || 10;

  const query = {};

  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [{ title: regex }, { description: regex }];
  }

  try {
    const transactions = await Transaction.find(query)
      .skip((pageNumber - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / itemsPerPage),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/statistics", async (req, res) => {
  const { month } = req.query;

  const monthIndex = parseInt(month, 10);
  if (!month || monthIndex < 1 || monthIndex > 12) {
    return res
      .status(400)
      .json({ error: "Month must be an integer between 1 and 12" });
  }

  const startDate = new Date(2021, monthIndex - 1, 1);
  const endDate = new Date(2022, monthIndex, 0);

  try {
    const soldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lte: endDate },
    });

    const totalAmountResult = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]);

    const notSoldItems = await Transaction.countDocuments({
      dateOfSale: { $lt: startDate },
    });

    res.json({
      totalAmount: totalAmountResult[0]?.total || 0,
      soldItems,
      notSoldItems,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bar-chart", async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(
    new Date().getFullYear(),
    new Date(month + " 1, 2021").getMonth(),
    1
  );
  const endDate = new Date(
    new Date().getFullYear(),
    new Date(month + " 1, 2021").getMonth() + 1,
    0
  );

  const priceRanges = [
    { range: "0-100", count: 0 },
    { range: "101-200", count: 0 },
    { range: "201-300", count: 0 },
    { range: "301-400", count: 0 },
    { range: "401-500", count: 0 },
    { range: "501-600", count: 0 },
    { range: "601-700", count: 0 },
    { range: "701-800", count: 0 },
    { range: "801-900", count: 0 },
    { range: "901-above", count: 0 },
  ];

  const transactions = await Transaction.find({
    dateOfSale: { $gte: startDate, $lte: endDate },
  });

  transactions.forEach((transaction) => {
    const price = transaction.price;
    if (price <= 100) priceRanges[0].count++;
    else if (price <= 200) priceRanges[1].count++;
    else if (price <= 300) priceRanges[2].count++;
    else if (price <= 400) priceRanges[3].count++;
    else if (price <= 500) priceRanges[4].count++;
    else if (price <= 600) priceRanges[5].count++;
    else if (price <= 700) priceRanges[6].count++;
    else if (price <= 800) priceRanges[7].count++;
    else if (price <= 900) priceRanges[8].count++;
    else priceRanges[9].count++;
  });

  res.json(priceRanges);
});

router.get("/pie-chart", async (req, res) => {
  const { month } = req.query;
  const startDate = new Date(
    new Date().getFullYear(),
    new Date(month + " 1, 2021").getMonth(),
    1
  );
  const endDate = new Date(
    new Date().getFullYear(),
    new Date(month + " 1, 2021").getMonth() + 1,
    0
  );

  const categories = await Transaction.aggregate([
    { $match: { dateOfSale: { $gte: startDate, $lte: endDate } } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  res.json(categories);
});

router.get("/combined", async (req, res) => {
  const month = req.query.month;
  const stats = await Promise.all([
    axios.get(`your_api_url/statistics?month=${month}`),
    axios.get(`your_api_url/bar-chart?month=${month}`),
    axios.get(`your_api_url/pie-chart?month=${month}`),
  ]);

  res.json({
    statistics: stats[0].data,
    barChart: stats[1].data,
    pieChart: stats[2].data,
  });
});

module.exports = router;
