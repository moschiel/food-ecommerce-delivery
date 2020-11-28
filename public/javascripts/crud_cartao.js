let lastCreatedCardId = 0;
let cardsList = [];
let cardsLocalStorageKey = 'cardsLocalStorage';
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
    id:null,
    select: false,
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
  if(checkCardValue(card.brand) ||
    checkCardValue(card.number) ||
    checkCardValue(card.expirationDate) ||
    checkCardValue(card.cvv) ||
    checkCardValue(card.holderName) ||
    checkCardValue(card.holderCpf))
    return false;
  else
    return true;
}

function checkCardValue(value){
  return (value == null || value == undefined || value == "");
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

  if(card.select) {
    cardClass += " card-box-is-selected";
  }

  //monta string do cartao, no seguinte formato:
  //BANDEIRA final XXXX
  let cardLine1 = 'xxxx-xxxx-xxxx-' + card.number.substring(card.number.length - 4);
  let cardLine2 = card.brand;

  //monta HTML final
  let cardBoxHTML = `
    <div class="${cardClass}" id="card-box-${card.id}" onclick="selectCard(${card.id}, 'card-box-${card.id}')">
      <div>
        <div class="select-container">
          <div class='card-type'>
            <i class='card-type-icon'></i>
            <div class='card-type-text'></div>
          </div>
          <div class="text-select">selecionado para pagamento</div>
        </div>
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

  //retira a selecao de todos os cards, pois o novo sera selecionado
  cardsList.forEach(card => { card.select = false; });
  $('.card-box').each((idx, element) => {
    $(element).removeClass('card-box-is-selected');
  });

  lastCreatedCardId++;
  localStorage.setItem('lastCreatedCardId', lastCreatedCardId);

  card.id = lastCreatedCardId;
  card.select = true;
  let cardBoxHTML = createCardBoxHtml(card);

  cardsList.push(card);
  localStorage.setItem(cardsLocalStorageKey, JSON.stringify(cardsList));
  elCardsList.append(cardBoxHTML);

  showCardsList();
  //limpa o formulario
  clearFormCard();
}

function selectCard(card_id, element_id){
  console.log('selectCard');
  if(document.getElementById(element_id) == null)
    return;
  
  cardsList.forEach(card => { card.select = false; });
  $('.card-box').each((idx, element) => {
    $(element).removeClass('card-box-is-selected');
  });
  
  let cardIndex = cardsList.findIndex(card => card.id == card_id);
  cardsList[cardIndex].select = true;
  localStorage.setItem(cardsLocalStorageKey, JSON.stringify(cardsList));
  $('#'+element_id).addClass('card-box-is-selected');
}

function deleteCard(card_id, element_id){
  console.log("deleteCard")
  cardsList = cardsList.filter(card => card.id != card_id);
  localStorage.setItem(cardsLocalStorageKey, JSON.stringify(cardsList));
  $('#'+element_id).remove();
  
  if(cardsList.length == 0)
    showCardForm();
}

//inicializa lista de  cartões de credito
function loadCardsList() {
    //leitura do ultimo card ID criado
    lastCreatedCardId = Number(localStorage.getItem('lastCreatedCardId'));
    if(lastCreatedCardId == null)
      lastCreatedCardId = 0;

    //carrega card list
    let storageCardsList = localStorage.getItem(cardsLocalStorageKey);
    if(storageCardsList != null){
      cardsList = JSON.parse(storageCardsList);

      if(cardsList.length == 0)
        return false;

      //cria html da lista de cartões
      let cardBoxesHTML = "";
      cardsList.forEach(card => {
        cardBoxesHTML += createCardBoxHtml(card);
      });

      //insere html
      elCardsList.html(cardBoxesHTML);
      return true;
    }
    else 
    {
      return false;
    }
}

function initializeCreditCardCRUD() {
  loadCardsList();
}

//ao carregar o script, essa função sera executada
initializeCreditCardCRUD();