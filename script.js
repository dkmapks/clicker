let score = 0;
let clickValue = 1;
let cps = 0; // Clicks per second
let upgrades = [10, 50, 100];
let upgradeValues = [1, 5, 10];
let products = [
    { cost: 70, cps: 2 },
    { cost: 60, cps: 5 },
    { cost: 400, cps: 25 }
];

// Load game state if available
window.onload = () => {
    if (localStorage.getItem('score')) {
        score = parseInt(localStorage.getItem('score'));
        clickValue = parseInt(localStorage.getItem('clickValue'));
        cps = parseInt(localStorage.getItem('cps'));
        upgrades = JSON.parse(localStorage.getItem('upgrades'));
        updateScore();
    }
};

// Update score display
const updateScore = () => {
    document.getElementById('score').textContent = score;
};

// Handle click event
document.getElementById('clicker').addEventListener('click', () => {
    score += clickValue;
    updateScore();
});

// Handle upgrade purchase
const handleUpgrade = (index) => {
    if (score >= upgrades[index]) {
        score -= upgrades[index];
        clickValue += upgradeValues[index];
        upgrades[index] = Math.round(upgrades[index] * 1.15); // Increase cost by 15%
        updateScore();
    }
};

document.getElementById('upgrade1').addEventListener('click', () => handleUpgrade(0));
document.getElementById('upgrade2').addEventListener('click', () => handleUpgrade(1));
document.getElementById('upgrade3').addEventListener('click', () => handleUpgrade(2));

// Handle product purchase
const handleProductPurchase = (product) => {
    if (score >= product.cost) {
        score -= product.cost;
        cps += product.cps;
        updateScore();
    }
};

document.getElementById('product1').addEventListener('click', () => handleProductPurchase(products[0]));
document.getElementById('product2').addEventListener('click', () => handleProductPurchase(products[1]));
document.getElementById('product3').addEventListener('click', () => handleProductPurchase(products[2]));

// Save game state
document.getElementById('save').addEventListener('click', () => {
    localStorage.setItem('score', score);
    localStorage.setItem('clickValue', clickValue);
    localStorage.setItem('cps', cps);
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
});

// Load game state
document.getElementById('load').addEventListener('click', () => {
    if (localStorage.getItem('score')) {
        score = parseInt(localStorage.getItem('score'));
        clickValue = parseInt(localStorage.getItem('clickValue'));
        cps = parseInt(localStorage.getItem('cps'));
        upgrades = JSON.parse(localStorage.getItem('upgrades'));
        updateScore();
    }
});

// Auto increment score based on CPS
setInterval(() => {
    if (cps > 0) {
        score += cps;
        updateScore();
    }
}, 1000);
