import Phaser from "phaser";

const WIDTH = 256;
const HEIGHT = 256;

const PLAYER_DX = 30;

class Player extends Phaser.Physics.Arcade.Sprite {
  static preload(scene) {
    scene.load.image('player', 'player.png');
  }

  constructor(scene, x = 0, y = 0) {
    super(scene, x, y, 'player');
  }

  update(scene) {
    let dx = 0;
    if (scene.keys.left.isDown) {
      dx -= PLAYER_DX;
    }
    if (scene.keys.right.isDown) {
      dx += PLAYER_DX;
    }

    this.setVelocityX(dx);
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
    const title = this.add.text(WIDTH / 2, HEIGHT * 0.2, "AWAY WITH ME!", {
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

  preload() {
    Tilemap.preload(this);
    Player.preload(this);
  },

  create() {
    this.keys = this.input.keyboard.createCursorKeys();

    this.tilemap = new Tilemap(this);

    this.player = new Player(this, 50, 50);
    this.add.existing(this.player);
    this.physics.add.existing(this.player);
  },

  update() {
    this.player.update(this);
  }
};

window.game = new Phaser.Game({
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
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
