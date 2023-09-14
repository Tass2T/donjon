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
    this.groundContainer.x = -40;
    this.groundContainer.y = constant.HEIGHT - (constant.HEIGHT / 100) * 36;
    const groundTexture = PIXI.Texture.from("ground/groundTile.png");
    const nbOfLine = Math.floor(((constant.HEIGHT / 100) * 40) / 30);
    console.log(nbOfLine);

    for (let j = 0; j < nbOfLine; j++) {
      for (let i = 0; i <= 3000; i += 114) {
        const groundSprite = PIXI.Sprite.from(groundTexture);
        groundSprite.x = i - j * 32;
        groundSprite.y = j * 28;
        groundSprite.width = 150;
        groundSprite.height = 150;
        this.groundContainer.addChild(groundSprite);
      }
    }
  }
}
