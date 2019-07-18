import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants";

const gameOverScene = {
  key: "gameOver",

  preload() {},

  create() {
    const title = this.add.text(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT * 0.2,
      "GAME OVER",
      {
        fontSize: 30
      }
    );
    title.setOrigin(0.5, 0.5);
  },

  update() {}
};

export default gameOverScene;
