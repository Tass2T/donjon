import * as PIXI from "pixi.js";
import config from "./config.js";
import Level from "./components/stage";
import InputManager from "./inputManager.js";

class Game {
  app: PIXI.Application;
  inputManager: InputManager;
  level: Level;
  constructor() {
    this.app = new PIXI.Application({
      width: config.WIDTH,
      height: config.HEIGHT,
    });
    document.body.appendChild(this.app.view as HTMLCanvasElement);
    this.inputManager = new InputManager();
    this.level = new Level();

    // timer section
    let elapsed = 0.0;
    this.app.ticker.maxFPS = 60;
    this.app.ticker.add((delta) => {
      elapsed += delta;
      this.update();
    });

    this.init();
  }

  init() {
    this.app.stage.addChild(this.level.container);
  }

  update() {
    this.level.update(this.inputManager.getInputs());
  }
}

new Game();
