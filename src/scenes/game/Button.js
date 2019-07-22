import Phaser from "phaser";

import { DEPTH_FOREGROUND } from "../../constants";

function findProperty(mapObject, name, fallback = null) {
  for (const prop of mapObject.properties) {
    if (prop.name == name) {
      return prop.value;
    }
  }
  return fallback;
}

export default class Button extends Phaser.GameObjects.Sprite {
  static preload(scene) {
    scene.load.audio("item", "item.mp3");
  }

  constructor({ scene, x = 0, y = 0, mapObject }) {
    const color = findProperty(mapObject, "color", "base");
    super(scene, x, y, `button-${color}`);
    this.color = color;
    this.extraLayer = findProperty(mapObject, "extraLayer");
    this.extraBg = findProperty(mapObject, "extraBg");
    this.sound = scene.sound.add("item");
  }

  update(scene) {
    if (scene.physics.overlap(scene.player, this)) {
      this.sound.play();

      if (this.extraLayer) {
        scene.tilemapManager.addExtraLayer(scene, this.extraLayer, {
          bg: false
        });
      }
      if (this.extraBg) {
        scene.tilemapManager.addExtraLayer(scene, this.extraBg, { bg: true });
      }
      console.log(`got ${this.color} button`);
      scene.events.emit("away::buttonCollected", this.color);
      this.destroy();
    }
  }
}
