import React from "react";
import { Building2, MapPin, Globe, ShieldCheck } from "lucide-react";
import SmartField from "@/components/ui/SmartField";
import SmartTextarea from "@/components/ui/SmartTextarea";
import type { WizardStepProps } from "@/pages/temple-registry/wizard-steps/types";

const IdentityStep: React.FC<WizardStepProps> = ({
  formData,
  setFormData,
  validationErrors,
  handleRealTimeValidation,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-medium text-slate-900 tracking-tight">
          Identity & Geolocation
        </h2>
        <p className="text-[13px] text-slate-500 font-normal">
          Establish the formal physical presence of the unit.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-1">
          <SmartField
            icon={Building2}
            label="Official Temple Name"
            required
            value={formData.name}
            onChange={(val) => {
              setFormData({ ...formData, name: val });
              handleRealTimeValidation("name", val);
            }}
            placeholder="Full legal title of the branch"
            errorText={validationErrors.name}
          />
        </div>

        <div className="space-y-1">
          <SmartField
            icon={MapPin}
            label="Permanent Registry Address"
            required
            value={formData.address}
            onChange={(val) => {
              setFormData({ ...formData, address: val });
              handleRealTimeValidation("address", val);
            }}
            placeholder="Complete street details and identifiers"
            errorText={validationErrors.address}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <SmartField
              icon={MapPin}
              label="City / Hub"
              required
              value={formData.city}
              onChange={(val) => {
                setFormData({ ...formData, city: val });
                handleRealTimeValidation("city", val);
              }}
              placeholder="City"
              errorText={validationErrors.city}
            />
          </div>
          <div className="space-y-1">
            <SmartField
              icon={ShieldCheck}
              label="Administrative Region"
              required
              value={formData.state}
              onChange={(val) => {
                setFormData({ ...formData, state: val });
                handleRealTimeValidation("state", val);
              }}
              placeholder="State"
              errorText={validationErrors.state}
            />
          </div>
        </div>

        <div className="space-y-1">
          <SmartField
            icon={Globe}
            label="Nationality"
            required
            value={formData.country}
            onChange={(val) => {
              setFormData({ ...formData, country: val });
              handleRealTimeValidation("country", val);
            }}
            placeholder="e.g. India"
            errorText={validationErrors.country}
          />
        </div>

        <SmartTextarea
          label="Unit Biography & Executive Summary"
          value={formData.bio || ""}
          onChange={(val) => setFormData({ ...formData, bio: val })}
          placeholder="Briefly describe the primary mission or summary of this branch..."
        />

        <SmartTextarea
          label="Internal Registry Description"
          value={formData.description || ""}
          onChange={(val) =>
            setFormData({ ...formData, description: val })
          }
          placeholder="Internal notes or technical description..."
        />
      </div>
    </div>
  );
};

export default IdentityStep;
