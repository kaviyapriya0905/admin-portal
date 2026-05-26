import React from "react";
import { cn } from "../../utils/cn";
import { Check } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<
  HTMLInputElement | HTMLTextAreaElement
> {
  icon: React.ElementType;
  label: string;
  textarea?: boolean;
  error?: unknown;
  optional?: boolean;
  required?: boolean;
  rows?: number;
}

const renderError = (error: unknown) => {
  if (!error) return null;
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;
    return (
      (err.message as string) ||
      (err.msg as string) ||
      (err.error as string) ||
      JSON.stringify(error)
    );
  }
  return String(error);
};

export const PremiumInputField: React.FC<InputFieldProps> = ({
  icon: Icon,
  label,
  textarea,
  error,
  optional,
  required,
  className,
  ...props
}) => (
  <div className="space-y-0.5 group w-full text-left">
    <div className="flex items-center gap-1.5 px-0.5">
      <Icon className="w-3.5 h-3.5 text-brand-primary" />
      <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
        {label}
        {optional && (
          <span className="text-[10px] text-slate-400 font-medium">
            (optional)
          </span>
        )}
        {required && <span className="text-brand-primary ml-0.5">*</span>}
      </label>
    </div>
    <div className="relative">
      {textarea ? (
        <textarea
          {...props}
          className={cn(
            "w-full px-4 py-2 bg-white border border-slate-200 rounded-md outline-none focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/5 transition-all duration-300 text-[13px] font-bold text-slate-700 placeholder:text-slate-300 resize-none",
            !!error && "border-rose-200",
            className,
          )}
        />
      ) : (
        <input
          {...props}
          className={cn(
            "w-full px-4 py-2 bg-white border border-slate-200 rounded-md outline-none focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/5 transition-all duration-300 text-[13px] font-bold text-slate-700 placeholder:text-slate-300",
            !!error && "border-rose-200",
            className,
          )}
        />
      )}
    </div>
    {!!error && (
      <p className="text-[10px] text-red-500 font-bold ml-1">
        {renderError(error) as React.ReactNode}
      </p>
    )}
  </div>
);

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  icon: React.ElementType;
  label: string;
  error?: unknown;
  optional?: boolean;
  required?: boolean;
  options: { value: string | number; label: string }[];
  placeholder?: string;
}

export const PremiumSelectField: React.FC<SelectFieldProps> = ({
  icon: Icon,
  label,
  error,
  optional,
  required,
  className,
  options,
  placeholder,
  value,
  onChange,
  ...props
}) => (
  <div className="space-y-0.5 group w-full text-left">
    <div className="flex items-center gap-1.5 px-0.5">
      <Icon className="w-3.5 h-3.5 text-brand-primary" />
      <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
        {label}
        {optional && (
          <span className="text-[10px] text-slate-400 font-medium">
            (optional)
          </span>
        )}
        {required && <span className="text-brand-primary ml-0.5">*</span>}
      </label>
    </div>
    <div className="relative">
      <select
        {...props}
        value={value || ""}
        onChange={onChange}
        className={cn(
          "w-full px-4 py-2 bg-white border border-slate-200 rounded-md outline-none focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/5 transition-all duration-300 text-[13px] font-bold text-slate-700 appearance-none cursor-pointer",
          !!error && "border-rose-200",
          className,
        )}
      >
        <option value="" disabled={required}>
          {placeholder || "Select an option"}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-3.5 h-3.5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
    {!!error && (
      <p className="text-[10px] text-red-500 font-bold ml-1">
        {renderError(error) as React.ReactNode}
      </p>
    )}
  </div>
);

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const PremiumStepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
}) => (
  <div className="flex items-center justify-center gap-4 py-6 border-b border-slate-50 bg-white">
    {steps.map((step, idx) => {
      const isCompleted = idx + 1 < currentStep;
      const isActive = idx + 1 === currentStep;
      return (
        <div key={step} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500",
                isCompleted
                  ? "bg-emerald-500 text-white"
                  : isActive
                    ? "bg-brand-primary text-white"
                    : "bg-slate-100 text-slate-400",
              )}
            >
              {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
            </div>
            <span
              className={cn(
                "text-[11px] font-bold tracking-tight",
                isActive ? "text-slate-800" : "text-slate-400",
              )}
            >
              {step}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className="w-12 h-[1px] bg-slate-100" />
          )}
        </div>
      );
    })}
  </div>
);

export const PremiumFormContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("bg-white flex flex-col h-full", className)}>
    {children}
  </div>
);

export const PremiumUpload: React.FC<{
  label: string;
  hint?: string;
  icon: React.ElementType;
}> = ({ label, hint, icon: Icon }) => (
  <div className="w-full h-20 border-2 border-dashed border-slate-100 rounded-md flex flex-col items-center justify-center bg-slate-50/20 hover:bg-white hover:border-brand-primary/20 transition-all duration-500 cursor-pointer group/upload">
    <Icon className="w-4 h-4 text-brand-primary mb-1.5" />
    <p className="text-[11px] font-bold text-slate-700 tracking-tight">
      {label}
    </p>
    {hint && (
      <p className="text-[9px] text-slate-300 mt-0.5 font-bold tracking-tight">
        {hint}
      </p>
    )}
  </div>
);
