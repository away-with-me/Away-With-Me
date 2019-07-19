import Phaser from "phaser";
import { DEPTH_FOREGROUND, DEPTH_ABOVE_SHADOW } from "../../constants";

const BLINK_PROBABILITY = 0.002;
const BLINK_MUL = 1.2;
const BLINK_DURATION = 8;

export default class AnchorTree extends Phaser.GameObjects.Container {
  static preload(scene) {
    scene.load.image("anchor-tree", "AnchorTree-ByErro.png");
    scene.load.image("tree-eyes", "CreepyEyes-ByErro.png");
  }

  constructor({ scene, x = 0, y = 0 }) {
    super(scene, x, y);
    this.setSize(112, 168)

    this.tree = new Phaser.GameObjects.Sprite(scene, 0, 0, "anchor-tree");
    this.depth += DEPTH_FOREGROUND;
    this.add(this.tree);

    this.eyes = new Phaser.GameObjects.Sprite(scene, 5, 15, "tree-eyes");
    this.eyes.depth += DEPTH_ABOVE_SHADOW;
    this.add(this.eyes);

    this._animation_state = "OPEN";
    this._animation_frame = 0;
  }

  update(scene) {
    switch(this._animation_state) {
      case "OPEN": {
        if (Math.random() < BLINK_PROBABILITY) {
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
