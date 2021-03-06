var express = require('express');
var router = express.Router();
const ProductsController = require("../controllers/ProductsShopkeeperController");
const UserController = require('../controllers/UserShopkeeperController');
//const OrderController = require('../controllers/OrderShopkeeperController');

// rotas do usuario lojistas
router.get('/cadastrar', UserController.userCreate);
router.post('/salvar', UserController.save);

router.get('/', UserController.login);
router.post('/login', UserController.authenticate);
router.get('/deslogar', UserController.logout);

// rotas do CRUD de produtos Lojistas
router.get('/listar', ProductsController.list);
router.post('/registrar', ProductsController.create);

router.post('/alterar/:id', ProductsController.update);

router.get('/excluir/:id', ProductsController.delete);

// rotas de controle de pedidos do lojista
//router.get('/pedidos', OrderController.ordersList);

module.exports = router;