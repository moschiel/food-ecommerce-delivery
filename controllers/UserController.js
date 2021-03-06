const bcrypt = require("bcrypt");
const { User, sequelize } = require("../models");
const HomeController = require("../controllers/HomeController")

module.exports = {
  create(req, res, next) {
    res.render('create-user');
  },

  async save(req, res, next) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    let user = { ...req.body }
    
    await User.create(user);

    res.render('create-user', { added: true });
  },

  login(req, res, next) {
    res.render('login');
  },

  async authenticate(req, res, next) {
    let { email, password } = req.body;
    let user = await User.findOne({ where: { email } });

    if(!user){
      return res.render('login', { notFound: true });
    }

    if(!bcrypt.compareSync(password, user.password)){
      return res.render('login', { notFound: true });
    }

    // removendo a propriedade password para nao criar sessao
    // contendo a senha do usuario logado
    delete user.password;

    req.session.user = user;
    
    //res.render('index', { user: req.session.user, categorias });
    //HomeController.index(req, res);
    res.redirect('/')
  },

  logout(req, res, next) {
    req.session.destroy();
    res.redirect('/');
  }
}