import Phaser from "phaser";

import gameScene from "./scenes/game";
import titleScene from "./scenes/title";
import gameOverScene from "./scenes/gameOver";
import creditsScene from "./scenes/credits";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants";

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
      debug: false,
      gravity: { y: 350 }
    }
  },
  scene: [titleScene, gameScene, gameOverScene, creditsScene],
  input: {
    gamepad: true
  }
});
