let score = 0;

document.getElementById('clicker').addEventListener('click', () => {
    score++;
    document.getElementById('score').textContent = score;
});
