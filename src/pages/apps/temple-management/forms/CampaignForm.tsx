import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Users, Loader2, Megaphone, Mail, MessageSquare, ShieldAlert, Coins, Share2, CalendarDays } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import SmartField from "../../../../components/ui/SmartField";
import SmartSelect from "../../../../components/ui/SmartSelect";
import SmartTextarea from "../../../../components/ui/SmartTextarea";
import { getMockData, addMockItem, updateMockItem } from "../../../../utils/mockData";

const CampaignForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [activeTab, setActiveTab] = useState<"General" | "Rules" | "Budget" | "Integrations">("General");
  
  const [formData, setFormData] = useState({
    // General
    name: "",
    type: "Email",
    targetAudience: "All Donors",
    message: "",
    visibility: "Public",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    // Rules
    dailyParticipationLimit: "100",
    totalCap: "5000",
    approvalRequired: "No",
    eligibility: "All",
    // Budget
    budget: "50000",
    dailyLimit: "5000",
    // Integrations
    provider: "Local Agency",
    commission: "5",
    metaConnected: false
  });

  const [isEstimating, setIsEstimating] = useState(false);
  const [estimatedReach, setEstimatedReach] = useState<number | null>(null);

  useEffect(() => {
    if (isEdit) {
      const data = getMockData();
      const existing = data.campaigns.find(c => c.id === id);
      if (existing) {
        setFormData({
          name: existing.name as string || "",
          type: existing.type as string || "Email",
          targetAudience: "All Donors",
          message: existing.funds as string || "", // Fallback
          visibility: "Public",
          startDate: new Date().toISOString().split('T')[0],
          endDate: "",
          dailyParticipationLimit: existing.dailyLimit as string || "100",
          totalCap: "5000",
          approvalRequired: "No",
          eligibility: (existing.rules as string[])?.[0] || "All",
          budget: existing.budget as string || "50000",
          dailyLimit: existing.dailyLimit as string || "5000",
          provider: existing.provider as string || "Local Agency",
          commission: existing.commission as string || "5",
          metaConnected: existing.metaConnected as boolean || false
        });
        setEstimatedReach(parseInt(existing.reach as string) || 4200);
      }
    }
  }, [isEdit, id]);

  // Real-time Scenario: Live Audience Estimator (General Tab)
  useEffect(() => {
    if (activeTab === "General" && formData.targetAudience && !isEdit) {
      setIsEstimating(true);
      const timer = setTimeout(() => {
        setIsEstimating(false);
        if (formData.targetAudience === "All Donors") setEstimatedReach(4200);
        else if (formData.targetAudience === "VIPs") setEstimatedReach(150);
        else setEstimatedReach(Math.floor(Math.random() * 2000) + 500);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [formData.targetAudience, isEdit, activeTab]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCampaign = {
      id: id || `CMP-${Math.floor(Math.random() * 1000)}`,
      name: formData.name,
      type: formData.type,
      reach: `${(estimatedReach || 1000) / 1000}k`,
      funds: `₹${(parseInt(formData.budget) / 100000).toFixed(1)}L`,
      status: "Active",
      end: formData.endDate || "31 Dec 2026",
      templeId: "t1",
      templeName: "Sri Krishna Temple",
      budget: formData.budget,
      spent: "0",
      metaConnected: formData.metaConnected,
      dailyLimit: formData.dailyLimit,
      provider: formData.provider,
      commission: formData.commission,
      rules: [formData.eligibility],
    };

    if (isEdit && id) {
      updateMockItem("campaigns", id, newCampaign);
      toast.success("Campaign updated successfully!");
    } else {
      addMockItem("campaigns", newCampaign);
      toast.success("Advanced Campaign deployed successfully!");
    }
    navigate("/campaigns");
  };

  const tabs: ("General" | "Rules" | "Budget" | "Integrations")[] = ["General", "Rules", "Budget", "Integrations"];



  const renderFormContent = () => {
    switch (activeTab) {
      case "General":
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
            <div className="sm:col-span-2">
              <SmartField label="Campaign Name" icon={Megaphone}  value={formData.name} onChange={v => setFormData(p => ({...p, name: v}))} />
            </div>
            <SmartSelect label="Channel" icon={Mail}  value={formData.type} onChange={v => setFormData(p => ({...p, type: v}))} options={["SMS", "Email", "WhatsApp", "Fundraiser", "Donation"]} />
            <SmartSelect label="Target Audience" icon={Users}  value={formData.targetAudience} onChange={v => setFormData(p => ({...p, targetAudience: v}))} options={["All Donors", "VIPs", "Recent Visitors (30 days)"]} />
            <div className="sm:col-span-2">
              <SmartTextarea label="Message Content" icon={MessageSquare} required rows={3} value={formData.message} onChange={v => setFormData(p => ({...p, message: v}))} />
            </div>
            <SmartField label="Start Date" icon={CalendarDays} type="date" value={formData.startDate} onChange={v => setFormData(p => ({...p, startDate: v}))} />
            <SmartField label="End Date" icon={CalendarDays} type="date" value={formData.endDate} onChange={v => setFormData(p => ({...p, endDate: v}))} />
          </motion.div>
        );
      case "Rules":
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
            <SmartSelect label="Eligibility" icon={Users} value={formData.eligibility} onChange={v => setFormData(p => ({...p, eligibility: v}))} options={["All", "Life Members", "Donors", "Regular"]} />
            <SmartSelect label="Approval Required" icon={ShieldAlert} value={formData.approvalRequired} onChange={v => setFormData(p => ({...p, approvalRequired: v}))} options={["No", "Yes, Admin Approval", "Yes, Finance Approval"]} />
            <SmartField label="Daily Participation Cap" icon={Users} type="number" value={formData.dailyParticipationLimit} onChange={v => setFormData(p => ({...p, dailyParticipationLimit: v}))} />
            <SmartField label="Total Cap" icon={Users} type="number" value={formData.totalCap} onChange={v => setFormData(p => ({...p, totalCap: v}))} />
          </motion.div>
        );
      case "Budget":
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
            <SmartField label="Total Campaign Budget (₹)" icon={Coins} type="number" value={formData.budget} onChange={v => setFormData(p => ({...p, budget: v}))} />
            <SmartField label="Daily Burn Limit (₹)" icon={Coins} type="number" value={formData.dailyLimit} onChange={v => setFormData(p => ({...p, dailyLimit: v}))} />
          </motion.div>
        );
      case "Integrations":
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-1 gap-y-8">
            <div className="p-5 border border-slate-200 rounded-xl flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-4">
                <Share2 className="w-8 h-8 text-blue-600" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Meta Ads Integration</h4>
                  <p className="text-xs text-slate-500">Sync audiences and track ad performance</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  toast.loading("Connecting to Meta APIs...", { duration: 1500 });
                  setTimeout(() => {
                    setFormData(p => ({...p, metaConnected: !p.metaConnected}));
                    toast.success(formData.metaConnected ? "Meta disconnected." : "Meta connected successfully!");
                  }, 1500);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${formData.metaConnected ? 'bg-rose-100 text-rose-600 hover:bg-rose-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {formData.metaConnected ? "Disconnect" : "Connect Meta"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SmartSelect label="Third-Party Provider" icon={Share2} value={formData.provider} onChange={v => setFormData(p => ({...p, provider: v}))} options={["Local Agency", "Google Ads", "Meta Ads", "Internal CRM"]} />
              <SmartField label="Provider Commission (%)" icon={Coins} type="number" value={formData.commission} onChange={v => setFormData(p => ({...p, commission: v}))} />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 relative min-h-[calc(100vh-6rem)]">
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
            onClick={() => navigate("/campaigns")} 
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-brand-primary transition-colors mb-4 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Campaigns
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex items-center justify-center p-2 bg-white shadow-sm border border-slate-100 rounded-xl text-brand-primary">
              <Megaphone className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              {isEdit ? "Configure Campaign" : "New Advanced Campaign"}
            </h1>
          </div>
          <p className="text-[11px] text-slate-500 font-medium max-w-lg leading-relaxed">
            Manage rules, budgets, and meta integrations to run an efficient temple campaign.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 px-8">
         {/* Modern Sidebar Tabs */}
         <div className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => {
            const active = activeTab === tab;
            let TabIcon = Users;
            let tabDesc = "Personal information";
            if (tab === "General") { TabIcon = Megaphone; tabDesc = "Basic Details"; }
            if (tab === "Rules") { TabIcon = ShieldAlert; tabDesc = "Eligibility & Caps"; }
            if (tab === "Budget") { TabIcon = Coins; tabDesc = "Cost & Allocations"; }
            if (tab === "Integrations") { TabIcon = Share2; tabDesc = "External Platforms"; }

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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
                    <TabIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`text-[12px] font-bold tracking-tight transition-colors ${active ? 'text-brand-primary' : 'text-slate-700'}`}>
                      {tab}
                    </h3>
                    <p className={`text-[9px] font-medium transition-colors ${active ? 'text-slate-500' : 'text-slate-400'}`}>
                      {tabDesc}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
         </div>

         {/* Content Area */}
         <div className="lg:col-span-9 space-y-6">
            
            {/* Top info cards for context based on active tab */}
            {activeTab === 'General' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                 <div className="p-4 bg-brand-primary/10 rounded-2xl text-brand-primary shrink-0 hidden sm:block">
                    <Users className="w-8 h-8" />
                 </div>
                 <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-800">Audience Estimation</h3>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-md">We automatically calculate your estimated reach based on target audience filters.</p>
                 </div>
                 <div className="sm:ml-auto text-left sm:text-right sm:pr-4">
                    {isEstimating ? (
                      <div className="flex items-center gap-2 text-brand-primary animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-xs font-bold uppercase">Scanning...</span>
                      </div>
                    ) : estimatedReach !== null ? (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-2xl font-black text-brand-primary">
                        {estimatedReach.toLocaleString()} <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block sm:text-right mt-0.5">Estimated Reach</span>
                      </motion.div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">Select Audience</span>
                    )}
                 </div>
              </div>
            )}
            
            <form onSubmit={handleSave} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 overflow-hidden flex flex-col relative">
              <div className="p-6 sm:p-8 flex-1 relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab}>
                    {renderFormContent()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Premium Sticky Footer */}
              <div className="relative z-20 p-6 sm:px-12 sm:py-6 border-t border-slate-200/60 bg-white/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                <p className="text-[11px] font-semibold text-slate-400 text-center sm:text-left">
                  Configure thoroughly before deploying to production.
                </p>
                <div className="flex gap-4 w-full sm:w-auto">
                  <button type="button" onClick={() => navigate("/campaigns")} className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm">Cancel</button>
                  <button type="submit" disabled={!formData.name} className="flex-1 sm:flex-none px-8 py-3 text-sm bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 hover:bg-[#8e330b] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
                    <Save className="w-4 h-4" />
                    {isEdit ? "Update Configuration" : "Deploy Campaign"}
                  </button>
                </div>
              </div>
            </form>
         </div>
      </div>
    </div>
  );
};

export default CampaignForm;
