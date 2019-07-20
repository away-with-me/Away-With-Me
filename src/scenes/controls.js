import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants";

const CONTROLS_TEXT_HEADER = '= CONTROLS =';

const CONTROLS_TEXT_LEFT  = `\
move left
move right
jump
`;

const CONTROLS_TEXT_RIGHT = `\
left arrow key
right arrow key
spacebar
`;

const controlsScene = {
  key: "controls",

  create() {
    this.add.rectangle(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      0x000000
    );
    this.text1 = this.add.text(
      (CANVAS_WIDTH / 2) - 12,
      25,
      CONTROLS_TEXT_HEADER,
      { align: "center" }
    );
    this.text1.setOrigin(0.5, 0.5);

    this.text2 = this.add.text(
      CANVAS_WIDTH / 4,
      75,
      CONTROLS_TEXT_LEFT,
      { align: "right" }
    );
    this.text2.setOrigin(0.5, 0.5);

    this.text3 = this.add.text(
      (3 * CANVAS_WIDTH) / 4,
      75,
      CONTROLS_TEXT_RIGHT,
      { align: "left" }
    );
    this.text3.setOrigin(0.5, 0.5);

    this.cursorKeys = this.input.keyboard.createCursorKeys();
  },

  update() {
    if (this.cursorKeys.space.isDown) {
      this.scene.transition({ target: "00_title", duration: 0 });
    }
  }
};

export default controlsScene;
