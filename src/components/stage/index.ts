import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import Player from '../Characters/Player';

export default class Level {
  container: PIXI.Container;
  physicEngine: Matter.Engine;
  player: Player;
  constructor() {
    this.container = new PIXI.Container();
    this.initPhysicEngine();
    this.player = new Player(this.physicEngine, this.container);
  }

  initPhysicEngine() {
    this.physicEngine = Matter.Engine.create();
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, this.physicEngine);
  }

  processInput(inputs: Array<String>) {}

  update(inputs: Array<String>) {
    this.processInput(inputs);
    this.player.update(inputs);
  }
}
