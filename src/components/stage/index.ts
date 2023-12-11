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
      100,
      {
        isStatic: true,
        friction: 1,
      }
    );
    const leftWall = Matter.Bodies.rectangle(
      0,
      window.innerHeight / 2,
      10,
      window.innerHeight,
      {
        isStatic: true,
      }
    );

    const ceiling = Matter.Bodies.rectangle(
      window.innerWidth / 2,
      0,
      window.innerWidth,
      10,
      {
        isStatic: true,
      }
    );

    const rightWall = Matter.Bodies.rectangle(
      window.innerWidth - 10,
      window.innerHeight / 2,
      10,
      window.innerHeight,
      { isStatic: true }
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
    inputs.forEach((input) => {
      switch (input) {
        case "Space":
          this.player.jump();
          break;
        default:
          break;
      }
    });
  }

  update(inputs: Array<String>) {
    this.processInput(inputs);
    this.player.update(this.bounds[0]);
  }
}
