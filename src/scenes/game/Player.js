import Phaser from "phaser";

import {PLAYER_DX, PLAYER_DY} from "../../constants";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  static preload(scene) {
    scene.load.image('player', 'player.png');
  }

  constructor(scene, x = 0, y = 0) {
    super(scene, x, y, 'player');
  }

  update(scene) {
    let dx = 0;
    if (scene.keys.left.isDown) {
      dx -= PLAYER_DX;
    }
    if (scene.keys.right.isDown) {
      dx += PLAYER_DX;
    }
    this.setVelocityX(dx);

    if (scene.keys.space.isDown && this.body.blocked.down) {
      this.body.setVelocityY(PLAYER_DY);
    }
  }
}
