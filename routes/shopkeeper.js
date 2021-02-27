var express = require('express');
var router = express.Router();
const ShopkeeperController = require("../controllers/ShopkeeperController")

// rotas do CRUD de produtos Lojistas
router.get('/listar', ShopkeeperController.list);
router.post('/registrar', ShopkeeperController.create);

router.post('/alterar/:id', ShopkeeperController.update);

router.get('/excluir/:id', ShopkeeperController.delete);

// rotas de controle de pedidos do lojista
router.get('/pedidos', ShopkeeperController.ordersList);

module.exports = router;