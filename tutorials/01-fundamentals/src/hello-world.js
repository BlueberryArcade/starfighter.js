function helloWorld() {
  var canvas = document.getElementById('game');
  var ctx = canvas.getContext('2d');
  var textX = canvas.width + 100;

  function loop() {
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 80px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Hello, World!', textX, canvas.height / 2 - 20);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(
      'This is where your game will appear.',
      canvas.width / 2,
      canvas.height / 2 + 55
    );
    ctx.fillText(
      'Delete helloWorld() in main.js to get started.',
      canvas.width / 2,
      canvas.height / 2 + 85
    );

    textX -= 2;
    if (textX < -700) {
      textX = canvas.width + 100;
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
