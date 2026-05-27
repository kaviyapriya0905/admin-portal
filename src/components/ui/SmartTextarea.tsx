import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface SmartTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string;
  icon?: LucideIcon;
  value: string;
  onChange: (val: string) => void;
  helperText?: string;
  errorText?: string;
}

const SmartTextarea: React.FC<SmartTextareaProps> = ({
  label,
  icon: Icon,
  value,
  onChange,
  helperText,
  errorText,
  className = "",
  required,
  placeholder: _placeholder,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`relative flex bg-slate-50 border rounded-xl overflow-hidden transition-all duration-300
          ${isFocused ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-white' : 'border-slate-200'}
          ${errorText ? 'border-rose-400 ring-rose-400/20 bg-rose-50' : ''}
        `}
      >
        {/* Leading Icon */}
        {Icon && (
          <div className={`pl-3 pt-3 flex items-start justify-center transition-colors duration-300
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
              scale: (isFocused || value) ? 0.8 : 1,
              color: isFocused ? '#a34015' : '#94a3b8'
            }}
            className={`absolute left-4 top-3.5 origin-left pointer-events-none font-medium tracking-wide text-sm
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
            className="w-full bg-transparent px-4 pt-7 pb-2 outline-none text-[11px] font-normal text-slate-800 resize-none min-h-[84px]"
            required={required}
          />
        </div>
      </div>

      {/* Helper / Error Text (in normal flow to avoid overlap) */}
      <AnimatePresence>
        {errorText && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 px-4 text-[10px] font-bold text-rose-500 leading-relaxed"
          >
            {errorText}
          </motion.p>
        )}
        {!errorText && helperText && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 px-4 text-[10px] font-medium text-slate-400 w-full leading-relaxed"
          >
            {helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartTextarea;
