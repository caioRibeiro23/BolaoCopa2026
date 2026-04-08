interface ProgressBarProps {
    percentage: number
    gradientFrom: string
    gradientTo: string
}

export default function ProgressBar({ percentage, gradientFrom, gradientTo }: ProgressBarProps) {
    const normalizedPercentage = Math.max(0, Math.min(100, percentage))

    return (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1F2D45]">
            <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                    width: `${normalizedPercentage}%`,
                    background: `linear-gradient(90deg, ${gradientFrom} 0%, ${gradientTo} 100%)`
                }}
            />
        </div>
    )
}
