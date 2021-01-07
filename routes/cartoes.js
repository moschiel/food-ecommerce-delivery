var express = require('express');
var router = express.Router();
const CardsController = require("../controllers/CardsController")

router.get('/listar', CardsController.list);
router.post('/criar', CardsController.create);
router.post('/deletar', CardsController.delete);
router.post('/selecionar', CardsController.select);

module.exports = router;