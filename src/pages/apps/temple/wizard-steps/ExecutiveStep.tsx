import {
  User,
  Mail,
  Phone,
  Plus,
  Link as LinkIcon,
} from "lucide-react";
import SmartField from "@/components/ui/SmartField";
import SmartSelect from "@/components/ui/SmartSelect";
import SmartTextarea from "@/components/ui/SmartTextarea";
import type { WizardStepProps } from "@/pages/apps/temple/wizard-steps/types";

const ExecutiveStep: React.FC<WizardStepProps> = ({
  formData,
  setFormData,
  validationErrors,
  handleRealTimeValidation,
  previewAdmin,
  handleFileChange,
  adminInputRef,
  mode,
  temples,
  onImageLinkPaste,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-slate-900 tracking-tight">
          Executive Authority
        </h2>
        <p className="text-[13px] text-slate-500 font-normal">
          Assign the primary Temple Admin responsible for this unit.
        </p>
      </div>

      <div className="space-y-6">
        {mode === "admin" && (
          <div className="p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">
                Administrative Assignment
              </span>
            </div>
            <SmartSelect
              label="Designated Temple / Unit"
              required
              value={formData.superadmin.templeId?.toString() || ""}
              onChange={(val) => {
                setFormData((prev) => ({
                  ...prev,
                  superadmin: {
                    ...prev.superadmin,
                    templeId: val || undefined,
                  },
                }));
                handleRealTimeValidation("templeId", val);
              }}
              options={
                temples && temples.length > 0
                  ? temples.map((t) => ({
                      value: t.id.toString(),
                      label: t.name,
                    }))
                  : []
              }
              errorText={validationErrors.templeId}
            />
            {/* {temples && temples.length > 0 && !formData.superadmin.templeId && (
              <p className="text-[10px] text-brand-primary/60 font-bold mt-1 ml-1 animate-pulse flex items-center gap-1">
                <Info className="w-3 h-3" />
                Awaiting unit assignment
              </p>
            )}
            <p className="text-[11px] text-slate-400 font-medium px-1 italic">
              Selecting a unit will automatically map this administrator to the
              chosen temple's management suite.
            </p> */}
          </div>
        )}

        <div className="flex flex-col items-center">
          <div className="relative group">
            <div
              onClick={() => adminInputRef?.current?.click()}
              className="w-24 h-24 rounded-full border border-slate-100 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary/20 transition-all overflow-hidden relative shadow-sm"
            >
              {previewAdmin ? (
                <img
                  src={previewAdmin}
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <User className="w-7 h-7 text-slate-300 mx-auto mb-1" />
                  <span className="text-[8px] text-slate-400 font-bold">
                    Profile Portrait
                  </span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={adminInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange?.(e, "admin")}
            />
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-brand-primary rounded-full flex items-center justify-center border-2 border-white text-white shadow-lg pointer-events-none">
              <Plus className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="w-full max-w-[240px] mt-6">
            <SmartField
              icon={LinkIcon}
              label="Or paste image URL"
              value={
                previewAdmin && previewAdmin.startsWith("http")
                  ? previewAdmin
                  : ""
              }
              onChange={(val) => onImageLinkPaste?.("admin", val)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <SmartField
              icon={User}
              label="Admin First Name"
              required
              value={formData.superadmin.firstName}
              onChange={(val) => {
                setFormData((prev) => ({
                  ...prev,
                  superadmin: { ...prev.superadmin, firstName: val },
                }));
                handleRealTimeValidation("firstName", val);
              }}
              placeholder="First Name"
              errorText={validationErrors.firstName}
            />
          </div>
          <div className="space-y-1">
            <SmartField
              icon={User}
              label="Admin Last Name"
              required
              value={formData.superadmin.lastName}
              onChange={(val) => {
                setFormData((prev) => ({
                  ...prev,
                  superadmin: { ...prev.superadmin, lastName: val },
                }));
                handleRealTimeValidation("lastName", val);
              }}
              placeholder="Last Name"
              errorText={validationErrors.lastName}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <SmartField
              icon={Mail}
              label="Corporate Email"
              type="email"
              required
              value={formData.superadmin.email}
              onChange={(val) => {
                setFormData((prev) => ({
                  ...prev,
                  superadmin: { ...prev.superadmin, email: val },
                }));
                handleRealTimeValidation("email", val);
              }}
              placeholder="admin@omgtrust.org"
              errorText={validationErrors.email}
            />
          </div>
          <div className="space-y-1">
            <SmartField
              icon={Phone}
              label="Contact Number"
              required
              value={formData.superadmin.phonenumber}
              onChange={(val) => {
                setFormData((prev) => ({
                  ...prev,
                  superadmin: { ...prev.superadmin, phonenumber: val },
                }));
                handleRealTimeValidation("phonenumber", val);
              }}
              placeholder="+91..."
              errorText={validationErrors.phonenumber}
            />
          </div>
        </div>

        <div className="space-y-1">
          <SmartTextarea
            label="Residential Residency Address"
            required
            value={formData.superadmin.residentialAddress}
            onChange={(val) => {
              setFormData((prev) => ({
                ...prev,
                superadmin: { ...prev.superadmin, residentialAddress: val },
              }));
              handleRealTimeValidation("residentialAddress", val);
            }}
            placeholder="Full residential details for verification"
            errorText={validationErrors.residentialAddress}
          />
        </div>

        <SmartTextarea
          label="Executive Summary (Bio)"
          value={formData.superadmin.bio}
          onChange={(val) => {
            setFormData((prev) => ({
              ...prev,
              superadmin: { ...prev.superadmin, bio: val },
            }));
          }}
          // placeholder="Brief professional background..."
          errorText={validationErrors.bio}
        />
      </div>
    </div>
  );
};

export default ExecutiveStep;
