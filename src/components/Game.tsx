import { useRef, useEffect } from "react";
import Game from "../Game/Game";
import GameUI from "./GameUI/GameUi";

function GameReact() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function startGame() {
      if (!canvasRef.current) return;
      let game = Game.getInstance();
      try {
        await game.init(canvasRef.current);
      } catch (error) {
        Game.clearInstance();
      }
    }
    void startGame();
  }, []);

  return (
    <main className="z-10 h-screen min-h-screen w-full select-none bg-[url('/assets/images/bg.webp')] bg-cover bg-center">
      <GameUI />
      <div
        id="canvas-container"
        className="max-h-screen overflow-hidden opacity-100"
      >
        <canvas ref={canvasRef} className="h-screen w-full outline-none" />
      </div>
    </main>
  );
}
export default GameReact;
