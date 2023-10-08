import * as PIXI from "pixi.js";
import constant from "../../constant.js";

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

  isCharacterOutbound(direction: String): boolean {
    const playerCoord = this.animatedSprite?.getBounds();

    switch (direction) {
      case "UP":
        return playerCoord.y + playerCoord?.height <= constant.HEIGHT * 0.75;
      case "DOWN":
        return playerCoord.y + playerCoord?.height >= constant.HEIGHT - 5;
      case "RIGHT":
        return playerCoord.x + playerCoord?.width >= constant.WIDTH;
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

    const previousKeys: Array<String> = [];
    inputs.forEach((item) => {
      switch (item) {
        case "KeyA":
          if (!previousKeys.includes("KeyD")) {
            this.nextDirectionX = "LEFT";
            this.nextAnim = "walk";
            this.moving = true;
          }
          break;
        case "KeyD":
          if (!previousKeys.includes("KeyA")) {
            this.nextDirectionX = "RIGHT";
            this.nextAnim = "walk";
            this.moving = true;
          }
          break;
        case "KeyW":
          if (!previousKeys.includes("KeyS")) {
            this.directionY = "UP";
            this.nextAnim = "walk";
          }
          break;
        case "KeyS":
          if (!previousKeys.includes("KeyW")) {
            this.directionY = "DOWN";
            this.nextAnim = "walk";
          }
          break;
        default:
          break;
      }

      previousKeys.push(item);
    });
  }

  resolveAnimation() {
    if (this.directionX !== this.nextDirectionX) {
      this.animatedSprite.scale.x *= -1;
    }

    if (this.nextAnim !== this.anim) {
      this.animatedSprite.textures =
        this.spriteSheet?.animations[this.nextAnim];
      this.animatedSprite.play();
    }

    this.directionX = this.nextDirectionX;
    this.anim = this.nextAnim;
  }

  moveSprite(isLevelBlocked: Boolean) {
    if (this.directionY === "UP" && !this.isCharacterOutbound("UP"))
      this.animatedSprite.y -= 5;
    if (this.directionY === "DOWN" && !this.isCharacterOutbound("DOWN"))
      this.animatedSprite.y += 5;
    if (this.moving) {
      if (this.directionX === "LEFT" && !this.isCharacterOutbound("LEFT")) {
        if (this.propsShouldMove(-1) && !isLevelBlocked) {
         if (!this.moveProps(-1)) this.animatedSprite.x -= 5
        } else this.animatedSprite.x -= 5;
      }
      if (this.directionX === "RIGHT" && !this.isCharacterOutbound("RIGHT")) {
        if (this.propsShouldMove(1) && !isLevelBlocked) {
          if  (!this.moveProps(1)) this.animatedSprite.x += 5
        } else this.animatedSprite.x += 5;
      }
    }
  }

  propsShouldMove(direction: number) {
    if (direction > 0) {
      return (
        this.animatedSprite.getBounds().x + this.animatedSprite.width >=
        constant.WIDTH - constant.WIDTH / 7
      );
    } else {
      return this.animatedSprite.getBounds().x <= constant.WIDTH / 7;
    }
  }

  update(inputs: Array<String>, isLevelBlocked: Boolean) {
    if (this.spriteSheet) {
      this.resolveInputs(inputs);
      this.resolveAnimation();
      this.moveSprite(isLevelBlocked);
    }
  }
}
