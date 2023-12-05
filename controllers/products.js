const { products, categories, product_images, stocks } = require("../models");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { log } = require("console");

module.exports = {
  getData : async (req, res, next) => {
    try {
      const result = await products.findAll({
        include: [
          {
            model: categories,
            required: true,
          },
          {
            model: product_images,
            required: true,
          },
          {
            model: stocks,
            required: true,
          }
        ],
        where: req.query,
        attributes: {
          exclude: ["createdAt", "updatedAt"]
        },
        order: [["id", "ASC"]],
      });
      return res.status(200).send(result)
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  addProduct: async (req, res, next) => {
    try {
      let token = req.token;
      const accountData = jwt.verify(token, process.env.SCRT_TKN);
      if (accountData.role.includes("admin")) {
        const result = await products.create({
          name: req.body.name,
          categoryid: req.body.category,
          normalPrice: req.body.normalPrice,
          discountPrice: req.body.discountPrice,
          description: req.body.description,
        })

        for (let i = 0; i < req.files.length; i++) {
          await product_images.create({
            productid: result.id,
            image: req.files[i].filename,
          });
        };

        await stocks.create({
          productid: result.id,
          warehouseid: req.body.warehouse,
          stocks: req.body.stocks
        })

        return res.status(201).send({
          success: true,
          message: "Add product success",
        })
      } else {
        return res.status(400).send({
          success: false,
          message: "Access denied",
        })
      }
    } catch (error) {
      console.log(error);
      if (fs.existsSync(`./${req.files}`)) {
        for (let i = 0; i < req.files.length; i++) {
          fs.unlinkSync(`./${req.files[i].path}`)
        };
      };
      return res.status(500).send(error);
    }
  },
}
