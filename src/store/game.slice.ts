import { type StateCreator } from "zustand";

type IState = {
  test: number;
};

type IActions = {
  setTest: (test: number) => void;
};

export type IGameSlice = IState & IActions;

const base: IState = {
  test: 0,
};

const createGameSlice: StateCreator<IGameSlice> = (set) => ({
  ...base,
  setTest: (test) => set({ test }),
});

export default createGameSlice;
