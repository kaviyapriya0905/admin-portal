import React, { useState } from "react";
import { User, Shield, Bell, Settings as SettingsIcon, Save, Key, Smartphone, Mail, Globe, Palette, Camera, CheckCircle2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SmartField from "@/components/ui/SmartField";
import SmartSelect from "@/components/ui/SmartSelect";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "preferences">("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@omg.com",
    phone: "+91 98765 43210",
    role: "Super Admin",
  });

  // Security Form State
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    mfaEnabled: true,
  });

  // Preferences Form State
  const [preferencesData, setPreferencesData] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsAlerts: true,
    language: "English",
    theme: "Light",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Settings updated successfully!", {
        icon: '✨',
        style: {
          borderRadius: '12px',
          background: '#fff',
          color: '#1e293b',
        },
      });
      setIsSaving(false);
    }, 1000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User, desc: "Personal information" },
    { id: "security", label: "Security", icon: Shield, desc: "Passwords & MFA" },
    { id: "preferences", label: "Preferences", icon: Palette, desc: "System settings" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 relative min-h-[calc(100vh-6rem)]">
      {/* Decorative Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-200/40 to-transparent pointer-events-none -z-10 rounded-3xl" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-slate-400/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 py-8 px-8"
      >
        <div>
          <button 
            type="button"
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-brand-primary transition-colors mb-4 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex items-center justify-center p-2 bg-white shadow-sm border border-slate-100 rounded-xl text-brand-primary">
              <SettingsIcon className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Platform Settings
            </h1>
          </div>
          <p className="text-[11px] text-slate-500 font-medium max-w-lg leading-relaxed">
            Manage your account preferences, security configurations, and personalize your administrative experience.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 px-8">
        {/* Modern Sidebar Tabs */}
        <div className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="w-full relative group flex items-center p-4 rounded-2xl transition-all duration-300 text-left"
              >
                {active && (
                  <motion.div 
                    layoutId="active-tab"
                    className="absolute inset-0 bg-white border border-slate-200 shadow-sm rounded-2xl z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`relative z-10 flex items-center gap-4 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                  <div className={`p-2.5 rounded-xl transition-colors duration-300 ${active ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                    <tab.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-[12px] font-bold tracking-tight transition-colors ${active ? 'text-brand-primary' : 'text-slate-700'}`}>
                      {tab.label}
                    </h3>
                    <p className={`text-[9px] font-medium transition-colors ${active ? 'text-slate-500' : 'text-slate-400'}`}>
                      {tab.desc}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <form onSubmit={handleSave} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 overflow-hidden min-h-[600px] flex flex-col relative">
            
            <div className="p-8 sm:p-12 flex-1 relative z-10">
              <AnimatePresence mode="wait">
                
                {/* ---------------- PROFILE TAB ---------------- */}
                {activeTab === "profile" && (
                  <motion.div 
                    key="profile" 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }} 
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="space-y-10"
                  >
                    {/* Avatar Section */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pb-10 border-b border-slate-100/80">
                      <div 
                        className="relative group cursor-pointer"
                        onMouseEnter={() => setIsHoveringAvatar(true)}
                        onMouseLeave={() => setIsHoveringAvatar(false)}
                      >
                        <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full scale-90 group-hover:scale-110 transition-transform duration-500" />
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-slate-400 overflow-hidden relative z-10 transition-transform duration-300 group-hover:scale-105">
                           {profileData.firstName[0]}{profileData.lastName[0]}
                           
                           <AnimatePresence>
                             {isHoveringAvatar && (
                               <motion.div 
                                 initial={{ opacity: 0 }} 
                                 animate={{ opacity: 1 }} 
                                 exit={{ opacity: 0 }}
                                 className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white"
                               >
                                 <Camera className="w-8 h-8 mb-1" />
                                 <span className="text-[10px] font-bold uppercase tracking-wider">Update</span>
                               </motion.div>
                             )}
                           </AnimatePresence>
                        </div>
                      </div>
                      <div className="text-center sm:text-left pt-2">
                        <h3 className="text-md font-bold text-slate-800">Profile Picture</h3>
                        <p className="text-[11px] text-slate-500 mt-1 max-w-sm leading-relaxed">
                          We recommend a high-resolution image. Allowed formats: JPEG, PNG or GIF. Max size 5MB.
                        </p>
                        <div className="mt-4 flex gap-3 justify-center sm:justify-start">
                           <button type="button" className="px-4 py-2 text-xs font-bold text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors shadow-sm">
                             Upload Image
                           </button>
                           <button type="button" className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                             Remove
                           </button>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                        <SmartField label="First Name" value={profileData.firstName} onChange={v => setProfileData(p => ({...p, firstName: v}))} />
                        <SmartField label="Last Name" value={profileData.lastName} onChange={v => setProfileData(p => ({...p, lastName: v}))} />
                        <SmartField label="Email Address" type="email" value={profileData.email} onChange={v => setProfileData(p => ({...p, email: v}))} />
                        <SmartField label="Phone Number" value={profileData.phone} onChange={v => setProfileData(p => ({...p, phone: v}))} />
                      
                      <div className="sm:col-span-2 mt-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                           <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Role Designation</label>
                           <p className="text-[14px] font-black text-slate-800 mt-1">{profileData.role}</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg border border-emerald-200">
                           <CheckCircle2 className="w-4 h-4" />
                           <span className="text-xs font-bold">Verified Account</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ---------------- SECURITY TAB ---------------- */}
                {activeTab === "security" && (
                  <motion.div 
                    key="security" 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }} 
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="space-y-12"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                         <div className="p-2 bg-rose-50 rounded-lg text-rose-500 border border-rose-100">
                           <Key className="w-5 h-5" />
                         </div>
                         <div>
                           <h3 className="text-sm font-bold text-slate-800 tracking-tight">Update Password</h3>
                           <p className="text-[10px] text-slate-500 mt-0.5">Ensure your account is using a long, random password to stay secure.</p>
                         </div>
                      </div>
                      
                      <div className="space-y-6 max-w-xl">
                        <SmartField label="Current Password" type="password" value={securityData.currentPassword} onChange={v => setSecurityData(p => ({...p, currentPassword: v}))} />
                        <SmartField label="New Password" type="password" value={securityData.newPassword} onChange={v => setSecurityData(p => ({...p, newPassword: v}))} />
                        <SmartField label="Confirm New Password" type="password" value={securityData.confirmPassword} onChange={v => setSecurityData(p => ({...p, confirmPassword: v}))} />
                      </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div>
                      <div className="flex items-center gap-3 mb-6">
                         <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500 border border-emerald-100">
                           <Smartphone className="w-5 h-5" />
                         </div>
                         <div>
                           <h3 className="text-sm font-bold text-slate-800 tracking-tight">Two-Factor Authentication</h3>
                           <p className="text-[10px] text-slate-500 mt-0.5">Add additional security to your account using TOTP.</p>
                         </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-between p-6 border border-slate-200 rounded-2xl bg-slate-50/50 hover:border-slate-300 transition-colors group">
                        <div className="flex-1 pr-6 text-center sm:text-left mb-4 sm:mb-0">
                          <p className="text-[13px] font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-2">
                             Authenticator App
                             {securityData.mfaEnabled && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] uppercase tracking-wider rounded-full font-black">Active</span>}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                             Use an authenticator app (like Google Authenticator or Authy) to generate one time passwords.
                          </p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setSecurityData(p => ({...p, mfaEnabled: !p.mfaEnabled}))}
                          className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 shadow-inner ${securityData.mfaEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        >
                          <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out ${securityData.mfaEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>


                  </motion.div>
                )}

                {/* ---------------- PREFERENCES TAB ---------------- */}
                {activeTab === "preferences" && (
                  <motion.div 
                    key="preferences" 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -20 }} 
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="space-y-12"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                         <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500 border border-indigo-100">
                           <Bell className="w-5 h-5" />
                         </div>
                         <div>
                           <h3 className="text-sm font-bold text-slate-800 tracking-tight">Notification Channels</h3>
                           <p className="text-[10px] text-slate-500 mt-0.5">Control how and when you receive system alerts.</p>
                         </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications', icon: Mail, desc: 'Receive daily summaries, reports, and critical alerts directly to your inbox.' },
                          { key: 'pushNotifications', label: 'Browser Push Notifications', icon: Globe, desc: 'Get live, unintrusive updates while actively using the dashboard.' },
                          { key: 'smsAlerts', label: 'SMS Alerts', icon: Smartphone, desc: 'Reserved exclusively for urgent system failures and high-priority security alerts.' },
                        ].map((item) => {
                           const isEnabled = preferencesData[item.key as keyof typeof preferencesData];
                           return (
                          <div key={item.key} className={`flex items-start sm:items-center justify-between p-5 border rounded-2xl transition-all duration-300 ${isEnabled ? 'bg-white border-brand-primary/30 shadow-sm shadow-brand-primary/5' : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'}`}>
                            <div className="flex items-start gap-4">
                              <div className={`p-2.5 rounded-xl transition-colors mt-0.5 ${isEnabled ? 'bg-brand-primary/10 text-brand-primary' : 'bg-white shadow-sm border border-slate-100 text-slate-400'}`}>
                                 <item.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-[13px] font-bold text-slate-800 tracking-tight">{item.label}</p>
                                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed max-w-lg">{item.desc}</p>
                              </div>
                            </div>
                            <button 
                              type="button" 
                              onClick={() => setPreferencesData(p => ({...p, [item.key]: !p[item.key as keyof typeof p]}))}
                              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none shadow-inner mt-2 sm:mt-0 ${isEnabled ? 'bg-brand-primary' : 'bg-slate-300'}`}
                            >
                              <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                          </div>
                        )})}
                      </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div>
                      <div className="flex items-center gap-3 mb-6">
                         <div className="p-2 bg-amber-50 rounded-lg text-amber-500 border border-amber-100">
                           <Palette className="w-5 h-5" />
                         </div>
                         <div>
                           <h3 className="text-sm font-bold text-slate-800 tracking-tight">Localization & Theme</h3>
                           <p className="text-[10px] text-slate-500 mt-0.5">Customize your regional and visual experience.</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                         <SmartSelect label="Interface Language" value={preferencesData.language} onChange={v => setPreferencesData(p => ({...p, language: v}))} options={["English", "Hindi", "Tamil", "Telugu"]} />
                         <SmartSelect label="UI Theme" value={preferencesData.theme} onChange={v => setPreferencesData(p => ({...p, theme: v}))} options={["Light Mode", "System Default"]} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Premium Sticky Footer */}
            <div className="relative z-20 p-6 sm:px-12 sm:py-6 border-t border-slate-200/60 bg-white/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] font-semibold text-slate-400 text-center sm:text-left">
                 Last saved: <span className="text-slate-600">Today at 10:42 AM</span>
              </p>
              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-3 text-sm bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 hover:bg-[#8e330b] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSaving ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                   <Save className="w-5 h-5" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
