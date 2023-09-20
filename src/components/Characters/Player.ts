import * as PIXI from "pixi.js";
import constant from "../../constant.js";

export default class Player {
  container: PIXI.Container;
  spriteSheet: PIXI.Spritesheet | null;
  animatedSprite: PIXI.AnimatedSprite | null;
  groundLocation: PIXI.Rectangle;
  directionY: "UP" | "DOWN" | null;
  directionX: "RIGHT" | "LEFT";
  currentAnim: "IDLE" | "IDLE LEFT" | "WALK RIGHT" | "WALK LEFT";
  moving: Boolean;
  constructor(groundLocation: PIXI.Rectangle) {
    this.container = new PIXI.Container();
    this.spriteSheet = null;
    this.animatedSprite = null;
    this.groundLocation = groundLocation;
    this.directionY = null;
    this.directionX = "RIGHT";
    this.currentAnim = "IDLE";
    this.moving = false;
  }

  isCharacterInbound(): boolean {
    const playerCoord = this.animatedSprite?.getBounds();

    if (
      playerCoord.x <= 0 ||
      playerCoord.x + playerCoord?.width >= constant.WIDTH ||
      playerCoord.y + playerCoord?.height <= this.groundLocation.y ||
      playerCoord.y + playerCoord?.height >= constant.HEIGHT
    )
      return true;

    return false;
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

  async setCharacter() {
    this.spriteSheet = await PIXI.Assets.load("characters/adventurer.json");

    if (!this.spriteSheet) console.error("oops error with loading");

    this.animatedSprite = new PIXI.AnimatedSprite(
      this.spriteSheet.animations["idle"]
    );

    this.animatedSprite.animationSpeed = 0.1;
    this.animatedSprite.anchor.set(0.5);
    this.animatedSprite.x = 100;
    this.animatedSprite.y = constant.HEIGHT / 1.4;
    this.container.addChild(this.animatedSprite);
    this.animatedSprite.play();
    // this.showCharacterHitbox();
  }

  resolveInputs(inputs: Array<String>) {
    if (!inputs.length) {
      this.directionY = null;
      this.directionX = null;
      this.moving = false;
    }
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

    if (!inputs.some((element) => element === "KeyS" || element === "KeyW")) {
      this.directionY = null;
    }
  }

  moveSprite() {
    if (this.directionY === "UP") this.animatedSprite.y -= 5;
    if (this.directionY === "DOWN") this.animatedSprite.y += 5;
    if (this.directionX === "LEFT") this.animatedSprite.x -= 5;
    if (this.directionX === "RIGHT") this.animatedSprite.x += 5;
  }

  update(inputs: Array<String>) {
    this.resolveInputs(inputs);
    if (this.moving) this.moveSprite();
  }
}
