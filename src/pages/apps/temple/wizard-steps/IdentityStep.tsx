import React from "react";
import { Building2, MapPin, Globe, FileText, ShieldCheck } from "lucide-react";
import { PremiumInputField } from "../../../../components/ui/FormComponents";
import type { WizardStepProps } from "./types";

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
          <PremiumInputField
            icon={Building2}
            label="Official Temple Name"
            required
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              handleRealTimeValidation("name", e.target.value);
            }}
            placeholder="Full legal title of the branch"
            error={validationErrors.name}
          />
        </div>

        <div className="space-y-1">
          <PremiumInputField
            icon={MapPin}
            label="Permanent Registry Address"
            required
            value={formData.address}
            onChange={(e) => {
              setFormData({ ...formData, address: e.target.value });
              handleRealTimeValidation("address", e.target.value);
            }}
            placeholder="Complete street details and identifiers"
            error={validationErrors.address}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <PremiumInputField
              icon={MapPin}
              label="City / Hub"
              required
              value={formData.city}
              onChange={(e) => {
                setFormData({ ...formData, city: e.target.value });
                handleRealTimeValidation("city", e.target.value);
              }}
              placeholder="City"
              error={validationErrors.city}
            />
          </div>
          <div className="space-y-1">
            <PremiumInputField
              icon={ShieldCheck}
              label="Administrative Region"
              required
              value={formData.state}
              onChange={(e) => {
                setFormData({ ...formData, state: e.target.value });
                handleRealTimeValidation("state", e.target.value);
              }}
              placeholder="State"
              error={validationErrors.state}
            />
          </div>
        </div>

        <div className="space-y-1">
          <PremiumInputField
            icon={Globe}
            label="Nationality"
            required
            value={formData.country}
            onChange={(e) => {
              setFormData({ ...formData, country: e.target.value });
              handleRealTimeValidation("country", e.target.value);
            }}
            placeholder="e.g. India"
            error={validationErrors.country}
          />
        </div>

        <PremiumInputField
          icon={FileText}
          label="Unit Biography & Executive Summary"
          textarea
          rows={4}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Briefly describe the primary mission or summary of this branch..."
        />

        <PremiumInputField
          icon={FileText}
          label="Internal Registry Description"
          textarea
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Internal notes or technical description..."
        />
      </div>
    </div>
  );
};

export default IdentityStep;
