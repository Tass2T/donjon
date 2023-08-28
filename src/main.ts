import * as PIXI from "pixi.js";

class Game {
  app: PIXI.Application;
  constructor() {
    this.app = new PIXI.Application({
      width: 840,
      height: 560,
    });

    this.init();
  }

  init() {
    document.body.appendChild(this.app.view as HTMLCanvasElement);
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(0, 0, this.app.view.width, this.app.view.height);
    this.app.stage.addChild(graphics);
  }
}

const game = new Game();
