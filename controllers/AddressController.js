const { Address } = require("../models")

module.exports = {
  async findAll(req, res, next) {
    let addresses = await Address.findAll();
    return addresses;
  }
}