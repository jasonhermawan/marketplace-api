const { warehouseController } = require("../controllers");
const router = require("express").Router();

router.get("/", warehouseController.getData);
router.post("/", warehouseController.addWarehouse);

module.exports = router;