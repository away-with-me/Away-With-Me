import Phaser from "phaser";
import Button from "./Button";
import AnchorTree from "./AnchorTree";
import {
  DEPTH_TILES,
  DEPTH_FOREGROUND,
  DEPTH_BACKGROUND
} from "../../constants";

const LEFT = 0;
const MIDDLE = 1;
const RIGHT = 2;

const ITEM_TYPES = {
  button: Button,
  anchor_tree: AnchorTree
};

export default class TilemapManager {
  static preload(scene) {
    scene.load.spritesheet("tileset", "tiles.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    scene.load.tilemapTiledJSON("tilemap", "tilemap.json");
    for (const ItemClass of Object.values(ITEM_TYPES)) {
      ItemClass.preload(scene);
    }
  }

  constructor(scene) {
    this.tilemaps = []; // Could use a better name
    for (let k = 0; k < 3; k++) {
      const tilemap = scene.make.tilemap({ key: "tilemap" });
      const tilesetImage = tilemap.addTilesetImage("tiles", "tileset");
      const platformLayer = tilemap.createStaticLayer(
        "platforms-1",
        tilesetImage,
        0,
        0
      );
      platformLayer.setCollisionByProperty({ collides: true });
      platformLayer.depth = DEPTH_TILES;
      this.tilemaps.push({
        tilemap,
        platformLayer,
        tilesetImage,
        extraLayers: []
      });
    }

    this.tileWidth = this.tilemaps[LEFT].tilemap.tileWidth;
    this.mapWidthTiles = this.tilemaps[LEFT].tilemap.width;
    this.mapWidth = this.tileWidth * this.mapWidthTiles;

    this.items = [];
    const itemLayer = this.tilemaps[LEFT].tilemap.getObjectLayer("items");
    for (const itemObject of itemLayer.objects) {
      const ItemClass = ITEM_TYPES[itemObject.type];
      if (!ItemClass) {
        throw new Error(
          `Unknown item type found in map: "${itemObject.type}" for item`,
          itemObject
        );
      }

      const offsetX = (
        (itemObject.properties || []).find(p => p.name == "offsetX") || {
          value: 0
        }
      ).value;
      const offsetY = (
        (itemObject.properties || []).find(p => p.name == "offsetY") || {
          value: 0
        }
      ).value;

      const item = new ItemClass({
        scene,
        // Tiled coordinates are top-left, sprite coordinates are center of sprite
        x: itemObject.x + itemObject.width / 2 + offsetX,
        y: itemObject.y + itemObject.height / 2 + offsetY,
        mapObject: itemObject
      });

      scene.add.existing(item);
      scene.physics.add.existing(item);

      item.originalX = itemObject.x;
      item.originalY = itemObject.y;
      item.body.allowGravity = false;
      item.depth = DEPTH_FOREGROUND;

      this.items.push(item);
      item.on("destroy", () => {
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
      item.x = x + item.originalX + item.width / 2;
    }
  }

  setTilemapX(side, x) {
    const sideTilemap = this.tilemaps[side];
    sideTilemap.platformLayer.x = x;
    for (const layer of sideTilemap.extraLayers) {
      layer.x = x;
    }
  }

  addExtraLayer(scene, layerName, { bg = false } = {}) {
    for (const tilemap of this.tilemaps) {
      const extraLayer = tilemap.tilemap.createStaticLayer(
        layerName,
        tilemap.tilesetImage,
        tilemap.platformLayer.x,
        tilemap.platformLayer.y
      );
      extraLayer.setCollisionByProperty({ collides: true });
      if (bg) {
        extraLayer.depth = DEPTH_BACKGROUND;
      } else {
        extraLayer.depth = DEPTH_TILES;
      }
      scene.physics.add.collider(scene.player, extraLayer);
      tilemap.extraLayers.push(extraLayer);
    }
  }

  // Given the name of an object in the tilemap, searches all object layers for
  // a corresponding object and returns the first one encountered or null if
  // none are encountered.
  findObject(objectLayer, objectName) {
    let objectLayers = Phaser.Utils.Array.GetAll(
      this.tilemaps[LEFT].tilemap.objects
    );
    for (let objectLayer of objectLayers) {
      let object = Phaser.Utils.Array.GetFirst(
        objectLayer.objects,
        "type",
        objectName
      );
      if (object !== null) {
        return object;
      }
    }
    return null;
  }

  update(scene) {
    // Shift the maps if the player leaves the bounds of the middle map to simulate
    // an infinitely-scrolling map.
    const middleTilemapLayer = this.tilemaps[MIDDLE].platformLayer;
    if (
      scene.player.x < middleTilemapLayer.x ||
      scene.player.x > middleTilemapLayer.x + this.mapWidth
    ) {
      const newX = scene.player.x - (scene.player.x % this.mapWidth);
      this.setMiddleTilemapX(newX);
    }

    for (const item of this.items) {
      item.update(scene);
    }
  }
}
