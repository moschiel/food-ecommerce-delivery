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

    // funcao de criacao de produtos *corrigir redirecionamento, esta dando erro na pagina apos cadastar produto
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

    // falta funcao de alterar e atualizar produtos

    // funcao de deletar produtos *corrigir redirecionamento, erro na pagina apos excluir o produto
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

    // listagem de pedidos 
    async ordersList (req,res,next) {
      
    
    res.render('pedidos_lojista');  
  }
}  