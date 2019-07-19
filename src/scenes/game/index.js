import TilemapManager from "./TilemapManager";
import Player from "./Player";
import ShadowWall from "./ShadowWall";
import AnchorTree from "./AnchorTree";
import { WORLD_HEIGHT, GROUND_LEVEL, CANVAS_WIDTH } from "../../constants";

const gameScene = {
  key: "game",

  preload() {
    TilemapManager.preload(this);
    Player.preload(this);
    ShadowWall.preload(this);
    AnchorTree.preload(this);
  },

  create() {
    this.keys = this.input.keyboard.createCursorKeys();

    this.tilemapManager = new TilemapManager(this);

    const playerStart = this.tilemapManager.findObject('markers', 'player_start');
    this.player = new Player(this, playerStart.x, playerStart.y);
    this.add.existing(this.player);
    this.physics.add.existing(this.player);
    this.player.setScale(2, 2);

    for (const {platformLayer} of this.tilemapManager.tilemaps) {
      this.physics.add.collider(this.player, platformLayer);
    }

    this.shadowWall = new ShadowWall({ scene: this, player: this.player });
    this.add.existing(this.shadowWall);
    this.physics.add.existing(this.shadowWall);
    this.shadowWall.body.allowGravity = false;

    this.physics.add.collider(this.player, this.shadowWall, () => {
      this.scene.switch("gameOver");
    })

    this.cameras.main.startFollow(this.player, true, 1.0, 1.0, -CANVAS_WIDTH * 0.1);
    this.cameras.main.setBounds(0, 0, Infinity, WORLD_HEIGHT);
  },

  update() {
    this.player.update(this);
    this.shadowWall.update(this);
    this.tilemapManager.update(this);
  }
};

export default gameScene;
