import Phaser from "phaser";

import { PLAYER_DX, PLAYER_DY } from "../../constants";

const BLINK_MUL = 1.2;
const BLINK_DURATION = 8;

export default class AnchorTree extends Phaser.GameObjects.Sprite {
  static preload(scene) {
    scene.load.image("anchor-tree", "AnchorTree-ByErro.png");
    scene.load.image("tree-eyes", "CreepyEyes-ByErro.png");
  }

  constructor({ scene, x = 0, y = 0 }) {
    super(scene, x, y, "anchor-tree");
    this.setOrigin(0.5, 1.0);

    scene.add.existing(this);

    this.eyes = new Phaser.GameObjects.Sprite(scene, x + 5, y - 65, "tree-eyes");
    scene.add.existing(this.eyes);

    this._animation_state = "OPEN";
    this._animation_frame = 0;
  }

  update(scene) {
    switch(this._animation_state) {
      case "OPEN": {
        if (Math.random() < 0.002) {
          this._animation_state = "BLINKING";
        }
        break;
      }
      case "BLINKING": {
        this.eyes.displayHeight /= BLINK_MUL;
        this._animation_frame += 1;
        if (this._animation_frame >= BLINK_DURATION) {
          this._animation_frame = 0;
          this._animation_state = "OPENING";
        }
        break;
      }
      case "OPENING": {
        this.eyes.displayHeight *= BLINK_MUL;
        this._animation_frame += 1;
        if (this._animation_frame >= BLINK_DURATION) {
          this._animation_frame = 0;
          this._animation_state = "OPEN";
        }
        break;
      }
      default: {
        throw new Error(`Unknown state ${this._animation_state}`);
      }
    }
  }
}
