import useStore from "../../../store/index.store";

export default function Test() {
  const test = useStore.use.test();

  return <div className="fixed left-0 top-0 p-2 bg-red-600" > test is {test}</div>;
}
