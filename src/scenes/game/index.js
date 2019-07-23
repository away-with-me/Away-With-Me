import TilemapManager from "./TilemapManager";
import Player from "./Player";
import ShadowWall from "./ShadowWall";
import {
  WORLD_HEIGHT,
  CANVAS_WIDTH,
  DEPTH_ABOVE_SHADOW,
  DEBUG
} from "../../constants";
import ParallaxMultiBackground from "../../ParallaxMultiBackground";

const gameScene = {
  key: "game",

  create() {
    this.keys = this.input.keyboard.createCursorKeys();

    this.backgrounds = [];
    for (let i = 0; i < 4; i++) {
      let bg = new ParallaxMultiBackground({
        scene: this,
        textures: ["bw", "blue", "red", "yellow"].map(
          color => `bg${i}-${color}`
        ),
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

    this.cameras.main.startFollow(
      this.player,
      true,
      1.0,
      1.0,
      -CANVAS_WIDTH * 0.1
    );
    this.cameras.main.setBounds(0, 0, Infinity, WORLD_HEIGHT);

    this.musicTracks = [
      this.sound.add("bgm-game-1", { loop: true, volume: 0 }),
      this.sound.add("bgm-game-2", { loop: true, volume: 0 }),
      this.sound.add("bgm-game-3", { loop: true, volume: 0 }),
      this.sound.add("bgm-game-4", { loop: true, volume: 0 })
    ];
    for (const track of this.musicTracks) {
      track.play();
    }

    this.buttonsFoundCount = 0;

    let bgMixes = [
      [1, 0, 0, 0],
      [0.7, 0.8, 0, 0],
      [0.4, 0.8, 0.8, 0],
      [0.2, 0.8, 0.8, 0.8]
    ];

    if (DEBUG) {
      let volumeBars = [0, 1, 2, 3].map(i =>
        this.add
          .rectangle(CANVAS_WIDTH - 80 + 10 * i, 30, 4, 0, 0x00ffff)
          .setScrollFactor(0)
          .setOrigin(0, 1)
          .setDepth(DEPTH_ABOVE_SHADOW)
      );

      setInterval(() => {
        for (let i = 0; i < this.musicTracks.length; i++) {
          volumeBars[i].height = this.musicTracks[i].volume * 25;
        }
      }, 500);
    }

    const setVolumesTo = (volumes, duration = 3000) => {
      for (let i = 0; i < this.musicTracks.length; i++) {
        this.tweens.add({
          targets: this.musicTracks[i],
          volume: volumes[i],
          duration
        });
      }
    };

    setVolumesTo(bgMixes[0]);

    this.events.on("away::buttonCollected", () => {
      this.buttonsFoundCount += 1;
      setVolumesTo(bgMixes[this.buttonsFoundCount]);

      for (const bg of this.backgrounds) {
        bg.nextBackground();
      }
    });

    this.physics.add.collider(this.player, this.shadowWall, () => {
      for (const track of this.musicTracks) {
        track.stop();
      }
      this.scene.transition({ target: "gameOver" });
    });
  },

  update() {
    try {
      this.player.update(this);
      this.shadowWall.update(this);
      this.tilemapManager.update(this);
      for (const bg of this.backgrounds) {
        bg.update(this);
      }
    } catch (e) {
      console.warn("couldn't update", e);
    }
  }
};

export default gameScene;
