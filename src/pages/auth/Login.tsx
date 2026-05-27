import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { loginSuccess } from "@/store/slices/authSlice";
import { type RootState } from "@/store/store";
import SmartField from "@/components/ui/SmartField";

const Login: React.FC = () => {
  const [email, setEmail] = useState("company-admin@gwcdata.ai");
  const [password, setPassword] = useState("Company_Admin@123");
  const [entering, setEntering] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleEnterPortal = () => {
    setEntering(true);
    // Directly authenticate with a mock user — no validation needed
    const mockUser = {
      id: "1",
      firstName: "Company",
      lastName: "Admin",
      email: email || "company-admin@gwcdata.ai",
      roleId: 1,
      role: { name: "company-admin" },
      templeId: undefined,
      userPermissions: [],
      profilePic: undefined,
    };
    dispatch(loginSuccess({ user: mockUser as any }));
    // Navigation happens via the useEffect above
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 lg:p-10 font-sans selection:bg-brand-primary/10">
      <img
        src="/temple_login_bg.png"
        alt="Spiritual Foundation"
        className="absolute inset-0 w-full h-full object-cover grayscale opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-900/60 to-brand-primary/20"></div>

      <div className="absolute top-8 left-8 z-20 hidden lg:block">
        <img
          src="https://omgofficial.com/omg-logo.png"
          alt="OMG Logo"
          className="h-7 brightness-0 invert"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative z-40 bg-white/95 backdrop-blur-xl w-full max-w-[450px] p-6 sm:p-10 rounded-xl border border-white/40 shadow-2xl shadow-slate-900/10"
      >
        <div className="text-center mb-6">
          <div className="flex justify-center mb-6">
            <img
              src="https://omgofficial.com/omg-logo.png"
              alt="OMG Logo"
              className="h-10 w-auto"
            />
          </div>
          <h3 className="text-[18px] font-bold text-slate-800 tracking-tight">
            Temple ERP Admin Portal
          </h3>
          <p className="text-[12px] text-slate-400 font-bold mt-1 tracking-tight">
            Access Secure Gateway
          </p>
        </div>

        <div className="space-y-4">
          <SmartField
            label="Email address"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="Enter admin email"
          />

          <SmartField
            label="Password"
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="Enter password"
          />

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleEnterPortal}
            disabled={entering}
            className="w-full py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold rounded-md transition-all text-[13px] mt-1 flex items-center justify-center gap-3 disabled:opacity-70 shadow-lg shadow-brand-primary/10"
          >
            {entering ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Entering...
              </>
            ) : (
              "Enter Portal"
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
