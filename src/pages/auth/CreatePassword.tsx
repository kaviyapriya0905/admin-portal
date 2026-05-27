import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Check,
  ShieldAlert,
} from "lucide-react";
import SmartField from "@/components/ui/SmartField";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import toast from "react-hot-toast";

const CreatePassword: React.FC = () => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Clear any existing session to prevent auto-redirect to dashboard
    dispatch(logout());
  }, [dispatch]);
  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    {
      label: "One number or special character",
      met: /[0-9!@#$%^&*]/.test(password),
    },
  ];

  const allMet = requirements.every((req) => req.met);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  useEffect(() => {
    // Intentionally left blank: user must click the button to navigate
  }, [completed, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allMet) {
      toast.error("Please meet all password security requirements");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCompleted(true);
      toast.success("Security credentials established");
    } catch (err: unknown) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center p-6 selection:bg-brand-primary/10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white w-full max-w-[500px] p-10 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 text-center space-y-6"
        >
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
              Security handshaked
            </h1>
            <p className="text-[13px] text-slate-500 font-normal">
              Your executive credentials have been successfully synchronized.
            </p>
            <p className="text-[11px] text-slate-400 font-medium pt-2">
              Redirecting to governance portal...
            </p>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 bg-brand-primary text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-brand-secondary shadow-lg shadow-brand-primary/10 group"
          >
            Enter governance portal
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center p-6 font-sans selection:bg-brand-primary/10">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-[540px] p-10 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-100 space-y-8"
      >
        <div className="space-y-3 text-center flex flex-col items-center">
          <div className="w-11 h-11 bg-brand-primary/5 rounded-2xl flex items-center justify-center mb-1">
            <Shield className="w-5 h-5 text-brand-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
              Create password
            </h1>
            <p className="text-[13px] text-slate-500 font-normal">
              Establish your secure administrative credentials.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <SmartField
              label="New password"
              icon={Lock}
              type="password"
              placeholder="Enter a strong password"
              value={password}
              onChange={setPassword}
            />

            <div className="pt-2 px-1 grid grid-cols-1 gap-2">
              {requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${req.met ? "bg-emerald-500" : "bg-slate-100"}`}
                  >
                    {req.met ? (
                      <Check className="w-2.5 h-2.5 text-white" />
                    ) : (
                      <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-medium transition-colors ${req.met ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    {req.label}
                  </span>
                </div>
              ))}
            </div>

            <SmartField
              label="Confirm password"
              icon={ShieldAlert}
              type="password"
              placeholder="Verify your password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              errorText={confirmPassword && !passwordsMatch ? "Passwords do not match" : ""}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !allMet || !passwordsMatch}
            className="w-full py-4 bg-brand-primary text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-brand-secondary disabled:opacity-50 shadow-lg shadow-brand-primary/10 group active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Synchronizing...
              </>
            ) : (
              <>
                Establish credentials
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePassword;
