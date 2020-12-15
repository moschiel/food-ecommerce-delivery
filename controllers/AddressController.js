const { Address } = require("../models")

module.exports = {
  async findAll(req, res, next) {
    let addresses = await Address.findAll();
    return addresses;
  },
  async create(req, res, next) {
    const result = await Address.create(req.body);

    if(result.dataValues.id)
      res.send(result.dataValues.id.toString());
    else
      res.send('error');
  }
}