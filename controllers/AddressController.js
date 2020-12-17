const { Address } = require("../models");

module.exports = {
  async list(req, res, next) {
    let { id } = req.query;

    //se veio id do endereço, pesquisamos apenas o endereço solicitado
    if(id) {
      let address = await Address.findByPk(id);
   
      if(address.dataValues.id == id) //gambiarra pra verificar erro da query
        res.send(address.dataValues);
      else
        res.send('error');
    }
    else { //senão, pesquisamos todos endereços do usuario
      let result = await Address.findAll({
        where: { deleted: 0 }
      });
  
      let addressList = [];
      result.forEach(element => {
        if(element['dataValues']){
          addressList.push(element['dataValues']);
        }
      });
  
      if(addressList.length > 0) //gambiarra pra verificar erro da query
        res.send(addressList);
      else
        res.send('error');
    }
  },

  async create(req, res, next) {
    let result = await Address.create(req.body);

    if(result.dataValues.id) //gambiarra pra verificar erro da query
      res.send(result.dataValues.id.toString());
    else
      res.send('error');
  },

  async delete(req, res, next) {
    let { id } = req.body;

    if(id) {
      let address = await Address.findByPk(id); //instancia elemento do banco de dados
      if(address.dataValues.id == id) //gambiarra pra verificar erro da query
      {
        address.deleted = 1;                      //altera o estado do elemento instanciado
        address.selected = 0;                     //altera o estado do elemento instanciado
        await address.save();                     //faz commit da alteraçao para o banco de dados
        res.send('OK');
        return;
      }
    }
    res.send('error');
  },

  async select(req, res, next) {
    let { id } = req.body;

    if(id) {
      await Address.update({selected: 0}, { where: {selected: 1} });
      let numAtualizados = await Address.update({selected: 1}, { where: {id: id} });
      
      //gambiarra pra verificar erro da query
      if(numAtualizados[0] >= 1) {
        res.send('OK');
        return;
      }
    }

    res.send('error');
  },

  async edit(req, res, next) {
    let { id, ...address } = req.body;
    
    if(id && address) {
      let numAtualizados = await Address.update(address, { where: {id: id} });
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