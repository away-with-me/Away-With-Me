import TilemapManager from "./TilemapManager";
import Player from "./Player";
import ShadowWall from "./ShadowWall";
import { WORLD_HEIGHT, CANVAS_WIDTH } from "../../constants";
import ParallaxBackground from "../../ParallaxBackground";

const gameScene = {
  key: "game",

  create() {
    this.keys = this.input.keyboard.createCursorKeys();

    this.backgrounds = [];
    for (let i = 0; i < 4; i++) {
      let bg = new ParallaxBackground({
        scene: this,
        texture: `bg${i}`,
        y: 90,
        parallaxEffect: 1 + (3 - i) * 0.05
      });
      this.backgrounds.push(bg);
      this.add.existing(bg);
    }

    this.tilemapManager = new TilemapManager(this);

    const playerStart = this.tilemapManager.findObject(
      "markers",
      "player_start"
    );

    this.player = new Player(this, playerStart.x, playerStart.y);
    this.add.existing(this.player);
    this.physics.add.existing(this.player);
    this.player.body.width = this.player.width - 4;
    this.player.body.offset.x = 2;

    for (const { platformLayer } of this.tilemapManager.tilemaps) {
      this.physics.add.collider(this.player, platformLayer);
    }

    this.shadowWall = new ShadowWall({ scene: this, player: this.player });
    this.add.existing(this.shadowWall);
    this.physics.add.existing(this.shadowWall);
    this.shadowWall.body.allowGravity = false;

    this.physics.add.collider(this.player, this.shadowWall, () => {
      this.scene.transition({ target: "gameOver" });
    });

    this.cameras.main.startFollow(
      this.player,
      true,
      1.0,
      1.0,
      -CANVAS_WIDTH * 0.1
    );
    this.cameras.main.setBounds(0, 0, Infinity, WORLD_HEIGHT);
  },

  update() {
    this.player.update(this);
    this.shadowWall.update(this);
    this.tilemapManager.update(this);
    for (const bg of this.backgrounds) {
      bg.update(this);
    }
  }
};

export default gameScene;
