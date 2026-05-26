import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Building2, LayoutGrid, Calendar, FileText, CheckCircle, Activity, ShieldCheck, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import SmartField from "../../../../components/ui/SmartField";
import SmartSelect from "../../../../components/ui/SmartSelect";
import { getMockData, addMockItem, updateMockItem } from "../../../../utils/mockData";

const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor'];
const MAINTENANCE_STATUSES = ['Up to Date', 'Due Soon', 'Overdue'];

const AssetForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    purchaseDate: new Date().toISOString().split('T')[0],
    condition: "",
    maintenanceStatus: "",
    notes: "",
  });

  const [auditStatus, setAuditStatus] = useState<"idle" | "evaluating" | "passed" | "warning">("idle");

  useEffect(() => {
    if (isEdit && id) {
      const data = getMockData();
      const existing = (data as any).assets?.find((a: any) => a.id === id);
      if (existing) {
        setFormData({
          name: existing.name || existing.assetName || "",
          category: existing.category || "",
          purchaseDate: (existing.purchaseDate || existing.date || new Date().toISOString()).split('T')[0],
          condition: existing.condition || existing.status || "",
          maintenanceStatus: existing.maintenanceStatus || "",
          notes: existing.notes || "",
        });
      }
    }
  }, [isEdit, id]);

  // Real-time Scenario: Live Audit Evaluation based on Condition and Maintenance Status
  useEffect(() => {
    if (formData.condition && formData.maintenanceStatus) {
      setAuditStatus("evaluating");
      const timer = setTimeout(() => {
        if (formData.condition === "Poor" || formData.maintenanceStatus === "Overdue") {
          setAuditStatus("warning");
        } else {
          setAuditStatus("passed");
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setAuditStatus("idle");
    }
  }, [formData.condition, formData.maintenanceStatus]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAsset = {
      id: id || `AST-${Math.floor(Math.random() * 10000)}`,
      name: formData.name,
      assetName: formData.name,
      category: formData.category,
      purchaseDate: formData.purchaseDate,
      date: formData.purchaseDate,
      condition: formData.condition,
      status: formData.condition,
      maintenanceStatus: formData.maintenanceStatus,
      notes: formData.notes,
      templeId: "t1",
    };

    if (isEdit && id) {
      updateMockItem("assets", id, newAsset);
      toast.success("Asset profile updated!");
    } else {
      addMockItem("assets", newAsset);
      toast.success("Asset added to registry!");
    }
    navigate("/assets");
  };

  const requiredFields = ['name', 'category', 'purchaseDate', 'condition', 'maintenanceStatus'];
  const completedFields = requiredFields.filter(f => formData[f as keyof typeof formData] && formData[f as keyof typeof formData].length > 0);
  const progressPercent = (completedFields.length / requiredFields.length) * 100;

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="shrink-0 bg-[#fafafa] border-b border-slate-100 pb-4 mb-0 flex items-start sm:items-center gap-4">
        <button onClick={() => navigate("/assets")} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shrink-0 mt-1 sm:mt-0">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{isEdit ? "Modify Asset Profile" : "Register New Asset"}</h1>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Protocol · Registry v3.4
          </p>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-6 py-6 pb-12 animate-in fade-in duration-500">

      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-8">
        <motion.div className="h-full bg-brand-primary" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-0 self-start">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-primary" />
              Live Audit Status
            </h3>
            <p className="text-[11px] text-slate-400 mb-5">Automated evaluation based on condition & maintenance.</p>
            
            {auditStatus === "idle" && (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Select Condition & Status</span>
              </div>
            )}

            {auditStatus === "evaluating" && (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center text-brand-primary animate-pulse">
                <span className="text-[10px] font-bold uppercase tracking-wider">Evaluating Risk Matrix...</span>
              </div>
            )}
            
            {auditStatus === "passed" && (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl animate-in zoom-in duration-300">
                <CheckCircle className="w-7 h-7 text-emerald-500 mb-2" />
                <h4 className="font-bold text-emerald-700 text-sm mb-1">Audit Cleared</h4>
                <p className="text-emerald-600 text-[11px]">Asset meets required compliance for condition and maintenance cycles.</p>
              </div>
            )}

            {auditStatus === "warning" && (
              <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl animate-in zoom-in duration-300">
                <AlertCircle className="w-7 h-7 text-rose-500 mb-2" />
                <h4 className="font-bold text-rose-700 text-sm mb-1">Action Required</h4>
                <p className="text-rose-600 text-[11px]">Asset requires immediate attention. Overdue maintenance or poor physical condition detected.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
            
            {/* Section 1: Identification */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-5 bg-brand-primary rounded-full" />
                <h2 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  Asset Identification
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <div className="sm:col-span-2">
                  <SmartField
                    label="Asset Designation"
                    icon={Building2}
                    
                    value={formData.name}
                    onChange={v => setFormData(p => ({...p, name: v}))}
                    placeholder="e.g. Suvarna Gopuram Entrance Door"
                    validationFn={v => v.length > 2 ? true : null}
                  />
                </div>

                <SmartField
                  label="Capital Category"
                  icon={LayoutGrid}
                  
                  value={formData.category}
                  onChange={v => setFormData(p => ({...p, category: v}))}
                  placeholder="e.g. Infrastructure, Sacred Items"
                />

                <SmartField
                  label="Acquisition Date"
                  icon={Calendar}
                  
                  type="date"
                  value={formData.purchaseDate}
                  onChange={v => setFormData(p => ({...p, purchaseDate: v}))}
                />
              </div>
            </div>

            <div className="w-full h-px bg-slate-100" />

            {/* Section 2: Condition Audit Status */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-5 bg-amber-500 rounded-full" />
                <h2 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
                  Condition Audit Status
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <SmartSelect
                  label="Physical Condition Profile"
                  icon={CheckCircle}
                  
                  value={formData.condition}
                  onChange={v => setFormData(p => ({...p, condition: v}))}
                  options={CONDITIONS}
                />

                <SmartSelect
                  label="Maintenance Cycle Status"
                  icon={Activity}
                  
                  value={formData.maintenanceStatus}
                  onChange={v => setFormData(p => ({...p, maintenanceStatus: v}))}
                  options={MAINTENANCE_STATUSES}
                />

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 block">
                    <FileText className="w-3.5 h-3.5" /> Audit Notes & Locational Details
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Specify exact location within temple premises, serial numbers, or detailed maintenance history..."
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-800 outline-none transition-all focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/10 focus:bg-white resize-none shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-4">
              <button type="button" onClick={() => navigate("/assets")} className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
              <button type="submit" disabled={progressPercent < 100} className="w-full sm:w-auto px-8 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 hover:bg-[#8e330b] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                <Save className="w-5 h-5" />
                {isEdit ? "Update Asset Profile" : "Finalize Asset Registry"}
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

export default AssetForm;
