const { Product, Address, Cards, Order, ProdutcsOrdered} = require("../models");

module.exports = {
  async solicitar(req, res, next) {
    //se existir usuario logado, vai pra pagina de pedido
    if(req.session.user)
    {
      res.render('pedido_solicitar', { user: req.session.user } );
    }
    //senão, força o usuário a logar
    else 
    {
      res.redirect('/usuario/autenticar');
    }
  },

  async registrar(req, res, next) {
    //se existir usuario logado, vai pra pagina de pedido

    if(req.session.user == undefined)
    {
      res.redirect('/usuario/autenticar')
      return;
    }

    console.log("REGISTRANDO PEDIDO")
    products = JSON.parse(JSON.stringify(req.body)) //gambiarra pra remover '[Object: null prototype]'
    console.log(products)

    if(products == undefined){
      res.send('error');
      return;
    }

    //mega gambiarra, json ta num formato zoado, ai faz isso pra coletar tudo
    prod_ids = []
    prod_amounts = []
    prod_names = []
    prod_prices = []
    for (let index = 0; index >=0 ; index++) {
      id = products['products[' + index + '][id]'];
      amount =  products['products[' + index + '][amount]'];
      if(id && amount){
        prod_ids.push(id);
        prod_amounts.push(amount);
        prod_names.push(0); //só pra deixar o array do mesmo tamnho dos outros
        prod_prices.push(0);  //só pra deixar o array do mesmo tamnho dos outros
      }
      else 
      {
        break;
      }
    }

    if(prod_ids.length == 0){
      res.send('error');
      return;
    }
      
    //seleciona produtos no banco de dados
    let PRODUTOS = await Product.findAll({
      where: { 
        id: prod_ids,
        deleted: 0 
      }
    });
    
    //calcula preço total
    total = 0
    PRODUTOS.forEach((element) => {
      prod_ids.forEach((id, index) => {
        if(element.dataValues.id == id){
          total += element.dataValues.price * prod_amounts[index];
          prod_names[index] = element.dataValues.name;
          prod_prices[index] = element.dataValues.price;
          return //return do inner forEach loop apenas, como se fosse um break
        }
      });
    });

    if(total == 0){
      res.send('error');
      return;
    }

    console.log("TOTAL: R$ ", total)

    //seleciona address selecionado no banco para envio
    let ADDRESS = await Address.findOne({
      where: { 
        user_id:req.session.user.id,
        selected: 1,
        deleted: 0, 
      }
    });
    if(ADDRESS === null) {
      res.send('error');
      return;
    }
    console.log("ADDRESS: ", ADDRESS.dataValues.id);

    //seleciona card selecionado no banco para envio
    let CARD = await Cards.findOne({
      where: { 
        user_id:req.session.user.id,
        selected: 1,
        deleted: 0, 
      }
    });
    if(CARD === null) {
      res.send('error');
      return;
    }
    console.log("CARD: ", CARD.dataValues.id);

    //insere pedido na tabela pedido(order)
    order = {
      user_id: req.session.user.id,
      address_id: ADDRESS.dataValues.id,
      card_id: CARD.dataValues.id,
      total: total,
      status: "ABERTO",
    }
    let result = await Order.create(order);
    if(result.dataValues.id == undefined){
      res.send('error');
      return;
    }
    order_id = result.dataValues.id;

    //insere produtos na tabela de produtos_solicitados (products_ordered)
    products_ordered = [];
    prod_ids.forEach((id, index) => {
        products_ordered.push({
          order_id: order_id,
          product_id: id,
          amount: prod_amounts[index],
          name: prod_names[index],
          price: prod_prices[index]
        })
        return //return do inner forEach loop apenas, como se fosse um break
    });
    result = await ProdutcsOrdered.bulkCreate(products_ordered);
    if(result === null){
      res.send('error');
      return;
    }

    res.send(order_id.toString());
      
  }
}



