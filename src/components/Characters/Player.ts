import * as PIXI from "pixi.js";
import constant from "../../constant.js";

export default class Player {
  container: PIXI.Container;
  spriteSheet: PIXI.Spritesheet | null;
  animatedSprite: PIXI.AnimatedSprite | null;
  constructor() {
    this.container = new PIXI.Container();
    this.spriteSheet = null;
    this.animatedSprite = null;
  }

  async setCharacter() {
    this.spriteSheet = await PIXI.Assets.load("characters/adventurer.json");

    if (this.spriteSheet) {
      this.animatedSprite = new PIXI.AnimatedSprite(
        this.spriteSheet.animations["idle"]
      );

      this.animatedSprite.animationSpeed = 0.1;
      this.animatedSprite.anchor.set(0.5);
      this.animatedSprite.x = 100;
      this.animatedSprite.y = constant.HEIGHT / 1.4;
      this.container.addChild(this.animatedSprite);
      this.animatedSprite.play();
    }
  }

  update(inputs: Array<String>) {}
}
