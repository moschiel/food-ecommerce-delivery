const { Address } = require("../models");

module.exports = {
  async list(req, res, next) {
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
      address.deleted = 1;                      //altera o estado do elemento instanciado
      address.selected = 0;                     //altera o estado do elemento instanciado
      await address.save();                     //faz commit da alteraçao para o banco de dados
      //PRECISA IMPLEMENTAR verifição de erro da query antes de enviar OK
      res.send('OK');
    }
    else {
      res.send('error');
    }
  },

  async select(req, res, next) {
    let { id } = req.body;

    if(id) {
      await Address.update({selected: 0}, { where: {selected: 1} });
      await Address.update({selected: 1}, { where: {id: id} });
      //PRECISA IMPLEMENTAR verifição de erro da query antes de enviar OK
      res.send('OK');
    }
    else {
      res.send('error');
    }
  }
}