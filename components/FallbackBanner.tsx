import { InfoIcon } from "./icons";

export default function FallbackBanner({ message }: { message: string }) {
  return (
    <div className="mb-6 flex items-center gap-3 rounded-md border-2 border-l-[6px] border-ink bg-banner p-4 shadow-hard-sm">
      <InfoIcon className="shrink-0 text-ink" />
      <p className="font-body text-sm font-medium text-ink md:text-base">
        {message}
      </p>
    </div>
  );
}
