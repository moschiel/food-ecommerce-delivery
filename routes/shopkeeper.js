var express = require('express');
var router = express.Router();
const ShopkeeperController = require("../controllers/ShopkeeperController")

// rotas do CRUD Lojistas
router.get('/listar', ShopkeeperController.list);
router.post('/registrar', ShopkeeperController.create);

// falata ativar as rotas abaixo
// router.get('/alterar/:id', ShopkeeperController.edit);
// router.post('/alterar/:id', ShopkeeperController.update);

router.get('/excluir/:id', ShopkeeperController.delete);

router.get('/pedidos', ShopkeeperController.ordersList);



module.exports = router;