import React, { useState } from "react";
import { User, Shield, Bell, Settings as SettingsIcon, Save, Key, Smartphone, Mail, Globe, Palette, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "preferences">("profile");
  const [isSaving, setIsSaving] = useState(false);

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
    
    // Simulate API Call
    setTimeout(() => {
      toast.success("Settings updated successfully!");
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-brand-primary" />
            Platform Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account preferences, security, and profile details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: "profile", label: "Profile Information", icon: User },
            { id: "security", label: "Security & MFA", icon: Shield },
            { id: "preferences", label: "System Preferences", icon: Palette },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left font-bold text-sm ${
                  active 
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" 
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100 hover:border-slate-200"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${active ? "text-white/90" : "text-slate-400"}`} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
            <form onSubmit={handleSave} className="flex flex-col h-full">
              <div className="p-6 sm:p-8 flex-1">
                <AnimatePresence mode="wait">
                  
                  {/* Profile Tab */}
                  {activeTab === "profile" && (
                    <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                      <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-3xl font-black text-slate-300 overflow-hidden">
                             {profileData.firstName[0]}{profileData.lastName[0]}
                          </div>
                          <button type="button" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-colors">
                            <User className="w-4 h-4" />
                          </button>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">Profile Picture</h3>
                          <p className="text-[12px] text-slate-500 mt-1">JPEG, PNG or GIF. Max size 2MB.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                          <input type="text" value={profileData.firstName} onChange={e => setProfileData(p => ({...p, firstName: e.target.value}))} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none text-[13px] font-semibold transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                          <input type="text" value={profileData.lastName} onChange={e => setProfileData(p => ({...p, lastName: e.target.value}))} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none text-[13px] font-semibold transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                          <input type="email" value={profileData.email} onChange={e => setProfileData(p => ({...p, email: e.target.value}))} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none text-[13px] font-semibold transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                          <input type="text" value={profileData.phone} onChange={e => setProfileData(p => ({...p, phone: e.target.value}))} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none text-[13px] font-semibold transition-all" />
                        </div>
                        <div className="sm:col-span-2 space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Role Designation (Read Only)</label>
                          <input type="text" value={profileData.role} disabled className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none text-[13px] font-bold" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Security Tab */}
                  {activeTab === "security" && (
                    <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Key className="w-4 h-4 text-brand-primary" /> Update Password
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
                            <input type="password" value={securityData.currentPassword} onChange={e => setSecurityData(p => ({...p, currentPassword: e.target.value}))} className="w-full max-w-md h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none text-[13px] transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                            <input type="password" value={securityData.newPassword} onChange={e => setSecurityData(p => ({...p, newPassword: e.target.value}))} className="w-full max-w-md h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none text-[13px] transition-all" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                            <input type="password" value={securityData.confirmPassword} onChange={e => setSecurityData(p => ({...p, confirmPassword: e.target.value}))} className="w-full max-w-md h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none text-[13px] transition-all" />
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-slate-100" />

                      <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-emerald-500" /> Multi-Factor Authentication
                        </h3>
                        <div className="flex items-center justify-between p-5 border border-slate-200 rounded-xl bg-slate-50">
                          <div>
                            <p className="text-[13px] font-bold text-slate-800">Authenticator App (TOTP)</p>
                            <p className="text-[11px] text-slate-500 mt-1">Requires an authenticator app to generate a code when logging in.</p>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setSecurityData(p => ({...p, mfaEnabled: !p.mfaEnabled}))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${securityData.mfaEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${securityData.mfaEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      </div>

                      <div className="h-px bg-slate-100" />

                      <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <LogOut className="w-4 h-4 text-rose-500" /> Active Sessions
                        </h3>
                        <div className="p-5 border border-rose-100 rounded-xl bg-rose-50/50 flex justify-between items-center">
                           <div>
                              <p className="text-[13px] font-bold text-slate-800">Log out everywhere</p>
                              <p className="text-[11px] text-slate-500 mt-1">Sign out of all other active sessions across devices.</p>
                           </div>
                           <button type="button" className="px-4 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-50 transition-colors">
                              Revoke Sessions
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Preferences Tab */}
                  {activeTab === "preferences" && (
                    <motion.div key="preferences" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Bell className="w-4 h-4 text-indigo-500" /> Notification Preferences
                        </h3>
                        <div className="space-y-3">
                          {[
                            { key: 'emailNotifications', label: 'Email Notifications', icon: Mail, desc: 'Receive daily summaries and critical alerts.' },
                            { key: 'pushNotifications', label: 'Browser Push Notifications', icon: Globe, desc: 'Get live updates while using the dashboard.' },
                            { key: 'smsAlerts', label: 'SMS Alerts', icon: Smartphone, desc: 'For urgent system failures and security alerts.' },
                          ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-brand-primary/30 transition-colors group">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-brand-primary/5 transition-colors">
                                   <item.icon className="w-4 h-4 text-slate-400 group-hover:text-brand-primary" />
                                </div>
                                <div>
                                  <p className="text-[13px] font-bold text-slate-700">{item.label}</p>
                                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                                </div>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => setPreferencesData(p => ({...p, [item.key]: !p[item.key as keyof typeof p]}))}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${preferencesData[item.key as keyof typeof preferencesData] ? 'bg-brand-primary' : 'bg-slate-300'}`}
                              >
                                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${preferencesData[item.key as keyof typeof preferencesData] ? 'translate-x-5' : 'translate-x-1'}`} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="h-px bg-slate-100" />

                      <div>
                         <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-emerald-500" /> Localization
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Interface Language</label>
                              <select value={preferencesData.language} onChange={e => setPreferencesData(p => ({...p, language: e.target.value}))} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none text-[13px] font-semibold transition-all appearance-none cursor-pointer">
                                 <option>English</option>
                                 <option>Hindi</option>
                                 <option>Tamil</option>
                                 <option>Telugu</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">UI Theme</label>
                              <select value={preferencesData.theme} onChange={e => setPreferencesData(p => ({...p, theme: e.target.value}))} className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-primary/20 outline-none text-[13px] font-semibold transition-all appearance-none cursor-pointer">
                                 <option>Light</option>
                                 <option>Dark (Coming Soon)</option>
                                 <option>System Default</option>
                              </select>
                           </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sticky Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 hover:bg-[#8e330b] transition-all flex items-center gap-2 disabled:opacity-70"
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
    </div>
  );
};

export default Settings;
