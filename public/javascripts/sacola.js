let itemsSacola = [];
let sacolaSessionKey = "sacolaSessionStorage";

// inicializa sacola com items armazenados na sessionStorage
function inicializaSacola() {
  let sessionItemsSacola = sessionStorage.getItem(sacolaSessionKey);
  if(sessionItemsSacola != null) {
    itemsSacola = JSON.parse(sessionItemsSacola);

    let itemsHtml = "";
    itemsSacola.forEach(item => {
      itemsHtml += criarHtmlDoItemParaSacola(item);
    });

    let elSacolaLista = document.getElementById('sacola-lista');
    elSacolaLista.insertAdjacentHTML("beforeend", itemsHtml); //adiciona items no HTML
    
    atualizarTotalSacola();
  }
}

//numero para moeda real
function numberToReal(num) {
  return num.toFixed(2).replace('.', ',');
}
//moeda real para numero
function realToNumber (real) {
  return Number(real.toString().replace(',', '.'));
}


//inverte visualizacao da sacola
function toggleSacola() {
  let elSacola = document.body.querySelector('.sacola');
  if(elSacola.style.display != 'flex'){
    elSacola.style.display = 'flex';
  }else{
    elSacola.style.display = 'none';
  }
}


function criarItemSacolaComValoresDoCard(card_id) {
    //seleciona o card
    let elCard = document.getElementById(card_id);
    //faz a leitura dos dados do Card
    let item = {
      id: "sacola-item-" + card_id,
      nome: elCard.querySelector(".my-card-title").innerHTML,
      valor: realToNumber(elCard.querySelector(".my-card-text").innerHTML),
      img: elCard.querySelector(".my-card-img-top").src,
      quantidade: 1
    }
    return item; 
}

function criarHtmlDoItemParaSacola(item) {
  let itemHtml = `
  <li class="sacola-item" id="${item.id}">
    <div class="item-seletor">
      <i class="fas fa-minus" onclick="mudarQuantidadeItemSacola('${item.id}', '-')"></i>
      <span class="item-quantidade">${item.quantidade}</span>
      <i class="fas fa-plus" onclick="mudarQuantidadeItemSacola('${item.id}', '+')"></i>
    </div>
    <img src="${item.img}" alt="">
    <span class="item-nome">${item.nome}</span>
    <span class="item-preco">R$ <span class="item-valor">${numberToReal(item.valor)}</span></span>
    <i class="fas fa-trash-alt" onclick="removerItemDaSacola('${item.id}')"></i>
  </li>`;

  return itemHtml;
}


//atualiza o preco total na sacola
//atualiza quantidade total de elementos no icone da sacola
//atualiza sessionStorage da sacola
function atualizarTotalSacola() {
  let elIconeSacola = document.querySelector('.icone-sacola-num');
  let elSacola = document.body.querySelector('.sacola');
  let elValores = elSacola.querySelectorAll('.item-valor');
  let elPreco = elSacola.querySelector('.sacola-total-valor');
  let elQuant = elSacola.querySelectorAll('.item-quantidade');
  
  let totalPreco = 0.0;
  let totalQuant = 0;
  for(let i=0; i < elValores.length; i++){
    //soma preço
    totalPreco += realToNumber(elValores[i].innerHTML);
    //soma quantidade
    totalQuant += Number(elQuant[i].innerHTML);
  }
  //atualiza preço total
  elPreco.innerHTML = numberToReal(totalPreco); 
  //aqualiza quantidade total
  if(elIconeSacola != null) {
    elIconeSacola.innerHTML = totalQuant;
  }
  //atualiza sessionStorage da sacola
  // console.log(itemsSacola);
  sessionStorage.setItem(sacolaSessionKey, JSON.stringify(itemsSacola));
}

function adicionarNaSacola(card_id) {
  let item = criarItemSacolaComValoresDoCard(card_id);
  let elSacolaLista = document.getElementById('sacola-lista');

  //evita adicionar itens repetidos
  if(elSacolaLista.querySelector('#' + item.id) == null){
    let itemHtml = criarHtmlDoItemParaSacola(item);
    elSacolaLista.insertAdjacentHTML("beforeend", itemHtml); //adiciona no HTML
    itemsSacola.push(item); //adiciona no array
    atualizarTotalSacola(); //atualiza total
  }
}

function removerItemDaSacola(sacola_item_id) {
  document.getElementById(sacola_item_id).remove(); //remove do HTML
  itemsSacola = itemsSacola.filter(item => item.id != sacola_item_id); //remove do Array
  atualizarTotalSacola(); //atualiza total
}


function mudarQuantidadeItemSacola(sacola_item_id, operacao) {
  let elItem = document.getElementById(sacola_item_id); //referencia HTML
  let itemIndex = itemsSacola.findIndex(item => item.id == sacola_item_id); //referencia array

  //********* atualizando quantidade do item ************
  let elQuant = elItem.querySelector('.item-quantidade');
  let quantidade = itemsSacola[itemIndex].quantidade;
  
  if(operacao == '-'){
    if(quantidade > 1) {
      quantidade --;
    }
  }else { //operacao == '+'
    quantidade ++;
  }
  elQuant.innerHTML = quantidade; //atualiza no HTML
  itemsSacola[itemIndex].quantidade = quantidade; //atualiza no Array

  
  //************* atualiza preço do item no HTML *****************
  let elValor = elItem.querySelector('.item-valor');
  let precoUnitario = itemsSacola[itemIndex].valor;
  elValor.innerHTML = numberToReal(precoUnitario * quantidade); 

  atualizarTotalSacola(); //atualiza total
}

inicializaSacola();
