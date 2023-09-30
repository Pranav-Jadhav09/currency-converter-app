// Enable strict mode to catch common programming mistakes
"use strict";

// Selecting elements from the DOM
const dropList = document.querySelectorAll("form select");
const getBtn = document.querySelector("form button");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");

// Loop through dropdown lists
for (let i = 0; i < dropList.length; i++) {
  for (const currency_code in countryCode) {
    // Set default selections for FROM and TO currencies
    let selected;
    if (i == 0) {
      selected = currency_code == "USD" ? "selected" : "";
    } else if (i == 1) {
      selected = currency_code == "INR" ? "selected" : "";
    }

    // Create option tag with currency code as text and value
    let optionTag = ` <option value="${currency_code}" ${selected}>${currency_code}</option>`;

    // Insert option tag inside select tag
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }

  // Add event listener for dropdown change to load flags
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
  });
}

// Function to load flag based on the selected currency
function loadFlag(el) {
  for (let code in countryCode) {
    if (code == el.value) {
      let imgTag = el.parentElement.querySelector("img");
      imgTag.src = `https://flagsapi.com/${countryCode[code]}/flat/64.png`;
    }
  }
}

// Function to swap positions of FROM and TO currencies
const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;

  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

// Event listeners for window load and form button click
window.addEventListener("load", (e) => {
  getExchangeRate();
});
getBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

// Function to get the exchange rate and update the UI
function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate");

  let amountValue = amount.value;

  // Set default value to 1 if input is empty or 0
  if (amountValue == "" || amountValue == "0") {
    amount.value = "1";
    amountValue = 1;
  }

  exchangeRateTxt.innerText = "Getting exchange rate...";

  let url = `https://v6.exchangerate-api.com/v6/c459362921b82c46eb9f30d6/latest/${fromCurrency.value}`;

  // Fetch exchange rate data and update the UI
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExRate = (amountValue * exchangeRate).toFixed(2);

      exchangeRateTxt.innerText = `${amountValue} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    })
    .catch(() => {
      exchangeRateTxt.innerText = "Something went wrong";
    });
}
