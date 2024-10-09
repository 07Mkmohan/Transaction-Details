const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:5174" }));

app.get("/api/initialize", (req, res) => {
  // Initialization logic
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
