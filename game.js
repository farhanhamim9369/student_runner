const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player, teacher, cursors, scoreText, livesText;
let score = 0;
let lives = 2;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'https://i.imgur.com/YrD5C1P.png'); // Background image
    this.load.image('ground', 'https://i.imgur.com/4vX3Kpt.png'); // Ground
    this.load.image('player', 'https://i.imgur.com/OdL0XPt.png'); // Student
    this.load.image('teacher', 'https://i.imgur.com/QZN94Gu.png'); // Teacher
    this.load.image('mobile', 'https://i.imgur.com/h1nKhd7.png'); // Mobile phone
}

function create() {
    this.add.image(400, 200, 'background').setScale(1.5);

    let ground = this.physics.add.staticGroup();
    ground.create(400, 390, 'ground').setScale(2).refreshBody();

    player = this.physics.add.sprite(100, 300, 'player').setScale(0.5);
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);

    teacher = this.physics.add.sprite(700, 300, 'teacher').setScale(0.5);
    teacher.setVelocityX(-100);

    this.physics.add.collider(player, ground);
    this.physics.add.collider(teacher, ground);

    cursors = this.input.keyboard.createCursorKeys();

    mobiles = this.physics.add.group({
        key: 'mobile',
        repeat: 4,
        setXY: { x: 200, y: 0, stepX: 150 }
    });

    this.physics.add.collider(mobiles, ground);
    this.physics.add.overlap(player, mobiles, collectMobile, null, this);

    this.physics.add.collider(player, teacher, hitTeacher, null, this);

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#000' });
    livesText = this.add.text(16, 40, 'Lives: 2', { fontSize: '20px', fill: '#000' });
}

function update() {
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-300);
    }

    if (teacher.x < 0) {
        teacher.x = 800;
    }
}

function collectMobile(player, mobile) {
    mobile.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
}

function hitTeacher(player, teacher) {
    lives -= 1;
    livesText.setText('Lives: ' + lives);
    player.setTint(0xff0000);
    
    if (lives <= 0) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        alert("Game Over!");
    }
}
