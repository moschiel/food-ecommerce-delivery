var express = require('express');
var router = express.Router();
const UserController = require("../controllers/UserController");

router.get('/registrar', UserController.create);
router.post('/registrar', UserController.save);

router.get('/autenticar', UserController.login);
router.post('/autenticar', UserController.authenticate);

router.get('/deslogar', UserController.logout);

module.exports = router;
