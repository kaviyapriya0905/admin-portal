import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/utils/cn";

interface SmartSearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  containerClassName?: string;
}

const SmartSearchBar: React.FC<SmartSearchBarProps> = ({
  value = "",
  onChange,
  placeholder = "Search...",
  containerClassName = "",
  className = "",
  ...props
}) => {
  return (
    <div className={cn("relative w-full sm:w-64", containerClassName)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={cn(
          "w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-primary/30 transition-all",
          className
        )}
        {...props}
      />
    </div>
  );
};

export default SmartSearchBar;
