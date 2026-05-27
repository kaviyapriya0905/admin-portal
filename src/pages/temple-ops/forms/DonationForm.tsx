import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Save, Landmark, ShieldCheck, Loader2,
  User, IndianRupee, CreditCard, Target, FileText,
  CalendarDays, Radio, QrCode, StickyNote, Phone, Building2,
  Banknote, Smartphone, Hash, Lock, Calendar
} from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";
import SmartField from "@/components/ui/SmartField";
import SmartSelect from "@/components/ui/SmartSelect";
import SmartTextarea from "@/components/ui/SmartTextarea";
import DevoteeSearchPanel, { type DevoteeSearchResult } from "../components/DevoteeSearchPanel";
import { getMockData, addMockItem, updateMockItem } from "@/utils/mockData";

// Number to Words
const numToWords = (num: number): string => {
  if (num === 0) return "Zero Rupees";
  if (num > 9999999) return "Amount too large";
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const convert = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + convert(n % 100) : "");
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + convert(n % 1000) : "");
    return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + convert(n % 100000) : "");
  };
  return convert(num) + " Rupees";
};

const CATEGORY_OPTIONS = ["General Fund", "Annadanam", "Renovation", "Endowment", "Education", "Medical Aid", "Festival", "Infrastructure"];
const CHANNEL_OPTIONS = ["Counter", "Online", "Hundi"];

const DonationForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { temples, activeTempleId } = useSelector((state: RootState) => state.temple);

  const [formData, setFormData] = useState({
    // Devotee Association
    devoteeId: "",
    donorName: "",
    phone: "",
    // Transactional
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    channel: "Counter",
    paymentMethod: "Cash",
    gateway: "",
    // Reference
    transactionId: "",
    pan: "",
    notes: "",
    templeId: activeTempleId !== "all" ? activeTempleId : "",
    // Card details
    cardNumber: "",
    cardHolder: "",
    cardExpiry: "",
    cardCvv: "",
    // UPI details
    upiId: "",
    // Bank Transfer details
    accountNumber: "",
    ifscCode: "",
    accountHolder: "",
    bankName: "",
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [bankVerified, setBankVerified] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const data = getMockData();
      const existing = data.donations.find((d: any) => d.id === id);
      if (existing) {
        setFormData({
          devoteeId: (existing as any).devoteeId || "",
          donorName: (existing as any).devotee || (existing as any).donorName || "",
          phone: (existing as any).phone || "",
          amount: String((existing as any).amount || ""),
          category: (existing as any).purpose || (existing as any).category || "",
          date: (existing as any).date?.split("T")[0] || new Date().toISOString().split("T")[0],
          channel: (existing as any).channel || "Counter",
          paymentMethod: (existing as any).method || (existing as any).paymentMethod || "Cash",
          gateway: (existing as any).gateway || "",
          transactionId: (existing as any).transactionId || "",
          pan: (existing as any).pan || "",
          notes: (existing as any).notes || "",
          templeId: (existing as any).templeId || (activeTempleId !== "all" ? activeTempleId : ""),
          cardNumber: "",
          cardHolder: "",
          cardExpiry: "",
          cardCvv: "",
          upiId: "",
          accountNumber: "",
          ifscCode: "",
          accountHolder: "",
          bankName: "",
        });
        setBankVerified(true);
      }
    }
  }, [isEdit, id]);

  // Live bank verification sim
  useEffect(() => {
    const rawAmount = Number(formData.amount.replace(/,/g, ""));
    if (rawAmount > 0 && formData.channel !== "Hundi" && formData.paymentMethod !== "Cash" && !bankVerified && !isEdit) {
      setIsVerifying(true);
      const t = setTimeout(() => { setIsVerifying(false); setBankVerified(true); }, 2000);
      return () => clearTimeout(t);
    } else if (rawAmount <= 0) {
      setBankVerified(false);
      setIsVerifying(false);
    }
  }, [formData.amount, formData.channel, formData.paymentMethod, bankVerified, isEdit]);

  // Payment methods based on channel
  const methodOptions = useMemo(() => {
    if (formData.channel === "Hundi") return ["Cash"];
    if (formData.channel === "Online") return ["UPI", "Card"];
    return ["Cash", "UPI", "Card", "Bank Transfer"];
  }, [formData.channel]);

  const handleChannelChange = (channel: string) => {
    const newMethod = channel === "Hundi" ? "Cash" : channel === "Online" ? "UPI" : "Cash";
    setFormData(p => ({ ...p, channel, paymentMethod: newMethod, gateway: "" }));
    setBankVerified(false);
  };

  const handleMethodChange = (method: string) => {
    setFormData(p => ({ ...p, paymentMethod: method, gateway: "" }));
    setBankVerified(false);
  };

  const handleDevoteeSelect = (devotee: DevoteeSearchResult) => {
    const name = devotee.name || `${devotee.first_name || ""} ${devotee.last_name || ""}`.trim();
    setFormData(p => ({ ...p, devoteeId: devotee.id, donorName: name, phone: devotee.phone || "" }));
  };

  const formatPan = (v: string) => v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
  const validatePan = (v: string) => { if (!v) return null; return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v); };

  const rawAmount = Number(formData.amount.replace(/,/g, ""));
  const amountWords = useMemo(() => rawAmount > 0 ? numToWords(rawAmount) : "Enter an amount", [rawAmount]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    
    
    

    const newDonation = {
      id: id || `DON-${Math.floor(Math.random() * 10000)}`,
      donation_code: id || `DON-${Date.now().toString().slice(-6)}`,
      devoteeId: formData.devoteeId,
      devotee_id: formData.devoteeId,
      devotee: formData.donorName,
      donorName: formData.donorName,
      phone: formData.phone,
      amount: rawAmount,
      date: formData.date || new Date().toISOString(),
      category: formData.category,
      purpose: formData.category,
      channel: formData.channel,
      method: formData.paymentMethod,
      paymentMethod: formData.paymentMethod,
      gateway: formData.gateway,
      transactionId: formData.transactionId,
      pan: formData.pan,
      notes: formData.notes,
      status: "Successful",
      templeId: formData.templeId,
      templeName: temples.find(t => t.id === formData.templeId)?.name || "Unknown Temple",
    };

    if (isEdit && id) {
      updateMockItem("donations", id, newDonation);
      toast.success("Donation record updated!");
    } else {
      addMockItem("donations", newDonation);
      toast.success("Donation recorded successfully!");
    }
    navigate("/donations");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="shrink-0 bg-[#fafafa] border-b border-slate-100 pb-4 mb-0 flex items-start sm:items-center gap-4">
        <button onClick={() => navigate("/donations")} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shrink-0 mt-1 sm:mt-0">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{isEdit ? "Modify Offering" : "New Sacred Offering"}</h1>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Financial Registry Record · Secure Entry
          </p>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto space-y-6 py-6 pb-12 animate-in fade-in duration-500">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left sidebar */}
        <div className="lg:col-span-1 space-y-5 lg:sticky lg:top-0 self-start">
          {/* Gateway Sync */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-brand-primary" /> Gateway Sync
            </h3>
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-slate-500 font-medium text-xs">Status</span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-1 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ONLINE
              </span>
            </div>
            <div className="border-t border-slate-100 pt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Live Verification</span>
              {formData.paymentMethod === "Cash" ? (
                <div className="flex items-center gap-2 text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs font-medium">
                  <Landmark className="w-4 h-4 text-slate-300" /> Manual Cash Entry
                </div>
              ) : isVerifying ? (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-100 p-3 rounded-lg text-xs font-bold">
                  <Loader2 className="w-4 h-4 animate-spin" /> Pinging Bank Servers...
                </div>
              ) : bankVerified ? (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" /> Transaction Pre-Verified
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs font-medium">
                  <Landmark className="w-4 h-4 text-slate-300" /> Waiting for amount...
                </div>
              )}
            </div>
          </div>

          {/* Registry Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500" /> Registry Summary
            </h3>
            <div className="rounded-xl border border-brand-primary/10 bg-brand-primary/5 p-5 flex flex-col gap-1 text-center mb-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-primary/60 mb-1">Total Contribution</p>
              <p className="text-3xl font-black text-slate-900 tabular-nums">
                {rawAmount > 0 ? `₹${rawAmount.toLocaleString("en-IN")}` : "₹0"}
              </p>
              {formData.category && (
                <span className="mt-2 mx-auto px-3 py-1 rounded-full bg-white border border-slate-100 text-[10px] font-bold text-slate-500 w-fit">
                  {formData.category}
                </span>
              )}
            </div>
            <div className="space-y-3">
              {[
                { label: "Donor", value: formData.donorName || "—" },
                { label: "Channel", value: formData.channel || "—" },
                { label: "Method", value: formData.paymentMethod || "—" },
                { label: "Date", value: formData.date || "—" },
                { label: "Gateway", value: formData.gateway || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
                  <span className="text-[11px] font-bold text-slate-700 truncate max-w-[120px]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="space-y-6">

            {/* Section 1: Devotee Association */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><User className="w-4 h-4 text-indigo-600" /></span>
                Devotee Association
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Linked Temple Unit */}
                <div className="sm:col-span-2">
                  <SmartSelect label="Linked Temple Unit" icon={Building2}  value={formData.templeId} onChange={v => setFormData(p => ({...p, templeId: v}))} options={temples.map(t => ({ value: t.id, label: t.name }))} />
                </div>
                {/* Devotee search */}
                <div className="sm:col-span-2">
                  <DevoteeSearchPanel 
                    onSelect={handleDevoteeSelect} 
                    initialValue={formData.donorName} 
                  />
                </div>

                <SmartField
                  label="Display Name"
                  icon={User}
                  
                  value={formData.donorName}
                  onChange={v => setFormData(p => ({ ...p, donorName: v }))}
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

            {/* Section 2: Transactional Parameters */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><IndianRupee className="w-4 h-4 text-emerald-600" /></span>
                Transactional Parameters
              </h4>
              <div className="space-y-6">
                {/* Amount - large input */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                    Contribution Amount 
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-semibold text-slate-300">₹</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.amount}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        const formatted = val ? Number(val).toLocaleString("en-IN") : "";
                        setBankVerified(false);
                        setFormData(p => ({ ...p, amount: formatted }));
                      }}
                      placeholder="0"
                      className="w-full h-20 pl-14 rounded-2xl border-2 border-slate-200 bg-white text-3xl font-bold outline-none focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/5 transition-all text-slate-900 shadow-sm"
                    />
                  </div>
                  {rawAmount > 0 && (
                    <p className="text-[10px] text-slate-400 font-medium mt-1.5 italic">{amountWords}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <SmartSelect
                    label="Fund Category"
                    icon={Target}
                    value={formData.category}
                    onChange={v => setFormData(p => ({ ...p, category: v }))}
                    options={CATEGORY_OPTIONS}
                  />
                  <SmartField
                    label="Log Date"
                    icon={CalendarDays}
                    type="date"
                    
                    value={formData.date}
                    onChange={v => setFormData(p => ({ ...p, date: v }))}
                  />
                  <SmartSelect
                    label="Channel"
                    icon={Radio}
                    value={formData.channel}
                    onChange={handleChannelChange}
                    options={CHANNEL_OPTIONS}
                  />
                </div>

                {/* ── Instrument / Method Picker ── */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 block flex items-center gap-1.5">
                    <CreditCard className="w-3 h-3" /> Instrument / Method
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {methodOptions.map((method) => {
                      const isActive = formData.paymentMethod === method;
                      const iconMap: Record<string, React.ElementType> = {
                        Cash: Banknote,
                        UPI: Smartphone,
                        Card: CreditCard,
                        "Bank Transfer": Landmark,
                      };
                      const colorMap: Record<string, string> = {
                        Cash: "text-emerald-600 bg-emerald-50 border-emerald-200",
                        UPI: "text-purple-600 bg-purple-50 border-purple-200",
                        Card: "text-blue-600 bg-blue-50 border-blue-200",
                        "Bank Transfer": "text-amber-600 bg-amber-50 border-amber-200",
                      };
                      const activeMap: Record<string, string> = {
                        Cash: "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-200",
                        UPI: "border-purple-500 bg-purple-500 text-white shadow-lg shadow-purple-200",
                        Card: "border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-200",
                        "Bank Transfer": "border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-200",
                      };
                      const MethodIcon = iconMap[method] || CreditCard;
                      return (
                        <motion.button
                          key={method}
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleMethodChange(method)}
                          className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${
                            isActive
                              ? activeMap[method] || "border-brand-primary bg-brand-primary text-white"
                              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="method-active-bg"
                              className="absolute inset-0 rounded-2xl"
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                          <div className={`relative z-10 p-2 rounded-xl ${
                            isActive ? "bg-white/20" : colorMap[method] || "bg-slate-100"
                          }`}>
                            <MethodIcon className="w-5 h-5" />
                          </div>
                          <span className="relative z-10 text-[11px] font-bold tracking-wide whitespace-nowrap">{method}</span>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/30 flex items-center justify-center"
                            >
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* ── Payment Method Details ── */}
                {(() => {
                  if (formData.paymentMethod === "Card") return (
                    <motion.div
                      key="card"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="pt-4 border-t border-slate-100"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                        </span>
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Card Details</span>
                      </div>

                      {/* Live Card Preview */}
                      <div className="relative h-44 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 mb-5 shadow-xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div className="w-10 h-7 rounded-md bg-amber-400/80 flex items-center justify-center">
                              <div className="w-6 h-4 rounded-sm border border-amber-600/50 bg-amber-300/80" />
                            </div>
                            <CreditCard className="w-7 h-7 text-white/30" />
                          </div>
                          <div>
                            <p className="text-white/50 text-[10px] font-bold tracking-[0.2em] mb-1">CARD NUMBER</p>
                            <p className="text-white text-[15px] font-bold tracking-[0.25em] font-mono">
                              {formData.cardNumber
                                ? formData.cardNumber.replace(/(.{4})/g, '$1 ').trim()
                                : '•••• •••• •••• ••••'}
                            </p>
                            <div className="flex justify-between mt-2">
                              <div>
                                <p className="text-white/40 text-[8px] tracking-wider">CARD HOLDER</p>
                                <p className="text-white text-[11px] font-bold uppercase">{formData.cardHolder || '—'}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-white/40 text-[8px] tracking-wider">EXPIRES</p>
                                <p className="text-white text-[11px] font-bold">{formData.cardExpiry || 'MM/YY'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <SmartField
                            label="Card Number"
                            icon={CreditCard}
                            value={formData.cardNumber}
                            onChange={(val) => {
                              const v = val.replace(/\D/g, '').slice(0, 16);
                              setFormData(p => ({ ...p, cardNumber: v }));
                            }}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                        </div>
                        <div>
                          <SmartField
                            label="Card Holder Name"
                            icon={User}
                            value={formData.cardHolder}
                            onChange={(val) => setFormData(p => ({ ...p, cardHolder: val.toUpperCase() }))}
                            placeholder="As on card"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <SmartField
                            label="Expiry"
                            icon={Calendar}
                            value={formData.cardExpiry}
                            onChange={(val) => {
                              let v = val.replace(/\D/g, '').slice(0, 4);
                              if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                              setFormData(p => ({ ...p, cardExpiry: v }));
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          <SmartField
                            label="CVV"
                            icon={Lock}
                            value={formData.cardCvv}
                            onChange={(val) => setFormData(p => ({ ...p, cardCvv: val.replace(/\D/g, '').slice(0, 4) }))}
                            placeholder="•••"
                            type="password"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );

                  if (formData.paymentMethod === "UPI") return (
                    <motion.div
                      key="upi"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="pt-4 border-t border-slate-100"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
                          <QrCode className="w-4 h-4 text-purple-600" />
                        </span>
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Scan & Pay via UPI</span>
                      </div>
                      <div className="flex flex-col items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="w-36 h-36 bg-white rounded-2xl border border-slate-200 shadow-md flex items-center justify-center">
                          <QrCode className="w-20 h-20 text-brand-primary opacity-70" />
                        </div>
                        <div className="text-center">
                          <p className="text-[13px] font-bold text-slate-800">
                            {rawAmount > 0 ? `Scan to pay ₹${rawAmount.toLocaleString('en-IN')}` : 'Enter amount to generate QR'}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">Temple Merchant UPI: temple@sbi</p>
                        </div>
                      </div>
                    </motion.div>
                  );

                  if (formData.paymentMethod === "Bank Transfer") return (
                    <motion.div
                      key="bank"
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="pt-4 border-t border-slate-100"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                          <Landmark className="w-4 h-4 text-amber-600" />
                        </span>
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Bank Transfer Reference</span>
                      </div>
                      <div className="mt-2">
                        <SmartField
                          label="Transaction ID / UTR Number"
                          icon={Hash}
                          value={formData.transactionId}
                          onChange={(val) => setFormData(p => ({ ...p, transactionId: val }))}
                          placeholder="e.g. UTR123456789012"
                          helperText="Enter the UTR / reference number from your bank transfer receipt."
                        />
                      </div>
                    </motion.div>
                  );

                  return null;
                })()}
              </div>
            </div>

            {/* Section 3: Reference & Notes */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><FileText className="w-4 h-4 text-amber-600" /></span>
                Internal Reference & Notes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SmartField
                  label="PAN (for 80G Receipt)"
                  icon={FileText}
                  value={formData.pan}
                  onChange={v => setFormData(p => ({ ...p, pan: v }))}
                  formatter={formatPan}
                  validationFn={validatePan}
                  helperText="Required for >₹50,000"
                  errorText="Must be 5 Letters, 4 Numbers, 1 Letter"
                />

                <div className="sm:col-span-2">
                  <SmartTextarea
                    label="Additional Notes / Prayer Requests"
                    icon={StickyNote}
                    value={formData.notes}
                    onChange={(val) => setFormData(p => ({ ...p, notes: val }))}
                    placeholder="Any specific requests, sankalpas, or context for this offering..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-2">
              <button type="button" onClick={() => navigate("/donations")} className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                Discard
              </button>
              <button
                type="submit"
                
                className="w-full sm:w-auto px-8 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 hover:bg-[#8e330b] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isEdit ? "Update Donation" : "Complete & Issue Receipt"}
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

export default DonationForm;
