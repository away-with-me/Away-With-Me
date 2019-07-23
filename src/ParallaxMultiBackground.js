import Phaser from "phaser";
import { CANVAS_WIDTH } from "./constants";

export default class ParallaxMultiBackground extends Phaser.GameObjects.Container {
  constructor({ scene, x = 0, y = 0, textures, parallaxEffect = 1.0 }) {
    const tile0 = new BackgroundTile({ scene, textures });

    let effectiveWidth = tile0.width / parallaxEffect;
    let rightMostEdge = tile0.width;
    const tiles = [tile0];
    let neededCount = Math.ceil(CANVAS_WIDTH / effectiveWidth) + 1;

    // start at one because tile 0 is already constructed
    for (let i = 1; i < neededCount; i++) {
      tiles.push(new BackgroundTile({ scene, x: rightMostEdge, textures }));
      rightMostEdge += tile0.width;
    }

    super(scene, x, y, tiles);
    this.tiles = tiles;
    this.leftIndex = 0;
    this.lastCameraLeft = null;
    this.parallaxEffect = parallaxEffect;
  }

  update(scene) {
    const camera = scene.cameras.main;

    if (this.parallaxEffect != 1) {
      if (this.lastCameraLeft === null) {
        this.lastCameraLeft = camera.worldView.left;
      }
      let cameraMotion = this.lastCameraLeft - camera.worldView.left;
      this.lastCameraLeft = camera.worldView.left;

      // The backgrounds stay fixed in the world, and so visually would have moved
      // a distance of `cameraMotion` since the last update. We want to slow that
      // visual motion by a factor of `this.parallaxEffect`. (Ie, effects > 1 slow
      // the motion).

      let dx = cameraMotion * (this.parallaxEffect - 1);
      if (isNaN(dx)) {
        throw new Error("nope");
      }
      for (const tile of this.tiles) {
        tile.x += dx;
      }
    }

    const bounds = this.tiles.map(tile => tile.getBounds());
    let leftEdge = Math.min(...bounds.map(b => b.left));
    let rightEdge = Math.max(...bounds.map(b => b.right));

    // we know that there is enough to cover the full camera (assuming it
    // doesn't zoom/rotate), so only move the left most or right most image.
    if (camera.worldView.right > rightEdge) {
      // move the left-most image to the right side
      this.tiles[this.leftIndex].x = rightEdge;
      this.leftIndex = (this.leftIndex + 1) % this.tiles.length;
    } else if (camera.worldView.left < leftEdge) {
      // move the right-most image to the left side
      // JS's mod doesn't deal well with negative numbers
      let rightIndex =
        (this.leftIndex + this.tiles.length - 1) % this.tiles.length;
      this.tiles[rightIndex].x = leftEdge - this.tiles[rightIndex].width;
      this.leftIndex = rightIndex;
    }
  }

  nextBackground() {
    for (const tile of this.tiles) {
      tile.nextBackground();
    }
  }
}

class BackgroundTile extends Phaser.GameObjects.Image {
  constructor({ scene, x = 0, y = 0, textures }) {
    super(scene, x, y, textures[0]);
    this.textures = textures;
    this.textureIndex = 0;
    this.setOrigin(0);
  }

  nextBackground() {
    this.textureIndex += 1;
    if (this.textureIndex >= this.textures.length) {
      throw new Error("no more backgrounds");
    }
    this.setTexture(this.textures[this.textureIndex]);
  }
}
