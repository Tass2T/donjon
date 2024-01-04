import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import config from "../../config.ts";

export default class Player {
  container: PIXI.Container;
  physicalBody: Matter.Body;
  physicEngine: Matter.Engine;
  visualBody: PIXI.Graphics;
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
    this.initVisualBody();
    const position = this.container.getLocalBounds();

    this.physicalBody = Matter.Bodies.rectangle(
      300,
      window.innerHeight * 0.6,
      position.width,
      position.height,
      {
        mass: 10,
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
        inertia: Infinity,
      }
    );

    Matter.World.add(this.physicEngine.world, [
      this.physicalBody,
      this.characterFloor,
    ]);

    this.syncAssetsWithPhysicalBodies();

    parentContainer.addChild(this.container);
  }

  initVisualBody() {
    this.visualBody = new PIXI.Graphics();
    this.visualBody.beginFill(0xff00ff);
    this.visualBody.drawRect(0, 0, 50, 50);
    this.container.addChild(this.visualBody);
  }

  syncAssetsWithPhysicalBodies() {
    this.visualBody.x = this.physicalBody.position.x;
    this.visualBody.y = this.physicalBody.position.y;
  }

  syncCharAndFloor() {
    Matter.Body.setPosition(this.characterFloor, {
      x: this.physicalBody.position.x,
      y: this.characterFloor.position.y,
    });
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

  isInBound() {
    return this.directionY === "up"
      ? this.visualBody.position.y > config.GAME_HEIGHT * 0.7
      : this.visualBody.position.y + this.visualBody.height + 10 <
          config.GAME_HEIGHT * 0.93;
  }

  jump() {
    if (!this.jumping && !this.directionY) {
      Matter.Body.setVelocity(this.physicalBody, {
        x: this.physicalBody.velocity.x,
        y: -config.player.JUMP_SPEED,
      });
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
    if (!this.directionX || !this.directionY) {
      if (!this.jumping)
        Matter.Body.setVelocity(this.physicalBody, {
          x: 0,
          y: this.physicalBody.velocity.y,
        });
      this.isMoving = false;
    }

    if (!this.isMoving) this.isMoving = true;

    if (!this.jumping && this.isMoving) {
      if (this.directionX === "right") {
        Matter.Body.setVelocity(this.physicalBody, {
          x: config.player.WALK_SPEED,
          y: this.physicalBody.velocity.y,
        });
      } else if (this.directionX === "left") {
        Matter.Body.setVelocity(this.physicalBody, {
          x: -config.player.WALK_SPEED,
          y: this.physicalBody.velocity.y,
        });
      }

      if (this.directionY && !this.jumping && this.isInBound()) {
        const floor = this.characterFloor;
        floor.isSleeping = false;

        if (this.directionY === "up") {
          Matter.Body.setVelocity(floor, {
            x: this.physicalBody.velocity.x,
            y: -config.player.WALK_SPEED_UP,
          });
        } else if (this.directionY === "down") {
          Matter.Body.setVelocity(this.physicalBody, {
            x: this.physicalBody.velocity.x,
            y: config.player.WALK_SPEED_DOWN,
          });
          Matter.Body.setVelocity(floor, {
            x: this.physicalBody.velocity.x,
            y: config.player.WALK_SPEED_DOWN,
          });
        }
      } else {
        this.characterFloor.isSleeping = true;
        Matter.Body.setVelocity(this.characterFloor, {
          x: this.physicalBody.velocity.x,
          y: 0,
        });
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
