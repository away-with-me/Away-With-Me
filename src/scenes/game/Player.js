import Phaser from "phaser";

import { PLAYER_DX, PLAYER_DY, DEPTH_PLAYER } from "../../constants";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  static preload(scene) {
    scene.load.image("player", "player.png");
  }

  constructor(scene, x = 0, y = 0) {
    super(scene, x, y, "player");
    this.depth = DEPTH_PLAYER;
  }

  update(scene) {
    let dx = 0;
    if (scene.keys.left.isDown) {
      dx -= PLAYER_DX;
    }
    if (scene.keys.right.isDown) {
      dx += PLAYER_DX;
    }

    if (scene.keys.space.isDown && this.body.blocked.down) {
      this.body.setVelocityY(-PLAYER_DY);
    }


    // This is all set up for mythmon's 8bitdo SF30 Pro in bluetooth Xinput mode
    let pad = scene.input.gamepad.pad1;
    if (pad) {
      // joystick
      if (Math.abs(pad.axes[0].value) > pad.axes[0].threshold) {
        dx += pad.axes[0].value * PLAYER_DX
      }
      // dpad
      if (Math.abs(pad.axes[6].value) > pad.axes[6].threshold) {
        dx += pad.axes[6].value * PLAYER_DX
      }

      if (pad.B && this.body.blocked.down) {
        this.body.setVelocityY(-PLAYER_DY);
      }
    }

    this.setVelocityX(dx);

  }
}
