let clicks = 0;
let bankBalance = 0;
let clickValue = 1;
let upgrades = [
    { id: 1, cost: 25, increment: 1, type: "click" },
    { id: 2, cost: 125, increment: 1.5, type: "passive" },
    { id: 3, cost: 200, increment: 10, type: "click" },
    { id: 4, cost: 600, increment: 8, type: "passive" },
    { id: 5, cost: 1500, increment: 100, type: "click" },
];

let passiveIncome = 0;

// Click button
document.getElementById("click-button").addEventListener("click", () => {
    clicks += clickValue;
    updateStats();
});

// Update stats
function updateStats() {
    document.getElementById("clicks").textContent = Math.floor(clicks);
    document.getElementById("bank").textContent = Math.floor(bankBalance);
}

// Buy upgrades
upgrades.forEach(upgrade => {
    document.getElementById(`upgrade${upgrade.id}`).addEventListener("click", () => {
        if (clicks >= upgrade.cost) {
            clicks -= upgrade.cost;

            if (upgrade.type === "click") {
                clickValue += upgrade.increment;
            } else if (upgrade.type === "passive") {
                passiveIncome += upgrade.increment;
            }

            // Increase cost after purchase
            upgrade.cost = Math.floor(upgrade.cost * 1.5);
            document.getElementById(`upgrade${upgrade.id}`).textContent = 
                `+${upgrade.increment} ${upgrade.type === "click" ? "Click" : "/s"} (Cost: ${upgrade.cost})`;

            updateStats();
        }
    });
});

// Passive income
setInterval(() => {
    clicks += passiveIncome;
    updateStats();
}, 1000);

// Bank functionality
let bankTimer = null;

document.getElementById("deposit-button").addEventListener("click", () => {
    const depositAmount = parseInt(document.getElementById("bank-amount").value);
    if (depositAmount > 0 && clicks >= depositAmount) {
        clicks -= depositAmount;
        updateStats();

        clearTimeout(bankTimer);
        setTimeout(() => {
            bankBalance += depositAmount * 1.1; // +10% after 3 minutes
            updateStats();
        }, 180000); // 180000 ms = 3 minutes
    }
});

// Mod menu
document.addEventListener("keydown", (e) => {
    if (e.key === "7" || e.key === "4" || e.key === "3" || e.key === "2") {
        const code = prompt("Enter Mod Code:");
        if (code === "7432") {
            const modChoice = prompt("Mod Menu:\n1. Add Clicks\n2. Add Bank Balance\n3. Add Passive Income");
            
            switch (modChoice) {
                case "1":
                    const addClicks = parseInt(prompt("How many clicks to add?"));
                    clicks += addClicks;
                    break;
                case "2":
                    const addBank = parseInt(prompt("How much to add to the bank?"));
                    bankBalance += addBank;
                    break;
                case "3":
                    const addPassive = parseFloat(prompt("How much passive income to add?"));
                    passiveIncome += addPassive;
                    break;
            }
            updateStats();
        }
    }
});