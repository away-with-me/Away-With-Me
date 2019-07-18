import {CANVAS_HEIGHT, CANVAS_WIDTH} from "../constants";

const CURSOR_X = 40;
const CURSOR_START_Y = 85;
const CURSOR_CONTROLS_Y = 105;
const CURSOR_CREDITS_Y = 125;

const menuSelectedEnum = {
  "Start": 0,
  "Controls": 1,
  "Credits": 2
};

let menuState = menuSelectedEnum.Start;

const titleScene = {
  key: "title",


  preload() {
    this.load.image('main', 'title/main.png');
    this.load.image('cursor', 'title/cursor.png');
  },

  create() {
    this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'main');
    this.add.image(CURSOR_X, CURSOR_START_Y, 'cursor');
    this.cursorKeys = this.input.keyboard.createCursorKeys();
  },

  update() {
    if (this.cursorKeys.space.isDown) {
      console.log(menuState);
      if (menuState === menuSelectedEnum.Start) {
        this.scene.switch("game");
      }
    }
  }
};

export default titleScene;
