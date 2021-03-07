const {Product, Sequelize} = require('../models');
  
  module.exports = {
    // funcao de listagem de produtos| com filtro de produtos não excluidos
   async list (req,res,next) {  
     if(req.session.user == undefined)
    {
      res.redirect('/lojista');
      return;
    }    
      let products = await Product.findAll({
        where:{
        deleted: 0
      }
      
    });
     
      res.render('lojista', {products, user: req.session.user});
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
  
    res.redirect('/lojista/listar');
    },

    // funcao de deletar produtos 
    async delete(req, res, next) {
      let id = req.params.id;
      let product = await Product.findByPk(id);
  
      product.deleted = 1;
  
      await product.save();    
  
      res.redirect('/lojista/listar');
    },

  }