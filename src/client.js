import Phaser from "phaser";

const CANVAS_WIDTH = 256;
const CANVAS_HEIGHT = 192;
const WORLD_HEIGHT = 256;

const PLAYER_DX = 100;
const PLAYER_DY = -170;

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

    if (scene.keys.space.isDown && this.body.blocked.down) {
      this.body.setVelocityY(PLAYER_DY);
    }
  }
}

class TilemapManager {
  static preload(scene) {
    scene.load.image('tileset', 'tiles.png');
    scene.load.tilemapTiledJSON('tilemap', 'tilemap.json');
  }

  constructor(scene) {
    this.tilemap = scene.make.tilemap({key: 'tilemap'});
    this.tilesetImage = this.tilemap.addTilesetImage('tiles', 'tileset');
    this.bgLayer = this.tilemap.createStaticLayer('background', this.tilesetImage, 0, 0);
    this.platformLayer = this.tilemap.createStaticLayer('platforms', this.tilesetImage, 0, 0);
    this.platformLayer.setCollisionFromCollisionGroup();
  }

  findObject(objectName) {
    let objectLayers = Phaser.Utils.Array.GetAll(this.tilemap.objects);
    for (let objectLayer of objectLayers) {
      let object = Phaser.Utils.Array.GetFirst(objectLayer, "name", objectName);
      if (object !== null) {
        return object;
      }
    }
    return null;
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
      },
    );
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
    TilemapManager.preload(this);
    Player.preload(this);
  },

  create() {
    this.keys = this.input.keyboard.createCursorKeys();

    this.tilemapManager = new TilemapManager(this);
    const playerStart = this.tilemapManager.findObject("player_start");
    this.player = new Player(this, playerStart.x, playerStart.y);
    this.add.existing(this.player);
    this.physics.add.existing(this.player);

    this.physics.add.collider(this.player, this.tilemapManager.platformLayer);

    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setBounds(
      0, 0,
      Infinity, WORLD_HEIGHT,
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
      gravity: { y: 350 }
    }
  },
  scene: [titleScene, gameScene]
});
