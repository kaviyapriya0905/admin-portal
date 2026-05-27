import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface ModalField {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "time" | "number" | "email" | "tel";
  options?: string[] | { label: string; value: string }[];
  readonly?: boolean;
  required?: boolean;
  group?: string;
  validate?: (val: any) => string | null;
}

import toast from "react-hot-toast";

interface CommonDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => Promise<void>;
  title: string;
  subtitle?: string;
  data: any | null;
  fields: ModalField[];
}

const CommonDataModal: React.FC<CommonDataModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  subtitle,
  data,
  fields,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const modalRoot = document.getElementById("root") || document.body;

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (data) {
        setFormData({ ...data });
      } else {
        setFormData({});
      }
    }
  }, [data, isOpen]);

  if (!isOpen) return null;

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleSave = async () => {
    if (onSave) {
      const newErrors: Record<string, string> = {};
      fields.forEach((field) => {
        const val = formData[field.key];

        if (field.required && !val) {
          newErrors[field.key] = `${field.label} is required`;
          return;
        }

        if (val) {
          if (field.validate) {
            const customError = field.validate(val);
            if (customError) {
              newErrors[field.key] = customError;
              return;
            }
          }

          if (field.type === "email") {
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
            if (!emailRegex.test(val)) {
              newErrors[field.key] =
                "Please enter a valid email address (e.g. user@example.com)";
            }
          } else if (field.type === "tel") {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(val.replace(/[-\s]/g, ""))) {
              newErrors[field.key] =
                "Please enter a valid 10-digit mobile number";
            }
          }
        }
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast.error("Please fix the validation errors");
        return;
      }

      setErrors({});
      setIsSaving(true);
      try {
        await onSave(formData);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex justify-end overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="relative bg-white w-full max-w-lg h-full shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.2)] flex flex-col"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-20">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-md bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10">
                  <div className="w-8 h-8 rounded-md bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/20">
                    <X className="w-4 h-4 text-white rotate-45" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold normal-case tracking-normal mt-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                    {subtitle || "Record update protocol"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-slate-50 rounded-md transition-all text-slate-400 hover:text-slate-900 hover:rotate-90 duration-300 group"
              >
                <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
              <div className="space-y-6">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5">
                    {fields.map((field) => {
                      if (field.readonly) {
                        return (
                          <div key={field.key} className="group/field">
                            <label className="block text-[11px] font-bold text-slate-400 normal-case tracking-normal mb-1.5 ml-1 group-focus-within/field:text-brand-primary transition-colors">
                              {field.label}
                            </label>
                            <input
                              type="text"
                              value={formData[field.key] || ""}
                              readOnly
                              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-md text-[12px] text-slate-400 cursor-not-allowed font-medium"
                            />
                          </div>
                        );
                      }

                      return (
                        <div key={field.key} className="group/field">
                          <label className="block text-[11px] font-bold text-slate-400 normal-case tracking-normal mb-1.5 ml-1 group-focus-within/field:text-brand-primary transition-colors">
                            {field.label}{" "}
                            {field.required && (
                              <span className="text-red-400">*</span>
                            )}
                          </label>
                          {field.type === "select" ? (
                            <div className="relative">
                              <select
                                value={formData[field.key] || ""}
                                onChange={(e) =>
                                  handleChange(field.key, e.target.value)
                                }
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-md text-[12px] focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary focus:bg-white transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                              >
                                <option value="">Select...</option>
                                {field.options?.map((opt) => {
                                  const isString = typeof opt === "string";
                                  const val = isString
                                    ? opt
                                    : (opt as { value: string }).value;
                                  const label = isString
                                    ? opt
                                    : (opt as { label: string }).label;
                                  return (
                                    <option key={val} value={val}>
                                      {label}
                                    </option>
                                  );
                                })}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                              </div>
                            </div>
                          ) : (
                            <input
                              type={field.type}
                              value={formData[field.key] || ""}
                              onChange={(e) =>
                                handleChange(field.key, e.target.value)
                              }
                              className={`w-full px-4 py-2.5 bg-slate-50 border ${errors[field.key] ? "border-red-300 focus:ring-red-500/10 focus:border-red-500" : "border-slate-100 focus:ring-brand-primary/5 focus:border-brand-primary"} rounded-md text-[12px] focus:outline-none focus:ring-4 focus:bg-white transition-all font-medium text-slate-900`}
                            />
                          )}
                          {errors[field.key] && (
                            <p className="text-[10px] text-red-500 mt-1 ml-1">
                              {errors[field.key]}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 bg-white border border-slate-100 text-slate-400 text-xs font-bold rounded-md hover:bg-slate-100 hover:text-slate-600 transition-all shadow-sm"
              >
                Discard
              </button>
              {onSave && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-[2] px-8 py-4 bg-brand-primary text-white text-xs font-bold rounded-md hover:bg-[#8e330b] transition-all shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    modalRoot,
  );
};

export default CommonDataModal;
