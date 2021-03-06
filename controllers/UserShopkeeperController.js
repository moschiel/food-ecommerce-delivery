const {Shopkeeper, Product, Sequelize} = require('../models');
const bcrypt = require("bcrypt");

module.exports = {
  // controles de acesso lojistas
  userCreate(req, res, next) {  
    res.render('cadastro_lojista');
  },
  
  async save(req, res, next) {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    let user = { ...req.body };

    await Shopkeeper.create(user); 
    
    res.render('cadastro_lojista', { added: true });
  },

  async login (req,res,next) {
          
    res.render('login_lojista');  
  },

  // funcao de autenticacao do lojistas
  async authenticate(req, res, next) {
    let products = await Product.findAll({
      where:{
      deleted: 0
    }
  });

    let { email, password } = req.body;
    let user = await Shopkeeper.findOne({ where: { email } });
    
    if(!user){
      return res.render('login_lojista', { notFound: true });
    }

    if(!bcrypt.compareSync(password, user.password)){
      return res.render('login_lojista', { notFound: true });
    }

    delete user.password;

    req.session.user = user;

    res.render('lojista', { user: req.session.user, products});
  },

  logout(req, res, next) {
    req.session.destroy();
    res.redirect('/lojista');
  }

}