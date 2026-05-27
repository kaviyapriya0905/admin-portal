import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import SmartSearchField from "@/components/ui/SmartSearchField";
import { getMockData } from "@/utils/mockData";

export interface DevoteeSearchResult {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  [key: string]: any;
}

interface DevoteeSearchPanelProps {
  onSelect: (devotee: DevoteeSearchResult) => void;
  initialValue?: string;
}

const DevoteeSearchPanel: React.FC<DevoteeSearchPanelProps> = ({ onSelect, initialValue = "" }) => {
  const [devoteeSearch, setDevoteeSearch] = useState(initialValue);
  const [devoteeResults, setDevoteeResults] = useState<DevoteeSearchResult[]>([]);

  const allDevotees = useMemo(() => getMockData().devotees || [], []);

  useEffect(() => {
    if (initialValue) {
      setDevoteeSearch(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    if (devoteeSearch.length > 1) {
      const results = allDevotees.filter((d: any) => {
        const name = (d.name || `${d.first_name || ""} ${d.last_name || ""}`).toLowerCase();
        return name.includes(devoteeSearch.toLowerCase()) || (d.phone || "").includes(devoteeSearch);
      }).slice(0, 6);
      setDevoteeResults(results);
    } else {
      setDevoteeResults([]);
    }
  }, [devoteeSearch, allDevotees]);

  const handleSelect = (devotee: DevoteeSearchResult) => {
    const name = devotee.name || `${devotee.first_name || ""} ${devotee.last_name || ""}`.trim();
    setDevoteeSearch(name);
    onSelect(devotee);
  };

  return (
    <SmartSearchField
      label="Link Existing Profile"
      icon={Search}
      value={devoteeSearch}
      onChange={(val) => setDevoteeSearch(val)}
      results={devoteeResults}
      onSelect={handleSelect}
      placeholder="Search by name or phone..."
      helperText="Search by name or phone. Linked profiles ensure accurate historical tracking."
      renderResult={(d: DevoteeSearchResult) => {
        const name = d.name || `${d.first_name || ""} ${d.last_name || ""}`.trim();
        return (
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs flex-shrink-0">
              {name.charAt(0)}
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-800">{name}</p>
              <p className="text-[10px] text-slate-400">{d.phone || "No phone"}</p>
            </div>
          </div>
        );
      }}
    />
  );
};

export default DevoteeSearchPanel;
