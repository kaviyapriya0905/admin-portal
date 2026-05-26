import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Save, Building2, Calendar, CalendarSearch,
  Ban, CheckCircle, User, Clock, FileText,
  Users, Receipt, AlertCircle, Plus, PieChart, ShieldCheck, Phone, Mail, StickyNote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SmartField from "../../../../components/ui/SmartField";
import SmartSelect from "../../../../components/ui/SmartSelect";
import { useSelector } from "react-redux";
import { type RootState } from "../../../../redux/store";
import { getMockData, addMockItem, updateMockItem } from "../../../../utils/mockData";
import toast from "react-hot-toast";

// Hall catalog
const HALLS = [
  { id: "h1", name: "Kalyana Mandapam", tagline: "Grand Wedding Hall", basePrice: 25000, capacity: 500, facilities: ["AC", "Stage", "Catering Kitchen", "Parking"] },
  { id: "h2", name: "Mini Hall A", tagline: "Intimate Ceremony Space", basePrice: 8000, capacity: 100, facilities: ["AC", "Audio System", "Seating"] },
  { id: "h3", name: "Annadhanam Hall", tagline: "Community Feast Hall", basePrice: 5000, capacity: 300, facilities: ["Kitchen", "Long Tables", "Fans"] },
  { id: "h4", name: "Yagasala", tagline: "Sacred Ritual Grounds", basePrice: 12000, capacity: 150, facilities: ["Open Air", "Fire Pit", "Seating"] },
  { id: "h5", name: "Conference Room", tagline: "Meeting & Office Space", basePrice: 3000, capacity: 50, facilities: ["Projector", "AC", "Whiteboard"] },
];

const SLOT_OPTIONS = [
  { value: "full", label: "Full Day (6 AM – 6 AM Next Day)" },
  { value: "morning", label: "Morning Half (6 AM – 2 PM)" },
  { value: "evening", label: "Evening Half (3 PM – 11 PM)" },
];

const CATEGORY_OPTIONS = [
  "Marriage", "Upanayanam", "Engagement", "Private Party",
  "Religious Event", "Seemantham", "Annadhanam", "Corporate",
];

const ADDONS = [
  { id: "a1", title: "Catering Setup", desc: "Full kitchen setup with staff", price: 5000 },
  { id: "a2", title: "Decoration Package", desc: "Flowers, drapes, and lighting", price: 8000 },
  { id: "a3", title: "Audio / Sound System", desc: "PA system, mics, speakers", price: 3000 },
  { id: "a4", title: "Photography Crew", desc: "3-person photo + video team", price: 12000 },
  { id: "a5", title: "Generator Backup", desc: "24h power backup unit", price: 2000 },
  { id: "a6", title: "Valet Parking", desc: "Managed parking service", price: 2500 },
];

const STEPS = ["Select Venue", "Devotee Details", "Event Services", "Final Review"];

const RentalVenueForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [step, setStep] = useState(1);
  const [selectedHallId, setSelectedHallId] = useState("");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);

  const { temples, activeTempleId } = useSelector((state: RootState) => state.temple);

  const [formData, setFormData] = useState({
    // Step 1 - Venue & Schedule
    date: new Date().toISOString().split("T")[0],
    slot: "full",
    // Step 2 - Devotee Details
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    category: "",
    guests: "",
    notes: "",
    templeId: activeTempleId !== "all" ? activeTempleId : "",
  });

  const [conflictStatus, setConflictStatus] = useState<"idle" | "checking" | "clear" | "conflict">("idle");

  const selectedHall = HALLS.find(h => h.id === selectedHallId);

  // Load existing for edit
  useEffect(() => {
    if (isEdit) {
      const data = getMockData();
      const existing = (data as any).rentalVenues?.find((r: any) => r.id === id);
      if (existing) {
        const hall = HALLS.find(h => h.name === (existing.venue || existing.hall));
        if (hall) setSelectedHallId(hall.id);
        const nameParts = ((existing.booker || existing.bookerName || "")).split(" ");
        setFormData({
          date: (existing.date || "").split("T")[0] || new Date().toISOString().split("T")[0],
          slot: existing.slot || "full",
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          phone: existing.phone || "",
          email: existing.email || "",
          category: existing.category || existing.purpose || "",
          guests: String(existing.guests || ""),
          notes: existing.notes || "",
          templeId: existing.templeId || (activeTempleId !== "all" ? activeTempleId : ""),
        });
        setStep(1);
      }
    }
  }, [isEdit, id]);

  // Live conflict detection
  useEffect(() => {
    if (selectedHallId && formData.date) {
      setConflictStatus("checking");
      const timer = setTimeout(() => {
        const day = formData.date.slice(-2);
        if (day === "15" || day === "20") setConflictStatus("conflict");
        else setConflictStatus("clear");
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setConflictStatus("idle");
    }
  }, [selectedHallId, formData.date]);

  const summary = useMemo(() => {
    const basePrice = selectedHall ? (formData.slot === "full" ? selectedHall.basePrice : Math.round(selectedHall.basePrice * 0.6)) : 0;
    const surge = Math.round(basePrice * 0.2);
    const addOnsPrice = ADDONS.filter(a => selectedAddonIds.includes(a.id)).reduce((s, a) => s + a.price, 0);
    const total = basePrice + surge + addOnsPrice;
    return { basePrice, surge, addOnsPrice, total, advance: Math.round(total * 0.5) };
  }, [selectedHall, formData.slot, selectedAddonIds]);

  const handleNext = () => {
    if (step === 1) {
       
       if (!selectedHallId) { toast.error("Please select a venue"); return; }
    }
    if (step === 2) {
      
      
      
    }
    setStep(s => s + 1);
  };

  const handleSave = () => {
    if (conflictStatus === "conflict") { toast.error("Cannot book: scheduling conflict on this date!"); return; }

    const newBooking = {
      id: id || `RV-${Math.floor(Math.random() * 10000)}`,
      hall: selectedHall?.name || "",
      venue: selectedHall?.name || "",
      booker: `${formData.firstName} ${formData.lastName}`.trim(),
      bookerName: `${formData.firstName} ${formData.lastName}`.trim(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      date: formData.date,
      slot: formData.slot,
      category: formData.category,
      purpose: formData.category,
      guests: Number(formData.guests) || 0,
      notes: formData.notes,
      addons: selectedAddonIds,
      basePrice: summary.basePrice,
      total: summary.total,
      advance: summary.advance,
      status: "Confirmed",
      templeId: formData.templeId,
      templeName: temples.find(t => t.id === formData.templeId)?.name || "Unknown Temple",
    };

    if (isEdit && id) {
      updateMockItem("rentalVenues", id, newBooking);
      toast.success("Booking updated!");
    } else {
      addMockItem("rentalVenues", newBooking);
      toast.success("Venue booked successfully!");
    }
    navigate("/rental-venue");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="shrink-0 bg-[#fafafa] border-b border-slate-100 pb-4 mb-0 space-y-4">
        <div className="flex items-start sm:items-center gap-4">
          <button onClick={() => navigate("/rental-venue")} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shrink-0 mt-1 sm:mt-0">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-primary" />
              {isEdit ? "Modify Hall Booking" : "Hall Booking Wizard"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Inventory Availability & Slot Validation · Step {step} of 4
            </p>
          </div>
        </div>

        {/* Step Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center gap-2">
            {STEPS.map((label, i) => {
              const s = i + 1;
              const active = step === s;
              const done = step > s;
              return (
                <React.Fragment key={s}>
                  <div className={`flex items-center gap-2 flex-1 ${s > 1 ? "" : ""}`}>
                    {s > 1 && <div className={`flex-1 h-0.5 rounded-full ${done ? "bg-brand-primary" : "bg-slate-200"}`} />}
                    <div className={`flex items-center gap-2 ${s > 1 ? "" : "ml-0"}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${done ? "bg-brand-primary text-white" : active ? "bg-brand-primary text-white ring-4 ring-brand-primary/20" : "bg-slate-100 text-slate-400"}`}>
                        {done ? <CheckCircle className="w-4 h-4" /> : s}
                      </div>
                      <span className={`text-[11px] font-bold hidden sm:block ${active ? "text-brand-primary" : done ? "text-slate-600" : "text-slate-400"}`}>{label}</span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-6 py-6 pb-12 animate-in fade-in duration-500">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar */}
        <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-0 self-start">
          {/* Availability Checker */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <CalendarSearch className="w-4 h-4 text-brand-primary" /> Live Availability
            </h3>
            <p className="text-[11px] text-slate-400 mb-5">Real-time conflict detection across all hall schedules.</p>

            {conflictStatus === "idle" && (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Select Venue & Date</span>
              </div>
            )}
            {conflictStatus === "checking" && (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center text-brand-primary animate-pulse">
                <span className="text-[10px] font-bold uppercase tracking-wider">Checking Master Schedule...</span>
              </div>
            )}
            {conflictStatus === "clear" && (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle className="w-7 h-7 text-emerald-500 mb-2" />
                <h4 className="font-bold text-emerald-700 text-sm mb-1">Venue Available</h4>
                <p className="text-emerald-600 text-[11px]">No conflicts detected for this date and venue.</p>
              </div>
            )}
            {conflictStatus === "conflict" && (
              <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl">
                <Ban className="w-7 h-7 text-rose-500 mb-2" />
                <h4 className="font-bold text-rose-700 text-sm mb-1">Scheduling Conflict</h4>
                <p className="text-rose-600 text-[11px]">This venue is already booked on the selected date. Choose another date or venue.</p>
              </div>
            )}

            {selectedHall && (
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Selection Summary</p>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-emerald-100 shadow-sm flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-slate-800">{selectedHall.name}</p>
                    <p className="text-[10px] font-bold text-emerald-600">₹{selectedHall.basePrice.toLocaleString()} / slot</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Billing Summary (shown from step 3 onwards) */}
          {step >= 3 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-500" /> Billable Summary
              </h3>
              <div className="space-y-3 mb-4">
                {[
                  { label: "Base Venue Rental", value: summary.basePrice },
                  { label: "Festival Surge (20%)", value: summary.surge, highlight: true },
                  { label: "Additional Services", value: summary.addOnsPrice },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className={`text-[11px] font-bold ${highlight ? "text-orange-600" : "text-slate-500"}`}>{label}</span>
                    <span className={`text-[12px] font-bold ${highlight ? "text-orange-600" : "text-slate-800"}`}>₹{value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-3 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-black text-slate-800">Gross Total</span>
                  <span className="text-xl font-black text-slate-900">₹{summary.total.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-brand-primary/5 border border-brand-primary/10 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-[11px] font-bold text-brand-primary">Required Advance</p>
                  <p className="text-[10px] text-brand-primary/60">50% Commitment Fee</p>
                </div>
                <p className="text-lg font-black text-brand-primary">₹{summary.advance.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: Select Venue */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><Calendar className="w-4 h-4 text-indigo-600" /></span>
                    Search Filters & Linkage
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <SmartSelect label="Linked Temple Unit" icon={Building2}  value={formData.templeId} onChange={v => setFormData(p => ({...p, templeId: v}))} options={temples.map(t => ({ value: t.id, label: t.name }))} />
                    </div>
                    <SmartField
                      label="Event Date"
                      icon={Calendar}
                      type="date"
                      
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.date}
                      onChange={v => setFormData(p => ({ ...p, date: v }))}
                    />
                    <SmartSelect
                      label="Preferred Slot"
                      icon={Clock}
                      value={formData.slot}
                      onChange={v => setFormData(p => ({ ...p, slot: v }))}
                      options={SLOT_OPTIONS}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><Building2 className="w-4 h-4 text-emerald-600" /></span>
                    Available Halls
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {HALLS.map(hall => (
                      <button
                        key={hall.id}
                        type="button"
                        onClick={() => setSelectedHallId(hall.id)}
                        className={`text-left p-5 rounded-xl border transition-all ${selectedHallId === hall.id ? "border-brand-primary ring-4 ring-brand-primary/10 bg-brand-primary/5" : "border-slate-200 hover:border-brand-primary/30 bg-white"}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold text-slate-800 text-[13px]">{hall.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{hall.tagline}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[11px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-lg">₹{hall.basePrice.toLocaleString()}</span>
                            {selectedHallId === hall.id && <CheckCircle className="w-4 h-4 text-brand-primary" />}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[10px] text-slate-500 font-semibold">Up to {hall.capacity} guests</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {hall.facilities.slice(0, 3).map(f => (
                            <span key={f} className="text-[9px] bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg font-semibold text-slate-500">{f}</span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Devotee Details */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><User className="w-4 h-4 text-indigo-600" /></span>
                    Devotee Attribution
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <SmartField
                      label="First Name"
                      icon={User}
                      
                      value={formData.firstName}
                      onChange={v => setFormData(p => ({ ...p, firstName: v }))}
                      formatter={v => v.replace(/\b\w/g, l => l.toUpperCase())}
                    />
                    <SmartField
                      label="Last Name"
                      icon={User}
                      value={formData.lastName}
                      onChange={v => setFormData(p => ({ ...p, lastName: v }))}
                      formatter={v => v.replace(/\b\w/g, l => l.toUpperCase())}
                    />
                    <SmartField
                      label="Mobile Number"
                      icon={Phone}
                      
                      type="tel"
                      value={formData.phone}
                      onChange={v => setFormData(p => ({ ...p, phone: v }))}
                    />
                    <SmartField
                      label="Email (Optional)"
                      icon={Mail}
                      type="email"
                      value={formData.email}
                      onChange={v => setFormData(p => ({ ...p, email: v }))}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><FileText className="w-4 h-4 text-amber-600" /></span>
                    Event Parameters
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <SmartSelect
                      label="Event Category"
                      icon={FileText}
                      
                      value={formData.category}
                      onChange={v => setFormData(p => ({ ...p, category: v }))}
                      options={CATEGORY_OPTIONS}
                    />
                    <SmartField
                      label="Expected Guest Count"
                      icon={Users}
                      type="number"
                      value={formData.guests}
                      onChange={v => setFormData(p => ({ ...p, guests: v }))}
                      helperText="No. of expected attendees"
                    />
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 block">
                        <StickyNote className="w-3 h-3" /> Special Requirements
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                        placeholder="Notes for temple administration..."
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-800 outline-none transition-all focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/10 focus:bg-white resize-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Add-ons */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><Plus className="w-4 h-4 text-emerald-600" /></span>
                    Optional Services & Add-ons
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ADDONS.map(addon => {
                      const active = selectedAddonIds.includes(addon.id);
                      return (
                        <label
                          key={addon.id}
                          className={`flex items-start gap-4 p-5 rounded-xl border transition-all cursor-pointer ${active ? "border-brand-primary ring-4 ring-brand-primary/10 bg-brand-primary/5" : "border-slate-200 hover:border-brand-primary/30 bg-white"}`}
                        >
                          <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${active ? "bg-brand-primary border-brand-primary" : "border-slate-200"}`}>
                            {active && <Plus className="w-3.5 h-3.5 text-white" />}
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={active}
                              onChange={() => setSelectedAddonIds(prev => active ? prev.filter(i => i !== addon.id) : [...prev, addon.id])}
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className={`font-bold text-[13px] ${active ? "text-brand-primary" : "text-slate-800"}`}>{addon.title}</span>
                              <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-md">₹{addon.price.toLocaleString()}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium">{addon.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  <div className="mt-6 p-5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <PieChart className="w-5 h-5 text-brand-primary" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Add-ons Total</p>
                        <p className="text-xl font-black text-slate-900">₹{summary.addOnsPrice.toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500">{selectedAddonIds.length} services selected</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Final Review */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><Receipt className="w-4 h-4 text-indigo-600" /></span>
                    Verification Audit
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "Primary Devotee", value: `${formData.firstName} ${formData.lastName}`.trim() || "(Unassigned)", icon: Users },
                      { label: "Selected Venue", value: selectedHall?.name || "TBD", icon: Building2 },
                      { label: "Temporal Schedule", value: `${formData.date} · ${SLOT_OPTIONS.find(s => s.value === formData.slot)?.label || formData.slot}`, icon: Calendar },
                      { label: "Event Category", value: formData.category || "—", icon: FileText },
                      { label: "Attendance", value: formData.guests ? `${formData.guests} Guests` : "—", icon: Users },
                      { label: "Contact", value: formData.phone || "—", icon: Phone },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-100 hover:border-brand-primary/20 transition-all shadow-sm group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-brand-primary/5 transition-colors">
                            <Icon className="w-4 h-4 text-slate-500 group-hover:text-brand-primary" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                        </div>
                        <span className="text-[12px] font-bold text-slate-800 truncate max-w-[180px]">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Financial Policy */}
                  <div className="mt-6 bg-brand-primary rounded-xl p-5 flex items-start gap-4">
                    <div className="p-2 bg-brand-secondary rounded-lg">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white mb-1">Financial Policy</p>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        A mandatory <strong className="text-white">50% advance</strong> is required to lock the slot.
                        Cancellation within 48 hours is non-refundable.
                      </p>
                    </div>
                  </div>

                  {/* Draft Receipt */}
                  <div className="mt-4 flex items-center gap-2 text-slate-500">
                    <Receipt className="w-4 h-4" />
                    <p className="text-[10px] font-bold uppercase tracking-wider">
                      Draft Receipt ID: TEMP_BK_{new Date().getTime().toString().slice(-6)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Navigation */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => step > 1 ? setStep(s => s - 1) : navigate("/rental-venue")}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {step > 1 ? "Back" : "Cancel"}
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={step === 1 && conflictStatus === "conflict"}
                className="w-full sm:w-auto px-8 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 hover:bg-[#8e330b] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Continue Phase <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={conflictStatus === "conflict"}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                Confirm & Pay Advance
              </button>
            )}
          </div>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default RentalVenueForm;
