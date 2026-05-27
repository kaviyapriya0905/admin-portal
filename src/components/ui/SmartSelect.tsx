import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDown, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SmartSelectProps {
  label: string;
  icon?: LucideIcon;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[] | string[];
  helperText?: string;
  errorText?: string;
  className?: string;
  required?: boolean;
}

const SmartSelect: React.FC<SmartSelectProps> = ({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  helperText,
  errorText,
  className = "",
  required,
}) => {
  const normalizedOptions = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find(o => o.value === value);

  return (
    <div className={`relative ${className}`}>
      <Listbox value={value} onChange={onChange}>
        {({ open }) => {
          return (
            <>
              <ListboxButton 
                className={`relative flex items-center w-full bg-slate-50 border rounded-xl overflow-hidden transition-all duration-300 text-left outline-none
                  ${open ? 'border-brand-primary ring-2 ring-brand-primary/20 bg-white shadow-sm z-20' : 'border-slate-200'}
                  ${errorText ? 'border-rose-400 ring-rose-400/20 bg-rose-50' : ''}
                `}
              >
                {/* Leading Icon */}
                {Icon && (
                  <div className={`pl-4 flex items-center justify-center transition-colors duration-300
                    ${open ? 'text-brand-primary' : 'text-slate-400'}
                    ${value && !open ? 'text-emerald-500' : ''}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                )}

                {/* Floating Label & Select Text */}
                <div className="relative flex-1 min-h-[52px]">
                  <motion.label
                    initial={false}
                    animate={{
                      y: (open || value) ? -10 : 0,
                      scale: (open || value) ? 0.75 : 1,
                      color: open ? '#a34015' : '#94a3b8'
                    }}
                    className={`absolute left-4 top-3.5 origin-left pointer-events-none font-bold uppercase tracking-wider text-[10px]
                      ${(open || value) ? 'opacity-100' : 'opacity-80'}
                    `}
                  >
                    {label} {required && <span className="text-rose-500 ml-0.5">*</span>}
                  </motion.label>
                  
                  <div className="w-full px-4 pt-6 pb-2 text-[13px] font-semibold text-slate-800 truncate">
                    {selectedOption ? selectedOption.label : <span className="opacity-0">Placeholder</span>}
                  </div>
                </div>

                {/* Trailing Icon */}
                <div className="pr-4 pointer-events-none">
                  <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className={`w-4 h-4 ${open ? 'text-brand-primary' : 'text-slate-400'}`} />
                  </motion.div>
                </div>
              </ListboxButton>

              <ListboxOptions 
                transition
                className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1.5 text-base shadow-xl border border-slate-100 ring-1 ring-black/5 focus:outline-none sm:text-sm data-[closed]:data-[leave]:opacity-0 data-[leave]:transition data-[leave]:duration-100 data-[leave]:ease-in custom-scrollbar"
              >
                {normalizedOptions.map((opt) => (
                  <ListboxOption
                    key={opt.value}
                    value={opt.value}
                    className="group relative cursor-pointer select-none py-2.5 pl-10 pr-4 text-slate-700 data-[focus]:bg-slate-50 data-[focus]:text-brand-primary transition-colors duration-150"
                  >
                    <span className="block truncate font-semibold text-[13px] group-data-[selected]:font-bold group-data-[selected]:text-brand-primary">
                      {opt.label}
                    </span>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-primary opacity-0 group-data-[selected]:opacity-100 transition-opacity">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </>
          );
        }}
      </Listbox>

      {/* Helper / Error Text */}
      <AnimatePresence>
        {errorText && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute left-1 -bottom-5 text-[10px] font-bold text-rose-500"
          >
            {errorText}
          </motion.p>
        )}
        {!errorText && helperText && (
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
