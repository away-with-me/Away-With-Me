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
}
