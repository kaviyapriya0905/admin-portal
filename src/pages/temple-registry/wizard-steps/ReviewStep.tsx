import React from "react";
import {
  Building2,
  MapPin,
  Globe,
  FileText,
  Shield,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Image as ImageIcon,
  Edit3,
  Zap,
  Info,
  Palette,
  History,
} from "lucide-react";
import { motion } from "framer-motion";
import type { WizardStepProps } from "@/pages/temple-registry/wizard-steps/types";

interface ReviewSectionProps {
  title: string;
  children: React.ReactNode;
  icon: React.ElementType;
  stepId: number;
  goToStepById?: (stepId: number) => void;
}

const ReviewSection = ({
  title,
  children,
  icon: Icon,
  stepId,
  goToStepById,
}: ReviewSectionProps) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center justify-between pb-4 border-b border-slate-50 mb-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-brand-primary/5 transition-colors">
          <Icon className="w-4 h-4 text-slate-400 group-hover:text-brand-primary transition-colors" />
        </div>
        <h3 className="text-[12px] font-bold text-slate-900">{title}</h3>
      </div>
      <button
        type="button"
        onClick={() => goToStepById?.(stepId)}
        className="p-2 text-slate-300 hover:text-brand-primary transition-colors hover:bg-brand-primary/5 rounded-lg flex items-center gap-2 group/edit"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover/edit:opacity-100 transition-opacity">
          Edit Section
        </span>
        <Edit3 className="w-3.5 h-3.5" />
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 px-1">
      {children}
    </div>
  </div>
);

interface ReviewItemProps {
  label: string;
  value: string | undefined;
  icon?: React.ElementType;
}

const ReviewItem = ({ label, value, icon: ItemIcon }: ReviewItemProps) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-1.5">
      {ItemIcon && <ItemIcon className="w-3 h-3 text-slate-300" />}
      <p className="text-[9px] text-slate-400 font-bold">{label}</p>
    </div>
    <p className="text-[13px] text-slate-900 font-medium leading-relaxed truncate">
      {value || "Not provided"}
    </p>
  </div>
);

const ReviewStep: React.FC<WizardStepProps> = ({
  formData,
  previewHero,
  previewLogo,
  previewAdmin,
  mode,
  goToStepById,
  error,
  temples,
}) => {
  // Enhanced cache detection for the review phase
  const getCachedHero = () => {
    if (previewHero) return previewHero;
    return null;
  };

  const displayHero = getCachedHero();

  return (
    <div className="space-y-12 pb-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5 text-center w-full sm:text-left sm:w-auto">
          <h2 className="text-2xl font-medium text-slate-900 tracking-tight">
            Governance Review
          </h2>
        </div>
      </div>

      <div className="space-y-10">
        {/* Visual Brand Portfolio Section */}
        {(mode === "full" || mode === "temple") && (
          <div className="relative rounded-[2rem] overflow-hidden border border-slate-100 shadow-2xl bg-white group/portfolio">
            <div className="h-64 relative overflow-hidden">
              {displayHero ? (
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  src={displayHero}
                  alt="Facade"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover/portfolio:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-200">
                  <ImageIcon className="w-12 h-12 stroke-[1]" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
            </div>

            <div className="absolute bottom-8 left-6 right-6 sm:left-10 sm:right-auto flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-1.5 shadow-2xl border border-white/50 backdrop-blur-sm relative group/logo-rev">
                {previewLogo ? (
                  <img
                    src={previewLogo}
                    alt="Logo"
                    className="w-full h-full object-contain rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center rounded-2xl border border-slate-50">
                    <Palette className="w-8 h-8 text-slate-100" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => goToStepById?.(3)}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/logo-rev:opacity-100 transition-all hover:scale-110"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <div className="pb-2 space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <h3 className="text-white text-2xl sm:text-3xl font-bold tracking-tight leading-none truncate max-w-[200px] sm:max-w-none">
                    {formData.name || "Untitled Temple"}
                  </h3>
                  <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-6">
                  <p className="text-white/70 text-[12px] font-bold flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                    {formData.city || "No City"}, {formData.state || "No State"}
                  </p>
                  <div className="hidden sm:block w-px h-4 bg-white/20"></div>
                  <p className="text-white/70 text-[12px] font-bold flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-brand-primary" />
                    {formData.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Structured Data Grids */}
        <div className="grid grid-cols-1 gap-8">
          {(mode === "full" || mode === "temple") && (
            <ReviewSection
              title="Unit Identity & Geolocation"
              icon={Building2}
              stepId={1}
              goToStepById={goToStepById}
            >
              <ReviewItem
                label="Official Name"
                value={formData.name}
                icon={ShieldCheck}
              />
              <ReviewItem
                label="City Hub"
                value={formData.city}
                icon={MapPin}
              />
              <ReviewItem
                label="Registry Address"
                value={formData.address}
                icon={MapPin}
              />
              <ReviewItem
                label="Admin Region"
                value={formData.state}
                icon={Globe}
              />
              <div className="col-span-1 sm:col-span-2 mt-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                <ReviewItem
                  label="Primary Mission Statement"
                  value={formData.description}
                  icon={FileText}
                />
              </div>
              {formData.historicalContext && (
                <div className="col-span-1 sm:col-span-2 mt-2 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                  <ReviewItem
                    label="Spiritual & Historical Context"
                    value={formData.historicalContext}
                    icon={History}
                  />
                </div>
              )}
            </ReviewSection>
          )}

          {(mode === "full" || mode === "admin") && (
            <ReviewSection
              title="Executive Leadership & Authority"
              icon={Shield}
              stepId={2}
              goToStepById={goToStepById}
            >
              <div className="col-span-1 sm:col-span-2 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 mb-2 relative group/admin-rev">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white relative shrink-0">
                  {previewAdmin ? (
                    <img
                      src={previewAdmin}
                      alt="Admin"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border border-slate-50">
                      <User className="w-8 h-8 text-slate-100" />
                    </div>
                  )}
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-slate-900 font-bold text-xl tracking-tight">
                    {formData.superadmin.firstName}{" "}
                    {formData.superadmin.lastName}
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-brand-primary/10 text-brand-primary uppercase">
                      {(
                        formData.superadmin as unknown as Record<string, string>
                      ).designation || "Executive"}
                    </span>
                    <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified Lead
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => goToStepById?.(2)}
                  className="sm:absolute sm:top-4 sm:right-4 p-2 bg-white text-slate-400 rounded-lg shadow-sm border border-slate-100 sm:opacity-0 group-hover/admin-rev:opacity-100 transition-all hover:text-brand-primary mt-4 sm:mt-0"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
              <ReviewItem
                label="Corporate Email"
                value={formData.superadmin.email}
                icon={Mail}
              />
              <ReviewItem
                label="Direct Contact"
                value={formData.superadmin.phonenumber}
                icon={Phone}
              />
              {mode === "admin" && (
                <div className="col-span-1 sm:col-span-2">
                  <ReviewItem
                    label="Designated Temple / Unit"
                    value={
                      temples?.find(
                        (t) =>
                          String(t.id) === String(formData.superadmin.templeId),
                      )?.name || "Not assigned"
                    }
                    icon={Building2}
                  />
                </div>
              )}
              <div className="col-span-1 sm:col-span-2 pt-2 space-y-4">
                <ReviewItem
                  label="Registered Residential Residency"
                  value={formData.superadmin.residentialAddress}
                  icon={MapPin}
                />
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 mt-2">
                  <ReviewItem
                    label="Executive Biography"
                    value={formData.superadmin.bio}
                    icon={FileText}
                  />
                </div>
              </div>
            </ReviewSection>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 animate-in shake duration-500">
          <Info className="w-5 h-5 shrink-0" />
          <p className="text-[13px] font-medium">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
