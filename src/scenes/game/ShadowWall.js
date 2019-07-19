import Phaser from "phaser";

import { SHADOW_DX, SHADOW_FOLLOW_DISTANCE, DEPTH_SHADOW_WALL } from "../../constants";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  static preload(scene) {
    scene.load.image("shadow-wall", "shadow-wall.png");
  }

  constructor({
    scene,
    player,
    x = player.x - SHADOW_FOLLOW_DISTANCE,
    y = 0
  }) {
    super(scene, x, y, "shadow-wall");
    this.depth += DEPTH_SHADOW_WALL;
    this.setOrigin(1.0, 0.0);
    this.player = player;
    this.farthestPlayerPosition = player.x;
    this.width = this.displayWidth - 50;
  }

  get targetPosition() {
    return this.farthestPlayerPosition - SHADOW_FOLLOW_DISTANCE;
  }

  update(scene) {
    if (this.player.x > this.farthestPlayerPosition) {
      this.farthestPlayerPosition = this.player.x;
    }
    if (this.x < this.targetPosition) {
      let vel = (this.targetPosition - this.x) / 10 * SHADOW_DX;
      vel = Math.min(Math.max(vel, 1), SHADOW_DX * 2);
      this.setVelocityX(vel);
    } else {
      this.setVelocityX(0);
    }
  }
}
