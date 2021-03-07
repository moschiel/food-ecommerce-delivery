
module.exports = {
  async solicitar(req, res, next) {
    //se existir usuario logado, vai pra pagina de pedido
    if(req.session.user)
    {
      res.render('pedido_solicitar', { user: req.session.user } );
    }
    //senão, força o usuário a logar
    else 
    {
      res.redirect('/usuario/autenticar')
    }
    
  }
}



