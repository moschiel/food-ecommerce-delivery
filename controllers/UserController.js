const bcrypt = require("bcrypt");
const { User, sequelize } = require("../models");

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
  
    let categoriasDeProdutos = await sequelize.query('SELECT DISTINCT category FROM products WHERE deleted = 0',
      { bind: ['active'], type: sequelize.QueryTypes.SELECT }
    )
    
    let categorias = []
    categoriasDeProdutos.map(produto=>{
      categorias.push(
        {
          nome: produto.category,
          items: []
        }
      ) 
    })
    
    let produtos = await sequelize.query('SELECT * FROM products WHERE deleted = 0',
      { bind: ['active'], type: sequelize.QueryTypes.SELECT }
    )

    produtos.map(produto =>{
      categorias.map(categoria=>{
        if ( categoria.nome === produto.category) {
          categoria.items.push(
            {id: produto.id, 
            nome: produto.name, 
            valor: produto.price, 
            imagem: '../images/'+ produto.image
          })
        }
      })
    })

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

    res.render('index', { user: req.session.user, categorias });
  },

  logout(req, res, next) {
    req.session.destroy();
    res.redirect('/');
  }
}