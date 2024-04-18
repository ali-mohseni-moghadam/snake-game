import type { Inspector } from "@babylonjs/inspector";
import { type Nullable, type Observer } from "@babylonjs/core";
import Game from "./Game";

export default class Debugger {
  private Inspector!: typeof Inspector;
  private observer!: Nullable<Observer<unknown>>;

  async init() {
    const { Inspector } = await import("@babylonjs/inspector");
    this.Inspector = Inspector;

    window.addEventListener("keydown", this.onKeydown.bind(this));
    this.observer = Game.getInstance().cleanUpObservable.add(
      this.cleanup.bind(this)
    );
  }

  private onKeydown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === "i") {
      this.toggleInspector();
    }
  }

  private toggleInspector() {
    if (this.Inspector.IsVisible) {
      this.Inspector.Hide();
    } else {
      this.Inspector.Show(Game.getInstance().scene, { embedMode: true });
    }
  }

  private cleanup() {
    window.removeEventListener("keydown", this.onKeydown.bind(this));
    this.observer?.remove();
  }
}
