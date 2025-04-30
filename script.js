let money = 0;
let cashPerClick = 1;
let cashiers = 0;
let branches = 0;
let stockOwned = false;

function updateDisplay() {
  document.getElementById("money").innerText = `Gotówka: $${Math.floor(money)}`;
}

document.getElementById("clicker").addEventListener("click", () => {
  money += cashPerClick;
  updateDisplay();
});

function buyUpgrade(type) {
  if (type === "cashPerClick" && money >= 50) {
    cashPerClick += 1;
    money -= 50;
  } else if (type === "cashier" && money >= 100) {
    cashiers += 1;
    money -= 100;
  } else if (type === "branch" && money >= 1000) {
    branches += 1;
    money -= 1000;
  } else if (type === "stock" && money >= 2000 && !stockOwned) {
    stockOwned = true;
    money -= 2000;
    setInterval(() => {
      const gain = Math.floor(Math.random() * 200 - 50);
      money += gain;
      updateDisplay();
    }, 5000);
  }
  updateDisplay();
}

setInterval(() => {
  money += cashiers * 1 + branches * 10;
  updateDisplay();
  saveGame();
}, 1000);

function saveGame() {
  localStorage.setItem("bankclicker", JSON.stringify({
    money, cashPerClick, cashiers, branches, stockOwned
  }));
}

function loadGame() {
  const data = JSON.parse(localStorage.getItem("bankclicker"));
  if (data) {
    money = data.money;
    cashPerClick = data.cashPerClick;
    cashiers = data.cashiers;
    branches = data.branches;
    stockOwned = data.stockOwned;
    if (stockOwned) buyUpgrade("stock"); // Start stock market timer
  }
  updateDisplay();
}

function resetGame() {
  localStorage.removeItem("bankclicker");
  location.reload();
}

loadGame();
