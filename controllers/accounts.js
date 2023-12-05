const {accounts} = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  getData: async (req, res, next) => {
    try {
      const result = await accounts.findAll({
        where: req.query,
        attributes: {
          exclude: ["createdAt", "updatedAt", "password"],
        },
      })
      return res.status(200).send(result)
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  register: async (req, res, next) => {
    try {
      if (req.body.password === req.body.confirmPassword) {
        const isExist = await accounts.findOne({
          where: {
            email: req.body.email,
          },
        });
        if (isExist) {
          return res.status(400).send({
            success: false,
            message: "Account is already exist",
          });
        }
        delete req.body.confirmPassword;
  
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashPassword;
  
        const result = await accounts.create({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        })

        return res.status(201).send({
          success: true,
          message: "Register success",
        })
      } else {
        return res.status(401).send({
          success: false,
          message: "Confirm password failed",
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const result = await accounts.findOne({
        where: {
          email: req.body.email,
        },
      });
      const isValid = await bcrypt.compare(req.body.password, result.password);

      if (isValid) {
        const {id, username, email, role} = result;
        const token = jwt.sign({
          id,
          username,
          email,
          role,
        }, process.env.SCRT_TKN, {
          expiresIn: "1h"
        });
        return res.status(200).send({
          success: true,
          result: {
            username,
            email,
            role,
            token,
          }
        });
      } else {
        return res.status(401).send({
          success: false,
          message: "You unauthenticate",
        })
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
}