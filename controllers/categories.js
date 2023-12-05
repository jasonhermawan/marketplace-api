const {categories} = require("../models");
const jwt = require("jsonwebtoken");

module.exports = {
  getData: async (req, res, next) => {
    try {
      const result = await categories.findAll({
        where: req.query,
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        },
        order: [["id", "ASC"]],
      })
      return res.status(200).send(result)
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  addCategory: async (req, res, next) => {
    try {
      let token = req.token;
      const accountData = jwt.verify(token, process.env.SCRT_TKN);
      if (accountData.role === "superadmin") {
        const result = await categories.create({
          category: req.body.category,
        });
        return res.status(201).send({
          success: true,
          message: "Add category success",
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "Access denied"
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
}