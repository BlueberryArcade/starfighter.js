const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let shipX = canvas.width / 2;
let shipY = canvas.height / 2;
let angle = 0;

function drawShip(x, y, a) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(a);
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(-15, 15);
  ctx.lineTo(15, 15);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function loop() {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  angle += 0.02;
  drawShip(shipX, shipY, angle);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
