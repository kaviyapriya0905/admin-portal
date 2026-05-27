import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star, AlertTriangle, MoonStar, Sparkles, User, CalendarDays, Clock, Users, StickyNote, CreditCard, Ticket, ShieldCheck, Phone, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";

import FormActions from "@/components/ui/FormActions";
import SmartField from "@/components/ui/SmartField";
import SmartSelect from "@/components/ui/SmartSelect";
import SmartTextarea from "@/components/ui/SmartTextarea";
import DevoteeSearchPanel, { type DevoteeSearchResult } from "../components/DevoteeSearchPanel";
import { getMockData, addMockItem, updateMockItem } from "@/utils/mockData";

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

  const [panchangStatus, setPanchangStatus] = useState<"idle" | "auspicious" | "rahu">("idle");

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

  const handleDevoteeSelect = (devotee: DevoteeSearchResult) => {
    const name = devotee.name || `${devotee.first_name || ""} ${devotee.last_name || ""}`.trim();
    setFormData(p => ({ ...p, devoteeId: devotee.id, devoteeName: name, phone: devotee.phone || "" }));
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
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div className="shrink-0 bg-[#fafafa] border-b border-slate-100 pb-4 mb-0 flex items-start sm:items-center gap-4">
        <button onClick={() => navigate("/pooja-sevas")} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shrink-0 mt-1 sm:mt-0">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">{isEdit ? "Modify Pooja Booking" : "New Pooja Reservation"}</h1>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure Encryption · PoojaOps 3.0
          </p>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden pb-4">
        <div className="max-w-7xl mx-auto h-full px-4 pt-4 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-6 h-full">
            <div className="lg:col-span-1 space-y-6 h-full overflow-y-auto custom-scrollbar pr-2 pb-10 lg:pb-0">
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
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-indigo-500" /> Booking Summary
                </h3>
                <div className="rounded-xl border border-brand-primary/10 bg-brand-primary/5 p-5 flex flex-col gap-1 text-center mb-4">
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
                <div className="space-y-4">
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
            <div className="lg:col-span-2 h-full min-h-0">
              <form onSubmit={handleSave} className="flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6 space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><User className="w-4 h-4 text-indigo-600" /></span>
                      Devotee Identity & Linkage
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2" >
                        <SmartSelect label="Linked Temple Unit" icon={Building2} value={formData.templeId} onChange={v => setFormData(p => ({ ...p, templeId: v }))} options={temples.map(t => ({ value: t.id, label: t.name }))} />
                      </div>
                      <div className="sm:col-span-2">
                        <DevoteeSearchPanel
                          onSelect={handleDevoteeSelect}
                          initialValue={formData.devoteeName}
                        />
                      </div>

                      <SmartField
                        className="mt-2"
                        label="Display Name"
                        icon={User}
                        value={formData.devoteeName}
                        onChange={v => setFormData(p => ({ ...p, devoteeName: v }))}
                        formatter={v => v.replace(/\b\w/g, l => l.toUpperCase())}
                      />
                      <SmartField
                        className="mt-2"
                        label="Linked Contact"
                        icon={Phone}
                        value={formData.phone}
                        onChange={v => setFormData(p => ({ ...p, phone: v }))}
                      />
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><Sparkles className="w-4 h-4 text-amber-600" /></span>
                      Service Parameters
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <SmartSelect
                          label="Pooja Package"
                          icon={Sparkles}
                          value={formData.poojaType}
                          onChange={(val) => setFormData(p => ({ ...p, poojaType: val }))}
                          options={POOJA_CATALOG.map(pkg => ({ value: pkg.name, label: `${pkg.name} (₹${pkg.amount.toLocaleString("en-IN")})` }))}
                        />
                        {selectedPkg && (
                          <p className="text-[10px] text-brand-primary font-bold mt-1.5 ml-1">Package fee: ₹{selectedPkg.amount.toLocaleString("en-IN")} (auto-filled)</p>
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
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><CreditCard className="w-4 h-4 text-emerald-600" /></span>
                      Lifecycle & Status
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                    <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center"><StickyNote className="w-4 h-4 text-slate-500" /></span>
                      Administrative Notes
                    </h4>
                    <SmartTextarea
                      label="Administrative Notes"
                      icon={StickyNote}
                      value={formData.notes}
                      onChange={(val) => setFormData(p => ({ ...p, notes: val }))}
                      placeholder="e.g. Special sankalpam requirements or nakshatra details..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="shrink-0 pt-4 mt-2 border-t border-slate-200">
                  <FormActions
                    onCancel={() => navigate("/pooja-sevas")}
                    cancelText="Discard"
                    submitText={isEdit ? "Apply System Updates" : "Complete & Issue Receipt"}
                    submitClassName={panchangStatus === "rahu" ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/30" : "bg-brand-primary hover:bg-[#8e330b] shadow-brand-primary/30"}
                  />
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
