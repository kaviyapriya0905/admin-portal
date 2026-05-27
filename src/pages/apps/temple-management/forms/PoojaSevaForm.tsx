import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Star, AlertTriangle, MoonStar, Sparkles, User, CalendarDays, Clock, Users, StickyNote, CreditCard, Ticket, ShieldCheck, Phone, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { type RootState } from "../../../../redux/store";
import SmartField from "../../../../components/ui/SmartField";
import SmartSelect from "../../../../components/ui/SmartSelect";
import { getMockData, addMockItem, updateMockItem } from "../../../../utils/mockData";

const POOJA_CATALOG = [
  { name: "Archana", amount: 100 },
  { name: "Abhishekam", amount: 500 },
  { name: "Rudrabhishekam", amount: 1100 },
  { name: "Kalyanam", amount: 2500 },
  { name: "Sahasranamam", amount: 750 },
  { name: "Homam", amount: 3000 },
  { name: "Ashtotharam", amount: 250 },
  { name: "Annadanam Seva", amount: 5000 },
];

const SLOT_OPTIONS = [
  "6:00 AM - 7:00 AM",
  "7:00 AM - 8:00 AM",
  "8:00 AM - 9:00 AM",
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "4:00 PM - 5:00 PM",
  "5:00 PM - 6:00 PM",
  "6:00 PM - 7:00 PM",
  "7:00 PM - 8:00 PM",
];

const PRIEST_OPTIONS = [
  "Auto-Assign based on availability",
  "Priest Sharma",
  "Priest Bhat",
  "Priest Rao",
  "Priest Venkataraman",
];

const PoojaSevaForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { temples, activeTempleId } = useSelector((state: RootState) => state.temple);

  const [formData, setFormData] = useState({
    devoteeId: "",
    devoteeName: "",
    phone: "",
    poojaType: "",
    date: new Date().toISOString().split("T")[0],
    slot: "",
    priestName: "",
    paymentStatus: "Pending",
    bookingStatus: "Confirmed",
    amount: 0,
    notes: "",
    templeId: activeTempleId !== "all" ? activeTempleId : "",
  });

  const [devoteeSearch, setDevoteeSearch] = useState("");
  const [devoteeResults, setDevoteeResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [panchangStatus, setPanchangStatus] = useState<"idle" | "auspicious" | "rahu">("idle");

  const allDevotees = useMemo(() => getMockData().devotees || [], []);

  useEffect(() => {
    if (devoteeSearch.length > 1) {
      const results = allDevotees.filter((d: any) => {
        const name = (d.name || `${d.first_name || ""} ${d.last_name || ""}`).toLowerCase();
        return name.includes(devoteeSearch.toLowerCase()) || (d.phone || "").includes(devoteeSearch);
      }).slice(0, 6);
      setDevoteeResults(results);
      setShowDropdown(results.length > 0);
    } else {
      setShowDropdown(false);
    }
  }, [devoteeSearch, allDevotees]);

  useEffect(() => {
    if (isEdit) {
      const data = getMockData();
      const existing = data.poojaSevas.find((p: any) => p.id === id);
      if (existing) {
        const name = (existing as any).devoteeName || (existing as any).devotee || "";
        setFormData({
          devoteeId: (existing as any).devoteeId || "",
          devoteeName: name,
          phone: (existing as any).phone || "",
          poojaType: (existing as any).poojaType || (existing as any).name || (existing as any).seva_name || "",
          date: ((existing as any).date || "").split("T")[0] || new Date().toISOString().split("T")[0],
          slot: (existing as any).slot || (existing as any).time || "",
          priestName: (existing as any).priestName || (existing as any).priest || "",
          paymentStatus: (existing as any).paymentStatus || "Pending",
          bookingStatus: (existing as any).bookingStatus || (existing as any).status || "Confirmed",
          amount: Number((existing as any).amount) || 0,
          notes: (existing as any).notes || "",
          templeId: (existing as any).templeId || (activeTempleId !== "all" ? activeTempleId : ""),
        });
        setDevoteeSearch(name);
      }
    }
  }, [isEdit, id]);

  // Auto-fill amount from catalog
  useEffect(() => {
    const pkg = POOJA_CATALOG.find(p => p.name === formData.poojaType);
    if (pkg) setFormData(prev => ({ ...prev, amount: pkg.amount }));
  }, [formData.poojaType]);

  // Live Panchang check based on slot
  useEffect(() => {
    if (!formData.slot) { setPanchangStatus("idle"); return; }
    const slotStart = formData.slot.split(" - ")[0];
    const hour = parseInt(slotStart);
    const isPM = slotStart.includes("PM");
    const hour24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
    if (hour24 >= 13 && hour24 < 15) {
      setPanchangStatus("rahu");
    } else {
      setPanchangStatus("auspicious");
    }
  }, [formData.slot]);

  const handleDevoteeSelect = (devotee: any) => {
    const name = devotee.name || `${devotee.first_name || ""} ${devotee.last_name || ""}`.trim();
    setFormData(p => ({ ...p, devoteeId: devotee.id, devoteeName: name, phone: devotee.phone || "" }));
    setDevoteeSearch(name);
    setShowDropdown(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    
    
    

    if (panchangStatus === "rahu") {
      if (!window.confirm("This time slot falls under Rahu Kalam. Proceed anyway?")) return;
    }

    const newSeva = {
      id: id || `SV-${Math.floor(Math.random() * 10000)}`,
      devoteeId: formData.devoteeId,
      devotee: formData.devoteeName,
      devoteeName: formData.devoteeName,
      name: formData.poojaType,
      seva_name: formData.poojaType,
      poojaType: formData.poojaType,
      date: formData.date,
      slot: formData.slot,
      time: formData.slot,
      phone: formData.phone,
      priestName: formData.priestName !== "Auto-Assign based on availability" ? formData.priestName : "",
      priest: formData.priestName !== "Auto-Assign based on availability" ? formData.priestName : "",
      paymentStatus: formData.paymentStatus,
      bookingStatus: formData.bookingStatus,
      status: formData.bookingStatus,
      amount: `₹${formData.amount}`,
      notes: formData.notes,
      templeId: formData.templeId,
      templeName: temples.find(t => t.id === formData.templeId)?.name || "Unknown Temple",
    };

    if (isEdit && id) {
      updateMockItem("poojaSevas", id, newSeva);
      toast.success("Pooja booking updated!");
    } else {
      addMockItem("poojaSevas", newSeva);
      toast.success("Pooja scheduled successfully!");
    }
    navigate("/pooja-sevas");
  };

  const selectedPkg = POOJA_CATALOG.find(p => p.name === formData.poojaType);

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="shrink-0 bg-[#fafafa] border-b border-slate-100 pb-4 mb-0 flex items-start sm:items-center gap-4">
        <button onClick={() => navigate("/pooja-sevas")} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shrink-0 mt-1 sm:mt-0">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{isEdit ? "Modify Pooja Booking" : "New Pooja Reservation"}</h1>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure Encryption · PoojaOps 3.0
          </p>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-6 py-6 pb-12 animate-in fade-in duration-500">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar */}
        <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-0 self-start">
          {/* Live Panchang */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <MoonStar className="w-4 h-4 text-brand-primary" /> Live Panchang
            </h3>
            <p className="text-[11px] text-slate-400 mb-5">Select a time slot to check astrological significance.</p>

            {panchangStatus === "idle" && (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Awaiting Slot Selection</span>
              </div>
            )}
            {panchangStatus === "auspicious" && (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <Star className="w-7 h-7 text-emerald-500 mb-2" />
                <h4 className="font-bold text-emerald-700 text-sm mb-1">Auspicious Time</h4>
                <p className="text-emerald-600 text-[11px]">This slot is highly favorable for poojas.</p>
              </div>
            )}
            {panchangStatus === "rahu" && (
              <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl">
                <AlertTriangle className="w-7 h-7 text-rose-500 mb-2" />
                <h4 className="font-bold text-rose-700 text-sm mb-1">Warning: Rahu Kalam</h4>
                <p className="text-rose-600 text-[11px]">This slot falls under Rahu Kalam (1 PM – 3 PM). Generally avoided for new poojas.</p>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-indigo-500" /> Booking Summary
            </h3>
            <div className="rounded-xl border border-brand-primary/10 bg-brand-primary/5 p-4 flex flex-col gap-1 text-center mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-primary/60">Package Fee</p>
              <p className="text-2xl font-black text-slate-900">
                {formData.amount > 0 ? `₹${formData.amount.toLocaleString("en-IN")}` : "₹0"}
              </p>
              {formData.poojaType && (
                <span className="mt-1 mx-auto px-3 py-1 rounded-full bg-white border border-slate-100 text-[10px] font-bold text-slate-500">
                  {formData.poojaType}
                </span>
              )}
            </div>
            <div className="space-y-3">
              {[
                { label: "Devotee", value: formData.devoteeName || "—" },
                { label: "Date", value: formData.date || "—" },
                { label: "Slot", value: formData.slot || "—" },
                { label: "Priest", value: formData.priestName && formData.priestName !== "Auto-Assign based on availability" ? formData.priestName : "Auto" },
                { label: "Payment", value: formData.paymentStatus || "—" },
                { label: "Booking", value: formData.bookingStatus || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                  <span className="text-[11px] font-bold text-slate-700 truncate max-w-[120px]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="space-y-6">

            {/* Section 1: Devotee Identity */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><User className="w-4 h-4 text-indigo-600" /></span>
                Devotee Identity & Linkage
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Linked Temple Unit */}
                <div className="sm:col-span-2">
                  <SmartSelect label="Linked Temple Unit" icon={Building2}  value={formData.templeId} onChange={v => setFormData(p => ({...p, templeId: v}))} options={temples.map(t => ({ value: t.id, label: t.name }))} />
                </div>
                {/* Devotee search */}
                <div className="sm:col-span-2 relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Link Existing Profile</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={devoteeSearch}
                      onChange={e => setDevoteeSearch(e.target.value)}
                      onFocus={() => devoteeSearch.length > 1 && setShowDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                      placeholder="Search by name or phone..."
                      className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-[13px] font-semibold outline-none transition-all focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/10 focus:bg-white"
                    />
                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                          className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
                        >
                          {devoteeResults.map((d: any) => {
                            const name = d.name || `${d.first_name || ""} ${d.last_name || ""}`.trim();
                            return (
                              <button
                                key={d.id}
                                type="button"
                                onMouseDown={() => handleDevoteeSelect(d)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                              >
                                <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs flex-shrink-0">
                                  {name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-[12px] font-bold text-slate-800">{name}</p>
                                  <p className="text-[10px] text-slate-400">{d.phone || "No phone"}</p>
                                </div>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Synchronizes contact data automatically.</p>
                </div>

                <SmartField
                  label="Display Name"
                  icon={User}
                  
                  value={formData.devoteeName}
                  onChange={v => setFormData(p => ({ ...p, devoteeName: v }))}
                  formatter={v => v.replace(/\b\w/g, l => l.toUpperCase())}
                />
                <SmartField
                  label="Linked Contact"
                  icon={Phone}
                  value={formData.phone}
                  onChange={v => setFormData(p => ({ ...p, phone: v }))}
                />
              </div>
            </div>

            {/* Section 2: Service Parameters */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><Sparkles className="w-4 h-4 text-amber-600" /></span>
                Service Parameters
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Pooja Package</label>
                  <select
                    value={formData.poojaType}
                    onChange={e => setFormData(p => ({ ...p, poojaType: e.target.value }))}
                    className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-[13px] font-semibold outline-none transition-all focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/10 focus:bg-white"
                  >
                    <option value="">Select Package</option>
                    {POOJA_CATALOG.map(pkg => (
                      <option key={pkg.name} value={pkg.name}>{pkg.name} (₹{pkg.amount.toLocaleString("en-IN")})</option>
                    ))}
                  </select>
                  {selectedPkg && (
                    <p className="text-[10px] text-brand-primary font-bold mt-1.5">Package fee: ₹{selectedPkg.amount.toLocaleString("en-IN")} (auto-filled)</p>
                  )}
                </div>

                <SmartField
                  label="Service Date"
                  icon={CalendarDays}
                  type="date"
                  
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.date}
                  onChange={v => setFormData(p => ({ ...p, date: v }))}
                />

                <SmartSelect
                  label="Time Slot"
                  icon={Clock}
                  value={formData.slot}
                  onChange={v => setFormData(p => ({ ...p, slot: v }))}
                  options={SLOT_OPTIONS}
                />

                <div className="sm:col-span-2">
                  <SmartSelect
                    label="Assign Specialist (Priest)"
                    icon={Users}
                    value={formData.priestName}
                    onChange={v => setFormData(p => ({ ...p, priestName: v }))}
                    options={PRIEST_OPTIONS}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Lifecycle / Status */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><CreditCard className="w-4 h-4 text-emerald-600" /></span>
                Lifecycle & Status
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SmartSelect
                  label="Payment Status"
                  icon={CreditCard}
                  value={formData.paymentStatus}
                  onChange={v => setFormData(p => ({ ...p, paymentStatus: v }))}
                  options={["Pending", "Paid"]}
                />
                <SmartSelect
                  label="Booking Status"
                  icon={Ticket}
                  value={formData.bookingStatus}
                  onChange={v => setFormData(p => ({ ...p, bookingStatus: v }))}
                  options={["Pending", "Confirmed", "Completed", "Cancelled"]}
                />
              </div>
            </div>

            {/* Section 4: Notes */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><StickyNote className="w-4 h-4 text-slate-500" /></span>
                Administrative Notes
              </h4>
              <textarea
                value={formData.notes}
                onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                placeholder="e.g. Special sankalpam requirements or nakshatra details..."
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-semibold text-slate-800 outline-none transition-all focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/10 focus:bg-white resize-none"
              />
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-2">
              <button type="button" onClick={() => navigate("/pooja-sevas")} className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                Discard
              </button>
              <button
                type="submit"
                disabled={!formData.devoteeName || !formData.poojaType || !formData.date}
                className={`w-full sm:w-auto px-8 py-3 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${panchangStatus === "rahu" ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/30" : "bg-brand-primary hover:bg-[#8e330b] shadow-brand-primary/30"}`}
              >
                <Save className="w-5 h-5" />
                {isEdit ? "Apply System Updates" : "Complete & Issue Receipt"}
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

export default PoojaSevaForm;
