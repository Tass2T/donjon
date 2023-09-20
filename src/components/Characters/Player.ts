import * as PIXI from "pixi.js";
import constant from "../../constant.js";

export default class Player {
  container: PIXI.Container;
  spriteSheet: PIXI.Spritesheet | null;
  constructor() {
    this.container = new PIXI.Container();
    this.spriteSheet = null;
  }

  async setCharacter() {
    this.spriteSheet = await PIXI.Assets.load("characters/adventurer.json");

    if (this.spriteSheet) {
      const animatedSprite = new PIXI.AnimatedSprite(
        this.spriteSheet.animations["idle"]
      );

      animatedSprite.animationSpeed = 0.1;
      animatedSprite.anchor.set(0.5);
      animatedSprite.x = 100;
      animatedSprite.y = constant.HEIGHT / 1.4;
      this.container.addChild(animatedSprite);
      animatedSprite.play();
    }
  }

  update(inputs: Array<String>) {}
}
