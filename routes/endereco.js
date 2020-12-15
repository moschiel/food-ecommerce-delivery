var express = require('express');
var router = express.Router();
const AddressController = require("../controllers/AddressController")

/* GET users listing. */
router.post('/criar', AddressController.create);

module.exports = router;