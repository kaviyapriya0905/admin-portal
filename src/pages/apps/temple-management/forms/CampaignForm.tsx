import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Users, Loader2, Megaphone, Mail, MessageSquare, ShieldAlert, Coins, Share2, CheckCircle2, CalendarDays, Lock } from "lucide-react";
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

  const renderLeftPanel = () => {
    switch (activeTab) {
      case "General":
        return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:sticky lg:top-24">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-primary" />
              Audience Reach
            </h3>
            {!formData.targetAudience ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Select Audience Filter</span>
              </div>
            ) : isEstimating ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-brand-primary flex flex-col items-center gap-2 animate-pulse">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Scanning Database...</span>
              </div>
            ) : estimatedReach !== null ? (
              <div className="p-5 bg-brand-primary/5 border border-brand-primary/20 rounded-xl animate-in zoom-in duration-300 text-center">
                <div className="text-3xl font-black text-brand-primary mb-1">{estimatedReach.toLocaleString()}</div>
                <h4 className="font-bold text-slate-700 text-xs">Estimated Matches</h4>
                <p className="text-slate-500 text-[10px] mt-2">These devotees will receive the broadcast.</p>
              </div>
            ) : null}
          </div>
        );
      case "Rules":
        return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:sticky lg:top-24">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Rule Restrictions
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs text-slate-500 font-medium">Daily Limit</span>
                <span className="text-xs font-bold text-slate-700">{formData.dailyParticipationLimit} entries</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs text-slate-500 font-medium">Eligibility</span>
                <span className="text-xs font-bold text-slate-700">{formData.eligibility}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs text-slate-500 font-medium">Approval Req</span>
                <span className="text-xs font-bold text-slate-700">{formData.approvalRequired}</span>
              </div>
            </div>
          </div>
        );
      case "Budget":
        return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:sticky lg:top-24">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-500" />
              Budget Health
            </h3>
            <div className="text-center p-5 bg-emerald-50 border border-emerald-100 rounded-xl mb-4">
              <div className="text-2xl font-black text-emerald-600 mb-1">₹{parseInt(formData.budget).toLocaleString()}</div>
              <h4 className="font-bold text-emerald-700 text-xs">Total Allocation</h4>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-500">Daily Burn Limit</span>
                <span className="font-bold text-slate-700">₹{parseInt(formData.dailyLimit).toLocaleString()}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${(parseInt(formData.dailyLimit) / parseInt(formData.budget)) * 100}%` }} />
              </div>
            </div>
          </div>
        );
      case "Integrations":
        return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:sticky lg:top-24">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-500" />
              Platform Status
            </h3>
            
            {formData.metaConnected ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-center flex flex-col items-center gap-2 mb-4">
                <Share2 className="w-8 h-8 text-blue-600" />
                <div className="flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase">Meta Linked</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center flex flex-col items-center gap-2 mb-4">
                <Share2 className="w-8 h-8 text-slate-400" />
                <span className="text-[11px] font-bold uppercase text-slate-500">Not Connected</span>
              </div>
            )}

            <div className="p-3 bg-white border border-slate-200 rounded-lg flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded-md"><Lock className="w-4 h-4 text-brand-primary" /></div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">API Provider</div>
                <div className="text-xs font-bold text-slate-700">{formData.provider}</div>
              </div>
            </div>
          </div>
        );
    }
  };

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
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="shrink-0 bg-[#fafafa] border-b border-slate-100 pb-4 mb-0 space-y-4">
        <div className="flex items-start sm:items-center gap-4">
          <button onClick={() => navigate("/campaigns")} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shrink-0 mt-1 sm:mt-0">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{isEdit ? "Configure Campaign" : "New Advanced Campaign"}</h1>
            <p className="text-xs sm:text-sm text-slate-500">Manage rules, budgets, and meta integrations</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar p-1.5 bg-white border border-slate-200 shadow-sm rounded-xl">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 px-4 py-2.5 text-sm font-bold rounded-lg whitespace-nowrap transition-all ${activeTab === t ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-6 py-6 pb-12 animate-in fade-in duration-500">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {renderLeftPanel()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col">
            <div className="pb-6">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}>
                  {renderFormContent()}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-4 mt-auto">
              <button type="button" onClick={() => navigate("/campaigns")} className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={!formData.name} className="w-full sm:w-auto px-6 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 hover:bg-[#8e330b] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                <Save className="w-5 h-5" />
                {isEdit ? "Update Configuration" : "Deploy Campaign"}
              </button>
            </div>
          </form>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignForm;
