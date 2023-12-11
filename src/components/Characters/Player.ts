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
        mass: 10,
        friction: 1,
        density: 10,
        inertia: Infinity,
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
    if (
      Matter.Collision.collides(
        this.physicalBody,
        this.physicEngine.world.bodies.find((item) => item.label === "floor")
      )
    ) {
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
        this.physicalBody.force.x += 0.07;
      } else if (this.directionX === "left") {
        this.physicalBody.force.x -= 0.07;
      }

      if (this.directionY) {
        const floor = this.physicEngine.world.bodies.find(
          (item) => item.label === "floor"
        );

        if (floor) {
          if (
            this.directionY === "up" &&
            floor.position.y > window.innerHeight * 0.6
          ) {
            floor.isSleeping = false;
            floor.force.y += -0.2;

            window.requestAnimationFrame(() => {
              floor.isSleeping = true;
            });
          } else if (
            this.directionY === "down" &&
            floor.position.y < window.innerHeight - 70
          ) {
            console.log("hello", window.innerHeight, floor.position.y);

            floor.isSleeping = false;
            floor.force.y += 0.2;
            this.physicalBody.force.y += 0.1;

            window.requestAnimationFrame(() => {
              floor.isSleeping = true;
            });
          }
        }
      }
    }
  }

  update() {
    this.processMovement();
    this.syncAssetsWithPhysicalBodies();
    if (this.jumping) {
      this.checkIfIsStillJumping();
    }
  }
}
