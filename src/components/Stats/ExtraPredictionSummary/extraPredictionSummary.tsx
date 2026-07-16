import Link from "next/link";
interface ExtraPredictionSummaryProps {
  userId?: string;
}

export default function ExtraPredictionSummary({ userId }: ExtraPredictionSummaryProps) {
  const href = userId
    ? `/torneio/extras?userId=${encodeURIComponent(userId)}`
    : "/torneio/extras";

  return (
    <Link
      href={href}
      className="mt-1 inline-flex w-fit items-center gap-1 font-roboto text-xs text-cinzaSuave transition-colors duration-200 hover:text-verdeNeon"
    >
      Ver extras
      <span className="text-[10px] leading-none">→</span>
    </Link>
  );
}