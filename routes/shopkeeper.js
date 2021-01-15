var express = require('express');
var router = express.Router();
const ShopkeeperController = require("../controllers/ShopkeeperController")

router.get('/controle', ShopkeeperController.lojista);

module.exports = router;