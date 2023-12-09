import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import config from '../../config.ts';

export default class Player {
  container: PIXI.Container;
  physicalBody: Matter.Body;
  physicEngine: Matter.Engine;
  rect: PIXI.Graphics;
  jumping: boolean;
  jumpInitialHeight: number;
  constructor(physicEngine: Matter.Engine, parentContainer: PIXI.Container) {
    this.container = new PIXI.Container();
    this.jumping = false;
    this.physicEngine = physicEngine;
    this.rect = new PIXI.Graphics();
    this.rect.beginFill(0xff00ff);
    this.rect.drawRect(0, 0, 50, 50);
    this.container.addChild(this.rect);

    const position = this.container.getLocalBounds();

    this.physicalBody = Matter.Bodies.rectangle(
      300,
      config.DEFAULT_FLOOR_POS - position.height,
      position.width,
      position.height
    );

    Matter.World.add(this.physicEngine.world, [this.physicalBody]);

    this.syncAssetsWithPhysicalBodies();

    parentContainer.addChild(this.container);
  }

  syncAssetsWithPhysicalBodies() {
    this.rect.x = this.physicalBody.position.x;
    this.rect.y = this.physicalBody.position.y;
  }

  jump() {
    if (!this.jumping) {
      this.jumpInitialHeight = this.physicalBody.position.y;
      this.physicalBody.position.y -= 10;
      this.jumping = true;
    }
  }

  checkIfIsStillJumping() {
    if (this.physicalBody.position.y === this.jumpInitialHeight)
      console.log(this.physicalBody.position.y);
  }

  update() {
    this.syncAssetsWithPhysicalBodies();
    if (this.jumping) {
      this.checkIfIsStillJumping();
    }
  }
}
