import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import config from "../../config.ts";

export default class Player {
  container: PIXI.Container;
  physicalBody: Matter.Body;
  physicEngine: Matter.Engine;
  rect: PIXI.Graphics;
  jumping: boolean;
  directionX: "right" | "left" | null = null;
  directionY: "up" | "down" | null = null;
  spriteDirection: "left" | "right";
  isMoving: Boolean = false;
  characterFloor: Matter.Body;
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
      window.innerHeight * 0.6,
      position.width,
      position.height,
      {
        mass: 10,
        friction: 1,
        density: 10,
        inertia: Infinity,
      }
    );

    this.characterFloor = Matter.Bodies.rectangle(
      this.physicalBody.position.x,
      this.physicalBody.position.y + position.height,
      position.width,
      10,
      {
        isSleeping: true,
      }
    );

    Matter.World.add(this.physicEngine.world, [
      this.physicalBody,
      this.characterFloor,
    ]);

    this.syncAssetsWithPhysicalBodies();

    parentContainer.addChild(this.container);
  }

  syncAssetsWithPhysicalBodies() {
    this.rect.x = this.physicalBody.position.x;
    this.rect.y = this.physicalBody.position.y;
  }

  syncCharAndFloor() {
    Matter.Body.setPosition(
      this.characterFloor,
      Matter.Vector.create(
        this.physicalBody.position.x,
        this.characterFloor.position.y
      )
    );
  }

  setDirectionX(directionX) {
    if (this.directionX || this.directionY) this.isMoving = true;
    this.directionX = directionX;
  }

  setDirectionY(directionY) {
    if (this.directionX || this.directionY) this.isMoving = true;
    this.directionY = directionY;
  }

  setIsMoving(value) {
    this.isMoving = value;
  }

  jump() {
    if (!this.jumping) {
      Matter.Body.applyForce(
        this.physicalBody,
        this.physicalBody.position,
        Matter.Vector.create(
          this.directionX === "left"
            ? -0.1
            : this.directionX === "right"
            ? 0.1
            : 0,
          -0.5
        )
      );
      window.requestAnimationFrame(() => {
        this.jumping = true;
      });
    }
  }

  checkIfIsStillJumping() {
    if (Matter.Collision.collides(this.physicalBody, this.characterFloor)) {
      this.jumping = false;
    }
  }

  resetDirections() {
    this.directionX = null;
    this.directionY = null;
  }

  processMovement() {
    if (!this.directionX || !this.directionY) this.isMoving = false;

    if (!this.isMoving) this.isMoving = true;

    if (!this.jumping && this.isMoving) {
      if (this.directionX === "right") {
        this.physicalBody.position.x += 1;
      } else if (this.directionX === "left") {
        this.physicalBody.position.x -= 1;
      }

      if (this.directionY) {
        const floor = this.characterFloor;

        if (floor) {
          if (
            this.directionY === "up" &&
            floor.position.y > window.innerHeight * 0.6
          ) {
            floor.force.y += -0.3;
          } else if (
            this.directionY === "down" &&
            floor.position.y < window.innerHeight - 70
          ) {
            floor.force.y += 0.2;
            this.physicalBody.force.y += 0.1;
          }
        }
      }
    }
  }

  update() {
    this.syncCharAndFloor();
    this.processMovement();
    this.syncAssetsWithPhysicalBodies();
    if (this.jumping) {
      this.checkIfIsStillJumping();
    }
  }
}
