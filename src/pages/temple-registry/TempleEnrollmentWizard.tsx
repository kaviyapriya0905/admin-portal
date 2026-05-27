import React, { useState, useRef, useMemo, useEffect } from "react";
import { getMockData, addMockItem } from "@/utils/mockData";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Save,
  X,
  Layout,
  Fingerprint,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { type RootState } from "@/store/store";
import IdentityStep from "@/pages/temple-registry/wizard-steps/IdentityStep";
import ExecutiveStep from "@/pages/temple-registry/wizard-steps/ExecutiveStep";
import VisualStep from "@/pages/temple-registry/wizard-steps/VisualStep";
import ReviewStep from "@/pages/temple-registry/wizard-steps/ReviewStep";
import type { FormData } from "@/pages/temple-registry/wizard-steps/types";
import { validateEnrollmentStep } from "@/pages/temple-registry/utils/enrollmentValidations";

const ALL_STEPS = [
  {
    id: 1,
    title: "Branch Identity",
    description: "Legal nomenclature & geolocation.",
    type: "temple",
  },
  {
    id: 2,
    title: "Executive Authority",
    description: "Administrative lead designation.",
    type: "admin",
  },
  {
    id: 3,
    title: "Visual Protocol",
    description: "Spiritual branding & heritage.",
    type: "temple",
  },
  {
    id: 4,
    title: "Review & Confirm",
    description: "Final governance verification.",
    type: "common",
  },
];

interface TempleEnrollmentWizardProps {
  onComplete: () => void;
  onCancel: () => void;
  mode?: "temple" | "admin" | "full";
  temples?: { id: string | number; name: string }[];
  onTempleCreated?: (newTemple: any) => void;
}

const TempleEnrollmentWizard: React.FC<TempleEnrollmentWizardProps> = ({
  onComplete,
  onCancel,
  mode = "full",
  temples: initialTemples,
  onTempleCreated,
}) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const adminInputRef = useRef<HTMLInputElement>(null);

  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  const filteredSteps = useMemo(() => {
    if (mode === "full") return ALL_STEPS;
    return ALL_STEPS.filter(
      (step) => step.type === mode || step.type === "common",
    );
  }, [mode]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = filteredSteps[currentStepIndex].id;

  const [submitted, setSubmitted] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [previewHero, setPreviewHero] = useState<string | null>(null);
  const [previewAdmin, setPreviewAdmin] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [temples, setTemples] = useState<
    { id: string | number; name: string }[]
  >(initialTemples || []);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    description: "",
    historicalContext: "",
    bio: "",
    superadmin: {
      firstName: "",
      lastName: "",
      email: "",
      phonenumber: "",
      residentialAddress: "",
      bio: "",
      templeId: undefined,
    },
  });

  const validateStep = (step: number) => {
    const errors = validateEnrollmentStep(step, formData, mode);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDraft = () => {
    toast.success("Draft saving disabled as per user request.");
  };

  useEffect(() => {
    const fetchTemples = async () => {
      setHasAttemptedFetch(true);
      try {
        const mockData = getMockData();
        const mappedTemples = (mockData.temples || []).map((t: any) => ({
          ...t,
          id: t.id || t._id || t.temple_id,
        }));
        setTemples(mappedTemples);
      } catch {
        // Silent error
      }
    };
    if (
      (isAuthenticated) &&
      mode === "admin" &&
      temples.length === 0 &&
      !hasAttemptedFetch
    )
      fetchTemples();
  }, [isAuthenticated, mode, temples.length, hasAttemptedFetch]);

  useEffect(() => {}, [mode]);

  const handleRealTimeValidation = (field: string, value: string) => {
    let errorMsg = "";
    if (field === "email" && value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.trim())) errorMsg = "Invalid email format";
    }
    if (field === "phonenumber" && value.trim()) {
      const phoneDigits = value.replace(/\D/g, "");
      if (phoneDigits.length !== 10)
        errorMsg = "Phone number must be exactly 10 digits";
    }
    if (field === "templeId") {
      if (!value) errorMsg = "Please select a temple";
      else errorMsg = "";
    }

    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      if (errorMsg) newErrors[field] = errorMsg;
      else delete newErrors[field];
      return newErrors;
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "hero" | "admin",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be under 2MB for browser persistence.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "logo") setPreviewLogo(reader.result as string);
        else if (type === "hero") setPreviewHero(reader.result as string);
        else setPreviewAdmin(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLinkPaste = (
    type: "logo" | "hero" | "admin",
    link: string,
  ) => {
    if (type === "logo") setPreviewLogo(link);
    else if (type === "hero") setPreviewHero(link);
    else setPreviewAdmin(link);
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      toast.error("Please resolve the validation errors before proceeding.");
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setCurrentStepIndex((prev) =>
        Math.min(prev + 1, filteredSteps.length - 1),
      );
      setIsSaving(false);
    }, 450);
  };

  const prevStep = () => setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  const goToStepById = (id: number) => {
    const index = filteredSteps.findIndex((s) => s.id === id);
    if (index !== -1) setCurrentStepIndex(index);
  };

  const compressImage = (
    base64Str: string,
    maxWidth = 800,
  ): Promise<string> => {
    return new Promise((resolve) => {
      if (
        !base64Str ||
        base64Str.startsWith("http://") ||
        base64Str.startsWith("https://")
      ) {
        return resolve(base64Str);
      }
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        // Heavily compress to bypass 100kb backend payload limits
        const maxW = Math.min(maxWidth, 300);
        if (width > maxW) {
          height = (height * maxW) / width;
          width = maxW;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.4));
      };
      img.onerror = () => resolve(base64Str);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const stepsToValidate = filteredSteps.slice(0, -1);
    for (let i = 0; i < stepsToValidate.length; i++) {
      if (!validateStep(stepsToValidate[i].id)) {
        setCurrentStepIndex(i);
        toast.error(
          `Please complete all required fields in the ${stepsToValidate[i].title} phase.`,
        );
        return;
      }
    }
    setIsSaving(true);
    setError(null);
    try {
      if (!isAuthenticated) {
        toast.error("Session expired. Please log in again.");
        setIsSaving(false);
        return;
      }

      const cLogo = previewLogo ? await compressImage(previewLogo, 400) : null;
      const cHero = previewHero ? await compressImage(previewHero, 1200) : null;
      const cAdmin = previewAdmin
        ? await compressImage(previewAdmin, 400)
        : null;

      let response: any = { status: 200, data: {} };
      if (mode === "admin") {
        const adminPayload: any = { id: "a" + Date.now(),
          firstName: formData.superadmin.firstName,
          lastName: formData.superadmin.lastName,
          email: formData.superadmin.email,
          phoneNumber: formData.superadmin.phonenumber.replace(/\D/g, ""),
          templeId: formData.superadmin.templeId,
          bio:
            formData.superadmin.bio === "None"
              ? ""
              : formData.superadmin.bio || "",
          profilePic: cAdmin,
          routePermissions: [
            { route: "devotees", access: "read_write" },
            { route: "donations", access: "read_write" },
          ],
        };
        const newUser = addMockItem("users", adminPayload);
        response.data = { superadmin: { token: "mock-token-admin" }, id: newUser.id };
      } else {
        const templePayload: any = { id: "t" + Date.now(), templeId: "t" + Date.now(),
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          description: formData.description,
          history: [
            {
              period: "General",
              description: formData.historicalContext || "",
              logo: cLogo || undefined,
              banner: cHero || undefined,
            },
          ],
          bio: formData.bio,
          superadmin: {
            firstName: formData.superadmin.firstName.trim(),
            lastName: formData.superadmin.lastName.trim(),
            email: formData.superadmin.email.trim().toLowerCase(),
            phoneNumber: formData.superadmin.phonenumber.replace(/\D/g, ""),
            bio:
              formData.superadmin.bio === "None"
                ? ""
                : formData.superadmin.bio || "",
            profilePic: cAdmin,
            routePermissions: [{ route: "*", access: "read_write" }],
          },
        };
        const newTemple = addMockItem("temples", templePayload);
        response.data = { token: "mock-token-temple", temple: { id: newTemple.id } };
      }
      if (response.status === 201 || response.status === 200) {
        if (response.data?.token) {
          setGeneratedToken(response.data.token);
        } else if (response.data?.superadmin?.token) {
          setGeneratedToken(response.data.superadmin.token);
        }
        const templeId =
          response.data?.temple?.temple_id ||
          response.data?.temple?.id ||
          response.data?.id;
        // Build a minimal temple object for UI update
        const newTemple = {
          id: templeId,
          name: formData.name,
          location: `${formData.city}, ${formData.state}`,
          address: formData.address,
          description: formData.description,
          historicalContext: formData.historicalContext,
          image: cLogo || "/temple1.png",
          city: formData.city,
          state: formData.state,
          country: formData.country,
          status: "active",
          bio: formData.bio,
          superadmin: {
            firstName: formData.superadmin.firstName,
            lastName: formData.superadmin.lastName,
            email: formData.superadmin.email,
            bio: formData.superadmin.bio,
          },
        };
        if (onTempleCreated) {
          onTempleCreated(newTemple);
        }

        toast.success(
          mode === "admin"
            ? "Administrator enrolled successfully"
            : "Temple registered successfully",
        );

        setSubmitted(true);
      }
    } catch (err: unknown) {
      toast.error(
        "An unexpected error occurred. Please refresh and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white flex items-center justify-center p-4 min-h-[500px] animate-in fade-in duration-500">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-slate-900 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-medium text-slate-900 tracking-tight mb-3">
            {mode === "admin"
              ? "Administrator Enrolled"
              : "Unit Successfully Enrolled"}
          </h2>
          <p className="text-slate-500 text-[14px] leading-relaxed mb-6 px-4">
            {mode === "admin"
              ? `Registration for **${formData.superadmin.firstName} ${formData.superadmin.lastName}** has been processed.`
              : `The registration for **${formData.name}** has been processed.`}
          </p>

          {generatedToken && (
            <div className="mb-8 p-5 bg-amber-50 border border-amber-100 rounded-xl text-left shadow-inner">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <p className="text-amber-900 text-[11px] font-bold uppercase tracking-wider">
                  Account Setup Required
                </p>
              </div>
              <p className="text-amber-800 text-[13px] font-medium mb-4">
                Please share this unique, secure link with the new administrator
                to complete their password setup.
              </p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={
                    mode === "temple"
                      ? `http://localhost:8081/auth/create_password/${generatedToken}`
                      : `${window.location.origin}/auth/create_password/${generatedToken}`
                  }
                  className="w-full bg-white border border-amber-200 rounded-lg px-4 py-2.5 text-[12px] text-amber-900 font-medium focus:outline-none"
                />
                <button
                  onClick={() => {
                    const link =
                      mode === "temple"
                        ? `http://localhost:8081/auth/create_password/${generatedToken}`
                        : `${window.location.origin}/auth/create_password/${generatedToken}`;
                    navigator.clipboard.writeText(link);
                    toast.success("Setup link copied to clipboard");
                  }}
                  className="bg-amber-600 text-white px-5 py-2.5 rounded-lg text-[12px] font-bold hover:bg-amber-700 transition-colors shadow-sm whitespace-nowrap"
                >
                  Copy Link
                </button>
                <a
                  href={`mailto:${formData.superadmin.email}?subject=Admin%20Account%20Setup&body=Please%20use%20this%20secure%20link%20to%20set%20up%20your%20administrator%20password:%0A%0A${mode === "temple" ? `http://localhost:8081/auth/create_password/${generatedToken}` : `${window.location.origin}/auth/create_password/${generatedToken}`}`}
                  className="bg-brand-secondary text-white px-5 py-2.5 rounded-lg text-[12px] font-bold hover:bg-brand-primary transition-colors shadow-sm whitespace-nowrap text-center"
                >
                  Email Link
                </a>
              </div>
            </div>
          )}

          <button
            onClick={onComplete}
            className="w-full py-4 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-secondary transition-all active:scale-[0.98] text-[14px] shadow-lg shadow-brand-primary/10"
          >
            Finalize & Return to Directory
          </button>
        </motion.div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <IdentityStep
            formData={formData}
            setFormData={setFormData}
            validationErrors={validationErrors}
            handleRealTimeValidation={handleRealTimeValidation}
          />
        );
      case 2:
        return (
          <ExecutiveStep
            formData={formData}
            setFormData={setFormData}
            validationErrors={validationErrors}
            handleRealTimeValidation={handleRealTimeValidation}
            previewAdmin={previewAdmin}
            handleFileChange={handleFileChange}
            adminInputRef={adminInputRef}
            mode={mode}
            temples={temples}
            onImageLinkPaste={handleImageLinkPaste}
          />
        );
      case 3:
        return (
          <VisualStep
            formData={formData}
            setFormData={setFormData}
            previewHero={previewHero}
            previewLogo={previewLogo}
            handleFileChange={handleFileChange}
            heroInputRef={heroInputRef}
            logoInputRef={logoInputRef}
            validationErrors={validationErrors}
            handleRealTimeValidation={handleRealTimeValidation}
            onImageLinkPaste={handleImageLinkPaste}
          />
        );
      case 4:
        return (
          <ReviewStep
            formData={formData}
            setFormData={setFormData}
            previewHero={previewHero}
            previewLogo={previewLogo}
            previewAdmin={previewAdmin}
            mode={mode}
            goToStepById={goToStepById}
            error={error}
            validationErrors={validationErrors}
            handleRealTimeValidation={handleRealTimeValidation}
            temples={temples}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white flex flex-col lg:flex-row overflow-hidden min-h-screen lg:min-h-0 lg:h-[820px] border border-slate-100 rounded-xl shadow-sm relative">
      <div className="w-full lg:w-[360px] bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col p-4 lg:p-4 sm:p-4 shrink-0">
        <div className="mb-4 lg:mb-10">
          <div className="flex items-center gap-3 mb-2 lg:mb-4">
            <div className="w-8 h-8 bg-brand-primary rounded flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] lg:text-[12px] font-semibold text-slate-900 uppercase tracking-widest">
              Enrollment Protocol
            </span>
          </div>
          <h1 className="text-base lg:text-xl font-medium text-slate-900 tracking-tight leading-tight">
            {mode === "admin"
              ? "Administrator Enrollment"
              : "Temple Unit Enrollment"}
          </h1>
        </div>

        <div className="flex-1 space-y-4 lg:space-y-4 sm:space-y-4 mb-4 lg:mb-0 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar flex lg:block gap-4">
          {filteredSteps.map((step, idx) => {
            const isActive = currentStepIndex === idx;
            const isDone = currentStepIndex > idx;
            return (
              <div key={step.id} className="relative shrink-0 lg:shrink">
                <div className="flex items-center lg:items-start gap-3 lg:gap-4 group cursor-default">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium transition-all shrink-0 relative z-10",
                      isActive
                        ? "bg-brand-primary text-white ring-4 ring-brand-primary/10 shadow-lg"
                        : isDone
                          ? "bg-emerald-500 text-white"
                          : "bg-white border border-slate-200 text-slate-400",
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div
                    className={cn(
                      "transition-all",
                      isActive ? "opacity-100 lg:translate-x-1" : "opacity-40",
                    )}
                  >
                    <h3 className="text-[12px] lg:text-[14px] font-bold text-slate-900 whitespace-nowrap lg:whitespace-normal leading-none mb-1 lg:mb-2">
                      {step.title}
                    </h3>
                    {isActive && (
                      <p className="text-[11px] lg:text-[12px] text-slate-500 font-normal leading-relaxed hidden lg:block">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
                {idx < filteredSteps.length - 1 && (
                  <div
                    className={cn(
                      "hidden lg:block absolute left-[11.5px] top-8 w-px h-10 transition-colors duration-500",
                      isDone ? "bg-emerald-500" : "bg-slate-200",
                    )}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        <div className="hidden lg:block mt-auto pt-6 border-t border-slate-200/60">
          <div className="flex items-center gap-3 py-3 px-4 bg-white/50 rounded-xl border border-slate-200/40">
            <Fingerprint className="w-5 h-5 text-slate-400" />
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400">
                Secure Enrollment
              </span>
              <span className="text-[8px] text-slate-400 font-medium block">
                V.2.4.0 Protocol
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
        {/* Header Controls */}
        <div className="h-16 flex items-center justify-between px-4 lg:px-4 sm:px-10 border-b border-slate-100 bg-white z-40 shrink-0">
          <div className="flex items-center gap-5 text-slate-400">
            <div className="w-8 h-8 rounded-lg bg-slate-50 hidden sm:flex items-center justify-center">
              <Layout className="w-4 h-4 text-slate-300" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.1em] lg:tracking-[0.2em]">
                {mode === "admin" ? "Admin Portal" : "Temple Portal"}
              </span>
              <ChevronRight className="w-3 h-3 text-slate-200" />
              <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.1em] lg:tracking-[0.2em] text-slate-900">
                Stage {currentStepIndex + 1} of {filteredSteps.length}
              </span>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-10 h-10 hover:bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-4 sm:p-10 bg-slate-50/10">
          <form
            id="enrollment-form"
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto space-y-4 sm:space-y-4 pb-12"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </form>
        </div>

        {/* Fixed Navigation Actions Footer */}
        <div className="px-4 lg:px-5 sm:px-4 sm:px-4 py-4 lg:py-4 flex items-center justify-between border-t border-slate-100 bg-white z-40 shrink-0">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className={cn(
              "px-4 lg:px-4 py-2 rounded-xl font-bold text-[10px] lg:text-[11px] transition-all flex items-center gap-2",
              currentStepIndex === 0
                ? "opacity-0 pointer-events-none"
                : "text-slate-400 hover:text-slate-900",
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous Phase</span>
          </button>

          <div className="flex gap-4 lg:gap-4 items-center">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-2 text-slate-400 hover:text-brand-primary text-[10px] lg:text-[11px] font-bold transition-all group/save"
            >
              <Save className="w-4 h-4 group-hover/save:scale-110 transition-transform" />
              <span className="hidden sm:inline">Save Draft</span>
            </button>
            {currentStepIndex < filteredSteps.length - 1 ? (
              <button
                onClick={nextStep}
                disabled={Object.keys(validationErrors).length > 0}
                className="px-4 lg:px-4 sm:px-4 py-2.5 lg:py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition-all flex items-center gap-2 lg:gap-3 disabled:opacity-50 text-[10px] lg:text-[11px] shadow-xl shadow-brand-primary/20 hover:scale-105 active:scale-95"
              >
                {currentStepIndex === filteredSteps.length - 2
                  ? "Finalize Audit"
                  : "Continue"}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="enrollment-form"
                disabled={Object.keys(validationErrors).length > 0}
                className="px-4 sm:px-4 lg:px-4 sm:px-10 py-2.5 lg:py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition-all flex items-center gap-2 lg:gap-3 text-[10px] lg:text-[11px] shadow-2xl shadow-brand-primary/30 hover:scale-105 active:scale-95 animate-pulse disabled:animate-none"
              >
                Register
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/40 backdrop-blur-[2px] z-[200] flex flex-col items-center justify-center"
          >
            <div className="w-7 h-7 border-2 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TempleEnrollmentWizard;
