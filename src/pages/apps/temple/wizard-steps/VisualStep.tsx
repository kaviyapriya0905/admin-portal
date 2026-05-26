import React from "react";
import {
  Camera,
  Maximize2,
  Palette,
  History,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { PremiumInputField } from "../../../../components/ui/FormComponents";
import type { WizardStepProps } from "./types";

const VisualStep: React.FC<WizardStepProps> = ({
  formData,
  setFormData,
  previewHero,
  previewLogo,
  handleFileChange,
  heroInputRef,
  logoInputRef,
  onImageLinkPaste,
}) => {
  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-slate-900 tracking-tight">
          Visual & Historical Protocol
        </h2>
        <p className="text-[13px] text-slate-500 font-semibold">
          Define the spiritual brand and heritage documentation.
        </p>
      </div>

      <div className="space-y-8">
        <div className="relative group mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="w-4 h-4 text-slate-400" />
            <span className="text-[11px] font-bold text-slate-400">
              Primary Facade Portrait
            </span>
          </div>

          <div
            onClick={() => heroInputRef?.current?.click()}
            className="relative aspect-[21/9] rounded-2xl border border-slate-100 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary/20 transition-all overflow-hidden group/hero shadow-sm"
          >
            {previewHero ? (
              <motion.img
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={previewHero}
                alt="Facade"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-8">
                <div className="w-10 h-10 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover/hero:scale-110 transition-transform duration-300">
                  <Maximize2 className="w-4 h-4 text-slate-300" />
                </div>
                <span className="text-[11px] text-slate-400 font-bold">
                  Upload Facade Portrait
                </span>
                <p className="text-[9px] text-slate-300 mt-1">
                  Recommended: 1920x820 landscape
                </p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/hero:opacity-100 transition-opacity"></div>
            <input
              type="file"
              ref={heroInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange?.(e, "hero")}
            />
          </div>

          <div className="absolute -bottom-8 left-10">
            <div
              onClick={(e) => {
                e.stopPropagation();
                logoInputRef?.current?.click();
              }}
              className="w-24 h-24 rounded-2xl bg-white border border-slate-100 shadow-lg flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all overflow-hidden relative group/logo"
            >
              {previewLogo ? (
                <img
                  src={previewLogo}
                  alt="Logo"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="text-center p-2">
                  <Palette className="w-6 h-6 text-slate-200 mx-auto mb-1" />
                  <span className="text-[8px] text-slate-400 font-bold">
                    Brand Logo
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-brand-primary/0 group-hover/logo:bg-brand-primary/5 transition-colors"></div>
              <input
                type="file"
                ref={logoInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange?.(e, "logo")}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PremiumInputField
            icon={LinkIcon}
            label="Or paste Facade Image URL"
            value={
              previewHero && previewHero.startsWith("http") ? previewHero : ""
            }
            onChange={(e) => onImageLinkPaste?.("hero", e.target.value)}
            placeholder="https://... (Landscape)"
          />
          <PremiumInputField
            icon={LinkIcon}
            label="Or paste Brand Logo URL"
            value={
              previewLogo && previewLogo.startsWith("http") ? previewLogo : ""
            }
            onChange={(e) => onImageLinkPaste?.("logo", e.target.value)}
            placeholder="https://... (Square)"
          />
        </div>

        <div className="pt-4 grid grid-cols-1 gap-6">
          <div className="flex items-center gap-2 mb-2">
            <History className="w-4 h-4 text-slate-400" />
            <span className="text-[11px] font-bold text-slate-400">
              Heritage & Historical Protocol
            </span>
          </div>
          <div className="space-y-1">
            <PremiumInputField
              icon={FileText}
              label="Historical Significance & Spiritual Context (Optional)"
              textarea
              rows={8}
              value={formData.historicalContext}
              onChange={(e) =>
                setFormData({ ...formData, historicalContext: e.target.value })
              }
              placeholder="Document the temple's history, cultural legacy, and spiritual heritage in detail..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualStep;
