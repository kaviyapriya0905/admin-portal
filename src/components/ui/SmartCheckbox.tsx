import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface SmartCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SmartCheckbox: React.FC<SmartCheckboxProps> = ({
  label,
  description,
  checked,
  onChange,
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <label className={`group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden
      ${checked ? 'bg-brand-primary/5 border-brand-primary/30 ring-1 ring-brand-primary/20' : 'bg-slate-50/50 border-slate-200 hover:border-brand-primary/40'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `}>
      <div className="relative flex items-center justify-center shrink-0 mt-0.5">
        <input
          {...props}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="peer sr-only"
        />
        <div className={`w-5 h-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center
          ${checked ? 'bg-brand-primary border-brand-primary' : 'bg-white border-slate-300 group-hover:border-brand-primary/50'}
        `}>
          <motion.div
            initial={false}
            animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
          </motion.div>
        </div>
      </div>
      
      <div className="flex-1 select-none">
        <p className={`text-[13px] font-bold transition-colors duration-300 ${checked ? 'text-brand-primary' : 'text-slate-700 group-hover:text-slate-900'}`}>
          {label}
        </p>
        {description && (
          <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      
      {/* Background glow effect when checked */}
      {checked && (
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-brand-primary/5 blur-2xl pointer-events-none" />
      )}
    </label>
  );
};

export default SmartCheckbox;
