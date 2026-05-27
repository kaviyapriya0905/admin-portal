import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  KeyRound,
  Mail,
  ArrowLeft,
  Loader2,
  Lock,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import SmartField from "@/components/ui/SmartField";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
} from "@/utils/validationSchemas";

type Step = "request" | "reset" | "success";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [step, setStep] = useState<Step>("request");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setStep("reset");
    }
  }, [token]);

  // Request Form
  const {
    handleSubmit: handleSubmitRequest,
    formState: { errors: requestErrors },
    control: controlRequest,
  } = useForm<ForgotPasswordFormData>({
    // @ts-ignore
    resolver: yupResolver(forgotPasswordSchema),
    mode: "onChange",
  });


  // Reset Form
  const {
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
    control: controlReset,
  } = useForm<ResetPasswordFormData>({
    // @ts-ignore
    resolver: yupResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const handleRequestOtp = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Reset link sent to your email");
      setStep("success");
    } catch (err: unknown) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!token) {
      toast.error("Security token missing.");
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err: unknown) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center p-6 font-sans selection:bg-brand-primary/10">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-[450px] p-10 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center mb-4">
            <KeyRound className="w-6 h-6 text-brand-primary" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            {step === "request" && "Forgot Password"}
            {step === "reset" && "Create New Password"}
            {step === "success" && "Check Your Email"}
          </h1>
          <p className="text-[13px] text-slate-400 font-medium mt-1">
            {step === "request" &&
              "Enter your email to receive a password reset link."}
            {step === "reset" && "Set a strong password for your account."}
            {step === "success" &&
              "We have sent a reset link to your email address. Please click the link to reset your password."}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "request" && (
            <motion.form
              key="request"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmitRequest(handleRequestOtp)}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Controller
                  name="email"
                  control={controlRequest}
                  render={({ field }) => (
                    <SmartField
                      label="Email address"
                      icon={Mail}
                      type="email"
                      placeholder="Enter your email"
                      value={field.value || ""}
                      onChange={field.onChange}
                      errorText={requestErrors.email?.message}
                    />
                  )}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-primary hover:bg-[#8e330b] text-white font-bold rounded-xl transition-all text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/10 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </motion.form>
          )}

          {step === "reset" && (
            <motion.form
              key="reset"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSubmitReset(handleResetPassword)}
              className="space-y-4"
            >
              <div className="space-y-1.5 text-left">
                <Controller
                  name="password"
                  control={controlReset}
                  render={({ field }) => (
                    <SmartField
                      label="New Password"
                      icon={Lock}
                      type="password"
                      placeholder="Enter new password"
                      value={field.value || ""}
                      onChange={field.onChange}
                      errorText={resetErrors.password?.message}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <Controller
                  name="confirmPassword"
                  control={controlReset}
                  render={({ field }) => (
                    <SmartField
                      label="Confirm Password"
                      icon={Lock}
                      type="password"
                      placeholder="Confirm new password"
                      value={field.value || ""}
                      onChange={field.onChange}
                      errorText={resetErrors.confirmPassword?.message}
                    />
                  )}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-primary hover:bg-[#8e330b] text-white font-bold rounded-xl transition-all text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/10 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Update Password"
                )}
              </button>
            </motion.form>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3.5 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-xl transition-all text-[13px] flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/10"
              >
                Back to Login
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {step !== "success" && (
          <div className="mt-8 pt-6 border-t border-slate-50 flex justify-center">
            <Link
              to="/login"
              className="flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-brand-primary transition-all group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              Return to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
