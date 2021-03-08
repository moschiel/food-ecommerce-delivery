var express = require('express');
var router = express.Router();
const ProductsController = require("../controllers/ProductsShopkeeperController");
const UserController = require('../controllers/UserShopkeeperController');
const PedidoController = require('../controllers/PedidoController');

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
router.get('/pedidos', PedidoController.list);
router.get('/pedidos/alterar/:id', PedidoController.update);
router.get('/pedidos/cancelar/:id', PedidoController.delete);

module.exports = router;