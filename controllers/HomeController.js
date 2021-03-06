const { sequelize } = require('../models')



module.exports = {
  async index (req,res) {

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

    if(req.session.user) {
      console.log("User: ",req.session.user.email);
      res.render('index', { title: 'Ecommerce', categorias, user: req.session.user });
      
    }else {
      res.render('index', { title: 'Ecommerce', categorias})
    }
  }
} 