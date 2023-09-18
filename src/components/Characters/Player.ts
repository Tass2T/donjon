import * as PIXI from "pixi.js";
import constant from "../../constant.js";

export default class Player {
  container: PIXI.Container;
  constructor() {
    this.container = new PIXI.Container();

    this.setCharacter();
  }

  setCharacter() {
    const character = new PIXI.Graphics();
    character.beginFill(0x00ff00);
    character.drawRect(
      50,
      Math.floor(constant.HEIGHT - constant.HEIGHT / 3),
      80,
      150
    );
    this.container.addChild(character);
  }

  update(inputs: Array<string>) {}
}
