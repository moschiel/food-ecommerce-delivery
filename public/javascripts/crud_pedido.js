function addOrder(){
    console.log("addOrder");

    $("#btn-fazer-pedido").prop("disabled", true);
    $("#btn-fazer-pedido").text("Confirmando Pedido, Aguarde...");
    let sacolaLocalStorageKey = "sacolaLocalStorage";
    let storageItemsSacola = localStorage.getItem(sacolaLocalStorageKey);
    
    if(storageItemsSacola != null){
        itemsSacola = JSON.parse(storageItemsSacola);

        data = []
        itemsSacola.forEach(item => {
            data.push({
                id: parseInt(item.id.replace('sacola-item-card-','')),
                amount: item.quantidade
            });
        });

        console.log(data);

        $.ajax({
            type: 'post',
            url: '/pedido/registrar',
            data: {products: data},
            dataType: 'json',
            success: id => {
                id = parseInt(id);
                if(!isNaN(id) && id > 0){
                    console.log("registrado com sucesso pedido ID: " + id);
                    $("#btn-fazer-pedido").text("SUCESSO");
                    alert('Registrado pedido #' + id + ' com sucesso');
                    localStorage.removeItem(sacolaLocalStorageKey);
                    $("#btn-fazer-pedido").prop("disabled", false);
                    window.location.replace("/");
                }else{
                    console.log('Erro: não foi possivel registrar pedido');
                    alert('Erro: não foi possivel registrar pedido');
                    $("#btn-fazer-pedido").prop("disabled", false);
                    $("#btn-fazer-pedido").text("Fazer Pedido");
                }
            }
        });
    }
    else {
        console.log("fail");
    }
  }