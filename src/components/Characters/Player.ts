import * as PIXI from "pixi.js";
import * as Matter from "matter-js";
import config from "../../config.ts";

export default class Player {
  container: PIXI.Container;
  physicalBody: Matter.Body;
  physicEngine: Matter.Engine;
  animatedSprite: PIXI.AnimatedSprite;
  jumping: boolean;
  directionX: "right" | "left" | null = null;
  directionY: "up" | "down" | null = null;
  spriteDirection: "left" | "right";
  isMoving: Boolean = false;
  characterFloor: Matter.Body;
  spriteSheet: PIXI.Spritesheet;

  constructor(physicEngine: Matter.Engine, parentContainer: PIXI.Container) {
    this.container = new PIXI.Container();
    this.jumping = false;
    this.physicEngine = physicEngine;
    this.prepareSprites();

    parentContainer.addChild(this.container);
  }

  async prepareSprites() {
    this.spriteSheet = await PIXI.Assets.load("characters/adventurer.json");

    if (this.spriteSheet) {
      this.animatedSprite = new PIXI.AnimatedSprite(
        // @ts-ignore
        this.spriteSheet.animations["idle"]
      );

      this.animatedSprite.animationSpeed = 0.1;
      this.animatedSprite.anchor.set(0.5, 1);
      this.animatedSprite.x = 200;
      this.animatedSprite.y = config.GAME_HEIGHT * 0.7;

      this.container.addChild(this.animatedSprite);
      this.animatedSprite.play();

      this.setPhysicalBody();
    }
  }

  setPhysicalBody() {
    const position = this.container.getLocalBounds();

    this.physicalBody = Matter.Bodies.rectangle(
      this.animatedSprite.x,
      this.animatedSprite.y,
      this.animatedSprite.width,
      this.animatedSprite.height,
      {
        mass: 10,
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
        inertia: Infinity,
      }
    );

    Matter.World.add(this.physicEngine.world, [
      this.physicalBody,
      this.characterFloor,
    ]);

    this.syncAssetsWithPhysicalBodies();
  }

  syncAssetsWithPhysicalBodies() {
    this.animatedSprite.x = this.physicalBody.position.x;
    this.animatedSprite.y = this.physicalBody.position.y;
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
      ? this.animatedSprite.position.y > config.GAME_HEIGHT * 0.77
      : this.animatedSprite.position.y < config.GAME_HEIGHT * 0.94;
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
          Matter.Body.setVelocity(this.physicalBody, {
            x: this.physicalBody.velocity.x,
            y: 0.5,
          });
          Matter.Body.setVelocity(floor, {
            x: this.physicalBody.velocity.x,
            y: -config.player.WALK_SPEED_UP,
          });
        } else if (this.directionY === "down") {
          Matter.Body.setVelocity(this.physicalBody, {
            x: this.physicalBody.velocity.x,
            y: 4,
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
    if (this.animatedSprite) {
      this.syncCharAndFloor();
      this.processMovement();
      this.syncAssetsWithPhysicalBodies();
      if (this.jumping) {
        this.checkIfIsStillJumping();
      }
    }
  }
}
