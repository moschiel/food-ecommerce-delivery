
const AddressController = require("./AddressController")

module.exports = {
  async solicitar(req, res, next) {
    //let addressList = await AddressController.findAll();
    //console.log(addressList[0]);
    res.render('pedido_solicitar');
  }
}



