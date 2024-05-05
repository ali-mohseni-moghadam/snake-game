import {
  Engine,
  HavokPlugin,
  Observable,
  Scene,
  Vector3,
} from "@babylonjs/core";
import Debugger from "./Debugger";
import Environment from "./Environment";
import Camera from "./Camera";
import Grounds from "./Ground";
import { Snake } from "./Snake";
// import useStore from "../store/index.store";
import HavokPhysics from "@babylonjs/havok";

export default class Game {
  private static instance: Game | undefined;
  physicsPlugin!: HavokPlugin;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Game();
    }
    return this.instance;
  }

  static clearInstance() {
    this.instance?.cleanUp();
    this.instance = undefined;
  }

  canvas!: HTMLCanvasElement;
  engine!: Engine;
  scene!: Scene;
  camera!: Camera;
  cleanUpObservable = new Observable();
  resizeObservable = new Observable();
  isInitialized = false;
  ground!: Grounds;

  async init(canvas: HTMLCanvasElement) {
    if (this.isInitialized) return;
    this.isInitialized = true;

    this.canvas = canvas;

    this.engine = new Engine(canvas, true, {
      lockstepMaxSteps: 4,
      deterministicLockstep: true,
    });

    this.scene = new Scene(this.engine);

    await this.initPhysics();

    window.addEventListener("resize", this.onResize.bind(this));

    this.camera = new Camera();

    new Environment();
    this.ground = new Grounds();
    new Snake();

    if (process.env.NODE_ENV === "development") {
      const debugLayer = new Debugger();
      await debugLayer.init();
    }

    await this.scene.whenReadyAsync();

    // let test = 0;
    // setInterval(() => {
    //   const { setTest } = useStore.getState();
    //   test++
    //   setTest(test);
    // }, 1000);

    this.engine.runRenderLoop(() => this.scene.render());
  }

  private onResize() {
    this.engine.resize();
    this.resizeObservable.notifyObservers(undefined);
  }

  async initPhysics() {
    const hk = await HavokPhysics();
    const gravityVector = new Vector3(0, -5, 0);
    this.physicsPlugin = new HavokPlugin(true, hk);
    this.scene.enablePhysics(gravityVector, this.physicsPlugin);
  }

  cleanUp() {
    this.engine.stopRenderLoop();

    window.removeEventListener("resize", this.onResize.bind(this));
    this.cleanUpObservable.notifyObservers(undefined);

    this.engine.dispose();
  }
}
