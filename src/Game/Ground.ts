import {
  // Color3,
  CreateGround,
  Mesh,
  // StandardMaterial,
} from "@babylonjs/core";

export default class Grounds {
  ground: Mesh;

  constructor() {
    this.ground = CreateGround("base_ground", {
      width: 3.1,
      height: 2.1,
    });

    // const groundMat = new StandardMaterial("groundMat");
    // groundMat.diffuseColor = new Color3(1, 0, 0);
    // this.ground.material = groundMat;
  }
}
