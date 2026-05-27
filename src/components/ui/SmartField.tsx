import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
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
  labelClassName?: string;
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
  labelClassName = "",
  className = "",
  type = "text",
  required,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isValid = validationFn ? validationFn(value) : null;
  const showError = isTouched && (errorText || isValid === false);
  
  // Use showPassword state to toggle actual input type if the prop type is "password"
  const actualType = type === "password" ? (showPassword ? "text" : "password") : type;

  // Apply formatting if provided
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newVal = e.target.value;
    if (formatter) {
      newVal = formatter(newVal);
    }
    onChange(newVal);
  };


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
          <div className={`pl-3 flex items-center justify-center transition-colors duration-300
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
              scale: (isFocused || value) ? 0.8 : 1,
              color: showError ? '#f43f5e' : (isFocused ? '#a34015' : '#94a3b8')
            }}
            className={`absolute left-4 top-3.5 origin-left pointer-events-none font-medium tracking-wider text-[11px] sm:text-[12px] whitespace-nowrap truncate w-[85%]
              ${(isFocused || value) ? 'opacity-100' : 'opacity-80'}
              ${labelClassName}
            `}
          >
            {label} 
          </motion.label>

          <input
            {...props}
            type={actualType}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setIsTouched(true);
            }}
            placeholder={isFocused ? props.placeholder : ""}
            className={`w-full bg-transparent px-4 pt-6 pb-2 outline-none text-sm font-medium
              ${showError ? 'text-rose-700' : 'text-slate-800'}
              ${type === 'date' && !value && !isFocused ? 'text-transparent' : ''}
            `}
            required={required}
          />
        </div>

        {/* Validation Icons & Password Toggle */}
        <AnimatePresence>
          {type === "password" && (
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowPassword(!showPassword)}
              className="pr-4 text-slate-400 hover:text-brand-primary focus:outline-none transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </motion.button>
          )}
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

      {/* Helper / Error Text (now in normal flow to avoid overlap) */}
      <AnimatePresence>
        {showError && errorText && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 px-4 text-[10px] font-bold text-rose-500 leading-relaxed"
          >
            {errorText}
          </motion.p>
        )}
        {!showError && helperText && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 px-4 text-[10px] font-medium text-slate-400 leading-relaxed"
          >
            {helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartField;
