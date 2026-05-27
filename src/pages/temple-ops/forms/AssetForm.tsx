import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, CheckCircle, Activity, ShieldCheck, AlertCircle, Package, Tag, Calendar, Settings, ActivitySquare, StickyNote } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import SmartField from "@/components/ui/SmartField";
import SmartSelect from "@/components/ui/SmartSelect";
import SmartTextarea from "@/components/ui/SmartTextarea";
import { getMockData, addMockItem, updateMockItem } from "@/utils/mockData";

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



  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-6 pb-12 relative min-h-[calc(100vh-6rem)]">
      {/* Decorative Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-200/40 to-transparent pointer-events-none -z-10 rounded-3xl" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-slate-400/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 py-4 sm:py-4 px-4 sm:px-4"
      >
        <div>
          <button
            type="button"
            onClick={() => navigate("/assets")}
            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-brand-primary transition-colors mb-4 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Assets
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="inline-flex items-center justify-center p-2 bg-white shadow-sm border border-slate-100 rounded-xl text-brand-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
              {isEdit ? "Modify Asset Profile" : "Register New Asset"}
            </h1>
          </div>
          <p className="text-[11px] text-slate-500 font-medium max-w-lg leading-relaxed">
            Secure Protocol · Registry v3.4. Define capital category, evaluate condition, and manage maintenance cycles.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-6 lg:gap-14 px-6 sm:px-6">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-primary" />
              Live Audit Status
            </h3>
            <p className="text-[10px] text-slate-400 mb-4">Automated evaluation based on condition & maintenance.</p>

            {auditStatus === "idle" && (
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl text-center text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Select Condition & Status</span>
              </div>
            )}

            {auditStatus === "evaluating" && (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center text-brand-primary animate-pulse">
                <span className="text-[10px] font-bold uppercase tracking-wider">Evaluating Risk Matrix...</span>
              </div>
            )}

            {auditStatus === "passed" && (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl animate-in zoom-in duration-300">
                <CheckCircle className="w-7 h-7 text-emerald-500 mb-2" />
                <h4 className="font-bold text-emerald-700 text-sm mb-1">Audit Cleared</h4>
                <p className="text-emerald-600 text-[11px]">Asset meets required compliance for condition and maintenance cycles.</p>
              </div>
            )}

            {auditStatus === "warning" && (
              <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl animate-in zoom-in duration-300">
                <AlertCircle className="w-7 h-7 text-rose-500 mb-2" />
                <h4 className="font-bold text-rose-700 text-sm mb-1">Action Required</h4>
                <p className="text-rose-600 text-[11px]">Asset requires immediate attention. Overdue maintenance or poor physical condition detected.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          <form onSubmit={handleSave} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 overflow-hidden flex flex-col relative">
            <div className="p-6 sm:p-8 flex-1 relative z-10 space-y-6 sm:space-y-6">

              {/* Section 1: Identification */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Asset Identification
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                  <div className="sm:col-span-2">
                    <SmartField
                      label="Asset Designation"
                      icon={Package}
                      value={formData.name}
                      onChange={(v) => setFormData(p => ({ ...p, name: v }))}
                      placeholder="e.g. Suvarna Gopuram Entrance Door"
                    />
                  </div>

                  <SmartField
                    label="Capital Category"
                    icon={Tag}
                    value={formData.category}
                    onChange={(v) => setFormData(p => ({ ...p, category: v }))}
                    placeholder="e.g. Infrastructure, Sacred Items"
                  />

                  <SmartField
                    label="Acquisition Date"
                    icon={Calendar}
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(v) => setFormData(p => ({ ...p, purchaseDate: v }))}
                  />
                </div>
              </div>

              <div className="w-full h-px bg-slate-100" />

              {/* Section 2: Condition Audit Status */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Condition Audit Status
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                  <SmartSelect
                    label="Physical Condition Profile"
                    icon={ActivitySquare}
                    value={formData.condition}
                    onChange={(v) => setFormData(p => ({ ...p, condition: v }))}
                    options={CONDITIONS}
                  />

                  <SmartSelect
                    label="Maintenance Cycle Status"
                    icon={Settings}
                    value={formData.maintenanceStatus}
                    onChange={(v) => setFormData(p => ({ ...p, maintenanceStatus: v }))}
                    options={MAINTENANCE_STATUSES}
                  />

                  <div className="sm:col-span-2">
                    <SmartTextarea
                      label="Audit Notes & Locational Details"
                      icon={StickyNote}
                      value={formData.notes}
                      onChange={(v) => setFormData(p => ({ ...p, notes: v }))}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Sticky Footer */}
            <div className="relative z-20 p-6 sm:px-6 border-t border-slate-200/60 bg-white/90 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
              <p className="text-[11px] font-semibold text-slate-400 text-center sm:text-left">
                Ensure all required fields are accurately filled.
              </p>
              <div className="flex gap-4 w-full sm:w-auto">
                <button type="button" onClick={() => navigate("/assets")} className="flex-1 sm:flex-none px-5 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm">Cancel</button>
                <button type="submit" className="flex-1 sm:flex-none px-5 sm:px-6 py-3 text-sm bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 hover:bg-[#8e330b] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0">
                  <Save className="w-4 h-4" />
                  {isEdit ? "Update Asset Profile" : "Finalize Asset Registry"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssetForm;
