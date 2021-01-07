let lastCreatedCardId = 0;
let elCardsList = $('#cards-list');
let elFormCard = $('#card-form');
let elFormCardInputs = $("#card-form input");
let elCardConfirmBtn = $('#card-form .confirmarBtn');
let elBtnNewCard = $('.btn-new-card');

//componentes para seleção de cartão ficam visíveis
function showCardsList(){
  elBtnNewCard.slideDown();
  elCardsList.slideDown();
  elFormCard.slideUp();
}
//form para prenchimente do cartão fica visível
function showCardForm(){
  elCardConfirmBtn.text('ADICIONAR CARTÃO');
  elCardConfirmBtn.unbind('click'); //remove todos elementos click
  elCardConfirmBtn.click(addCard); //add click event
  
  elBtnNewCard.slideUp();
  elCardsList.slideUp();
  elFormCard.slideDown(); 
}

//leitura dos valores do form
//retorna null se dados invalidos
function readCardFromForm() {
  let card = {
    brand: 'mastercard',
    number: $('#card-form #numCard').val(),
    expirationDate: $('#card-form #expirationDate').val(),
    cvv: $('#card-form #cvv').val(),
    holderName: $('#card-form #holderName').val(),
    holderCpf: $('#card-form #holderCpf').val()
  }

  if(verifyCard(card))
    return card;
  else 
    return null;
}


function verifyCard(card){
  if(checkCardValue(card.brand) &&
    checkCardValue(card.number) &&
    checkCardValue(card.expirationDate) &&
    checkCardValue(card.cvv) &&
    checkCardValue(card.holderName) &&
    checkCardValue(card.holderCpf))
    return true;
  else
    return false;
}

function checkCardValue(value){
  return (value != null && value != undefined && value != "");
}

function clearFormCard(){
  //limpa o formulario
  elFormCardInputs.each((index, element) => {
    element.value = '';
  });
}

function createCardBoxHtml(card){
  //determina classes a serem utilizadas
  let cardClass = "card-box";

  if(card.selected) {
    cardClass += " card-box-is-selected";
  }

  //monta string do cartao, no seguinte formato:
  //BANDEIRA final XXXX
  let cardLine1 = 'xxxx-xxxx-xxxx-' + card.number.substring(card.number.length - 4);
  let cardLine2 = card.brand;

  //monta HTML final
  let cardBoxHTML = `
    <div class="${cardClass}" id="card-box-${card.id}" onclick="selectCard(${card.id}, 'card-box-${card.id}')">
    <div class="select-container">
      <div class='card-type'>
        <i class='card-type-icon'></i>
        <div class='card-type-text'></div>
      </div>
      <div class="text-select">selecionado para pagamento</div>
    </div>
      <div>
        <div class="card-text">
          <div class="card-line card-line-1">${cardLine1}</div>
          <div class="card-line card-line-2">${cardLine2}</div>
        </div>
      </div>
      <div class="card-box-controls">
        <i id="card-remover" class="fas fa-trash-alt" onclick="deleteCard(${card.id}, 'card-box-${card.id}')"></i>
      </div>
    </div>`;

  return cardBoxHTML;
}

function addCard(){
  console.log("addCard");
  let card = readCardFromForm();
  if(card == null)
    return;

  console.log("oi");
  $.ajax({
    type: 'post',
    url: '/cartao/criar',
    data: card,
    dataType: 'text',
    success: id => {
      id = parseInt(id);
      if(isNaN(id) || id < 1){
        console.log('Erro: não foi possivel cadastrar cartao');
      }else{
        console.log("cadastrado com sucesso cartao ID: " + id);
        loadCardsList(); 
        showCardsList();  //mostra os cartoes do usuario
        clearFormCard(); //limpa o formulario
      }
    }
  });
}

function selectCard(card_id, element_id){
  if(document.getElementById(element_id) == null)
    return;
  if($('#'+element_id).hasClass('card-box-is-selected'))
    return;

  console.log('selectCard');

  $.ajax({
    type: 'post',
    url: '/cartao/selecionar',
    data: {id: card_id},
    dataType: 'text',
    success: result => {
      if(result == "error"){
        console.log('não foi possivel selecionar cartão ID: ' + card_id);
      }else{
        console.log('selecionado cartao ID: ' + card_id);
        //retira o estilo css de seleção de todos os endereços
        $('.card-box').each((idx, element) => {
          $(element).removeClass('card-box-is-selected');
        });
        //adiciona estilo css de seleção
        $('#'+element_id).addClass('card-box-is-selected');
      }
    }
  });
}

function deleteCard(card_id, element_id){
  console.log("deleteCard");

  $.ajax({
    type: 'post',
    url: '/cartao/deletar',
    data: {id: card_id},
    dataType: 'text',
    success: result => {
      if(result == "error"){
        console.log('não foi possivel deletar cartao ID: ' + card_id);
      }else{
        console.log('removendo cartao ID: ' + card_id);
        $('#' + element_id).remove();
      }
    }
  });
}

//inicializa lista de  cartões de credito
function loadCardsList() {
  $.ajax({
    type: 'get',
    url: '/cartao/listar',
    success: cardsList => {
      if(cardsList == "error") {
        console.log("não foi possivel carregar lista de cartoes");
      }
      else {
        console.log("carregando lista de cartoes");
          //cria html da lista de cartoes
          let cardBoxesHTML = "";
          cardsList.forEach(card => {
            cardBoxesHTML += createCardBoxHtml(card);
          });
          //insere html
          elCardsList.html(cardBoxesHTML);
      }
    }
  });
}

//ao carregar o script, essa função sera executada
loadCardsList();