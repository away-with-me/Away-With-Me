export default class TilemapManager {
  static preload(scene) {
    scene.load.image('tileset', 'tiles.png');
    scene.load.tilemapTiledJSON('tilemap', 'tilemap.json');
  }

  constructor(scene) {
    this.tilemap = scene.make.tilemap({key: 'tilemap'});
    this.tilesetImage = this.tilemap.addTilesetImage('tiles', 'tileset');
    this.bgLayer = this.tilemap.createStaticLayer('background', this.tilesetImage, 0, 0);
    this.platformLayer = this.tilemap.createStaticLayer('platforms', this.tilesetImage, 0, 0);
    this.platformLayer.setCollisionFromCollisionGroup();
  }

  // Given the name of an object in the tilemap, searches all object layers for
  // a corresponding object and returns the first one encountered or null if
  // none are encountered.
  findObject(objectName) {
    let objectLayers = Phaser.Utils.Array.GetAll(this.tilemap.objects);
    for (let objectLayer of objectLayers) {
      let object = Phaser.Utils.Array.GetFirst(objectLayer.objects, "name", objectName);
      if (object !== null) {
        return object;
      }
    }
    return null;
  }
}
