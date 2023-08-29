import * as PIXI from "pixi.js";
import constant from "./constant.json";

class Game {
  app: PIXI.Application;
  constructor() {
    this.app = new PIXI.Application({
      width: 1024,
      height: 576,
    });
    document.body.appendChild(this.app.view as HTMLCanvasElement);

    this.prepareBackground();
  }

  async prepareBackground() {
    const sprite = PIXI.Sprite.from("sky.jpg");
    sprite.anchor.set(0, constant.DAY_ANCHOR);
    sprite.width = 1024;
    sprite.height = 1200;

    this.app.stage.addChild(sprite);
  }
}

new Game();
