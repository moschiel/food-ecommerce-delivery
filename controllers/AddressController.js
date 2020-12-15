const { Address } = require("../models")

module.exports = {
  async findAll(req, res, next) {
    let addresses = await Address.findAll();
    return addresses;
  },
  async create(req, res, next) {
    await Address.create({
      street: "Rua teste",
      number: "123"
    });
    return;
  }
}