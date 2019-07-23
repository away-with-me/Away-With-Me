import Phaser from "phaser";

import TilemapManager from "./game/TilemapManager";
import Player from "./game/Player";
import ShadowWall from "./game/ShadowWall";
import AnchorTree from "./game/AnchorTree";
import Button from "./game/AnchorTree";

import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants";

const loadingScene = {
  key: "loading",

  // load these files before even the preload step, so they are available to
  // draw the loading bar.
  pack: {
    files: [
      {
        type: "image",
        key: "title-bg",
        url: "title/main.png"
      },
      {
        type: "image",
        key: "loading-bar",
        url: "loadingBar.png"
      }
    ]
  },

  // assets for the preload screen
  preload() {
    this.bg = this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "title-bg");

    let bgNames = ["back-trees", "lights", "middle-trees", "front-trees"];
    for (const color of ["BW", "Blue", "Red", "Yellow"]) {
      for (let index = 0; index < 4; index++) {
        this.load.image(
          `bg${index}-${color.toLowerCase()}`,
          `backgroundset/${color}background/parallax-forest-${
            bgNames[index]
          }.png`
        );
      }
    }

    TilemapManager.preload(this);
    Player.preload(this);
    ShadowWall.preload(this);
    AnchorTree.preload(this);
    Button.preload(this);

    this.load.image("cursor", "title/cursor.png");
    this.load.image("start-button", "title/start-button.png");
    this.load.image("controls-button", "title/controls-button.png");
    this.load.image("credits-button", "title/credits-button.png");
    this.load.image("button-red", "RedButton.png");
    this.load.image("button-blue", "BlueButton.png");
    this.load.image("button-yellow", "YellowButton.png");

    this.load.audio("bgm-game-1", "sounds/AWM - Ambient 1checkFinal.mp3");
    this.load.audio("bgm-game-2", "sounds/AWM - Keys 2checkFinal.mp3");
    this.load.audio("bgm-game-3", "sounds/AWM - Strings 3checkfinal.mp3");
    this.load.audio("bgm-game-4", "sounds/AWM - Horns 4checkFinal.mp3");
    this.load.audio("bgm-gameover", "sounds/shadowbeingMasteredLong.mp3");
    this.load.audio("sfx-shadow-wall", "sounds/shadowWhisperFinal.mp3");

    this.loadingBar = this.add.image(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      "loading-bar"
    );
    this.loadingBar.setScale(0, 1);

    this.load.on("progress", value => this.loadingBar.setScale(value, 1));
    this.load.on("load", file =>
      console.log(`loaded file key=${file.key} url=${file.url}`)
    );
  },

  create() {
    console.log("Switching to title screen from create method");
    clearTimeout(this.fallbackTimeout);
    this.scene.switch("title");
  }
};

export default loadingScene;
