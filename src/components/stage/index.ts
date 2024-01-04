import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import Player from "../Characters/Player";
import config from "../../config.js";
import { loadBundle } from "../../utils/loaderUtils.js";

export default class Level {
  container: PIXI.Container;
  physicEngine: Matter.Engine;
  player: Player;
  bounds: Array<Matter.Body>;
  showBounds: Boolean;
  textures: any;
  constructor() {
    this.showBounds = config.SHOW_BOUND;
    this.container = new PIXI.Container();
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
  }

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
