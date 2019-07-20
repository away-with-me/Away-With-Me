import Phaser from "phaser";

import {CANVAS_HEIGHT, CANVAS_WIDTH} from "../constants";

const menuSelectedEnum = {
  Start: 0,
  Controls: 1,
  Credits: 2
};

const MENU_POS = [
  { x: 180, y: 35 },
  { x: 200, y: 70 },
  { x: 220, y: 105 },
];

const CURSOR_X_OFFSET = -40;

const titleScene = {
  key: "00_title",

  preload() {
    this.load.image('main', 'title/main.png');
    this.load.image('cursor', 'title/cursor.png');
    this.load.image('start-button', 'title/start-button.png');
    this.load.image('controls-button', 'title/controls-button.png');
    this.load.image('credits-button', 'title/credits-button.png');
  },

  create() {
    this.add.image(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'main');
    let cursorPos = MENU_POS[menuSelectedEnum['Start']];
    this.cursor = this.add.image(cursorPos.x + CURSOR_X_OFFSET, cursorPos.y, 'cursor');
    let startPos = MENU_POS[menuSelectedEnum['Start']];
    this.add.image(startPos.x, startPos.y, 'start-button');
    let controlsPos = MENU_POS[menuSelectedEnum['Controls']];
    this.add.image(controlsPos.x, controlsPos.y, 'controls-button');
    let creditsPos = MENU_POS[menuSelectedEnum['Credits']];
    this.add.image(creditsPos.x, creditsPos.y, 'credits-button');
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.menuState = menuSelectedEnum.Start;
  },

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.space)) {
      if (this.menuState === menuSelectedEnum.Start) {
        this.scene.transition({target: "game", duration: 0});
      } else if (this.menuState === menuSelectedEnum.Controls) {
        this.scene.transition({target: "controls", duration: 0, sleep: true});
      } else if (this.menuState === menuSelectedEnum.Credits) {
        this.scene.transition({target: "credits", duration: 0,  sleep: true});
      }
    }
    let changed = false;
    if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.down)) {
      this.menuState++;
      this.menuState = this.menuState % MENU_POS.length
      changed = true;
    } else if (Phaser.Input.Keyboard.JustDown(this.cursorKeys.up)) {
      if (this.menuState == 0) {
        this.menuState = MENU_POS.length;
      }
      this.menuState--;
      changed = true;
    }
    if (changed) {
      let cursorPos = MENU_POS[this.menuState];
      this.cursor.setPosition(cursorPos.x + CURSOR_X_OFFSET, cursorPos.y);
    }
  }
};

export default titleScene;
