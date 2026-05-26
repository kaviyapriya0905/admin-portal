import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SmartSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string;
  icon?: LucideIcon;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[] | string[];
  helperText?: string;
}

const SmartSelect: React.FC<SmartSelectProps> = ({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  helperText,
  className = "",
  required,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const normalizedOptions = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`relative flex items-center bg-slate-50 border rounded-xl overflow-hidden transition-all duration-300
          ${isFocused ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-white' : 'border-slate-200'}
        `}
      >
        {/* Leading Icon */}
        {Icon && (
          <div className={`pl-4 flex items-center justify-center transition-colors duration-300
            ${isFocused ? 'text-brand-primary' : 'text-slate-400'}
            ${value && !isFocused ? 'text-emerald-500' : ''}
          `}>
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Floating Label & Select */}
        <div className="relative flex-1">
          <motion.label
            initial={false}
            animate={{
              y: (isFocused || value) ? -10 : 0,
              scale: (isFocused || value) ? 0.75 : 1,
              color: isFocused ? '#a34015' : '#94a3b8'
            }}
            className={`absolute left-4 top-3.5 origin-left pointer-events-none font-bold uppercase tracking-wider text-[10px]
              ${(isFocused || value) ? 'opacity-100' : 'opacity-80'}
            `}
          >
            {label} 
          </motion.label>

          <select
            {...props}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent px-4 pt-6 pb-2 outline-none text-sm font-semibold text-slate-800 appearance-none relative z-10"
            required={required}
          >
            <option value="" disabled className="hidden"></option>
            {normalizedOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Trailing Icon */}
        <div className="pr-4 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>

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

export default SmartSelect;
