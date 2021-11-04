let canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const spawnTimerLimit = 40; // максимальная скорость появления деревьев
const maxJumpTimer = 15; // размер удерживаемого прыжка
const frequencyMoves = 20; // изменение очков для смены анимации
const scoreToStart = 6; // для начала мал. прыжка
const scoreToEnd = 14; // для завершения мал. прыжка
const standartGameSpeed = 5;
const gameSpeedBooster = 0.003;
const standartGravity = 1;
const standartSpawnTimer = 200; // начальная скорость появления деревьев
const spawnTimerBooster = 8; // пропорционален скорости появления деревьев
const moveObjectUp = 30; // поднять зайку и деревья

let score;
let scoreText;
let highScore;
let highScoreText;
let gravity;
let gameSpeed;
let bushes = [];

let spacebarDown;

document.addEventListener('keydown', function (e) {
    if (e.code == "Space") {
        spacebarDown = true;
    }
});

document.addEventListener('keyup', function (e) {
    if (e.code == "Space") {
        spacebarDown = false;
    }
})

class Player {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.dy = 0; // сила прыжка
        this.jumpForce = 15; // дальность прыжка
        this.grounded = false;
        this.jumpTimer = 0;
        this.prevY = y; // считывать последнюю высоту
    }

    Animate() {
        // Прыжок
        if (spacebarDown) {
            this.Jump();
        } else {
            this.jumpTimer = 0;
        }
        this.prevY = this.y;
        this.y += this.dy;
        // Гравитация
        if (this.y + this.h + moveObjectUp < canvas.height) {
            this.dy += gravity;
            this.grounded = false;
        } else {
            this.dy = 0; // на земле
            this.grounded = true;
            this.y = canvas.height - this.h - moveObjectUp;
        }
        this.Draw();
    }

    Jump() {
        if (this.grounded && this.jumpTimer == 0) { // точечный прыжок
            this.jumpTimer = 1;
            this.dy = - this.jumpForce;
        } else if (this.jumpTimer > 0 && this.jumpTimer < maxJumpTimer) { // 15 - макс значение
            this.jumpTimer++;
            this.dy = - this.jumpForce - this.jumpTimer / 4;
        }
    }

    Draw() {
        ctx.beginPath();
        let img = document.createElement("img");
        if (this.prevY > this.y) {
            img.src = 'images/rabbits/startJumpV1.png';
        } else if (this.prevY < this.y) {
            img.src = 'images/rabbits/endJumpV1.png';
        } else {
            let moveTimer = score * gameSpeed / 16;
            if (moveTimer % frequencyMoves < scoreToStart) img.src = 'images/rabbits/startJump.png';
            else if (moveTimer % frequencyMoves > scoreToEnd) img.src = 'images/rabbits/endJump.png';
            else img.src = 'images/rabbits/rabbit.png';
        }
        ctx.drawImage(img, this.x, this.y, this.h, this.h);
        ctx.closePath();
    }
}


class Text {
    constructor(text, x, y, allign, color, size) { // a - allign(выравнивание)
        this.text = text;
        this.x = x;
        this.y = y;
        this.allign = allign;
        this.color = color;
        this.size = size;
    }

    Draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.font = this.size + "px sans-serif";
        ctx.textAlign = this.allign;
        ctx.fillText(this.text, this.x, this.y);
        ctx.closePath();
    }
}

class Bush {
    constructor(x, y, w, h, name) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.dx = -gameSpeed;
    }

    Update() {
        this.x += this.dx;
        this.Draw();
        this.dx = -gameSpeed;
    }

    Draw() {
        ctx.beginPath();
        let img = document.createElement("img");
        img.src = this.name;
        ctx.drawImage(img, this.x, this.y - moveObjectUp, Math.round(this.w), Math.round(this.h));
        ctx.closePath();
    }
}


function SpawnBushes() {
    picName = 'images/trees/tree' + (Math.ceil(Math.random() * 3) - 1) + '.png'; // случайное дерево
    let img = document.createElement("img");
    img.src = picName;
    img.onload = function () {
        let imgW = this.width / 2;
        let imgH = this.height / 2;
        let bush = new Bush(canvas.width + imgW, canvas.height - imgH, imgW, imgH, picName);
        bushes.push(bush)
    }
}

function drawBackground() {
    ctx.beginPath();
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height - 100);// -100 для того чтобы рисовать только небо
    ctx.closePath();
}

function Start() { // Запуск всея руси
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 30;

    gameSpeed = standartGameSpeed;
    gravity = standartGravity;

    score = 0;
    highScore = 0;

    scoreText = new Text("Очки: " + score, 25, 25, "left", "#212121", "20");
    highScoreText = new Text("Рекорд: " + highScore, canvas.width - 25, 25, "right", "#212121", "20");
    player = new Player(25, 0, 60, 60, '#FBCEB1');
    player.Draw();

    requestAnimationFrame(Update); // говорим что нужно обновить объекты след 
    //кадром через функцию update
}

let spawnTimer = standartSpawnTimer;
function Update() {
    requestAnimationFrame(Update) // держим функцию в цикле
    ctx.clearRect(0, 0, canvas.width, canvas.height); // очистка экрана

    spawnTimer--; // каждый кадр уменьшаем таймер
    if (spawnTimer <= 0) {
        imgName = SpawnBushes();
        spawnTimer = standartSpawnTimer - gameSpeed * spawnTimerBooster; // ускорение игры
        if (spawnTimer < spawnTimerLimit) { // фиксируем предел ускорения игры
            spawnTimer = spawnTimerLimit;
        }
    }

    score++;
    scoreText.text = "Очки: " + score;
    scoreText.Draw();
    highScore = Math.max(score, highScore);
    highScoreText.text = "Рекорд: " + highScore;
    highScoreText.Draw();

    console.log("gameSpeed: " + gameSpeed, "spawnTimer: " + spawnTimer);
    drawBackground();
    player.Animate();

    for (let i = 0; i < bushes.length; i++) {
        let b = bushes[i];

        if (b.x + b.width < 0) { // убираем с массива если вышел за пределы
            bushes.splice(i, 1);
        }

        if (
            player.x < b.x + b.w &&
            player.x + player.w > b.x &&
            player.y < b.y + b.h &&
            player.y + player.h > b.y
        ) {
            alert("Вы проиграли\nВаши очки: " + score);
            bushes = [];
            score = 0;
            spawnTimer = standartSpawnTimer;
            gameSpeed = standartGameSpeed;
        }

        b.Update(imgName);
    }
    gameSpeed += gameSpeedBooster; // ускорим игру
}

Start();