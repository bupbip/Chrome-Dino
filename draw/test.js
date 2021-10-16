let canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

ctx.beginPath(); // начало отрисовки
var img = new Image();
img.src = 'rabbit.png';      // Новый объект
img.onload = function() { // Событие которое будет исполнено в момент когда изображение будет загружено
    ctx.drawImage(img, 100, 100);
}
    // Путь к изображению

ctx.closePath();