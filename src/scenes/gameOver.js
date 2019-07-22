import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants";

const gameOverScene = {
  key: "gameOver",

  create() {
    this.add.rectangle(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      0x000000
    );
    const text = this.add.text(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT * 0.2,
      "GAME OVER",
      {
        fontSize: 30
      }
    );
    text.setOrigin(0.5, 0.5);

    const music = this.sound.add("bgm-gameover").play({ volume: 1, loop: true });
  },

  update() {}
};

export default gameOverScene;
