export interface FormData {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  description: string;
  historicalContext?: string;
  bio?: string;
  superadmin: {
    firstName: string;
    lastName: string;
    email: string;
    phonenumber: string;
    residentialAddress: string;
    bio: string;
    templeId?: string | number;
  };
}

export interface WizardStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  validationErrors: Record<string, string>;
  handleRealTimeValidation: (field: string, value: string) => void;
  previewLogo?: string | null;
  previewHero?: string | null;
  previewAdmin?: string | null;
  handleFileChange?: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "hero" | "admin",
  ) => void;
  logoInputRef?: React.RefObject<HTMLInputElement | null>;
  heroInputRef?: React.RefObject<HTMLInputElement | null>;
  adminInputRef?: React.RefObject<HTMLInputElement | null>;
  temples?: { id: string | number; name: string }[];
  mode?: "temple" | "admin" | "full";
  goToStepById?: (id: number) => void;
  error?: string | null;
  onImageLinkPaste?: (type: "logo" | "hero" | "admin", link: string) => void;
}
