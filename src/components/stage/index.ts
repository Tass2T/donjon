import * as PIXI from "pixi.js";
import constant from "../../constant.js";

export default class Level {
  container: PIXI.Container;
  groundContainer: PIXI.Container;
  constructor() {
    this.container = new PIXI.Container();
    this.groundContainer = new PIXI.Container();
    this.container.addChild(this.groundContainer);

    this.setGround();
  }

  setGround() {
    this.groundContainer.x = -10;
    this.groundContainer.y = constant.HEIGHT - (constant.HEIGHT / 100) * 50;
    const groundTexture = PIXI.Texture.from("ground/groundTile.png");
    const nbOfLine = ((constant.HEIGHT / 100) * 50) / 30;

    for (let j = 0; j < nbOfLine; j++) {
      for (let i = 0; i <= 3000; i += 88) {
        const groundSprite = PIXI.Sprite.from(groundTexture);
        groundSprite.x = i - j * 11;
        groundSprite.y = j * 26;
        groundSprite.width = 100;
        groundSprite.height = 100;
        this.groundContainer.addChild(groundSprite);
      }
    }
  }
}
