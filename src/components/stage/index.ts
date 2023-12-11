import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import Player from "../Characters/Player";
import config from "../../config.ts";

export default class Level {
  container: PIXI.Container;
  physicEngine: Matter.Engine;
  player: Player;
  bounds: Array<Matter.Body>;
  showBounds: Boolean = false;
  constructor() {
    this.container = new PIXI.Container();
    this.initPhysicEngine();
    this.initBounds();
    this.player = new Player(this.physicEngine, this.container);
  }

  initPhysicEngine() {
    this.physicEngine = Matter.Engine.create();
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, this.physicEngine);
  }

  initBounds() {
    this.bounds = [];

    const floor = Matter.Bodies.rectangle(
      window.innerWidth / 2,
      config.DEFAULT_FLOOR_POS,
      window.innerWidth,
      10,
      {
        isSleeping: true,
        friction: 1,
        inertia: Infinity,
        label: "floor",
      }
    );
    const leftWall = Matter.Bodies.rectangle(
      0,
      window.innerHeight / 2,
      10,
      window.innerHeight,
      {
        isStatic: true,
        label: "leftWall",
        friction: 0,
      }
    );

    const ceiling = Matter.Bodies.rectangle(
      window.innerWidth / 2,
      10,
      window.innerWidth,
      10,
      {
        isStatic: true,
        label: "rightWall",
      }
    );

    const rightWall = Matter.Bodies.rectangle(
      window.innerWidth - 30,
      window.innerHeight / 2,
      10,
      window.innerHeight,
      { isStatic: true, label: "rightWall" }
    );

    if (this.showBounds) {
      const render = Matter.Render.create({
        element: document.body,
        engine: this.physicEngine,
      });
      Matter.Render.run(render);
    }

    this.bounds.push(floor, leftWall, ceiling, rightWall);

    Matter.World.add(this.physicEngine.world, this.bounds);
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
