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

    this.load.image("bg0", "backgroundset/BWbackground/parallax-forest-back-trees.png");
    this.load.image("bg1", "backgroundset/BWbackground/parallax-forest-lights.png");
    this.load.image("bg2", "backgroundset/BWbackground/parallax-forest-middle-trees.png");
    this.load.image("bg3", "backgroundset/BWbackground/parallax-forest-front-trees.png");

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



    this.load.audioSprite({
      key: "audiosprite",
      jsonURL: "sounds/audiosprite.json"
    });


    this.loadingBar = this.add.image(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      "loading-bar"
    );
    this.loadingBar.setScale(0, 1);

    this.load.on("progress", value => {
      this.loadingBar.setScale(value, 1);
      if (value >= 1) {
        this.scene.switch("title");
      }
    });

    this.load.on(Phaser.Loader.Events.FILE_LOAD, file => {
      console.log(`loaded file key=${file.key} url=${file.url}`);
    })
  }
};

export default loadingScene;
