import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import config from "../../config.ts";

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
      position.height,
      {
        mass: 20,
      }
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
      this.jumpInitialHeight = Math.floor(this.physicalBody.position.y);
      Matter.Body.applyForce(
        this.physicalBody,
        this.physicalBody.position,
        Matter.Vector.create(0.4, -0.7)
      );
      window.requestAnimationFrame(() => {
        this.jumping = true;
      });
    }
  }

  checkIfIsStillJumping() {
    console.log(this.jumpInitialHeight, this.physicalBody.position.y);

    if (Math.floor(this.physicalBody.position.y) === this.jumpInitialHeight) {
      this.jumping = false;
    }
  }

  update() {
    this.syncAssetsWithPhysicalBodies();
    if (this.jumping) {
      this.checkIfIsStillJumping();
    }
  }
}
