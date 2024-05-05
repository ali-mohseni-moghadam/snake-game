import {
  Color3,
  HavokPlugin,
  IBasePhysicsCollisionEvent,
  KeyboardInfo,
  Mesh,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsMotionType,
  PhysicsShapeType,
  Scene,
  StandardMaterial,
  Vector2,
  Vector3,
} from "@babylonjs/core";
import Game from "./Game";
import Grounds from "./Ground";

export class Snake {
  head!: Mesh;
  body: Mesh[] = [];
  range: number[] = [-0.1, -0.2, -0.3, -0.4, -0.5];
  timePassed: number = 0;

  direction = new Vector2(1, 0);

  ground: Grounds;

  boxAggregate!: PhysicsAggregate;
  appleAggregate!: PhysicsAggregate;

  apple!: Mesh;
  appleStorage: Mesh | null = null;

  scene: Scene;
  observer: any;
  hk!: HavokPlugin;

  collidedWithApple: boolean = false;

  lastPosition: Vector3 = Vector3.Zero();

  groundWidth: number = 3.1;
  groundHeight: number = 2.1;

  constructor() {
    this.hk = Game.getInstance().physicsPlugin;

    this.scene = Game.getInstance().scene;

    this.head = this.createBox(new Color3(1, 0, 0));

    this.ground = Game.getInstance().ground;

    this.createApple();

    this.scene.onKeyboardObservable.add(this.onKeyboard.bind(this));
    this.scene.onBeforeRenderObservable.add(this.update.bind(this));
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

    this.hk.onTriggerCollisionObservable.add(
      (event: IBasePhysicsCollisionEvent) => {
        if (event.type == "TRIGGER_ENTERED") {
          if (
            event.collider.transformNode.id === "snake" &&
            event.collidedAgainst.transformNode.id === "apple"
          ) {
            event.collidedAgainst.transformNode.dispose();
            event.collidedAgainst.dispose();
            this.createApple();
            this.createSnakeBody();
          }
        }
        console.log(event);
      }
    );

    return box;
  }

  createApple() {
    if (this.appleStorage) {
      this.appleStorage.dispose();
    }

    const apple = MeshBuilder.CreateBox("apple", { size: 0.09 });
    const material = new StandardMaterial("box");
    material.diffuseColor = new Color3(0, 1, 0);
    apple.material = material;
    apple.material.alpha = 0.7;

    let movementRangeX = 1.5;
    let movementRangeY = 1.1;

    let randomMovementX = +(
      Math.random() * movementRangeX -
      movementRangeX / 2
    ).toFixed(1);
    let randomMovementY = +(
      Math.random() * movementRangeY -
      movementRangeY / 2
    ).toFixed(1);

    apple.position = new Vector3(randomMovementX, 0, randomMovementY);

    const appleAggregate = new PhysicsAggregate(apple, PhysicsShapeType.BOX);

    appleAggregate.body.disablePreStep = false;

    appleAggregate.body.setMotionType(PhysicsMotionType.STATIC);
    appleAggregate.shape.isTrigger = true;

    this.appleStorage = apple;

    return apple;
  }

  createSnakeBody() {
    const body = MeshBuilder.CreateBox("snakeBody", { size: 0.09 });
    const material = new StandardMaterial("box");
    material.diffuseColor = new Color3(0, 0, 0);
    body.material = material;
    body.position.copyFrom(this.lastPosition);
    this.body.push(body);
  }

  gameOver() {
    console.log("Game Over");
    this.resetTheGame();
  }

  resetTheGame() {
    this.head.position = Vector3.Zero();
    this.direction = new Vector2(1, 0);

    for (const i of this.body) {
      i.dispose();
    }
    this.body = [];
    this.timePassed = 0;
    this.createApple();
  }

  update() {
    const engine = Game.getInstance().engine;
    const delta = engine.getDeltaTime();
    this.timePassed += delta;

    if (this.timePassed >= 500) {
      this.lastPosition = this.head.position.clone();

      this.head.position.x += this.direction.x * 0.1;
      this.head.position.z += this.direction.y * 0.1;

      for (let i = 0; i < this.body.length; i++) {
        const oldBodyPos = this.body[i].position.clone();
        this.body[i].position.copyFrom(this.lastPosition);
        this.lastPosition.copyFrom(oldBodyPos);
      }

      if (
        this.head.position.x < -this.groundWidth / 2 ||
        this.head.position.x > this.groundWidth / 2 ||
        this.head.position.z < -this.groundHeight / 2 ||
        this.head.position.z > this.groundHeight / 2
      ) {
        this.gameOver();
        return;
      }
      this.timePassed -= 500;
    }
  }
}
