const { Product, Address, Cards, Order, ProdutcsOrdered, User, sequelize} = require("../models");

module.exports = {
  // função que lista os pedidos
  async list (req, res, next){
    // redireciona usuario sem login
    if(req.session.user == undefined)
    {
      res.redirect('/lojista');
      return;
    }    
    
    pedidoEmPreparoJSON = await MontaPedidos('PREPARANDO');
    pedidoAcaminhoJSON = await MontaPedidos('A CAMINHO');
    pedidoEntregueJSON = await MontaPedidos('ENTREGUE');


    res.render('pedidos_lojista', {pedidoEmPreparoJSON, pedidoAcaminhoJSON, pedidoEntregueJSON, user: req.session.user});    
  },

  // função atualizar estatos do pedido
  async update(req, res, next) {
    let id = req.params.id;
    let order = await Order.findByPk(id);  

    // altera o status do pedido para entregue
    if (order.status == 'A CAMINHO' ){      
      order.status= 'ENTREGUE';
      await order.save();

      res.redirect('/lojista/pedidos');
    }  
    // altera o status do pedido para a caminho
    if (order.status == 'PREPARANDO' ){      
      order.status= 'A CAMINHO';
      await order.save();

      res.redirect('/lojista/pedidos');
    }
  },

  // funcao de cancelar pedidos 
  async delete(req, res, next) {
    let id = req.params.id;
    let order = await Order.findByPk(id);

    order.deleted = 1;

    await order.save();    

    res.redirect('/lojista/pedidos');
  },

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
      status: "PREPARANDO",
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


async function MontaPedidos(ORDER_STATUS){ 
  let ORDERS_OPEN = await Order.findAll({
    where:{
      deleted: 0,
      status: ORDER_STATUS
    }
  })

  if(ORDERS_OPEN == null) {
    console.log('Erro na consulta dos pedidos');
    return;
  }

  //agrupa ids dos users e seus endereços
  users_ids = [];
  address_ids = [];
  orders_ids = [];
  ORDERS_OPEN.forEach((element) => {
    users_ids.push(element.dataValues.user_id);
    address_ids.push(element.dataValues.address_id);
    orders_ids.push(element.dataValues.id)
  });

  //pesquisa usuarios 'PREPARANDO' de acordo com os users_ids,
  let USERS_OPEN = await User.findAll({
    where:{
      //deleted: 0,
      id: users_ids
    }
  })
  if(USERS_OPEN == null) {
    console.log('Erro na consulta dos Usuarios');
    return;
  }
  //garante que fica na mesma ordem do array
  USERS_OPEN_IN_ORDER = users_ids.map( user_id => { return USERS_OPEN.find( user => { return user.dataValues.id == user_id}) });
  
  //pesquisa produtos 'PREPARANDO' de acordo com order_id
  let ADDRESS_OPEN = await Address.findAll({
    where:{
      deleted: 0,
      id: address_ids
    }
  })
  if(ADDRESS_OPEN == null) {
    console.log('Erro na consulta dos Endereços');
    return;
  }
  //garante que fica na mesma ordem do array
  ADDRESS_OPEN_IN_ORDER = address_ids.map( addr_id => { return ADDRESS_OPEN.find( addr => { return addr.dataValues.id == addr_id}) });

  //pesquisa adresses 'PREPARANDO' de acordo com os orders_ids
  let PRODUCTS_ORDERED_OPEN = await ProdutcsOrdered.findAll({
    where:{
      deleted: 0,
      order_id: orders_ids
    }
  })

  if(PRODUCTS_ORDERED_OPEN == null) {
    console.log('Erro na consulta dos Produtos do Pedido');
    return;
  }

  //console.log('USER_IDS:', users_ids)
  //console.log('USERS_SQL', USERS_OPEN_IN_ORDER);
  //console.log('ADDRESS_IDS:', address_ids)
  //console.log('ADDRESS_SQL', ADDRESS_OPEN_IN_ORDER);

  let ordersOpenJSON = []
  ORDERS_OPEN.forEach((pedidoAtual, index) => {
    let mountAddress = ADDRESS_OPEN_IN_ORDER[index].dataValues.street + ", ";
    mountAddress += ADDRESS_OPEN_IN_ORDER[index].dataValues.number + ", ";
    mountAddress += ADDRESS_OPEN_IN_ORDER[index].dataValues.complement + ", ";
    mountAddress += ADDRESS_OPEN_IN_ORDER[index].dataValues.city + ", ";
    mountAddress += ADDRESS_OPEN_IN_ORDER[index].dataValues.postal_code;

    //monta array de pedidos que tem o mesmo order_id do pedido atual
    let mountProductsOrdered = []
    PRODUCTS_ORDERED_OPEN.filter( 
      prodOrderedAtual => {
        if(prodOrderedAtual.dataValues.order_id == pedidoAtual.dataValues.id){
          mountProductsOrdered.push( {
            product_id: prodOrderedAtual.dataValues.product_id,
            name: prodOrderedAtual.dataValues.name,
            amount: prodOrderedAtual.dataValues.amount,
            price: prodOrderedAtual.dataValues.price
          })
        }
      }
    );
    //console.log("PRODUTOS: ", mountProductsOrdered)

    //inclui pedido no JSON
    ordersOpenJSON.push({
      id: pedidoAtual.dataValues.id,
      name: USERS_OPEN_IN_ORDER[index].dataValues.name,
      total: pedidoAtual.dataValues.total,
      time: pedidoAtual.dataValues.createdAt,
      address: mountAddress,
      productsOrdered: mountProductsOrdered,
    })
  }); //END ORDERS_OPEN.forEach

  return ordersOpenJSON;
}