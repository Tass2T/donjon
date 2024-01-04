import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import Player from "../Characters/Player";
import config from "../../config.js";
import { loadBundle } from "../../utils/loaderUtils.js";

export default class Level {
  container: PIXI.Container;
  propsContainer: PIXI.Container;
  groundContainer: PIXI.Container;
  wallContainer: PIXI.Container;
  physicEngine: Matter.Engine;
  player: Player;
  bounds: Array<Matter.Body>;
  showBounds: Boolean;
  textures: any;
  constructor() {
    this.showBounds = config.SHOW_BOUND;
    this.container = new PIXI.Container();
    this.wallContainer = new PIXI.Container();
    this.groundContainer = new PIXI.Container();
    this.propsContainer = new PIXI.Container();
    this.initPhysicEngine();
    this.initBounds();
    this.player = new Player(this.physicEngine, this.container);
    this.prepareTextures();
  }

  initPhysicEngine() {
    this.physicEngine = Matter.Engine.create();
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, this.physicEngine);
  }

  initBounds() {
    this.bounds = [];

    const leftWall = Matter.Bodies.rectangle(
      0,
      config.GAME_HEIGHT / 2,
      10,
      config.GAME_HEIGHT,
      {
        isStatic: true,
        label: "leftWall",
        friction: 0,
      }
    );

    const ceiling = Matter.Bodies.rectangle(
      config.GAME_WIDTH / 2,
      0,
      config.GAME_WIDTH,
      10,
      {
        isStatic: true,
        label: "rightWall",
        friction: 0,
      }
    );

    const rightWall = Matter.Bodies.rectangle(
      config.GAME_WIDTH - 60,
      config.GAME_HEIGHT / 2,
      10,
      config.GAME_HEIGHT,
      { isStatic: true, label: "rightWall" }
    );

    if (this.showBounds) {
      const render = Matter.Render.create({
        element: document.body,
        engine: this.physicEngine,
      });
      Matter.Render.run(render);
    }

    this.bounds.push(leftWall, ceiling, rightWall);

    Matter.World.add(this.physicEngine.world, this.bounds);
  }

  async prepareTextures() {
    this.textures = await loadBundle("stage");
    this.prepareBackground();
    this.container.addChild(this.player.container);
  }

  prepareBackground() {
    const sprite = PIXI.Sprite.from(this.textures.background);
    sprite.height = config.GAME_HEIGHT;
    sprite.width = config.GAME_WIDTH;
    this.container.addChild(sprite);
    this.prepareProps();
  }

  prepareProps(): void {
    this.setWalls();
    this.setGround();
    this.container.addChild(this.propsContainer);
    this.propsContainer.x -= 50;
  }

  async setGround(): Promise<void> {
    const nbOfLine = 4;
    const groundOffset = config.GAME_HEIGHT * 0.72;

    for (let j = 0; j < nbOfLine; j++) {
      let num = 1 + j;
      for (let i = 0; i <= config.GAME_WIDTH + 450; i += 150) {
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
      }
    }
    this.propsContainer.addChild(this.groundContainer);
  }

  setWalls(): void {
    const wallTexture = PIXI.Texture.from("wall/wall.png");

    for (let i = 0; i <= config.GAME_WIDTH; i += 500) {
      const wallSprite = PIXI.Sprite.from(wallTexture);
      wallSprite.x = i + 50;
      wallSprite.height = config.GAME_HEIGHT;
      wallSprite.width = 500;
      this.wallContainer.addChild(wallSprite);
    }

    this.propsContainer.addChild(this.wallContainer);
  }

  moveUnseenGroundTiles(): void {
    this.groundContainer.children.forEach((tile) => {
      if (tile.getGlobalPosition().x + 200 <= 0) {
        tile.x += config.GAME_WIDTH - 200;
        tile.zIndex = tile.zIndex + 10000;

        this.groundContainer.updateTransform();
      }
    });
  }

  moveUnseenWalls(): void {
    this.wallContainer.children.forEach((wallSprite) => {
      if (wallSprite.getGlobalPosition().x + 500 <= 0) {
        wallSprite.x += config.GAME_WIDTH;
      }
    });
  }

  moveProps = (): boolean => {
    this.propsContainer.x -= 5;
    this.moveUnseenGroundTiles();
    this.moveUnseenWalls();
    return true;
  };

  processInput(inputs: Array<String>) {
    const processKeys: Array<String> = [];

    if (!inputs.length) {
      this.player.resetDirections();
    }

    inputs.forEach((input) => {
      switch (input) {
        case "Space":
          this.player.jump();
          break;
        case "KeyD":
          if (!processKeys.includes("KeyD")) {
            this.player.setDirectionX("right");
          }
          break;
        case "KeyA":
          if (!processKeys.includes("KeyA")) {
            this.player.setDirectionX("left");
          }
          break;
        case "KeyW":
          if (!processKeys.includes("KeyS")) {
            this.player.setDirectionY("up");
          }
          break;
        case "KeyS":
          if (!processKeys.includes("KeyW")) {
            this.player.setDirectionY("down");
          }
          break;
        default:
          break;
      }

      processKeys.push(input);
    });

    if (!processKeys.includes("KeyS") && !processKeys.includes("KeyW")) {
      this.player.setDirectionY(null);
    }
    if (!processKeys.includes("KeyA") && !processKeys.includes("KeyD")) {
      this.player.setDirectionX(null);
    }
  }

  update(inputs: Array<String>) {
    this.processInput(inputs);
    this.player.update();
  }
}
