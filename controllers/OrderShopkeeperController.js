const {Order, Sequelize} = require('../models');

module.exports = {
    // Controles dos pedidos

    // listagem de pedidos 
    async ordersList (req,res,next) {
      let order = await Order.findAll({
        where:{
        deleted: 0
      }
    });

        res.render('pedidos_lojista',{order, user: req.session.user});  
      }  
    
}  