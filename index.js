require("dotenv").config();
const PORT = process.env.PORT || 2500;
const express = require("express");
const app = express();
const cors = require("cors");
const bearerToken = require("express-bearer-token");

app.use(cors());
app.use(express.json());
app.use(bearerToken());

app.get("/", (req, res) => {
  return res.status(200).send("<h1>API RUNNING</h1>");
});

// Define Router
const { accountsRouter, productsRouter, categoriesRouter, warehouseRouter } = require("./routers");
app.use("/account", accountsRouter);
app.use("/product", productsRouter);
app.use("/category", categoriesRouter);
app.use("/warehouse", warehouseRouter);

app.use("/public", express.static("public"));

app.listen(PORT, () => {
  console.log(`API RUNNING ON PORT ${PORT}`);
})