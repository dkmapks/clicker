let score = 0;
let clickValue = 1;

// Handle click event
document.getElementById('clicker').addEventListener('click', () => {
    score += clickValue;
    document.getElementById('score').textContent = score;
});

// Handle upgrade 1
document.getElementById('upgrade1').addEventListener('click', () => {
    if (score >= 10) {
        score -= 10;
        clickValue += 1;
        document.getElementById('score').textContent = score;
    }
});

// Handle upgrade 2
document.getElementById('upgrade2').addEventListener('click', () => {
    if (score >= 50) {
        score -= 50;
        clickValue += 5;
        document.getElementById('score').textContent = score;
    }
});

// Handle upgrade 3
document.getElementById('upgrade3').addEventListener('click', () => {
    if (score >= 100) {
        score -= 100;
        clickValue += 10;
        document.getElementById('score').textContent = score;
    }
});
