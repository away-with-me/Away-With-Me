import Phaser from 'phaser';
import Ball from './Ball';

const LEFT = 0;
const MIDDLE = 1;
const RIGHT = 2;

const ITEM_TYPES = {
  'ball': Ball,
}

export default class TilemapManager {
  static preload(scene) {
    scene.load.spritesheet('tileset', 'tiles.png', {frameWidth: 16, frameHeight: 16});
    scene.load.tilemapTiledJSON('tilemap', 'tilemap.json');
    Ball.preload(scene);
  }

  constructor(scene) {
    this.tilemaps = []; // Could use a better name
    for (let k = 0; k < 3; k++) {
      const tilemap = scene.make.tilemap({key: 'tilemap'});
      const tilesetImage = tilemap.addTilesetImage('tiles', 'tileset');
      const backgroundLayer = tilemap.createStaticLayer('background', tilesetImage, 0, 0);
      const platformLayer = tilemap.createStaticLayer('platforms', tilesetImage, 0, 0);
      platformLayer.setCollisionFromCollisionGroup();
      this.tilemaps.push({
        tilemap,
        backgroundLayer,
        platformLayer,
        tilesetImage,
        extraLayers: [],
      });
    }

    this.tileWidth = this.tilemaps[LEFT].tilemap.tileWidth;
    this.mapWidthTiles = this.tilemaps[LEFT].tilemap.width;
    this.mapWidth = this.tileWidth * this.mapWidthTiles;

    this.items = [];
    const itemLayer = this.tilemaps[LEFT].tilemap.getObjectLayer('items');
    for (const itemObject of itemLayer.objects) {
      const ItemClass = ITEM_TYPES[itemObject.type];
      const item = new ItemClass(
        scene,
        // Tiled coordinates are top-left, sprite coordinates are center of sprite
        itemObject.x + (itemObject.width / 2),
        itemObject.y - (itemObject.height / 2), // Why is this minus instead of plus?,
        itemObject,
      );

      scene.add.existing(item);
      scene.physics.add.existing(item);

      item.originalX = itemObject.x;
      item.originalY = itemObject.y;
      item.body.allowGravity = false;

      this.items.push(item);
      item.on('destroy', () => {
        this.items = this.items.filter(i => i !== item);
      });
    }

    this.setMiddleTilemapX(0);
  }

  setMiddleTilemapX(x) {
    this.setTilemapX(LEFT, x - this.mapWidth);
    this.setTilemapX(MIDDLE, x);
    this.setTilemapX(RIGHT, x + this.mapWidth);
    for (const item of this.items) {
      item.x = x + item.originalX + (item.width / 2);
    }
  }

  setTilemapX(side, x) {
    const sideTilemap = this.tilemaps[side];
    sideTilemap.backgroundLayer.x = x;
    sideTilemap.platformLayer.x = x;
    for (const layer of sideTilemap.extraLayers) {
      layer.x = x;
    }
  }

  addExtraLayer(scene, layerName) {
    for (const tilemap of this.tilemaps) {
      const extraLayer = tilemap.tilemap.createStaticLayer(
        layerName,
        tilemap.tilesetImage,
        tilemap.platformLayer.x,
        tilemap.platformLayer.y,
      );
      extraLayer.setCollisionFromCollisionGroup();
      scene.physics.add.collider(scene.player, extraLayer);
      tilemap.extraLayers.push(extraLayer);
    }
  }

  // Given the name of an object in the tilemap, searches all object layers for
  // a corresponding object and returns the first one encountered or null if
  // none are encountered.
  findObject(objectLayer, objectName) {
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

    for (const item of this.items) {
      item.update(scene);
    }
  }
}
