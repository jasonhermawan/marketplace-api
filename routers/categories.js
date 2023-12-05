const { categoriesController } = require("../controllers");
const router = require("express").Router();

router.get("/", categoriesController.getData);
router.post("/", categoriesController.addCategory);

module.exports = router;