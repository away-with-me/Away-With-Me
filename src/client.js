import Phaser from "phaser";

import { CANVAS_HEIGHT, CANVAS_WIDTH, GRAVITY_STRENGTH, DEBUG } from "./constants";
import controlsScene from "./scenes/controls";
import creditsScene from "./scenes/credits";
import gameOverScene from "./scenes/gameOver";
import gameScene from "./scenes/game";
import loadingScene from "./scenes/loading"
import titleScene from "./scenes/title";

window.game = new Phaser.Game({
  type: Phaser.AUTO,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  scale: {
    zoom: 3
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: DEBUG,
      gravity: { y: GRAVITY_STRENGTH }
    }
  },
  scene: [
    loadingScene,
    titleScene,
    gameScene,
    gameOverScene,
    controlsScene,
    creditsScene
  ],
  input: {
    gamepad: true
  },
  audio: {
    noAudio: new URL(window.location).searchParams.has("noaudio")
  }
});
