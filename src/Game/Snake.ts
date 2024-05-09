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
  cloneBody: Vector3 = Vector3.Zero();

  timePassed: number = 0;

  direction = new Vector2(1, 0);

  ground: Grounds;

  boxAggregate!: PhysicsAggregate;
  appleAggregate!: PhysicsAggregate;

  apple!: Mesh;
  appleStorage: Mesh | null = null;

  scene: Scene;
  hk!: HavokPlugin;

  lastPosition: Vector3 = Vector3.Zero();

  groundWidth: number = 2.5;
  groundHeight: number = 2.5;

  inputs: Vector2[] = [];

  score: number = 0;

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
    switch (event.event.key) {
      case "w":
        if (this.direction.y !== 1) {
          this.direction.set(0, -1);
        }
        break;
      case "s":
        if (this.direction.y !== -1) {
          this.direction.set(0, 1);
        }
        break;
      case "d":
        if (this.direction.x !== 1) {
          this.direction.set(-1, 0);
        }
        break;
      case "a":
        if (this.direction.x !== -1) {
          this.direction.set(1, 0);
        }
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
            this.score++;
            // console.log(this.score);
          } else if (
            event.collider.transformNode.name === "snake" &&
            event.collidedAgainst.transformNode.name === "snakeBody"
          ) {
            console.log("collided");
            this.gameOver();
          }
        }
      }
    );

    return box;
  }

  createSnakeBody() {
    const body = MeshBuilder.CreateBox("snakeBody", { size: 0.09 });
    const material = new StandardMaterial("box");
    material.diffuseColor = new Color3(0, 0, 0);
    body.material = material;

    body.position.copyFrom(this.lastPosition);

    const snakeBodyAggregate = new PhysicsAggregate(body, PhysicsShapeType.BOX);
    snakeBodyAggregate.body.setMassProperties({ mass: 1 });
    snakeBodyAggregate.body.setMotionType(PhysicsMotionType.STATIC);
    snakeBodyAggregate.shape.isTrigger = true;
    snakeBodyAggregate.body.disablePreStep = false;

    this.body.push(body);
  }

  getRandomNumbner() {
    const occupiedBodyPos = this.cloneBody;
    const occupiedHeadPos = this.head.position;

    let movementRangeX = this.groundWidth / 2;
    let movementRangeZ = this.groundHeight / 2;
    let random = Vector3.Zero();

    let finalPosition = false;

    while (true) {
      let randomMovementX = +(
        Math.random() * movementRangeX -
        movementRangeX
      ).toFixed(1);
      let randomMovementZ = +(
        Math.random() * movementRangeZ -
        movementRangeZ
      ).toFixed(1);

      random.set(randomMovementX, 0, randomMovementZ);

      if (
        (occupiedBodyPos.x === random.x && occupiedBodyPos.z === random.z) ||
        (occupiedHeadPos.x === random.x && occupiedHeadPos.z === random.z)
      ) {
        finalPosition = true;
      }

      if (!finalPosition) {
        return random;
      }
    }
  }

  createApple() {
    if (this.appleStorage) {
      this.appleStorage.dispose();
    }

    const apple = MeshBuilder.CreateBox("apple", { size: 0.09 });
    const material = new StandardMaterial("box");
    material.diffuseColor = new Color3(0, 1, 0);
    apple.material = material;
    // apple.material.alpha = 0.7;

    // random position
    const randomPosition = this.getRandomNumbner();
    apple.position.set(randomPosition.x, 0, randomPosition.z);

    const appleAggregate = new PhysicsAggregate(apple, PhysicsShapeType.BOX);
    appleAggregate.body.disablePreStep = false;
    appleAggregate.body.setMotionType(PhysicsMotionType.STATIC);
    appleAggregate.shape.isTrigger = true;

    this.appleStorage = apple;

    return apple;
  }

  gameOver() {
    console.log("Game Over");
    this.resetTheGame();
  }

  resetTheGame() {
    this.head.position = Vector3.Zero();
    this.direction = new Vector2(1, 0);

    this.body.forEach((item) => {
      item.dispose();
    });

    this.body = [];
    this.timePassed = 0;
    this.score = 0;
    this.createApple();
  }

  update() {
    const engine = Game.getInstance().engine;
    const delta = engine.getDeltaTime();
    this.timePassed += delta;

    if (this.timePassed >= 300) {
      this.lastPosition = this.head.position.clone();

      this.head.position.x += this.direction.x * 0.1;
      this.head.position.z += this.direction.y * 0.1;

      for (let i = 0; i < this.body.length; i++) {
        const oldBodyPos = this.body[i].position.clone();
        this.body[i].position.copyFrom(this.lastPosition);
        this.cloneBody.copyFrom(this.body[i].position);
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
      this.timePassed -= 300;
    }
  }
}
