var express = require('express');
var router = express.Router();
const PedidoController = require("../controllers/PedidoController")

/* GET users listing. */
router.get('/solicitar', PedidoController.solicitar);

module.exports = router;
