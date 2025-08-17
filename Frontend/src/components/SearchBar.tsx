import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onFilter: (query: string, area: string) => void;
  areas: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onFilter, areas }) => {
  const [query, setQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  // Jab bhi query/area change ho -> parent ko update karo
  useEffect(() => {
    onFilter(query, selectedArea);
  }, [query, selectedArea]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* 🔎 Search box */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for delicious recipes..."
            className="w-full h-14 pl-6 pr-4 text-lg bg-ctp-surface0 border-2 border-ctp-surface1 rounded-full"
          />
          <Search className="absolute right-4 top-4 h-5 w-5 text-ctp-subtext0" />
        </div>

        {/* 🌍 Area filter */}
        <div className="flex flex-col items-start pb-5">
          <label htmlFor="area-select" className="mb-1 text-sm text-ctp-subtext1 text-center appearance-none px-10">
            Filter by Region:
          </label>
          <select
            id="area-select"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="h-14 w-48 bg-ctp-surface0 text-ctp-subtext1 rounded-full text-center appearance-none px-4"
          >
            <option value="">All Areas</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

        </div>
      </div>
    </div>
  );
};

export default SearchBar;
