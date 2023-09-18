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
  constructor() {
    this.app = new PIXI.Application({
      width: constant.WIDTH,
      height: constant.HEIGHT,
    });
    document.body.appendChild(this.app.view as HTMLCanvasElement);
    this.inputManager = new InputManager();

    // timer section
    this.app.ticker.stop();
    gsap.ticker.add(() => this.app.ticker.update());
    let elapsed = 0.0;
    this.app.ticker.maxFPS = 60;
    this.app.ticker.add((delta) => {
      elapsed += delta;
      this.update();
    });

    this.prepareBackground();
    this.init();
  }

  async prepareBackground() {
    const sprite = PIXI.Sprite.from("background.png");
    sprite.anchor.set(0, constant.DAY_ANCHOR);
    sprite.width = constant.WIDTH;
    sprite.height = constant.HEIGHT;

    this.app.stage.addChild(sprite);
  }

  init() {
    const level = new Level();
    this.app.stage.addChild(level.container);
  }

  update() {
    console.log(this.app.stage.children);
  }
}

new Game();
