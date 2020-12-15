const { Address } = require("../models")

module.exports = {
  async findAll(req, res, next) {
    let result = await Address.findAll();
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
  }
}