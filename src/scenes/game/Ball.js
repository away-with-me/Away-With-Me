import Phaser from "phaser";

export default class Ball extends Phaser.Physics.Arcade.Sprite {
  static preload(scene) {
    scene.load.audio('item', 'item.mp3');
  }

  constructor(scene, x = 0, y = 0, mapObject) {
    super(scene, x, y, 'tileset', 4);
    this.sound = scene.sound.add('item');
    this.extraLayer = mapObject.properties.extraLayer;
  }

  update(scene) {
    if (scene.physics.overlap(scene.player, this)) {
      this.sound.play();
      scene.tilemapManager.addExtraLayer(scene, this.extraLayer);
      this.destroy();
    }
  }
}
