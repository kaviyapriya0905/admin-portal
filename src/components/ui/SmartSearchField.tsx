import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface SmartSearchFieldProps {
  label: string;
  icon?: LucideIcon;
  value: string;
  onChange: (val: string) => void;
  results: any[];
  onSelect: (item: any) => void;
  renderResult: (item: any) => React.ReactNode;
  placeholder?: string;
  helperText?: string;
  className?: string;
}

const SmartSearchField: React.FC<SmartSearchFieldProps> = ({
  label,
  icon: Icon,
  value,
  onChange,
  results,
  onSelect,
  renderResult,
  placeholder = "",
  helperText,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const showDropdown = isFocused && value.length > 1 && results.length > 0;

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`relative flex items-center bg-slate-50 border rounded-xl transition-all duration-300
          ${isFocused ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-white shadow-sm z-30' : 'border-slate-200'}
        `}
      >
        {/* Leading Icon */}
        {Icon && (
          <div className={`pl-4 flex items-center justify-center transition-colors duration-300
            ${isFocused ? 'text-brand-primary' : 'text-slate-400'}
          `}>
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Floating Label & Input */}
        <div className="relative flex-1 overflow-hidden rounded-xl">
          <motion.label
            initial={false}
            animate={{
              y: (isFocused || value) ? -10 : 0,
              scale: (isFocused || value) ? 0.75 : 1,
              color: isFocused ? '#a34015' : '#94a3b8'
            }}
            className={`absolute left-4 top-3.5 origin-left pointer-events-none font-bold uppercase tracking-wider text-[10px] whitespace-nowrap truncate w-[85%]
              ${(isFocused || value) ? 'opacity-100' : 'opacity-80'}
            `}
          >
            {label} 
          </motion.label>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={isFocused ? placeholder : ""}
            className={`w-full bg-transparent px-4 pt-6 pb-2 outline-none text-sm font-semibold text-slate-800`}
          />
        </div>
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-40 top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {results.map((item, index) => (
                <button
                  key={item.id || index}
                  type="button"
                  onMouseDown={() => {
                    onSelect(item);
                    setIsFocused(false);
                  }}
                  className="w-full text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                >
                  {renderResult(item)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper Text */}
      <AnimatePresence>
        {helperText && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute left-1 -bottom-5 text-[10px] font-medium text-slate-400"
          >
            {helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSearchField;
