const { sequelize } = require('../models')



module.exports = {
  async index (req,res) {

    console.log("Username: ",req.session.user);

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

    
    res.render('index', { title: 'Ecommerce', categorias });
  }
} 