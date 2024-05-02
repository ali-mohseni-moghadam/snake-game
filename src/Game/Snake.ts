import {
  Color3,
  KeyboardInfo,
  Mesh,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsMotionType,
  PhysicsShapeType,
  StandardMaterial,
  Vector2,
} from "@babylonjs/core";
import Game from "./Game";
import Grounds from "./Ground";

export class Snake {
  head!: Mesh;
  body: Mesh[] = [];
  range: number[] = [0.1, 0.2, 0.3, 0.4, 0.5];
  timePassed: number = 0;

  direction = new Vector2(1, 0);

  ground: Grounds;

  boxAggregate!: PhysicsAggregate;

  constructor() {
    const scene = Game.getInstance().scene;

    this.head = this.createBox(new Color3(1, 0, 0));

    this.ground = Game.getInstance().ground;

    // this.createSnakeBody();

    scene.onKeyboardObservable.add(this.onKeyboard.bind(this));
    scene.onBeforeRenderObservable.add(this.update.bind(this));
  }

  onKeyboard(event: KeyboardInfo) {
    this.direction.x = 0;
    this.direction.y = 0;
    switch (event.event.key) {
      case "w":
        this.direction.y = -1;
        break;
      case "d":
        this.direction.x = -1;
        break;
      case "a":
        this.direction.x = 1;
        break;
      case "s":
        this.direction.y = 1;
        break;
    }
  }

  createBox(color?: Color3) {
    const box = MeshBuilder.CreateBox("snake", {
      size: 0.09,
    });
    const material = new StandardMaterial("box");
    color
      ? (material.diffuseColor = color)
      : (material.diffuseColor = Color3.Black());
    box.material = material;

    this.boxAggregate = new PhysicsAggregate(
      box,
      PhysicsShapeType.BOX,
      undefined
    );
    this.boxAggregate.body.setMassProperties({ mass: 1 });
    this.boxAggregate.body.setMotionType(PhysicsMotionType.ANIMATED);
    this.boxAggregate.body.disablePreStep = false;

    return box;
  }

  // createSnakeBody() {
  //   this.range.reverse().forEach((item) => {
  //     const body = this.createBox();
  //     body.position.x = item;
  //     console.log(item);
  //     this.body.push(body);
  //   });
  // }

  update() {
    const engine = Game.getInstance().engine;
    const delta = engine.getDeltaTime();
    this.timePassed += delta;

    if (this.timePassed >= 1000) {
      this.head.position.x += this.direction.x * 0.1;
      this.head.position.z += this.direction.y * 0.1;

      // this.body.forEach((item) => {
      //   item.position.x -= 0.1;
      // });

      this.timePassed -= 1000;
    }
  }
}
