import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants";

const CREDITS_TEXT_1 = `\
= PROGRAMMING =
Osmose
Michael Cooper
Juniper Wilde
Dana Keeler
`;

const CREDITS_TEXT_2 = `\
= ART =
Sam McGahan


= SOUND and MUSIC =
Nate Wehe
`;

const creditsScene = {
  key: "credits",

  preload() {
    this.load.image('pig', 'pig.png');
  },

  create() {
    this.add.rectangle(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      0x000000
    );
    this.text1 = this.add.text(
      CANVAS_WIDTH / 4,
      75,
      CREDITS_TEXT_1,
      { align: "center" }
    );
    this.text1.setOrigin(0.5, 0.5);

    this.text2 = this.add.text(
      (3 * CANVAS_WIDTH) / 4,
      75,
      CREDITS_TEXT_2,
      { align: "center" }
    );
    this.text2.setOrigin(0.5, 0.5);

    this.add.image(312, 55, "pig");
    this.add.image(292, 55, "pig");
    this.add.image(332, 55, "pig");

    this.cursorKeys = this.input.keyboard.createCursorKeys();
  },

  update() {
    if (this.cursorKeys.space.isDown) {
      this.scene.transition({ target: "00_title", duration: 0 });
    }
  }
};

export default creditsScene;
