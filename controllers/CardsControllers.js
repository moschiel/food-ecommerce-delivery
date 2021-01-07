const { Cards } = require("../models");

module.exports = {
  async list(req, res, next) {
    let { id } = req.query;

    //se veio id do cartao, pesquisamos apenas o cartão solicitado
    if(id) {
      let card = await Cards.findByPk(id);
   
      if(card.dataValues.id == id) //gambiarra pra verificar erro da query
        res.send(card.dataValues);
      else
        res.send('error');
    }
    else { //senão, pesquisamos todos cartões do usuario
      let result = await Cards.findAll({
        where: { deleted: 0 }
      });
  
      let cardsList = [];
      result.forEach(element => {
        if(element['dataValues']){
          cardsList.push(element['dataValues']);
        }
      });
  
      if(cardsList.length > 0) //gambiarra pra verificar erro da query
        res.send(cardsList);
      else
        res.send('error');
    }
  },

  async create(req, res, next) {
    let result = await Cards.create(req.body);

    if(result.dataValues.id) //gambiarra pra verificar erro da query
      res.send(result.dataValues.id.toString());
    else
      res.send('error');
  },

  async delete(req, res, next) {
    let { id } = req.body;

    if(id) {
      let card = await Cards.findByPk(id); //instancia elemento do banco de dados
      if(card.dataValues.id == id) //gambiarra pra verificar erro da query
      {
        card.deleted = 1;                      //altera o estado do elemento instanciado
        card.selected = 0;                     //altera o estado do elemento instanciado
        await card.save();                     //faz commit da alteraçao para o banco de dados
        res.send('OK');
        return;
      }
    }
    res.send('error');
  },

  async select(req, res, next) {
    let { id } = req.body;

    if(id) {
      await Cards.update({selected: 0}, { where: {selected: 1} });
      let numAtualizados = await Cards.update({selected: 1}, { where: {id: id} });
      
      //gambiarra pra verificar erro da query
      if(numAtualizados[0] >= 1) {
        res.send('OK');
        return;
      }
    }

    res.send('error');
  }
}