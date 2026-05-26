import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface SmartTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string;
  icon?: LucideIcon;
  value: string;
  onChange: (val: string) => void;
  helperText?: string;
}

const SmartTextarea: React.FC<SmartTextareaProps> = ({
  label,
  icon: Icon,
  value,
  onChange,
  helperText,
  className = "",
  required,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`relative flex bg-slate-50 border rounded-xl overflow-hidden transition-all duration-300
          ${isFocused ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-white' : 'border-slate-200'}
        `}
      >
        {/* Leading Icon */}
        {Icon && (
          <div className={`pl-4 pt-4 flex items-start justify-center transition-colors duration-300
            ${isFocused ? 'text-brand-primary' : 'text-slate-400'}
            ${value && !isFocused ? 'text-emerald-500' : ''}
          `}>
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Floating Label & Textarea */}
        <div className="relative flex-1">
          <motion.label
            initial={false}
            animate={{
              y: (isFocused || value) ? -10 : 0,
              scale: (isFocused || value) ? 0.75 : 1,
              color: isFocused ? '#a34015' : '#94a3b8'
            }}
            className={`absolute left-4 top-4 origin-left pointer-events-none font-bold uppercase tracking-wider
              ${(isFocused || value) ? 'opacity-100' : 'opacity-80'}
            `}
          >
            {label} 
          </motion.label>

          <textarea
            {...props}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent px-4 pt-8 pb-3 outline-none text-sm font-semibold text-slate-800 resize-none min-h-[100px]"
            required={required}
          />
        </div>
      </div>

      {/* Helper Text */}
      <AnimatePresence>
        {helperText && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute left-1 -bottom-5 text-[10px] font-medium text-slate-400 w-full flex justify-between pr-2"
          >
            {helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartTextarea;
