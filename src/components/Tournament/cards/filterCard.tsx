interface FilterCardProps {
    text: string;
    isActive: boolean;
    onClick?: () => void;
}

export default function FilterCard({ text, isActive, onClick }: FilterCardProps) {
    const className = `inline-flex items-center justify-center rounded-lg border px-4 py-2 font-inter text-sm transition-colors ${isActive ? "border-verdeNeon/50 bg-verdeNeon/10 text-verdeNeon" : "border-[#1F2D45] bg-cinzaEscuro text-cinzaSuave hover:border-verdeNeon/30 hover:text-verdeNeon"}`;

    return (
        <button type="button" aria-current={isActive ? "page" : undefined} className={className} onClick={onClick}>
            {text}
        </button>
    );
}