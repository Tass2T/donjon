import * as PIXI from "pixi.js";

export default class Level {
  container: PIXI.Container;
  constructor() {
    this.container = new PIXI.Container();

    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xff00ee);
    graphics.drawRect(400, 200, 300, 200);
    this.container.addChild(graphics);
  }
}
