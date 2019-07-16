import Phaser from "phaser";

const WIDTH = 800;
const HEIGHT = 600;

class Coin extends Phaser.GameObjects.Arc {
  constructor({ scene, x = 0, y = 0, color = 0xffff00 }) {
    // function Arc (scene, x, y, radius, startAngle, endAngle, anticlockwise, fillColor, fillAlpha)
    super(scene, x, y, 10, 0, 360, true, color);
    this.body = new Phaser.Physics.Arcade.Body(scene.physics.world, this);
  }
}

const titleScene = {
  key: "title",

  preload() {},

  create() {
    const title = this.add.text(WIDTH / 2, HEIGHT * 0.2, "AWAY WITH ME", {
      fontSize: 40
    });
    title.setOrigin(0.5, 0.5);
    this.cursorKeys = this.input.keyboard.createCursorKeys();
  },

  update() {
    if (this.cursorKeys.space.isDown) {
      this.scene.switch("game");
    }
  }
};

const gameScene = {
  key: "game",

  preload() {},

  create() {
    this.rect = this.add.rectangle(WIDTH / 2, HEIGHT * 0.8, 20, 20, 0xff0000);
    this.physics.add.existing(this.rect);
    this.rect.body.setBounce(0.5, 0.5);
    this.rect.body.setCollideWorldBounds(true);
    this.rect.body.mass = this.rect.body.width * this.rect.body.height * 5;

    this.coins = [];
    let coinsPhysicsGroup = this.physics.add.group({
      allowGravity: false,
      collideWorldBounds: true
    });

    for (let i = 0; i < 50; i++) {
      let coin = new Coin({
        scene: this
      });
      Phaser.Geom.Rectangle.Random(this.physics.world.bounds, coin);

      coinsPhysicsGroup.add(coin);
      coin.body.setVelocity(
        Math.random() * 400 - 200,
        Math.random() * 400 - 200
      );
      coin.body.setBounce(1.0, 1.0);
      this.add.existing(coin);
      this.physics.add.existing(coin);
      this.coins.push(coin);
    }

    //coinsPhysicsGroup.addMultiple(this.coins);

    this.physics.add.overlap(this.rect, coinsPhysicsGroup, (rect, coin) => {
      coin.destroy();
      rect.width += 2;
      rect.height += 2;
      rect.body.width += 2;
      rect.body.height += 2;
      rect.body.mass = rect.body.width * rect.body.height;
    });

    this.cursorKeys = this.input.keyboard.createCursorKeys();
  },

  update() {
    const force = 5000000;
    const accel = force / this.rect.body.mass;
    let ax = 0;
    let ay = 0;

    if (this.cursorKeys.down.isDown) {
      ay += accel;
    }
    if (this.cursorKeys.up.isDown) {
      ay -= accel;
    }
    if (this.cursorKeys.left.isDown) {
      ax -= accel;
    }
    if (this.cursorKeys.right.isDown) {
      ax += accel;
    }

    this.rect.body.setAcceleration(ax, ay);
  }
};

window.game = new Phaser.Game({
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: [titleScene, gameScene]
});
