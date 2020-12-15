var express = require('express');
var router = express.Router();
const AddressController = require("../controllers/AddressController")

router.get('/listar', AddressController.list);
router.post('/criar', AddressController.create);
router.post('/deletar', AddressController.delete);

module.exports = router;