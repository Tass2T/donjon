import * as PIXI from "pixi.js";
import constant from "../../constant.js";
import Player from "../Characters/Player.js";
import { loadBundle } from "../../utils/loaderUtils.js";

export default class Level {
  container: PIXI.Container;
  propsContainer: PIXI.Container;
  groundContainer: PIXI.Container;
  player: Player;
  textures: Array<PIXI.Texture>;
  blockLevel: Boolean;
  constructor() {
    this.blockLevel = false;
    this.container = new PIXI.Container();
    this.propsContainer = new PIXI.Container();
    this.groundContainer = new PIXI.Container();
    this.prepareTextures();
  }

  async prepareTextures() {
    this.textures = await loadBundle("stage");
    this.prepareBackground();
    this.prepareProps();
    this.player = new Player(this.moveProps);
    this.container.addChild(this.player.container);
  }

  prepareBackground() {
    const sprite = PIXI.Sprite.from(this.textures.background);
    sprite.height = constant.HEIGHT;
    this.container.addChild(sprite);
  }

  prepareProps(): void {
    this.setWalls();
    this.setGround();
    this.container.addChild(this.propsContainer);
    this.propsContainer.x -= 50;
  }

  async setGround(): Promise<void> {
    const nbOfLine = 5;
    const groundOffset = constant.HEIGHT * 0.62;

    for (let j = 0; j < nbOfLine; j++) {
      let num = 1 + j;
      for (let i = 0; i <= constant.LEVEL_WIDTH + 450; i += 150) {
        const groundSprite = PIXI.Sprite.from(
          num % 2 === 0 ? this.textures.floor1 : this.textures.floor2
        );
        groundSprite.x = i - j * 50;
        groundSprite.y = groundOffset + j * 43;
        groundSprite.width = 200;
        groundSprite.height = 200;
        this.groundContainer?.addChild(groundSprite);
        num++;
      }
    }
    this.propsContainer.addChild(this.groundContainer);
  }

  setWalls(): void {
    const wallTexture = PIXI.Texture.from("wall/wall.png");

    for (let i = 0; i <= constant.LEVEL_WIDTH; i += 500) {
      const wallSprite = PIXI.Sprite.from(wallTexture);
      wallSprite.x = i + 50;
      wallSprite.height = constant.HEIGHT;
      wallSprite.width = 500;
      this.propsContainer.addChild(wallSprite);
    }
  }

  moveProps = (direction: number) => {
    if (direction > 0) {
      this.propsContainer.x -= 5;
      this.container.x -= 2;
    } else {
      this.propsContainer.x += 5;
      this.container.x += 2;
    }
  };

  update(inputs: Array<String>) {
    if (this.player) this.player.update(inputs, this.blockLevel);
  }
}
