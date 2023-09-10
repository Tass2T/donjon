import * as PIXI from "pixi.js";
import constant from "./constant.js";
import Level from "./components/stage";

class Game {
  app: PIXI.Application;
  constructor() {
    this.app = new PIXI.Application({
      width: constant.WIDTH,
      height: constant.HEIGHT,
    });
    document.body.appendChild(this.app.view as HTMLCanvasElement);

    this.prepareBackground();
    this.addChildren();
  }

  async prepareBackground() {
    const sprite = PIXI.Sprite.from("background.png");
    sprite.anchor.set(0, constant.DAY_ANCHOR);
    sprite.width = constant.WIDTH;
    sprite.height = constant.HEIGHT;

    this.app.stage.addChild(sprite);
  }

  addChildren() {
    const level = new Level();
    this.app.stage.addChild(level.container);
  }
}

new Game();
