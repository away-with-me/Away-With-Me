import Phaser from "phaser";

const CANVAS_WIDTH = 256;
const CANVAS_HEIGHT = 256;

const PLAYER_DX = 60;

class Player extends Phaser.Physics.Arcade.Sprite {
  static preload(scene) {
    scene.load.image('player', 'player.png');
  }

  constructor(scene, x = 0, y = 0) {
    super(scene, x, y, 'player');
  }

  update(scene) {
    let dx = 0;
    let dy = 0;
    if (scene.keys.left.isDown) {
      dx -= PLAYER_DX;
    }
    if (scene.keys.right.isDown) {
      dx += PLAYER_DX;
    }
    if (scene.keys.up.isDown) {
      dy -= PLAYER_DX;
    }
    if (scene.keys.down.isDown) {
      dy += PLAYER_DX;
    }

    this.setVelocity(dx, dy);
  }
}

class Tilemap {
  static preload(scene) {
    scene.load.image('tileset', 'tiles.png');
    scene.load.tilemapTiledJSON('tilemap', 'tilemap.json');
  }

  constructor(scene) {
    this._tilemap = scene.make.tilemap({key: 'tilemap'});
    this.tilesetImage = this._tilemap.addTilesetImage('tiles', 'tileset');
    this.bgLayer = this._tilemap.createStaticLayer('background', this.tilesetImage, 0, 0);
    this.platformLayer = this._tilemap.createStaticLayer('platforms', this.tilesetImage, 0, 0);
    this.platformLayer.setCollisionFromCollisionGroup();
  }
}

const titleScene = {
  key: "title",

  preload() {},

  create() {
    const title = this.add.text(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT * 0.2,
      "AWAY WITH ME!",
      {
        fontSize: 30
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

  preload() {
    Tilemap.preload(this);
    Player.preload(this);
  },

  create() {
    this.keys = this.input.keyboard.createCursorKeys();

    this.tilemap = new Tilemap(this);

    this.player = new Player(this, 50, CANVAS_HEIGHT * 0.8);
    this.add.existing(this.player);
    this.physics.add.existing(this.player);

    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
    this.cameras.main.setBounds(
      -Infinity, CANVAS_HEIGHT * -0.05,
      Infinity, CANVAS_HEIGHT * 1.1,
      )
  },

  update() {
    this.player.update(this);
  }
};

window.game = new Phaser.Game({
  type: Phaser.AUTO,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  scale: {
    zoom: Phaser.Scale.Zoom.ZOOM_2X,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: [titleScene, gameScene]
});
