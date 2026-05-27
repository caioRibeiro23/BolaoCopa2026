interface PaginationCardProps {
    number: string | number;
    isActive?: boolean;
    disabled?: boolean;
    isEllipsis?: boolean;
    onClick?: () => void;
}

export default function PaginationCard({ number, isActive, disabled, isEllipsis, onClick }: PaginationCardProps) {
    if (isEllipsis) {
        return (
            <span className="inline-flex h-12 min-w-12 items-center justify-center rounded-lg border border-transparent font-inter text-sm text-cinzaSuave">
                {number}
            </span>
        );
    }

    const className = `inline-flex h-12 w-12 items-center justify-center rounded-lg border font-inter text-sm transition-colors ${isActive ? "border-verdeNeon/50 bg-verdeNeon/10 text-verdeNeon" : "border-[#1F2D45] bg-cinzaEscuro text-cinzaSuave hover:border-verdeNeon/30 hover:text-verdeNeon"} ${disabled ? "pointer-events-none opacity-40" : ""}`;

    return (
        <button type="button" aria-current={isActive ? "page" : undefined} className={className} onClick={onClick} disabled={disabled}>
            {number}
        </button>
    );
}