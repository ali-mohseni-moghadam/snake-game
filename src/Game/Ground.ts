import {
  // Color3,
  CreateGround,
  Mesh,
  PhysicsAggregate,
  PhysicsShapeType,
  // StandardMaterial,
} from "@babylonjs/core";

export default class Grounds {
  ground: Mesh;

  groundAggregate: PhysicsAggregate;
  constructor() {
    this.ground = CreateGround("base_ground", {
      width: 3.1,
      height: 2.1,
    });

    // const groundMat = new StandardMaterial("groundMat");
    // groundMat.diffuseColor = new Color3(1, 0, 0);
    // this.ground.material = groundMat;

    this.groundAggregate = new PhysicsAggregate(
      this.ground,
      PhysicsShapeType.BOX,
      undefined
    );
  }
}
