// This sample uses the Autocomplete widget to help the user select a
// place, then it retrieves the address components associated with that
// place, and then it populates the form fields with those details.
// This sample requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let placeSearch;
let autocomplete;
//componentes da 'Local API' do Google
const localComponentsAPI = {
  route: "long_name",
  street_number: "short_name",
  sublocality_level_1: "short_name",
  administrative_area_level_2: "long_name",
  administrative_area_level_1: "short_name",
  postal_code: "short_name",
};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("autocomplete"),
    { types: ["geocode"] }
  );
  // Avoid paying for data that you don't need by restricting the set of
  // place fields that are returned to just the address components.
  autocomplete.setFields(["address_component"]);
  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  autocomplete.addListener("place_changed", showAddressForm);
}

//preenche o formulario com os dados de endereço
function fillInAddress(address) {
  //limpa o formulario
  clearFormAddress();

  //se recebeu endereço como parametro, preenche com os dados recebidos
  if(address) {
    elFormAddrInputs.each((index, element) => {
      if($(element).attr('type') == 'radio' && $(element).attr('value') == address.type){
        $(element).prop('checked', true);
      }
      else if(address[element.id.replace('addr_','')]){
        element.value = address[element.id.replace('addr_','')];
      }
    });
    
  }
  else { //se não, provalemnte é a localAPI, então preenche com os dados da 'Local API'
    // Get the place details from the autocomplete object.
    const place = autocomplete.getPlace();
  
    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    for (const component of place.address_components) {
      const addressType = component.types[0];

      if(addressType == "route")
        $("#addr_street").val(component[localComponentsAPI[addressType]])
      else if(addressType == "street_number")
        $("#addr_number").val(component[localComponentsAPI[addressType]])
      else if(addressType == "sublocality_level_1")
        $("#addr_district").val(component[localComponentsAPI[addressType]])
      else if(addressType == "administrative_area_level_2")
        $("#addr_city").val(component[localComponentsAPI[addressType]])
      else if(addressType == "administrative_area_level_1")
        $("#addr_state").val(component[localComponentsAPI[addressType]])
      else if(addressType == "postal_code")
        $("#addr_postal_code").val(component[localComponentsAPI[addressType]])
    }
  }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      const circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy,
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}


//************ MINHAS FUNCOES *****************
let lastCreatedAddressId = 0;
let addressList = [];
let addressLocalStorageKey = 'addressLocalStorage';
let elLocationField = $('#locationField');
let elAddressList = $('#address-list');
let elFormAddress = $('#address-form');
let elFormAddrInputs = $("#address-form input");
let elConfirmButton = $('#address-form .confirmarBtn');

//componentes para seleção de endereço ficam visíveis
function showAddressList(){
  $('#locationField > input').val(""); //limpa pesquisa
  elAddressList.slideDown();
  elLocationField.slideDown();
  elFormAddress.slideUp();
}
//form para prenchimente de endereço fica visível
function showAddressForm(addr_id){
  if(addr_id) {
    elConfirmButton.text('ATUALIZAR');
    elConfirmButton.unbind('click'); //remove todos eventos click
    elConfirmButton.click(()=>( editAddress(addr_id))); //add click event
    let address = addressList.find((item) => item.id == addr_id);
    fillInAddress(address);
  }
  else {
    elConfirmButton.text('CADASTRAR');
    elConfirmButton.unbind('click'); //remove todos eventos click
    elConfirmButton.click(addAddress); //add click event
    fillInAddress();
  }

  elAddressList.slideUp();
  elLocationField.slideUp();
  elFormAddress.slideDown(); 
}

//leitura dos valores do form
//retorna null se dados invalidos
function readAddressFromForm() {
  let address = {
    id:null,
    selected: 0,
    type: $('input[name=address_type]:checked').val(), 
    street: $('#addr_street').val(),
    number: $('#addr_number').val(),
    complement: $('#addr_complement').val(),
    district: $('#addr_district').val(),
    city: $('#addr_city').val(),
    state: $('#addr_state').val(),
    postal_code: $('#addr_postal_code').val(),
  }
 
  if(verifyAddress(address)) 
    return address;
  else 
    return null;
}

function verifyAddress(address){
  if(checkValue(address.street) &&
    checkValue(address.number) &&
    checkValue(address.district) &&
    checkValue(address.city) &&
    checkValue(address.state) &&
    checkValue(address.postal_code))
    return true;
  else
    return false;
}

function checkValue(value){
  return (value != null && value != undefined && value != "");
}

function clearFormAddress(){
  //limpa o formulario
  elFormAddrInputs.each((index, element) => {
    if($(element).attr('type') == 'radio'){
      $(element).prop('checked', false);
    }else {
      element.value = '';
    }
  });
}

function createAddressBoxHtml(addr){
  //determina classes a serem utilizadas
  let addressClass = "address-box";
  if(addr.type == 'home'){
    addressClass += " address-box-has-type address-box-type-home";
  }
  else if(addr.type == 'work'){
    addressClass += " address-box-has-type address-box-type-work";
  }
  if(addr.selected) {
    addressClass += " address-box-is-selected";
  }

  //monta string de endereço, no seguinte formato:
  //RUA, NUMERO, COMPLEMENTO
  //BAIRRO, CIDADE/UF, CEP
  let addressLine1 = `${addr.street}, ${addr.number}`;
  if(addr.complement) {
    addressLine1 += `, ${addr.complement}`;
  }
  let addressLine2 = `${addr.district}, ${addr.city}/${addr.state}, ${addr.postal_code}`;

  //monta HTML final
  let addressBoxHTML = `
    <div class="${addressClass}" id="address-box-${addr.id}" onclick="selectAddress(${addr.id}, 'address-box-${addr.id}')">
    <div class="select-container">
      <div class='address-type'>
        <i class='address-type-icon'></i>
        <div class='address-type-text'></div>
      </div>
      <div class="text-select">selecionado para entrega</div>
    </div>
      <div>
        <div class="address-text">
          <div class="address-line address-line-1">${addressLine1}</div>
          <div class="address-line address-line-2">${addressLine2}</div>
        </div>
      </div>
      <div class="address-box-controls">
        <i id="address-editar" class="fas fa-pen" onclick="showAddressForm(${addr.id})"></i>
        <i id="address-remover" class="fas fa-trash-alt" onclick="deleteAddress(${addr.id}, 'address-box-${addr.id}')"></i>
      </div>
    </div>`;

  return addressBoxHTML;
}

function addAddress(){
  console.log("addAddress");
  let address = readAddressFromForm();
  if(address == null)
    return;

  let {id, ...data} = address;

  $.ajax({
    type: 'post',
    url: '/endereco/criar',
    data: data,
    dataType: 'text',
    success: id => {
      id = parseInt(id);
      if(isNaN(id) || id < 1){
        console.log('Erro: não foi possivel cadastrar endereço');
      }else{
        console.log("cadastrado com sucesso endereço ID: " + id);
        address.id = id;  //carrega id cadastrado no banco de dados
        let addressBoxHTML = createAddressBoxHtml(address); //cria HTML do endereço
        elAddressList.append(addressBoxHTML); //insere HTML na pagina
        showAddressList();  //mostra os endereços do usuario
        clearFormAddress(); //limpa o formulario
      }
    }
  });
}

function editAddress(addr_id){
  console.log("editAddress")
  let address = readAddressFromForm();
  if(address == null)
    return;

  let addrIndex = addressList.findIndex(item => item.id == addr_id);
  address.id = addr_id;
  addressList[addrIndex] = address;
  localStorage.setItem(addressLocalStorageKey, JSON.stringify(addressList));
  
  loadAddressList();
  showAddressList();
  //limpa o formulario
  clearFormAddress();
}

function selectAddress(addr_id, element_id){
  if(document.getElementById(element_id) == null)
    return;
  if($('#'+element_id).hasClass('address-box-is-selected'))
    return;

  console.log('selectAddress');

  $.ajax({
    type: 'post',
    url: '/endereco/selecionar',
    data: {id: addr_id},
    dataType: 'text',
    success: result => {
      if(result == "error"){
        console.log('não foi possivel selecionar endereço ID: ' + addr_id);
      }else{
        console.log('selecionado endereço ID: ' + addr_id);
        //retira o estilo css de seleção de todos os endereços
        $('.address-box').each((idx, element) => {
          $(element).removeClass('address-box-is-selected');
        });
        //adiciona estilo css de seleção
        $('#'+element_id).addClass('address-box-is-selected');
      }
    }
  });

}

function deleteAddress(addr_id, element_id){
  console.log("deleteAddress");

  $.ajax({
    type: 'post',
    url: '/endereco/deletar',
    data: {id: addr_id},
    dataType: 'text',
    success: result => {
      if(result == "error"){
        console.log('não foi possivel deletar endereço ID: ' + addr_id);
      }else{
        console.log('removendo endereço ID: ' + addr_id);
        $('#' + element_id).remove();
      }
    }
  });
}

//inicializa lista de endereços
function loadAddressList() {
  $.ajax({
    type: 'get',
    url: '/endereco/listar',
    success: addressList => {
      if(addressList == "error") {
        console.log("não foi possivel carregar lista de endereços");
      }
      else {
        console.log("carregando lista de endereços");
          //cria html da lista de andereços
          let addressBoxesHTML = "";
          addressList.forEach(address => {
            addressBoxesHTML += createAddressBoxHtml(address);
          });
          //insere html
          elAddressList.html(addressBoxesHTML);
      }
    }
  });
}

//ao carregar o script, essa função sera executada
loadAddressList();