const { Address } = require("../models");

module.exports = {
  async list(req, res, next) {
    let result = await Address.findAll({
      where: {
        deleted: 0
      }
    });

    let addressList = [];
    result.forEach(element => {
      if(element['dataValues']){
        addressList.push(element['dataValues']);
      }
    });

    if(addressList.length > 0)
      res.send(addressList);
    else
      res.send('error');
  },

  async create(req, res, next) {
    let result = await Address.create(req.body);

    if(result.dataValues.id)
      res.send(result.dataValues.id.toString());
    else
      res.send('error');
  },

  async delete(req, res, next) {
    let { id } = req.body;

    if(id) {
      let address = await Address.findByPk(id); //instancia elemento do banco de dados
      address.deleted = 1;                      //altera o estado do elemento instanciado
      await address.save();                     //faz commit da alteraçao para o banco de dados
      res.send('OK');
    }
    else {
      res.send('error');
    }
  }
}