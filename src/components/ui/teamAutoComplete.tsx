import { useEffect, useMemo, useRef, useState } from "react";

interface TeamAutocompleteProps {
  label: string;
  name: string;
  placeholder: string;
  teams: string[];
  disabled?: boolean;
}

export function TeamAutocomplete({
  label,
  name,
  placeholder,
  teams,
  disabled = false,
}: TeamAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredTeams = useMemo(() => {
    return teams.filter((team) =>
      team.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, teams]);

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
  <span className="font-inter text-sm font-semibold text-[#E8EDF5]">
    {label}
  </span>

  <div className="relative">
    <input
      name={name}
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        setOpen(true);
      }}
      onFocus={() => setOpen(true)}
      placeholder={placeholder}
      autoComplete="off"
      className="w-full rounded-[10px] border border-[#FFFFFF]/12 bg-transparent py-3 px-4 text-white placeholder-[#757575] transition-all duration-200 focus:border-verdeNeon/30 focus:outline-none focus:ring-2 focus:ring-verdeNeon/20"
      disabled={disabled}
    />

    {open && filteredTeams.length > 0 && (
      <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-white/10 bg-azulMedio">
        {filteredTeams.map((team) => (
          <button
            key={team}
            type="button"
            onClick={() => {
              setQuery(team);
              setOpen(false);
            }}
            className="block w-full px-4 py-3 text-left text-white hover:bg-white/10"
          >
            {team}
          </button>
        ))}
      </div>
    )}
  </div>
</div>);
}