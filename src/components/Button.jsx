export default function Buton({ text, onClickHandler }) {
  return (
    <button onClick={onClickHandler} className="rounded-full bg-slate-200 p-2 hover:bg-slate-300 hover:scale-95">{text}</button>
  );
}