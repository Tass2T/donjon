import * as PIXI from "pixi.js";
import constant from "../../constant.js";

export default class Level {
  container: PIXI.Container;
  groundContainer: PIXI.Container;
  wallContainer: PIXI.Container;
  constructor() {
    this.container = new PIXI.Container();
    this.groundContainer = new PIXI.Container();
    this.wallContainer = new PIXI.Container()
    this.container.addChild(this.wallContainer)
    this.container.addChild(this.groundContainer);
    this.setWalls()
    this.setGround();
    this.setCharacter();
  }

  setGround() {
    this.groundContainer.x = -40;
    this.groundContainer.y = constant.HEIGHT - (constant.HEIGHT / 100) * 36;
    const groundTexture = PIXI.Texture.from("ground/groundTile.png");
    const nbOfLine = Math.floor(((constant.HEIGHT / 100) * 40) / 30);

    for (let j = 0; j < nbOfLine; j++) {
      for (let i = 0; i <= 3000; i += 114) {
        const groundSprite = PIXI.Sprite.from(groundTexture);
        groundSprite.x = i - j * 32;
        groundSprite.y = j * 28;
        groundSprite.width = 150;
        groundSprite.height = 150;
        this.groundContainer.addChild(groundSprite);
      }
    }
  }

  setWalls() {
    this.wallContainer.x = -40
    this.wallContainer.y = 0
    const wallTexture = PIXI.Texture.from("wall/wall.png")
    const nbOfWall = 3000 / 200
    

    for (let i = 0; i < nbOfWall; i++) {
      const wallSprite = PIXI.Sprite.from(wallTexture)
      wallSprite.x = i * 400
      wallSprite.height = constant.HEIGHT
      wallSprite.width = 400
      this.wallContainer.addChild(wallSprite)

    }
    
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
}
