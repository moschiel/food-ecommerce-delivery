var express = require('express');
var router = express.Router();
const AddressController = require("../controllers/AddressController")

router.get('/listar', AddressController.list);
router.post('/criar', AddressController.create);
router.post('/deletar', AddressController.delete);
router.post('/selecionar', AddressController.select);
router.post('/editar', AddressController.edit);

module.exports = router;