const { accountsController } = require("../controllers");
const router = require("express").Router();

router.get("/", accountsController.getData);
router.post("/register", accountsController.register);
router.post("/login", accountsController.login);

module.exports = router;