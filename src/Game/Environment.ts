import { Color3, Color4, HemisphericLight, Vector3 } from "@babylonjs/core";
import Game from "./Game";

export default class Environment {
  constructor() {
    const scene = Game.getInstance().scene;

    // clear color
    scene.clearColor = new Color4(0.4, 0.8, 0.4, 1.0);

    this.createLight();
  }

  private createLight() {
    const scene = Game.getInstance().scene;
    const light = new HemisphericLight(
      "HemisphericLight",
      new Vector3(-1, 2, 0),
      scene
    );
    light.diffuse = new Color3(1, 1, 1);
    light.specular = new Color3(0.5, 0.5, 0.5);
    light.groundColor = new Color3(0, 0, 0);
    light.intensity = 3.0;
    light.direction = new Vector3(1.5, 3, 1);
  }
}
