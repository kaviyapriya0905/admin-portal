import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SmartFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  icon?: LucideIcon;
  value: string;
  onChange: (val: string) => void;
  validationFn?: (val: string) => boolean | null; // null means don't show validation
  formatter?: (val: string) => string;
  helperText?: string;
  errorText?: string;
}

const SmartField: React.FC<SmartFieldProps> = ({
  label,
  icon: Icon,
  value,
  onChange,
  validationFn,
  formatter,
  helperText,
  errorText,
  className = "",
  type = "text",
  required,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // Apply formatting if provided
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newVal = e.target.value;
    if (formatter) {
      newVal = formatter(newVal);
    }
    onChange(newVal);
  };

  const isValid = validationFn ? validationFn(value) : null;
  const showError = isTouched && isValid === false;

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`relative flex items-center bg-slate-50 border rounded-xl overflow-hidden transition-all duration-300
          ${isFocused ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-white' : 'border-slate-200'}
          ${showError ? 'border-rose-400 ring-rose-400/20 bg-rose-50' : ''}
          ${isValid === true && !isFocused ? 'border-emerald-300 bg-emerald-50/30' : ''}
        `}
      >
        {/* Leading Icon */}
        {Icon && (
          <div className={`pl-4 flex items-center justify-center transition-colors duration-300
            ${isFocused ? 'text-brand-primary' : 'text-slate-400'}
            ${showError ? 'text-rose-400' : ''}
            ${isValid === true && !isFocused ? 'text-emerald-500' : ''}
          `}>
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Floating Label & Input */}
        <div className="relative flex-1">
          <motion.label
            initial={false}
            animate={{
              y: (isFocused || value) ? -10 : 0,
              scale: (isFocused || value) ? 0.75 : 1,
              color: showError ? '#f43f5e' : (isFocused ? '#a34015' : '#94a3b8')
            }}
            className={`absolute left-4 top-3.5 origin-left pointer-events-none font-bold uppercase tracking-wider text-[10px] whitespace-nowrap truncate w-[85%]
              ${(isFocused || value) ? 'opacity-100' : 'opacity-80'}
            `}
          >
            {label} 
          </motion.label>

          <input
            {...props}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setIsTouched(true);
            }}
            placeholder={isFocused ? props.placeholder : ""}
            className={`w-full bg-transparent px-4 pt-6 pb-2 outline-none text-sm font-semibold
              ${showError ? 'text-rose-700' : 'text-slate-800'}
              ${type === 'date' && !value && !isFocused ? 'text-transparent' : ''}
            `}
            required={required}
          />
        </div>

        {/* Validation Icons */}
        <AnimatePresence>
          {isValid === true && value.length > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="pr-4"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </motion.div>
          )}
          {showError && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], x: [-2, 2, -2, 2, 0] }}
              className="pr-4"
            >
              <AlertCircle className="w-5 h-5 text-rose-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helper / Error Text */}
      <AnimatePresence>
        {showError && errorText && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-1 -bottom-5 text-[10px] font-bold text-rose-500"
          >
            {errorText}
          </motion.p>
        )}
        {!showError && helperText && (
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

export default SmartField;
