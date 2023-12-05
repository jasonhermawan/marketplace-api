const { productsController } = require("../controllers");
const { uploader } = require("../helper/uploader");
const router = require("express").Router();

router.get("/", productsController.getData);
router.post("/", uploader("/products").array("fileupload", 10), productsController.addProduct);

module.exports = router;