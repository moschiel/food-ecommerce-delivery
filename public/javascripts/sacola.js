//inverte visualizacao da sacola
const toggleSacola = () => {
  if(document.body.querySelector('.sacola').style.display != 'flex'){
    document.body.querySelector('.sacola').style.display = 'flex';
  }else{
    document.body.querySelector('.sacola').style.display = 'none';
  }
}

const lerProdutoDoCard = (card_id) => {
    //seleciona o card
    let cardElement = document.getElementById(card_id);
    //faz a leitura dos dados do Card
    let produto = {
      nome: cardElement.querySelector(".my-card-title").innerHTML,
      img: cardElement.querySelector(".my-card-img-top").src,
      valor: cardElement.querySelector(".my-card-text").innerHTML
    }
    return produto; 
}

const criarHtmlDoProdutoParaSacola = (element_id, produto) => {
  let prodHtml = `
  <li class="sacola-item" id="${element_id}">
    <div class="item-seletor">
      <i class="fas fa-minus" onclick="mudarQuantidadeItemSacola('${element_id}', '${produto.valor}', '-')"></i>
      <span class="item-quantidade">1</span>
      <i class="fas fa-plus" onclick="mudarQuantidadeItemSacola('${element_id}', '${produto.valor}', '+')"></i>
    </div>
    <img src="${produto.img}" alt="">
    <span class="item-nome">${produto.nome}</span>
    <span class="item-preco">R$ <span class="item-valor">${produto.valor}</span></span>
    <i class="fas fa-trash-alt" onclick="removerItemDaSacola('${element_id}')"></i>
  </li>`;

  return prodHtml;
}

//atualiza quantidade de elementos no icone da sacola
//atualiza o preco total na sacola
const calcularTotalSacola = () => {
  let iconeSacola = document.querySelector('.icone-sacola-num');
  let sacola = document.querySelector('.sacola');
  let valoresElement = sacola.querySelectorAll('.item-valor');
  let quantElement = sacola.querySelectorAll('.item-quantidade');

  
  let totalPreco = 0.0;
  let totalQuant = 0;
  for(let i=0; i < valoresElement.length; i++){
    //no preço, substitui virgula por ponto para fazer calculos
    let val = valoresElement[i].innerHTML.replace(',','.');
    totalPreco += Number(val);
    let quant = quantElement[i].innerHTML;
    totalQuant += Number(quant);
  }
  totalPreco = totalPreco.toFixed(2).replace('.',','); //coloca virgula de volta
  sacola.querySelector('.sacola-total-valor').innerHTML = totalPreco; //atualiza preço total

  iconeSacola.innerHTML = totalQuant; //atualizar quantidade total no icone
}

const adicionarNaSacola = (card_id)=>{
  let produto = lerProdutoDoCard(card_id);
  let sacolaItemId = 'sacola-item-' + card_id;
  let sacolaLista = document.getElementById('sacola-lista');

  //evita adicionar itens repetidos
  if(sacolaLista.querySelector('#' + sacolaItemId) == null){
    let produtoHtml = criarHtmlDoProdutoParaSacola(sacolaItemId, produto);  
    sacolaLista.insertAdjacentHTML("beforeend", produtoHtml);
    calcularTotalSacola(); //atualiza total
  }
}

const removerItemDaSacola = (sacola_item_id)=> {
  document.getElementById(sacola_item_id).remove();
  calcularTotalSacola(); //atualiza total
}


const mudarQuantidadeItemSacola = (sacola_item_id, item_valor, operacao) => {
  let itemElement = document.getElementById(sacola_item_id);

  //********* atualiza quantidade ************
  let quantElement = itemElement.querySelector('.item-quantidade');
  let quantidade = Number(quantElement.innerHTML);
  
  if(operacao == '-'){
    if(quantidade > 1) {
      quantidade --;
    }
  }else { //operacao == '+'
    quantidade ++;
  }
  quantElement.innerHTML = quantidade; 
  
  //************* atualiza preço do item *****************
  item_valor = item_valor.replace(',','.'); //para fazer contas, usa-se ponto ao invés de virgula
  let valorElement = itemElement.querySelector('.item-valor');
  item_valor = (item_valor * quantidade).toFixed(2);
  item_valor = item_valor.replace('.',','); //coloca a virgula de volta
  valorElement.innerHTML = item_valor; 

  calcularTotalSacola(); //atualiza total
}
