const { Address } = require("../models");

module.exports = {
  async list(req, res, next) {
    if(req.session.user == undefined){
      return res.send('error');
    }

    let result = await Address.findAll({
      where: { 
        user_id: req.session.user.id,
        deleted: 0 
      }
    });

    let addressList = [];
    result.forEach(element => {
      if(element['dataValues']){
        addressList.push(element['dataValues']);
      }
    });

    if(addressList.length > 0) {//gambiarra pra verificar erro da query
      //se veio id no corpo da requisição, retornamos apenas esse id
      if(req.query.id){
        addressList.forEach(address => {
          if(address.id == req.query.id){
            res.send(address);
            return;
          }
        })
        res.send('error');
      }
      else{ //senão, retornamos a lista
        res.send(addressList);
      }
    }
    else {
      res.send('error');
    }
  },

  async create(req, res, next) {
    if(req.session.user == undefined){
      return res.send('error');
    }
    address = req.body;
    //adiciona o parametro 'user_id'
    address.user_id = req.session.user.id; 

    let result = await Address.create(address);

    if(result.dataValues.user_id == address.user_id) //gambiarra pra verificar erro da query
      res.send(result.dataValues.id.toString());
    else
      res.send('error');
  },

  async delete(req, res, next) {
    if(req.session.user == undefined || req.body.id == undefined){
      return res.send('error');
    }

    let address = await Address.findByPk(req.body.id); //instancia elemento do banco de dados
  
    if(address.dataValues.user_id == req.session.user.id) //gambiarra pra verificar erro da query
    {
      address.deleted = 1;                      //altera o estado do elemento instanciado
      address.selected = 0;                     //altera o estado do elemento instanciado
      await address.save();                     //faz commit da alteraçao para o banco de dados
      res.send('OK');
      return;
    }
    else
    {
      return res.send('error');
    }
  },

  async select(req, res, next) {
    if(req.session.user == undefined || req.body.id == undefined){
      return res.send('error');
    }
    
    //limpa selected de todos endereços do usuario
    await Address.update(
      { 
        selected: 0
      }, 
      { 
        where: {
          user_id: req.session.user.id,
        } 
      }
    );

    //ativa selected de acordo com id do endereço e do usuario
    let numAtualizados = await Address.update(
      { 
        selected: 1
      }, 
      { 
        where: {
          id: req.body.id,
          user_id: req.session.user.id,
        } 
      }
    );
    
    //gambiarra pra verificar erro da query
    if(numAtualizados[0] >= 1) {
      res.send('OK');
      return;
    }
  
  },

  async edit(req, res, next) {
    if(req.session.user == undefined || req.body.id == undefined){
      return res.send('error');
    }

    let { id, ...address } = req.body;
    
    if(id && address) {
      let numAtualizados = await Address.update(
        address, 
        { 
          where: {
            id: id,
            user_id: req.session.user.id,
          } 
        }
      );
      //gambiarra pra verificar erro da query
      if(numAtualizados[0] >= 1) {
        res.send('OK');
        return;
      }
    }
    else {
      res.send('error');
    }
  }
}