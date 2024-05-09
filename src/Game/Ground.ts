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
      width: 2.5,
      height: 2.5,
    });

    // const groundMat = new StandardMaterial("groundMat");
    // groundMat.diffuseColor = new Color3(1, 0, 0);
    // this.ground.material = groundMat;
  }
}
