// Image
// =============================================================================

getImage = function() {

    playerImage = new Image();
    enemy01Image = new Image();
    enemy02Image = new Image();
    enemy03Image = new Image();
    enemy04Image = new Image();
    playerBulletImage = new Image();
    enemyBulletImage = new Image();
    explosionImage = new Image();

	playerImage.src = "../images/player.png";
    enemy01Image.src = "../images/enemy01.png";
    enemy02Image.src = "../images/enemy02.png";
    enemy03Image.src = "../images/enemy03.png";
    enemy04Image.src = "../images/enemy04.png";
    playerBulletImage.src = "../images/player_bullet.png";
    enemyBulletImage.src = "../images/enemy_bullet04.png";
    explosionImage.src = "../images/explosion1.png";
};

//  Game + Player + Control
// =============================================================================

let hasListener = false;
let lives = 3;


let downKeys = {
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false
}

let gameover = false;
Game = function(lives) {
    canvas = document.getElementById('game-canvas');
    crashed = false;
    ctx = canvas.getContext("2d");

    CVW = canvas.width;
    CVH = canvas.height;
    oldCounter = 0;
    nextCounter = 0;

    enemies = [];
    explosions = [];
    getImage();

    PLAYER = {
        X: 50,
        Y: 280,
        W: 50,
        H: 50,
        SPEED: 4,
        LIFES: lives,
        BULLETS: [],
        EXPLOSIONS: [],
        STARTTIME: Date.now(),
        DURATION: 200,
        timeLeft: 1000,
    
        update: function() {
            if(downKeys.up){
                PLAYER.Y = PLAYER.Y - PLAYER.SPEED;
                if (PLAYER.Y <= 0) { PLAYER.Y = 0 };
            }
            if(downKeys.down){
                PLAYER.Y = PLAYER.Y + PLAYER.SPEED;
                if (PLAYER.Y >= CVH - PLAYER.W) { PLAYER.Y = CVH - PLAYER.W };
            }
            if (downKeys.left) {
                PLAYER.X = PLAYER.X - PLAYER.SPEED;
                if (PLAYER.X <= 0) { PLAYER.X = 0 };
            }
            if (downKeys.right) {
                PLAYER.X = PLAYER.X + PLAYER.SPEED;
                if (PLAYER.X >= CVW - PLAYER.H) { PLAYER.X = CVW - PLAYER.H };
            }
            if(downKeys.fire){this.fire();}
        },

        draw: function() {ctx.drawImage(playerImage, PLAYER.X, PLAYER.Y, PLAYER.W, PLAYER.H)},

        fire: function(){
                const timePassed = Date.now() - this.STARTTIME;
                if (timePassed < this.timeLeft) {
                    this.STARTTIME = Date.now();
                    this.timeLeft = this.timeLeft - timePassed;
                } else {
                    this.STARTTIME = Date.now();
                    this.timeLeft = this.DURATION;
                    if (nextCounter - oldCounter >= 1) {
                        let z = new PlayerBullet(this.X + (this.W) / 2, this.Y, 8);
                        this.BULLETS.push(z);
                        oldCounter = nextCounter;
                    }
            };
        }
    };

    function onkeydown(e) {
        if (!crashed){
            if (e.key == ' ' || e.key == 'Enter') { downKeys.fire = true };
            if (e.key == 'w' || e.key == 'ArrowUp') { downKeys.up = true };
            if (e.key == 's' || e.key == 'ArrowDown') { downKeys.down = true };
            if (e.key == 'a' || e.key == 'ArrowLeft') { downKeys.left = true };
            if (e.key == 'd' || e.key == 'ArrowRight') { downKeys.right = true };
        }
    };

    function onkeyup(e){
        if (e.key == ' ' || e.key == 'Enter') {downKeys.fire = false};
        if (e.key == 'w' || e.key == 'ArrowUp') {downKeys.up = false};
        if (e.key == 's' || e.key == 'ArrowDown') {downKeys.down = false};
        if (e.key == 'a' || e.key == 'ArrowLeft') {downKeys.left = false};
        if (e.key == 'd' || e.key == 'ArrowRight') {downKeys.right = false};
    };

    if(hasListener === false){
        document.addEventListener('keydown', onkeydown);
        document.addEventListener('keyup', onkeyup);
        hasListener = true;
    }
};

// Bulltet
// =============================================================================

PlayerBullet = function(X, Y, SPEED) {
    this.X = X;
    this.Y = Y;
    this.W = 50;
    this.H = 50;
    this.SPEED = SPEED;
    this.state = 'active';

    this.draw = function() {
        if(this.state === "active"){
            ctx.drawImage(playerBulletImage, this.X, this.Y, this.W, this.H)
        }
    };

    this.update = function() {
        this.X += this.SPEED;
        if (this.X <= 0 ) { this.sate = 'inactive'};
    };
};

// Explosion
// =============================================================================

Explosion = function (X, Y, size = 50) {
    this.X = X;
    this.Y = Y;
    this.W = size;
    this.H = size;
    this.start = Date.now();

    this.draw = function () {
        const duration = Date.now() - this.start;

        if (duration < 1000) {
            [x, y] = getExplosionPictionPos(duration);
            ctx.drawImage(explosionImage, x, y, 160, 160, this.X, this.Y, this.W, this.H)
        }
    };
};

function getExplosionPictionPos(time) {
    const n = Math.floor(time / 50);
    const row = Math.floor(n / 4);
    const col = Math.floor(n % 4);
    const x = col * 160;
    const y = row * 160;
    return [x, y];
};

// Lifea
// =============================================================================

function showLife(n) {
    for(let i = 0; i < n; i++){
        ctx.drawImage(playerImage, 30 * (i+1), 25, 25, 25)
    }
};

// function enemyBullet(X, Y, SPEED) {
//     this.X = X;
//     this.Y = Y;
//     this.W = 5;
//     this.H = 15;
//     this.SPEED = SPEED;
//     this.state = 'active';

//     this.draw = function () {
//         ctx.drawImage(enemyBulletImage, this.X, this.Y, this.W, this.H)
//     };

//     this.update = function () {
//         this.Y -= this.SPEED;
//         if (this.Y <= 0 || this.X <= 0) { this.sate = 'inactive' };
//     };
// };

// Enemies
// =============================================================================

enemy = function(X, Y, SPEED) {
    this.X = X;
    this.Y = Y;
    this.W = 20;
    this.H = 20;
    this.SPEED = SPEED;
    this.state = 'active';

    this.draw = function() {
        ctx.drawImage(enemy02Image, this.X, this.Y, this.W, this.H)
    };

    this.update = function () {
        this.Y = this.Y + this.SPEED;
        if (this.Y >= CVH - this.W || this.Y <= 0) {this.SPEED *= -1};
        this.X--;
        if (this.X <= 0) { 
            this.state = 'inactive';
        };
    };
};

// Util
// =============================================================================

function draw() {

    ctx.clearRect(0, 0, CVW, CVH);

    PLAYER.draw();
    PLAYER.BULLETS.forEach(bullet => bullet.draw());
    // PLAYER.LIFES.forEach(life => life.draw());
    showLife(PLAYER.LIFES);

    enemies.forEach(enemy => enemy.draw());

};

function update(){

    PLAYER.update();
    PLAYER.BULLETS.forEach(bullet => bullet.update());
    
    enemies.forEach(enemy => enemy.update());

    for (let i = 0; i < enemies.length; i++) {
        PLAYER.BULLETS.forEach(z => {
            if (z.state === "active" && isAHit(z, enemies[i])) {
                z.state = 'inactive';
                let bomb = new Explosion(enemies[i].X, enemies[i].Y);
                explosions.push(bomb);
                enemies.splice(i, 1);
            }
        })
    };

    let num = Math.random();
    if ( num < 0.05 ) {
        let x = Math.floor(Math.random() * (CVH - 50));
        let y = Math.floor(Math.random() * 600);
        let speed = Math.random() * 5;
        let neg = Math.random();
        if (neg < 0.5) { speed = -speed };
        let a = new enemy(800, y, speed)
        enemies.push(a)
    };

    enemies.forEach( enemy => {
        if (isCrash(PLAYER, enemy)) {
            let bomb = new Explosion(PLAYER.X - 25, PLAYER.Y - 25, 100);
            explosions.push(bomb);
            downKeys = {
                up: false,
                down: false,
                left: false,
                right: false,
                fire: false
            };
            if (!crashed){
                PLAYER.LIFES--;
                lives -= 1;
                if (lives === 0) {
                    lives = 3;
                    gameover = true;
                }
            }
            crashed = true;
        }
    });

    explosions.forEach(explosion => explosion.draw());

};

//  Math
// =============================================================================

function isCrash(o1, o2) {
    return Math.sqrt(Math.pow((o1.X + o1.W / 2) - (o2.X + o2.W / 2), 2) + Math.pow((o1.Y + o1.H / 2) - (o2.Y + o2.H / 2), 2)) < 20;
};

function isAHit(o1, o2) {
    if(o1 && o2){
        return Math.sqrt(Math.pow((o1.X + o1.W / 2) - (o2.X + o2.W / 2), 2) + Math.pow((o1.Y + o1.H / 2) - (o2.Y + o2.H / 2), 2)) < 20;
    }
    return false;
};

//  Show
// =============================================================================

let timerId = null;
let endTime = null;

function render() {

    if (endTime && Date.now() - endTime > 1000) {
        return;
    }
    draw();
    update();
    nextCounter++;
    window.requestAnimationFrame(render);

    if (crashed === true){
        if (!timerId) {
            endTime = Date.now();
            timerId = setTimeout(() => { 
                timerId = null;
                if (!gameover) {
                    start();
                } else {
                    alert("game is realy over")
                    // render other views
                }
            }, 1200);
        }
    }
};


function start(){
    endTime = null;
    console.log(lives)
    Game(lives);
    render();
    downKeys = {
        up: false,
        down: false,
        left: false,
        right: false,
        fire: false
    };
};

start();