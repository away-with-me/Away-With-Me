import Phaser from 'phaser';

const LEFT = 0;
const MIDDLE = 1;
const RIGHT = 2;

export default class TilemapManager {
  static preload(scene) {
    scene.load.image('tileset', 'tiles.png');
    scene.load.tilemapTiledJSON('tilemap', 'tilemap.json');
  }

  constructor(scene) {
    this.tilemaps = []; // Could use a better name
    for (let k = 0; k < 3; k++) {
      const tilemap = scene.make.tilemap({key: 'tilemap'});
      const tilesetImage = tilemap.addTilesetImage('tiles', 'tileset');
      const backgroundLayer = tilemap.createStaticLayer('background', tilesetImage, 0, 0);
      const platformLayer = tilemap.createStaticLayer('platforms', tilesetImage, 0, 0);
      platformLayer.setCollisionFromCollisionGroup();
      this.tilemaps.push({tilemap, backgroundLayer, platformLayer});
    }

    this.tileWidth = this.tilemaps[LEFT].tilemap.tileWidth;
    this.mapWidthTiles = this.tilemaps[LEFT].tilemap.width;
    this.mapWidth = this.tileWidth * this.mapWidthTiles;

    this.setMiddleTilemapX(0);
  }

  setMiddleTilemapX(x) {
    this.setTilemapX(LEFT, x - this.mapWidth);
    this.setTilemapX(MIDDLE, x);
    this.setTilemapX(RIGHT, x + this.mapWidth);
  }

  setTilemapX(side, x) {
    this.tilemaps[side].backgroundLayer.x = x;
    this.tilemaps[side].platformLayer.x = x;
  }

  // Given the name of an object in the tilemap, searches all object layers for
  // a corresponding object and returns the first one encountered or null if
  // none are encountered.
  findObject(objectName) {
    let objectLayers = Phaser.Utils.Array.GetAll(this.tilemaps[LEFT].tilemap.objects);
    for (let objectLayer of objectLayers) {
      let object = Phaser.Utils.Array.GetFirst(objectLayer.objects, "name", objectName);
      if (object !== null) {
        return object;
      }
    }
    return null;
  }

  update(scene) {
    // Shift the maps if the player leaves the bounds of the middle map to simulate
    // an infinitely-scrolling map.
    const middleTilemapLayer = this.tilemaps[MIDDLE].backgroundLayer;
    if (scene.player.x < middleTilemapLayer.x || scene.player.x > (middleTilemapLayer.x + this.mapWidth)) {
      const newX = scene.player.x - (scene.player.x % this.mapWidth);
      this.setMiddleTilemapX(newX);
    }
  }
}
