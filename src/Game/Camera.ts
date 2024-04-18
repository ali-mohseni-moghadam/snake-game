import { Vector3, ArcRotateCamera } from "@babylonjs/core";

export default class Camera {
  camera: ArcRotateCamera;

  constructor() {
    this.camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      0.02,
      4,
      new Vector3()
    );
    this.camera.minZ = 0.01;
    this.camera.maxZ = 50;
  }
}
