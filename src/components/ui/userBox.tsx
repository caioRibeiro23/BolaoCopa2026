interface UserBoxProps {
    name: string;
}

export default function UserBox({ name }: UserBoxProps) {
    return(
        <div className="flex justify-center items-center py-2 px-1.5 rounded-lg bg-linear-to-r from-[#F59E0B] to-[#EF4444] font-inter font-bold">{name}</div>
    )
}