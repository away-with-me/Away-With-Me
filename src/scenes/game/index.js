import TilemapManager from "./TilemapManager";
import Player from "./Player";
import ShadowWall from "./ShadowWall";
import { WORLD_HEIGHT, WORLD_WIDTH, CANVAS_WIDTH } from "../../constants";

const gameScene = {
  key: "game",


  create() {
    this.keys = this.input.keyboard.createCursorKeys();

    for(let x = 10; x > 0; x--){
      this.add.image( (272)*x, 170, 'bg0');
      this.add.image( (272)*x, 170, 'bg1');
      this.add.image( (272)*x, 170, 'bg2');
      this.add.image( (272)*x, 170, 'bg3');
    }

    this.add.image( 0, 170, 'bg0');
    this.add.image( 0, 170, 'bg1');
    this.add.image( 0, 170, 'bg2');
    this.add.image( 0, 170, 'bg3');

    this.tilemapManager = new TilemapManager(this);

    const playerStart = this.tilemapManager.findObject(
      "markers",
      "player_start"
    );
    
    

    this.player = new Player(this, playerStart.x, playerStart.y);
    this.add.existing(this.player);
    this.physics.add.existing(this.player);
    this.player.body.width = this.player.width - 4;
    this.player.body.offset.x = 2;

    for (const { platformLayer } of this.tilemapManager.tilemaps) {
      this.physics.add.collider(this.player, platformLayer);
    }

    

    this.shadowWall = new ShadowWall({ scene: this, player: this.player });
    this.add.existing(this.shadowWall);
    this.physics.add.existing(this.shadowWall);
    this.shadowWall.body.allowGravity = false;

    this.physics.add.collider(this.player, this.shadowWall, () => {
      this.scene.transition({ target: "gameOver" });
    });

    // this.background = new Background({scene: this, x: WORLD_WIDTH/2, y: WORLD_HEIGHT/2});
    // this.add.group.existing(this.background);

    

    this.cameras.main.startFollow(
      this.player,
      true,
      1.0,
      1.0,
      -CANVAS_WIDTH * 0.1
    );
    this.cameras.main.setBounds(0, 0, Infinity, WORLD_HEIGHT);
  },

  update() {
    this.player.update(this);
    this.shadowWall.update(this);
    this.tilemapManager.update(this);
  }
};

export default gameScene;
