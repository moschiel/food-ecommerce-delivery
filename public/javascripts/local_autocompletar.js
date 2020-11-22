// This sample uses the Autocomplete widget to help the user select a
// place, then it retrieves the address components associated with that
// place, and then it populates the form fields with those details.
// This sample requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let placeSearch;
let autocomplete;
const componentForm = {
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
  autocomplete.addListener("place_changed", fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  const place = autocomplete.getPlace();
  //console.log(place);

  for (const component in componentForm) {
    document.getElementById(component).value = "";
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  for (const component of place.address_components) {
    const addressType = component.types[0];

    if (componentForm[addressType]) {
      const val = component[componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
  showAddressForm();
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


//minhas funcoes
let addressList = [];
let addressLocalStorageKey = 'addressLocalStorage';
let elLocationField = $('#locationField');
let elAddressList = $('#address-list');
let elFormAddress = $('form#address');

//componentes para seleção de endereço visivel
function showAddressSelection(){
  $('#locationField > input').val(""); //limpa pesquisa
  elAddressList.slideDown();
  elLocationField.slideDown();
  elFormAddress.slideUp();
}
//form para prenchimente endereço visivel
function showAddressForm(){
  elAddressList.slideUp();
  elLocationField.slideUp();
  elFormAddress.slideDown(); 
}

function getAddressInputsValues() {
  lastAddressId++;
  localStorage.setItem('lastAddressId', lastAddressId);

  let address = {
    id:lastAddressId,
    select: true,
    route: $('#route').val(),
    street_number: $('#street_number').val(),
    complement: $('#complement').val(),
    sublocality_level_1: $('#sublocality_level_1').val(),
    administrative_area_level_2: $('#administrative_area_level_2').val(),
    administrative_area_level_1: $('#administrative_area_level_1').val(),
    postal_code: $('#postal_code').val(),
  }
  return address;
}

function createAddressBoxHtml(addr){

  let addressLine1 = `${addr.route}, ${addr.street_number}`;
  if(addr.complement)
    addressLine1 += `, ${addr.complement}`;

  let addressLine2 = `${addr.sublocality_level_1}, ${addr.administrative_area_level_2}/${addr.administrative_area_level_1}, ${addr.postal_code}`;

  let addressBoxHTML = `
    <div class="address-box" id="address-box-${addr.id}">
      <div>
        <div class="address-line address-line-1">${addressLine1}</div>
        <div class="address-line address-line-2">${addressLine2}</div>
      </div>
      <div>
        <button class="address-editar">Editar</button>
        <button class="address-trocar">Trocar</button>
      </div>
    </div>`;

  return addressBoxHTML;
}

function addAddress(){
  let address = getAddressInputsValues();
  let addressBoxHTML = createAddressBoxHtml(address);

  addressList.push(address);
  localStorage.setItem(addressLocalStorageKey, JSON.stringify(addressList));
  document.body.querySelector('#address-list').insertAdjacentHTML("beforeend", addressBoxHTML);

  showAddressSelection();
}

let lastAddressId = 0;
function initAddressList() {
    //address list
    let storageAddressList = localStorage.getItem(addressLocalStorageKey);

    if(storageAddressList != null){
      addressList = JSON.parse(storageAddressList);
    }

    let addressBoxesHTML = "";
    addressList.forEach(address => {
      addressBoxesHTML += createAddressBoxHtml(address);
    });

    document.body.querySelector('#address-list').innerHTML = addressBoxesHTML;

    //last address id created
    lastAddressId = Number(localStorage.getItem('lastAddressId'));
    
    if(lastAddressId == null)
      lastAddressId = 0;
}

initAddressList();