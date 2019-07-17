import TilemapManager from "./TilemapManager";
import Player from "./Player";
import {WORLD_HEIGHT, CANVAS_HEIGHT} from "../../constants";

const gameScene = {
  key: "game",

  preload() {
    TilemapManager.preload(this);
    Player.preload(this);
  },

  create() {
    this.keys = this.input.keyboard.createCursorKeys();

    this.tilemapManager = new TilemapManager(this);

    this.player = new Player(this, 50, CANVAS_HEIGHT * 0.8);
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

export default gameScene;