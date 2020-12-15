
const AddressController = require("./AddressController")

module.exports = {
  async solicitar(req, res, next) {
    // await AddressController.create();
    // let addressList = await AddressController.findAll();
    // console.log(addressList);
    res.render('pedido_solicitar');
  }
}



