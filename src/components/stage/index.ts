import * as PIXI from "pixi.js";
import config from "../../config.js";
import Player from "../Characters/Player.js";
import { loadBundle } from "../../utils/loaderUtils.js";

export default class Level {
  container: PIXI.Container;
  propsContainer: PIXI.Container;
  groundContainer: PIXI.Container;
  wallContainer: PIXI.Container;
  player: Player;
  textures: PIXI.Texture<PIXI.Resource>[];
  isLevelBlocked: Boolean;
  groundTileIndex: number;
  constructor() {
    this.container = new PIXI.Container();
    this.propsContainer = new PIXI.Container();
    this.groundContainer = new PIXI.Container();
    this.wallContainer = new PIXI.Container();
    this.groundContainer.sortableChildren = true;
    this.isLevelBlocked = false;
    this.prepareTextures();
  }

  async prepareTextures() {
    this.textures = await loadBundle("stage");
    this.prepareBackground();
    this.prepareProps();
    this.player = new Player(this.moveProps);
    this.container.addChild(this.player.container);
  }

  prepareBackground() {
    const sprite = PIXI.Sprite.from(this.textures.background);
    sprite.height = config.HEIGHT;
    sprite.width = config.WIDTH;
    this.container.addChild(sprite);
  }

  prepareProps(): void {
    this.setWalls();
    this.setGround();
    this.container.addChild(this.propsContainer);
    this.propsContainer.x -= 50;
  }

  async setGround(): Promise<void> {
    const nbOfLine = 4;
    const groundOffset = config.HEIGHT * 0.72;

    for (let j = 0; j < nbOfLine; j++) {
      let num = 1 + j;
      for (let i = 0; i <= config.LEVEL_WIDTH + 450; i += 150) {
        const groundSprite = PIXI.Sprite.from(
          // @ts-ignore
          num % 2 === 0 ? this.textures.floor1 : this.textures.floor2
        );
        groundSprite.x = i - j * 50;
        groundSprite.y = groundOffset + j * 43;
        groundSprite.width = 200;
        groundSprite.height = 200;
        groundSprite.zIndex = i;
        this.groundContainer?.addChild(groundSprite);
        num++;
        this.groundTileIndex = i;
      }
    }
    this.propsContainer.addChild(this.groundContainer);
  }

  setWalls(): void {
    const wallTexture = PIXI.Texture.from("wall/wall.png");

    for (let i = 0; i <= config.LEVEL_WIDTH; i += 500) {
      const wallSprite = PIXI.Sprite.from(wallTexture);
      wallSprite.x = i + 50;
      wallSprite.height = config.HEIGHT;
      wallSprite.width = 500;
      this.wallContainer.addChild(wallSprite);
    }

    this.propsContainer.addChild(this.wallContainer);
  }

  moveUnseenGroundTiles(): void {
    this.groundContainer.children.forEach((tile) => {
      if (tile.getGlobalPosition().x + 200 <= 0) {
        tile.x += config.LEVEL_WIDTH - 200;
        tile.zIndex = tile.zIndex + 10000;

        this.groundContainer.updateTransform();
      }
    });
  }

  moveUnseenWalls(): void {
    this.wallContainer.children.forEach((wallSprite) => {
      if (wallSprite.getGlobalPosition().x + 500 <= 0) {
        wallSprite.x += config.LEVEL_WIDTH;
      }
    });
  }

  moveProps = (): boolean => {
    this.propsContainer.x -= 5;
    this.moveUnseenGroundTiles();
    this.moveUnseenWalls();
    return true;
  };

  resolveInputs(inputs: Array<String>) {
    if (!inputs.length) {
      this.player.directionY = null;
      this.player.moving = false;
      this.player.nextAnim = "idle";
    }

    if (!inputs.some((element) => element === "KeyS" || element === "KeyW")) {
      this.player.directionY = null;
    }

    const previousKeys: Array<String> = [];
    inputs.forEach((item) => {
      switch (item) {
        case "KeyA":
          if (!previousKeys.includes("KeyD")) {
            this.player.nextDirectionX = "LEFT";
            this.player.nextAnim = "walk";
            this.player.moving = true;
          }
          break;
        case "KeyD":
          if (!previousKeys.includes("KeyA")) {
            this.player.nextDirectionX = "RIGHT";
            this.player.nextAnim = "walk";
            this.player.moving = true;
          }
          break;
        case "KeyW":
          if (!previousKeys.includes("KeyS")) {
            this.player.directionY = "UP";
            this.player.nextAnim = "walk";
          }
          break;
        case "KeyS":
          if (!previousKeys.includes("KeyW")) {
            this.player.directionY = "DOWN";
            this.player.nextAnim = "walk";
          }
          break;
        default:
          break;
      }

      previousKeys.push(item);
    });
  }

  resolveAnimation() {
    if (this.player.directionX !== this.player.nextDirectionX) {
      this.player.animatedSprite.scale.x *= -1;
    }

    if (this.player.nextAnim !== this.player.anim) {
      this.player.animatedSprite.textures =
        // @ts-ignore
        this.player.spriteSheet?.animations[this.player.nextAnim];
      this.player.animatedSprite.play();
    }

    this.player.directionX = this.player.nextDirectionX;
    this.player.anim = this.player.nextAnim;
  }

  moveSprite() {
    if (
      this.player.directionY === "UP" &&
      !this.player.isCharacterOutbound("UP")
    )
      this.player.animatedSprite.y -= 5;
    if (
      this.player.directionY === "DOWN" &&
      !this.player.isCharacterOutbound("DOWN")
    )
      this.player.animatedSprite.y += 5;
    if (this.player.moving) {
      if (
        this.player.directionX === "LEFT" &&
        !this.player.isCharacterOutbound("LEFT")
      ) {
        this.player.animatedSprite.x -= 5;
      }
      if (
        this.player.directionX === "RIGHT" &&
        !this.player.isCharacterOutbound("RIGHT")
      ) {
        if (this.player.propsShouldMove(1) && !this.isLevelBlocked) {
          if (!this.moveProps()) this.player.animatedSprite.x += 5;
        } else this.player.animatedSprite.x += 5;
      }
    }
  }

  update(inputs: Array<String>) {
    if (this.player && this.player.animatedSprite) {
      this.resolveInputs(inputs);
      this.resolveAnimation();
      this.moveSprite();
    }
  }
}
