const {Product, Sequelize} = require('../models');
  
  module.exports = {
    // funcao de listagem de produtos| com filtro de produtos não excluidos
   async list (req,res,next) {
      
      let products = await Product.findAll({
        where:{
        deleted: 0
      }
    });
     
      res.render('lojista', {products});
    },

    // funcao de criacao de produtos
    async create(req, res, next) {      
      let product = { ...req.body }; 
      await Product.create(product);

      let products = await Product.findAll({
        where:{
        deleted: 0
      }
    });
   
  
      res.render('lojista', {products});
    },
    
    // funcao atualizar produto
    async update(req, res, next) {
      let id = req.params.id;
      let product = await Product.findByPk(id);
      
  
      let { name, stock, price, category, description, image } = req.body;
  
      product.name = name;
      product.stock = stock;
      product.price = price;
      product.category = category;
      product.description = description;
      product.image = image;      
  
      await product.save();
      
      let products = await Product.findAll({
        where:{
        deleted: 0
      }
    });
  
    res.redirect('/lojista/listar');
    },

    // funcao de deletar produtos 
    async delete(req, res, next) {
      let id = req.params.id;
      let product = await Product.findByPk(id);
  
      product.deleted = 1;
  
      await product.save();    
  
      let products = await Product.findAll({
        where:{
        deleted: 0
      }
      });
      
      res.redirect('/lojista/listar');
    },

    // Contollers dos pedidos

    // listagem de pedidos 
    async ordersList (req,res,next) {
      
    
    res.render('pedidos_lojista');  
  }
}  