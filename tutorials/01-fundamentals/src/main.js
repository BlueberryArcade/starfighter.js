const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const shipX = canvas.width / 2;
const shipY = canvas.height / 2;

ctx.fillStyle = '#00e5ff';
ctx.beginPath();
ctx.moveTo(shipX, shipY - 20);      // nose
ctx.lineTo(shipX - 15, shipY + 15); // bottom-left
ctx.lineTo(shipX + 15, shipY + 15); // bottom-right
ctx.closePath();
ctx.fill();