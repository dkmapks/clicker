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
let level = 1;
let levelThreshold = 100; // Score needed to level up
let achievements = [
    { name: "First Click", condition: () => score >= 1 },
    { name: "100 Clicks", condition: () => score >= 100 },
    { name: "1000 Clicks", condition: () => score >= 1000 }
];
let unlockedAchievements = [];
let missions = [
    { name: "Earn 100 Clicks", condition: () => score >= 100, reward: 50 },
    { name: "Reach Level 5", condition: () => level >= 5, reward: 100 }
];
let clickSound = document.getElementById('clickSound');

// Load game state if available
window.onload = () => {
    if (localStorage.getItem('score')) {
        score = parseInt(localStorage.getItem('score'));
        clickValue = parseInt(localStorage.getItem('clickValue'));
        cps = parseInt(localStorage.getItem('cps'));
        upgrades = JSON.parse(localStorage.getItem('upgrades'));
        level = parseInt(localStorage.getItem('level'));
        levelThreshold = parseInt(localStorage.getItem('levelThreshold'));
        unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];
        unlockedAchievements.forEach(achievement => {
            const li = document.createElement('li');
            li.textContent = achievement;
            document.getElementById('achievementsList').appendChild(li);
        });
        updateScore();
    }
    if (localStorage.getItem('backgroundColor')) {
        document.body.style.backgroundColor = localStorage.getItem('backgroundColor');
    }
    if (localStorage.getItem('reincarnations')) {
        const reincarnations = parseInt(localStorage.getItem('reincarnations'));
        clickValue += reincarnations;
        cps += reincarnations * 2;
    }
};

// Update score display
const updateScore = () => {
    document.getElementById('score').textContent = score;
    checkAchievements();
    checkMissions();
    if (score >= levelThreshold) {
        level++;
        levelThreshold = Math.round(levelThreshold * 1.5); // Increase threshold by 50%
        alert(`Congratulations! You've reached level ${level}!`);
    }
};

// Handle click event
document.getElementById('clicker').addEventListener('click', () => {
    score += clickValue;
    updateScore();
    clickSound.play();
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
    localStorage.setItem('level', level);
    localStorage.setItem('levelThreshold', levelThreshold);
    localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements));
    updateLeaderboard();
});

// Load game state
document.getElementById('load').addEventListener('click', () => {
    if (localStorage.getItem('score')) {
        score = parseInt(localStorage.getItem('score'));
        clickValue = parseInt(localStorage.getItem('clickValue'));
        cps = parseInt(localStorage.getItem('cps'));
        upgrades = JSON.parse(localStorage.getItem('upgrades'));
        level = parseInt(localStorage.getItem('level'));
        levelThreshold = parseInt(localStorage.getItem('levelThreshold'));
        unlockedAchievements = JSON.parse(localStorage.getItem('unlockedAchievements')) || [];
        unlockedAchievements.forEach(achievement => {
            const li = document.createElement('li');
            li.textContent = achievement;
            document.getElementById('achievementsList').appendChild(li);
        });
        updateScore();
    }
    if (localStorage.getItem('backgroundColor')) {
        document.body.style.backgroundColor = localStorage.getItem('backgroundColor');
    }
    if (localStorage.getItem('reincarnations')) {
        const reincarnations = parseInt(localStorage.getItem('reincarnations'));
        clickValue += reincarnations;
        cps += reincarnations * 2;
    }
});

// Auto increment score based on CPS
setInterval(() => {
    if (cps > 0) {
        score += cps;
        updateScore();
    }
}, 1000);

// Check for unlocked achievements
const checkAchievements = () => {
    achievements.forEach(achievement => {
        if (achievement.condition() && !unlockedAchievements.includes(achievement.name)) {
            unlockedAchievements.push(achievement.name);
            const li = document.createElement('li');
            li.textContent = achievement.name;
            document.getElementById('achievementsList').appendChild(li);
            alert(`Achievement Unlocked: ${achievement.name}`);
        }
    });
};

// Check for completed missions
const checkMissions = () => {
    missions.forEach(mission => {
        if (mission.condition() && !mission.completed) {
            mission.completed = true;
            score += mission.reward;
            updateScore();
            const li = document.createElement('li');
            li.textContent = `${mission.name} - Reward: ${mission.reward}`;
            document.getElementById('missionsList').appendChild(li);
            alert(`Mission Completed: ${mission.name} - Reward: ${mission.reward}`);
        }
    });
};

// Update leaderboard
const updateLeaderboard = () => {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';
    const scores = JSON.parse(localStorage.getItem('leaderboard')) || [];
    scores.push({ score, level });
    scores.sort((a, b) => b.score - a.score);
    scores.slice(0, 10).forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `Score: ${entry.score}, Level: ${entry.level}`;
        leaderboardList.appendChild(li);
    });
    localStorage.setItem('leaderboard', JSON.stringify(scores));
};

// Change background color
document.getElementById('changeBackground').addEventListener('click', () => {
    const colors = ['#f0f0f0', '#ffcccc', '#ccffcc', '#ccccff'];
    const currentColor = document.body.style.backgroundColor;
    const newColor = colors[(colors.indexOf(currentColor) + 1) % colors.length];
    document.body.style.backgroundColor = newColor;
    localStorage.setItem('backgroundColor', newColor);
});

// Reincarnate
document.getElementById('reincarnate').addEventListener('click', () => {
    if (confirm('Are you sure you want to reincarnate? You will lose your current progress but gain a permanent bonus.')) {
        localStorage.setItem('reincarnations', (parseInt(localStorage.getItem('reincarnations')) || 0) + 1);
        score = 0;
        clickValue = 1;
        cps = 0;
        upgrades = [10, 50, 100];
        level = 1;
        levelThreshold = 100;
        unlockedAchievements = [];
        updateScore();
    }
});
