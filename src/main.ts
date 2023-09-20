import * as PIXI from "pixi.js";
import constant from "./constant.js";
import Level from "./components/stage";
import InputManager from "./inputManager.js";
import gsap from "gsap";
import { PixiPlugin } from "gsap/all";

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

class Game {
  app: PIXI.Application;
  inputManager: InputManager;
  level: Level;
  constructor() {
    this.app = new PIXI.Application({
      width: constant.WIDTH,
      height: constant.HEIGHT,
    });
    document.body.appendChild(this.app.view as HTMLCanvasElement);
    this.inputManager = new InputManager();
    this.level = new Level();

    // timer section
    this.app.ticker.stop();
    gsap.ticker.add(() => this.app.ticker.update());
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
