"use client";

import { Search, X } from "lucide-react";
import { FIELD_STYLES } from "./fieldStyles";

export type SearchInputProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  "aria-label"?: string;
  className?: string;
};

const SearchInput = ({
  value,
  onValueChange,
  placeholder = "Search tasks...",
  "aria-label": ariaLabel = "Search tasks",
  className = "",
}: SearchInputProps) => {
  return (
    <div className={`relative w-full ${className}`}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500"
      />
      <input
        // type="search" has its own clear button in some browsers; hide it in favour of ours
        type="search"
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onValueChange("");
        }}
        className={`${FIELD_STYLES} pr-9 pl-9 text-sm [&::-webkit-search-cancel-button]:hidden`}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onValueChange("")}
          className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
