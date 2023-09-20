import * as PIXI from "pixi.js";
import constant from "../../constant.js";
import Player from "../Characters/Player.js";

export default class Level {
  container: PIXI.Container;
  propsContainer: PIXI.Container;
  groundContainer: PIXI.Container;
  player: Player;
  constructor() {
    this.container = new PIXI.Container();
    this.propsContainer = new PIXI.Container();
    this.groundContainer = new PIXI.Container();
    this.propsContainer.x = -50;
    this.prepareBackground();
    this.prepareProps();
    this.player = new Player(this.groundContainer.getBounds());
    this.player.setCharacter();
    this.container.addChild(this.player.container);
  }

  async prepareBackground() {
    const sprite = PIXI.Sprite.from("background.png");
    sprite.width = constant.WIDTH;
    sprite.height = constant.HEIGHT;

    this.container.addChild(sprite);
  }

  prepareProps(): void {
    this.container.addChild(this.propsContainer);

    this.setWalls();
    this.setGround();
  }

  setGround(): void {
    const groundTexture = PIXI.Texture.from("ground/groundTile.png");
    const nbOfLine = Math.floor(((constant.HEIGHT / 100) * 40) / 30);
    const groundOffset = constant.HEIGHT - (constant.HEIGHT / 100) * 36;

    for (let j = 0; j < nbOfLine; j++) {
      for (let i = 0; i <= 3000; i += 114) {
        const groundSprite = PIXI.Sprite.from(groundTexture);
        groundSprite.x = i - j * 32;
        groundSprite.y = groundOffset + j * 28;
        groundSprite.width = 150;
        groundSprite.height = 150;
        this.groundContainer?.addChild(groundSprite);
      }
    }
    this.propsContainer.addChild(this.groundContainer);
  }

  setWalls(): void {
    const wallTexture = PIXI.Texture.from("wall/wall.png");
    const nbOfWall = 3000 / 200;

    for (let i = 0; i < nbOfWall; i++) {
      const wallSprite = PIXI.Sprite.from(wallTexture);
      wallSprite.x = i * 400;
      wallSprite.height = constant.HEIGHT;
      wallSprite.width = 400;
      this.propsContainer.addChild(wallSprite);
    }
  }

  update(inputs: Array<String>) {
    this.player.update(inputs);
  }
}
