import * as PIXI from "pixi.js";
import constant from "../../constant.js";

export default class Player {
  container: PIXI.Container;
  spriteSheet: PIXI.Spritesheet | null;
  animatedSprite: PIXI.AnimatedSprite | null;
  directionY: "UP" | "DOWN" | null;
  directionX: "RIGHT" | "LEFT" | null;
  moving: Boolean;
  constructor() {
    this.container = new PIXI.Container();
    this.spriteSheet = null;
    this.animatedSprite = null;
    this.directionY = null;
    this.directionX = "RIGHT";
    this.moving = false;
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

  resolveInputs(inputs: Array<String>) {
    if (!inputs.length) {
      this.directionY = null;
      this.directionX = null;
      this.moving = false;
    }
    console.log(inputs);
    const previousKeys: Array<String> = [];
    inputs.forEach((item) => {
      switch (item) {
        case "KeyA":
          if (!previousKeys.includes("KeyD")) this.directionX = "LEFT";
          this.moving = true;
          break;
        case "KeyD":
          if (!previousKeys.includes("KeyA")) this.directionX = "RIGHT";
          this.moving = true;
          break;
        case "KeyW":
          if (!previousKeys.includes("KeyS")) this.directionY = "UP";
          this.moving = true;
          break;
        case "KeyS":
          if (!previousKeys.includes("KeyW")) this.directionY = "DOWN";
          this.moving = true;
          break;
        default:
          break;
      }
      previousKeys.push(item);
    });
  }

  moveSprite() {
    if (this.directionY === "UP") this.animatedSprite.y -= 10;
    if (this.directionY === "DOWN") this.animatedSprite.y += 10;
    if (this.directionX === "LEFT") this.animatedSprite.x -= 10;
    if (this.directionX === "RIGHT") this.animatedSprite.x += 10;
  }

  update(inputs: Array<String>) {
    this.resolveInputs(inputs);
    if (this.moving) this.moveSprite();
  }
}
