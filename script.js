let balance = 1000;
let history = [];
let nickname = localStorage.getItem('nickname') || prompt("Podaj swój nick:");
localStorage.setItem('nickname', nickname);
document.getElementById('nickname').textContent = nickname;

let autoPlay = false;
let canSpin = true;

const clickSound = document.getElementById('sound-click');
const winSound = document.getElementById('sound-win');
const loseSound = document.getElementById('sound-lose');
const jackpotSound = document.getElementById('sound-jackpot');

function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);

function updateBonusTimer() {
    const now = new Date();
    const minutes = 60 - now.getMinutes() - 1;
    const seconds = 60 - now.getSeconds();
    document.getElementById('bonus-timer').textContent = `Bonus za: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
setInterval(updateBonusTimer, 1000);

function notify(msg) {
    const notif = document.getElementById('notifications');
    notif.textContent = msg;
    setTimeout(() => notif.textContent = '', 3000);
}

function updateBalance() {
    document.getElementById('balance').textContent = balance;
}

function addHistory(entry) {
    history.unshift(entry);
    document.getElementById('history').innerHTML = history.slice(0, 10).join('<br>');
}

function fireworks() {
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            dx: (Math.random() - 0.5) * 10,
            dy: (Math.random() - 0.5) * 10,
            life: 100
        });
    }

    const interval = setInterval(() => {
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            p.life--;
        });

        particles = particles.filter(p => p.life > 0);
        if (particles.length === 0) {
            clearInterval(interval);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, 30);
}

function spin() {
    if (!canSpin) return;
    canSpin = false;
    clickSound.play();

    const bet = parseInt(document.getElementById('bet-amount').value) || 10;
    if (bet > balance || bet <= 0) {
        notify('Nieprawidłowy zakład!');
        canSpin = true;
        return;
    }
    balance -= bet;
    updateBalance();

    document.getElementById('wheel').style.animationPlayState = 'running';

    setTimeout(() => {
        document.getElementById('wheel').style.animationPlayState = 'paused';

        const wheelResult = Math.floor(Math.random() * 36) + 1;
        const slotsResult = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];

        document.getElementById('slot1').textContent = slotsResult[0];
        document.getElementById('slot2').textContent = slotsResult[1];
        document.getElementById('slot3').textContent = slotsResult[2];

        let win = 0;
        if (wheelResult === 7) {
            win = bet * 10;
            jackpotSound.play();
            fireworks();
            notify('JACKPOT w ruletce!');
        } else if (slotsResult.every(val => val === slotsResult[0])) {
            win = bet * 5;
            winSound.play();
            notify('TRZY TAKIE SAME w slotach!');
        } else if (wheelResult % 2 === 0) {
            win = bet * 2;
            winSound.play();
            notify('Wygrana na parzystym numerze!');
        } else {
            loseSound.play();
            notify('Przegrana.');
        }

        balance += win;
        updateBalance();
        addHistory(`Wynik: Ruletka ${wheelResult}, Sloty ${slotsResult.join('-')} | Wygrana: $${win}`);
        canSpin = true;
    }, 3000);
}

document.getElementById('spin-btn').addEventListener('click', spin);

document.getElementById('auto-play-btn').addEventListener('click', () => {
    autoPlay = !autoPlay;
    if (autoPlay) {
        notify('Auto-Play: ON');
        autoSpin();
    } else {
        notify('Auto-Play: OFF');
    }
});

function autoSpin() {
    if (!autoPlay) return;
    spin();
    setTimeout(autoSpin, 5000);
}
