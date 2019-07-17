import {CANVAS_HEIGHT, CANVAS_WIDTH} from "../constants";

const titleScene = {
  key: "title",

  preload() {},

  create() {
    const title = this.add.text(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT * 0.2,
      "AWAY WITH ME!",
      {
        fontSize: 30
      },
    );
    title.setOrigin(0.5, 0.5);
    this.cursorKeys = this.input.keyboard.createCursorKeys();
  },

  update() {
    if (this.cursorKeys.space.isDown) {
      this.scene.switch("game");
    }
  }
};

export default titleScene;
