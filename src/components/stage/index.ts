import * as PIXI from "pixi.js";
import constant from "../../constant.js";
import Player from "../Characters/Player.js";
import { loadBundle } from "../../utils/loaderUtils.js";

export default class Level {
  container: PIXI.Container;
  propsContainer: PIXI.Container;
  groundContainer: PIXI.Container;
  player: Player | null;
  textures: Array<PIXI.Texture> | null;
  constructor() {
    this.container = new PIXI.Container();
    this.textures = null;
    this.player = null;
    this.propsContainer = new PIXI.Container();
    this.groundContainer = new PIXI.Container();
    this.prepareTextures();
  }

  async prepareTextures() {
    this.textures = await loadBundle("stage");
    this.prepareBackground();
    this.prepareProps();
    this.player = new Player(this.groundContainer.getBounds());
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
    PIXI.Assets.addBundle("floor", {
      floor1: "ground/ground1.png",
      floor2: "ground/ground2.png",
    });
    const assets = await PIXI.Assets.loadBundle("floor");

    const nbOfLine = 5;
    const groundOffset = constant.HEIGHT * 0.62;

    for (let j = 0; j < nbOfLine; j++) {
      let num = 1 + j;
      for (let i = 0; i <= constant.LEVEL_WIDTH; i++) {
        const groundSprite = PIXI.Sprite.from(
          num % 2 === 0 ? assets.floor1 : assets.floor2
        );
        groundSprite.x = 150 * i - j * 50;
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

  update(inputs: Array<String>) {
    this.player.update(inputs);
  }
}
