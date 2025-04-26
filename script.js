// --- Inicjalizacja zmiennych ---
let balance = 1000;
let nickname = "Gracz" + Math.floor(Math.random() * 10000);
let isAutoPlay = false;
let autoPlayInterval = null;
let history = [];
let xp = 0;
let level = 1;

// --- Inicjalizacja po załadowaniu strony ---
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('nickname').textContent = nickname;
  document.getElementById('balance').textContent = balance;
  updateClock();
  setInterval(updateClock, 1000);
  document.getElementById('spin-btn').addEventListener('click', spin);
  document.getElementById('auto-play-btn').addEventListener('click', toggleAutoPlay);
  document.getElementById('claim-bonus-btn').addEventListener('click', claimDailyBonus);
  showSection('games');
});

// --- Funkcja aktualizacji zegara ---
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  document.getElementById('clock').textContent = timeString;
}

// --- Pokazywanie sekcji ---
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
  document.getElementById(sectionId).classList.remove('hidden');
}

// --- Spinowanie slotów i ruletki ---
function spin() {
  const betAmount = parseInt(document.getElementById('bet-amount').value);

  if (isNaN(betAmount) || betAmount <= 0) {
    notify('Wprowadź poprawną stawkę!');
    return;
  }

  if (betAmount > balance) {
    notify('Nie masz wystarczającego balansu!');
    return;
  }

  balance -= betAmount;
  updateBalance();

  playSound('sound-click');

  // Sloty
  const symbols = ['7', '🍒', '💎', '⭐', '🍀'];
  const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
  const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
  const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

  document.getElementById('slot1').textContent = slot1;
  document.getElementById('slot2').textContent = slot2;
  document.getElementById('slot3').textContent = slot3;

  // Ruletka
  spinWheel();

  // Wygrana?
  let winnings = 0;
  if (slot1 === slot2 && slot2 === slot3) {
    winnings = betAmount * 5;
    balance += winnings;
    notify(`Mega wygrana! +${winnings} KC`);
    triggerFireworks();
    playSound('sound-jackpot');
    addXp(50);
  } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
    winnings = betAmount * 2;
    balance += winnings;
    notify(`Mała wygrana! +${winnings} KC`);
    playSound('sound-win');
    addXp(20);
  } else {
    notify('Brak wygranej.');
    playSound('sound-lose');
    addXp(5);
  }

  updateBalance();
  addToHistory(slot1, slot2, slot3, winnings);
}

// --- Aktualizacja balansu ---
function updateBalance() {
  document.getElementById('balance').textContent = balance;
}

// --- Powiadomienia ---
function notify(message) {
  const notifications = document.getElementById('notifications');
  notifications.textContent = message;
  notifications.style.opacity = 1;
  setTimeout(() => notifications.style.opacity = 0, 3000);
}

// --- Historia spinów ---
function addToHistory(s1, s2, s3, winnings) {
  history.push({ s1, s2, s3, winnings });
  const historyDiv = document.getElementById('history');
  historyDiv.innerHTML = history.slice(-5).map(item => {
    return `<div>${item.s1} | ${item.s2} | ${item.s3} - ${item.winnings > 0 ? '+' : ''}${item.winnings} KC</div>`;
  }).join('');
}

// --- Auto-Play ---
function toggleAutoPlay() {
  if (isAutoPlay) {
    clearInterval(autoPlayInterval);
    isAutoPlay = false;
    document.getElementById('auto-play-btn').textContent = 'Auto-Play';
  } else {
    autoPlayInterval = setInterval(spin, 2000);
    isAutoPlay = true;
    document.getElementById('auto-play-btn').textContent = 'Stop Auto-Play';
  }
}

// --- Ruletka ---
function spinWheel() {
  const wheel = document.getElementById('wheel');
  const randomDeg = Math.floor(Math.random() * 3600 + 360);
  wheel.style.transition = 'transform 3s ease-out';
  wheel.style.transform = `rotate(${randomDeg}deg)`;
}

// --- Odtwarzanie dźwięków ---
function playSound(soundId) {
  const sound = document.getElementById(soundId);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

// --- Fajerwerki (Placeholder) ---
function triggerFireworks() {
  // Efekt fajerwerków tutaj (na razie prosty alert lub animacja canvas później)
}

// --- Dodawanie XP i Levelowanie ---
function addXp(amount) {
  xp += amount;
  const xpNeeded = level * 100;

  if (xp >= xpNeeded) {
    level++;
    xp = xp - xpNeeded;
    notify(`Awans! Teraz poziom ${level}!`);
    balance += level * 500; // bonus za awans
    updateBalance();
  }

  updateXpDisplay();
}

function updateXpDisplay() {
  const xpBar = document.getElementById('xp-bar');
  if (xpBar) {
    const xpPercent = (xp / (level * 100)) * 100;
    xpBar.style.width = xpPercent + "%";
    xpBar.textContent = `Poziom ${level}`;
  }
}

// --- Dzienny Bonus ---
function claimDailyBonus() {
  const lastClaim = localStorage.getItem('lastClaim');
  const now = Date.now();

  if (lastClaim && now - lastClaim < 24 * 60 * 60 * 1000) {
    notify('Bonus już odebrany dzisiaj!');
    return;
  }

  const bonusAmount = Math.floor(Math.random() * 500 + 500);
  balance += bonusAmount;
  localStorage.setItem('lastClaim', now);
  notify(`Odebrano dzienny bonus: +${bonusAmount} KC!`);
  updateBalance();
}

// --- Ranking / Tablica wyników (prosty zapis lokalny) ---
function updateLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  leaderboard.push({ nickname, balance });
  leaderboard.sort((a, b) => b.balance - a.balance);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10)));

  const leaderboardList = document.getElementById('leaderboard-list');
  if (leaderboardList) {
    leaderboardList.innerHTML = leaderboard.slice(0, 10).map(player => {
      return `<div>${player.nickname} - ${player.balance} KC</div>`;
    }).join('');
  }
}

// --- Zapis stanu gry przed wyjściem ---
window.addEventListener('beforeunload', () => {
  updateLeaderboard();
});
