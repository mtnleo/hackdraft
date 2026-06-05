import { ShuffleIcon } from "./icons";

interface Props {
  label: string;
  onClick: () => void;
}

export default function ShuffleButton({ label, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hover-lift active-press flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-orange px-6 py-3 text-ink shadow-hard-lg md:w-auto"
    >
      <ShuffleIcon />
      <span className="font-display text-xl font-bold">{label}</span>
    </button>
  );
}
