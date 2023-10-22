import * as PIXI from "pixi.js";
import config from "../../config.js";

export default class Player {
  container: PIXI.Container;
  spriteSheet: PIXI.Spritesheet;
  animatedSprite: PIXI.AnimatedSprite;
  directionY: "UP" | "DOWN" | null;
  directionX: "RIGHT" | "LEFT";
  nextDirectionX: "RIGHT" | "LEFT";
  nextDirectionY: "UP" | "DOWN" | null;
  anim: "idle" | "walk" | "jump" | "attack";
  nextAnim: "idle" | "walk" | "jump" | "attack";
  moving: Boolean;
  moveProps: Function;
  constructor(moveProps: Function) {
    this.container = new PIXI.Container();
    this.directionY = null;
    this.directionX = "RIGHT";
    this.nextDirectionX = "RIGHT";
    this.nextDirectionY = null;
    this.anim = "idle";
    this.nextAnim = "idle";
    this.moveProps = moveProps;
    this.moving = false;

    this.prepareSprites();
  }

  async prepareSprites() {
    this.spriteSheet = await PIXI.Assets.load("characters/adventurer.json");

    if (this.spriteSheet) {
      this.animatedSprite = new PIXI.AnimatedSprite(
        // @ts-ignore
        this.spriteSheet.animations["idle"]
      );

      this.animatedSprite.animationSpeed = 0.1;
      this.animatedSprite.anchor.set(0.5);
      this.animatedSprite.x = 100;
      this.animatedSprite.y = config.HEIGHT / 1.4;

      this.container.addChild(this.animatedSprite);
      this.animatedSprite.play();
    }
  }

  isCharacterOutbound(direction: String): boolean {
    const playerCoord = this.animatedSprite?.getBounds();

    switch (direction) {
      case "UP":
        return playerCoord.y + playerCoord?.height <= config.HEIGHT * 0.75;
      case "DOWN":
        return playerCoord.y + playerCoord?.height >= config.HEIGHT - 5;
      case "RIGHT":
        return playerCoord.x + playerCoord?.width >= config.WIDTH;
      case "LEFT":
        return playerCoord.x <= 0;
      default:
        return false;
    }
  }

  showCharacterHitbox() {
    const playerCoord = this.animatedSprite?.getBounds();
    const bounds = new PIXI.Graphics();
    bounds.beginFill(0xff00ff);
    bounds.drawRect(
      playerCoord?.x,
      playerCoord?.y,
      playerCoord?.width,
      playerCoord?.height
    );
    this.container.addChild(bounds);
  }

  resolveInputs(inputs: Array<String>) {
    if (!inputs.length) {
      this.directionY = null;
      this.moving = false;
      this.nextAnim = "idle";
    }

    if (!inputs.some((element) => element === "KeyS" || element === "KeyW")) {
      this.directionY = null;
    }
  }

  propsShouldMove(direction: number) {
    if (direction > 0) {
      return (
        this.animatedSprite.getBounds().x + this.animatedSprite.width >=
        config.WIDTH - config.WIDTH / 4
      );
    } else {
      return this.animatedSprite.getBounds().x <= config.WIDTH / 7;
    }
  }

  update() {}
}
