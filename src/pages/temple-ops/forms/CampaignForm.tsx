import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Megaphone, ShieldAlert, Target, CalendarDays, CheckCircle2, ChevronRight, MessageSquare, Mail, Smartphone, Users as UsersIcon, AlertTriangle, Coins } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import SmartField from "@/components/ui/SmartField";
import SmartSelect from "@/components/ui/SmartSelect";
import SmartTextarea from "@/components/ui/SmartTextarea";
import { useDispatch, useSelector } from "react-redux";
import { addCampaign, updateCampaign, type Campaign } from "@/store/slices/campaignSlice";
import { type RootState } from "@/store/store";
import { getMockData } from "@/utils/mockData";

const STEPS = ["Campaign Details", "Review & Submit"];

const CampaignForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = !!id;

  const { activeTempleId, temples } = useSelector((state: RootState) => state.temple);
  const providerCosts = useSelector((state: RootState) => state.provider.costs);
  const activeTempleName = temples.find(t => t.id === activeTempleId)?.name || "Unknown Temple";

  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: "",
    description: "",
    type: "Donation",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    targetAmount: 50000,
    status: "Draft",
    visibility: "Public",
    paymentGateway: "Razorpay",
    priority: "Medium",
    dailyBudget: 5000,
    providerCost: 0,
    minDonation: 100,
    categories: ["General"],
    channels: ["Email"],
    audienceCount: 1000,
  });

  const perMessageCost = (formData.channels || []).reduce((sum, channel) => sum + (providerCosts[channel as keyof typeof providerCosts] || 0), 0);
  const estimatedCost = (formData.audienceCount || 0) * perMessageCost;
  const isOverBudget = estimatedCost > 10000;

  useEffect(() => {
    if (isEdit) {
      // Simulate fetch from real API if it was redone, or just mock data
      const data = getMockData();
      const existing = data.campaigns.find(c => c.id === id);
      if (existing) {
        setFormData({
          name: existing.name as string || "",
          type: (existing.type as Campaign["type"]) || "Donation",
          startDate: new Date().toISOString().split('T')[0],
          endDate: (existing.end as string) || "",
          targetAmount: parseInt((existing.budget as string) || "50000"),
          description: existing.funds as string || "",
          visibility: "Public",
          priority: "Medium",
          dailyBudget: parseInt(existing.dailyLimit as string || "5000"),
          status: (existing.status as Campaign["status"]) || "Draft",
        });
      }
    }
  }, [isEdit, id]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== STEPS.length - 1) return;

    const newCampaign: Campaign = {
      id: id || `CMP-${Math.floor(Math.random() * 1000)}`,
      name: formData.name || "Untitled",
      description: formData.description || "",
      type: formData.type as Campaign["type"] || "Donation",
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      endDate: formData.endDate || "2026-12-31",
      targetAmount: formData.targetAmount || 50000,
      status: "Pending Approval", // Send to Super Admin for approval
      visibility: formData.visibility,
      paymentGateway: formData.paymentGateway,
      priority: formData.priority,
      dailyBudget: formData.dailyBudget,
      providerCost: formData.providerCost,
      minDonation: formData.minDonation,
      fundsRaised: 0,
      expenses: [],
      transactions: [],
      templeId: activeTempleId === "all" ? undefined : activeTempleId,
      templeName: activeTempleId === "all" ? undefined : activeTempleName,
      channels: formData.channels || [],
      audienceCount: formData.audienceCount,
      estimatedCost: estimatedCost,
    };

    if (isEdit && id) {
      dispatch(updateCampaign(newCampaign));
      toast.success("Campaign updated successfully!");
    } else {
      dispatch(addCampaign(newCampaign));
      toast.success("Campaign submitted for Super Admin approval!");
    }
    navigate("/campaigns");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
            <div className="sm:col-span-2">
              <SmartField label="Campaign Name" icon={Megaphone} value={formData.name || ""} onChange={v => setFormData(p => ({ ...p, name: v }))} required />
            </div>
            <SmartSelect label="Campaign Type" icon={Target} value={formData.type || "Donation"} onChange={v => setFormData(p => ({ ...p, type: v as any }))} options={["Donation", "Event", "Festival", "Annadhanam", "Renovation"]} />
            <SmartField label="Target Amount (₹)" type="number" icon={Coins} value={formData.targetAmount?.toString() || ""} onChange={v => setFormData(p => ({ ...p, targetAmount: parseInt(v) || 0 }))} />

            <SmartField label="Start Date" icon={CalendarDays} type="date" value={formData.startDate || ""} onChange={v => setFormData(p => ({ ...p, startDate: v }))} />
            <SmartField label="End Date" icon={CalendarDays} type="date" value={formData.endDate || ""} onChange={v => setFormData(p => ({ ...p, endDate: v }))} />

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Outreach Channels</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { id: "SMS", label: "SMS Broadcast", icon: MessageSquare },
                  { id: "WhatsApp", label: "WhatsApp Campaign", icon: Smartphone },
                  { id: "Email", label: "Email Newsletter", icon: Mail },
                ].map((channel) => {
                  const isSelected = formData.channels?.includes(channel.id);
                  const Icon = channel.icon;
                  return (
                    <div
                      key={channel.id}
                      onClick={() => {
                        const current = formData.channels || [];
                        const updated = current.includes(channel.id)
                          ? current.filter(c => c !== channel.id)
                          : [...current, channel.id];
                        setFormData(p => ({ ...p, channels: updated }));
                      }}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="font-semibold text-sm text-slate-700">{channel.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <SmartField label="Target Audience Count" type="number" icon={UsersIcon} value={formData.audienceCount?.toString() || ""} onChange={v => setFormData(p => ({ ...p, audienceCount: parseInt(v) || 0 }))} />

            <div className="sm:col-span-2">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-6">Estimated Outreach Cost</h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Audience</div>
                    <div className="font-semibold text-slate-800">{formData.audienceCount?.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Cost / Message</div>
                    <div className="font-semibold text-slate-800">₹{perMessageCost.toFixed(2)}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Est. Cost</div>
                    <div className={`font-bold text-lg ${isOverBudget ? 'text-rose-600' : 'text-blue-600'}`}>₹{estimatedCost.toLocaleString()}</div>
                  </div>
                </div>

                {isOverBudget && (
                  <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-800">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="text-xs font-medium">
                      Warning: The estimated outreach cost exceeds the standard ₹10,000 threshold. Ensure sufficient budget is allocated.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <SmartTextarea label="Description / Cause" required rows={3} value={formData.description || ""} onChange={v => setFormData(p => ({ ...p, description: v }))} />
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-4 text-amber-800">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Approval Required</h4>
                <p className="text-xs mt-1">This campaign will be submitted to the Super Admin for review. It will not be active until approved.</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Name</span>
                <span className="font-bold text-slate-800">{formData.name}</span>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Type</span>
                <span className="font-bold text-slate-800">{formData.type}</span>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Target</span>
                <span className="font-bold text-emerald-600">₹{formData.targetAmount?.toLocaleString()}</span>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Channels</span>
                <div className="flex gap-1 mt-1">
                  {formData.channels?.map(c => (
                    <span key={c} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold">{c}</span>
                  )) || <span className="text-slate-400 text-[9px]">None</span>}
                </div>
              </div>
              <div>
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Est. Outreach Cost</span>
                <span className={`font-bold ${isOverBudget ? 'text-rose-600' : 'text-slate-800'}`}>₹{estimatedCost.toLocaleString()}</span>
              </div>
              <div className="col-span-2 mt-2">
                <span className="block text-slate-400 text-[10px] font-bold uppercase tracking-wider">Description</span>
                <span className="font-medium text-slate-700">{formData.description || "N/A"}</span>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12 relative min-h-[calc(100vh-6rem)]">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="pt-8 px-4">
        <button type="button" onClick={() => navigate("/campaigns")} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-brand-primary transition-colors mb-4 uppercase tracking-wider">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Campaigns
        </button>

        <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
          {isEdit ? "Edit Campaign" : "Create New Campaign"}
        </h1>
        <p className="text-[12px] text-slate-500 font-medium max-w-lg mt-1">
          {activeTempleId !== "all" ? `Linking to ${activeTempleName}` : "Creating a global trust campaign"}
        </p>

        {/* Wizard Progress */}
        <div className="flex items-center gap-2 mt-8">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep >= idx ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'bg-slate-100 text-slate-400'}`}>
                  {currentStep > idx ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider hidden sm:block ${currentStep >= idx ? 'text-brand-primary' : 'text-slate-400'}`}>
                  {step}
                </span>
              </div>
              {idx < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300 mx-1" />}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col relative mx-4">
        <div className="p-8 sm:p-12 flex-1 relative z-10 min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep}>
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm disabled:opacity-50"
          >
            Back
          </button>
          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-2.5 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/20 hover:bg-[#8e330b] transition-all text-sm disabled:opacity-50"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              className="px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Submit for Approval
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CampaignForm;
