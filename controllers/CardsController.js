const { Cards } = require("../models");

module.exports = {
  async list(req, res, next) {
    if(req.session.user == undefined){
      return res.send('error');
    }


      let result = await Cards.findAll({
        where: 
        { 
          user_id: req.session.user.id,
          deleted: 0 
        }
      });
  
      let cardsList = [];
      result.forEach(element => {
        if(element['dataValues']){
          cardsList.push(element['dataValues']);
        }
      });

      if(cardsList.length > 0) {//gambiarra pra verificar erro da query
        //se veio id no corpo da requisição, retornamos apenas esse id
        if(req.query.id){
          cardsList.forEach(card => {
            if(card.id == req.query.id){
              res.send(card);
              return;
            }
          })
          res.send('error');
        }
        else{ //senão, retornamos a lista
          res.send(cardsList);
        }
      }
      else {
        res.send('error');
      }
  },

  async create(req, res, next) {
    if(req.session.user == undefined){
      return res.send('error');
    }
    card = req.body;
    //adiciona o parametro 'user_id'
    card.user_id = req.session.user.id; 

    let result = await Cards.create(card);

    if(result.dataValues.user_id == result.user_id) //gambiarra pra verificar erro da query
      res.send(result.dataValues.id.toString());
    else
      res.send('error');
  },

  async delete(req, res, next) {
    if(req.session.user == undefined || req.body.id == undefined){
      return res.send('error');
    }

    let card = await Cards.findByPk(req.body.id); //instancia elemento do banco de dados

    if(card.dataValues.user_id == req.session.user.id) //gambiarra pra verificar erro da query
    {
      card.deleted = 1;                      //altera o estado do elemento instanciado
      card.selected = 0;                     //altera o estado do elemento instanciado
      await card.save();                     //faz commit da alteraçao para o banco de dados
      res.send('OK');
      return;
    }
    else
    {
      return res.send('error');
    }
  },

  async select(req, res, next) {
    if(req.session.user == undefined || req.body.id == undefined){
      return res.send('error');
    }
    
    //limpa selected de todos cards do usuario
    await Cards.update(
      { 
        selected: 0
      }, 
      { 
        where: {
          user_id: req.session.user.id,
        } 
      }
    );

    //ativa selected de acordo com id do card e do usuario
    let numAtualizados = await Cards.update(
      { 
        selected: 1
      }, 
      { 
        where: {
          id: req.body.id,
          user_id: req.session.user.id,
        } 
      }
    );
    
    //gambiarra pra verificar erro da query
    if(numAtualizados[0] >= 1) {
      res.send('OK');
      return;
    }
  }
}