let canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


let score;
let highScore;
let gravity;
let gameSpeed;

let keys = [];

document.addEventListener('keydown', function (e) {
    keys[e.code] = true; // записываем нажатие в массив
});

document.addEventListener('keyup', function (e) {
    keys[e.code] = false; // отпустил кнопку
})


class Player {
    constructor(x,y,w,h,c) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;

        this.dy = 0; // сила прыжка
        this.jumpForce = 15; // дальность прыжка
        this.standartHeight = h;
        this.grounded = false;
        this.jumpTimer = 0;
    }

    Animate() {
        // Прыжок
        if (keys['Space']) {
            this.Jump();
        } else {
            this.jumpTimer = 0;
        }

        //Присесть
        if (keys['ShiftLeft']) {
            this.h = this.standartHeight / 2;
        } else {
            this.h = this.standartHeight;
        }

        this.y += this.dy;
        // Гравитация
        if (this.y + this.h < canvas.height) {
            this.dy += gravity;
            this.grounded = false;
        } else {
            this.dy = 0; // на земле
            this.grounded = true;
            this.y = canvas.height - this.h;
        }

        this.Draw();
    }

    Jump() {
        if (this.grounded && this.jumpTimer == 0) { // точечный прыжок
            this.jumpTimer = 1;
            this.dy = - this.jumpForce;
        } else if (this.jumpTimer > 0 && this.jumpTimer < 15) { // 15 - макс значение
            this.jumpTimer++;
            this.dy = - this.jumpForce - (this.jumpTimer / 50);
        }
    }

    // Draw () {
    //     ctx.beginPath(); // начало отрисовки
    //     ctx.fillStyle = this.c; // закрасить нашим цветом
    //     ctx.fillRect(this.x, this.y, this.w, this.h);
    //     ctx.closePath();
    // }

    Draw() {
        ctx.beginPath();
        var img = new Image();
        img.src = 'rabbit.png';      // Новый объект
        img.onload = function() { // Событие которое будет исполнено в момент когда изображение будет загружено
            ctx.drawImage(img, 100, 100);
        }
        ctx.closePath();
    }
}

function Start (){ // Запуск всея руси
    canvas.width = window.innerWidth; // размеры сцены как размеры экрана
    canvas.height = window.innerHeight;

    //ctx.font = "20px sans-serif"; todo нахуя

    gameSpeed = 3; // обычная скорость игры
    gravity = 1; // гравитация 

    score = 0; // обнуление
    highScore = 0;

    player = new Player(25,0,50,50,'#FBCEB1');
    player.Draw();

    requestAnimationFrame(Update); // говорим что нужно обновить объекты след 
                                   //кадром через функцию update
}

function Update() {
    requestAnimationFrame(Update) // держим функцию в цикле
    ctx.clearRect(0, 0, canvas.width, canvas.height); // очистка экрана
    player.Animate();
}

Start();