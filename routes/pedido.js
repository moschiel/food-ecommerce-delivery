var express = require('express');
var router = express.Router();
const PedidoController = require("../controllers/PedidoController")

/* GET users listing. */
router.get('/finalizar', PedidoController.finalizar);

module.exports = router;
