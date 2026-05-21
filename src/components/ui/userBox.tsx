interface UserBoxProps {
    shortName: string;
}

export default function UserBox({ shortName }: UserBoxProps) {
    return(
        <div className="flex h-10 aspect-square justify-center items-center py-2 px-1.5 rounded-lg bg-linear-to-r from-[#F59E0B] to-[#EF4444] font-inter font-bold">{shortName}</div>
    )
}