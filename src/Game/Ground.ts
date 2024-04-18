import { CreateGround, Mesh } from "@babylonjs/core";

export default class Grounds {
  ground: Mesh;
  constructor() {
    this.ground = CreateGround("base_ground", {
      width: 3.1,
      height: 2.1,
    });
  }
}
