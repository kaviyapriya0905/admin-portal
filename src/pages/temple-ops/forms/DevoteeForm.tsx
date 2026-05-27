import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Save, ScanFace, Loader2, CheckCircle2, User, Phone, Mail, MapPin, QrCode, History, Activity, ShieldAlert, Award, BookOpen, Users, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";
import SmartField from "@/components/ui/SmartField";
import SmartSelect from "@/components/ui/SmartSelect";
import SmartCheckbox from "@/components/ui/SmartCheckbox";
import { getMockData, addMockItem, updateMockItem } from "@/utils/mockData";

const DevoteeForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { temples, activeTempleId } = useSelector((state: RootState) => state.temple);

  const [activeTab, setActiveTab] = useState<"Personal" | "Membership" | "History">("Personal");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gothram: "",
    bloodGroup: "",
    address: "",
    city: "",
    state: "",
    country: "",
    dob: "",
    gender: "",
    occupation: "",
    nakshatra: "",
    rasi: "",
    phoneSecondary: "",
    emailSecondary: "",
    emergencyContact: "",
    membershipType: "Regular",
    status: "Active",
    whatsapp: false,
    sms: true,
    emailAlerts: false,
    reminderBirthday: false,
    reminderNakshatra: false,
    reminderFestivalGreetings: false,
    reminderDonationAnniversary: false,
    familyStr: "", // comma separated for simple editing
    volunteerRolesStr: "", // comma separated for simple editing
    templeId: activeTempleId !== "all" ? activeTempleId : "",
  });

  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [isGeneratingId, setIsGeneratingId] = useState(false);
  const [idGenerated, setIdGenerated] = useState(false);

  // Simulated history for this mock
  const [activityHistory] = useState([
    { date: "2026-05-10", action: "Donated ₹5,000 for Annadanam" },
    { date: "2026-04-15", action: "Booked Archana Seva" },
    { date: "2026-01-01", action: "Renewed Life Membership" }
  ]);

  // Formatters & Validators
  const formatPhone = (v: string) => {
    const cleaned = ('' + v).replace(/\D/g, '');
    let match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,5})$/);
    if (!match) return v;
    if (match[3]) return `+${match[1]} ${match[2]} ${match[3]}`;
    if (match[2]) return `+${match[1]} ${match[2]}`;
    if (match[1]) return `+${match[1]}`;
    return cleaned;
  };
  const validatePhone = (v: string) => {
    const cleaned = v.replace(/\D/g, '');
    if (cleaned.length === 0) return null;
    return cleaned.length === 12 && v.startsWith('+91');
  };
  const validateEmail = (v: string) => {
    if (!v) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  };

  useEffect(() => {
    if (isEdit) {
      const data = getMockData();
      const existing = data.devotees.find(d => d.id === id);
      if (existing) {
        setFormData({
          firstName: existing.first_name as string || (existing.name as string).split(' ')[0] || "",
          lastName: existing.last_name as string || (existing.name as string).split(' ').slice(1).join(' ') || "",
          phone: existing.phone as string || "",
          email: existing.email as string || "",
          gothram: existing.gothram as string || "",
          bloodGroup: existing.bloodGroup as string || "",
          address: existing.address as string || "",
          city: (existing as any).city || "",
          state: (existing as any).state || "",
          country: (existing as any).country || "",
          dob: (existing as any).dob || "",
          gender: (existing as any).gender || "",
          occupation: (existing as any).occupation || "",
          nakshatra: (existing as any).nakshatra || "",
          rasi: (existing as any).rasi || "",
          phoneSecondary: (existing as any).phoneSecondary || "",
          emailSecondary: (existing as any).emailSecondary || "",
          emergencyContact: existing.emergencyContact as string || "",
          membershipType: existing.membershipType as string || existing.type as string || "Regular",
          status: existing.status as string || "Active",
          whatsapp: (existing.communication as any)?.whatsapp || false,
          sms: (existing.communication as any)?.sms || true,
          emailAlerts: (existing.communication as any)?.email || false,
          reminderBirthday: (existing as any).reminderBirthday || false,
          reminderNakshatra: (existing as any).reminderNakshatra || false,
          reminderFestivalGreetings: (existing as any).reminderFestivalGreetings || false,
          reminderDonationAnniversary: (existing as any).reminderDonationAnniversary || false,
          familyStr: (existing.family as any[])?.map((f: any) => `${f.name} (${f.relation})`).join(', ') || "",
          volunteerRolesStr: (existing.volunteerRoles as string[])?.join(', ') || "",
          templeId: existing.templeId as string || (activeTempleId !== "all" ? activeTempleId : ""),
        });
        setIdGenerated(true); // Assuming they already have an ID if they exist
      }
    }
  }, [isEdit, id]);

  const handleScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
      setFormData((prev) => ({
        ...prev,
        firstName: "Aarav",
        lastName: "Sharma",
        phone: "+91 99887 76655",
      }));
      toast.success("Biometric match found! Details auto-filled.");
    }, 2000);
  };

  const handleGenerateId = () => {
    setIsGeneratingId(true);
    setTimeout(() => {
      setIsGeneratingId(false);
      setIdGenerated(true);
      toast.success("Digital ID successfully generated!");
    }, 1500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePhone(formData.phone) === false) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    if (formData.email && validateEmail(formData.email) === false) {
      toast.error("Please enter a valid email address.");
      return;
    }


    const newDevotee = {
      id: id || `DEV-${Math.floor(Math.random() * 1000)}`,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      gothram: formData.gothram,
      bloodGroup: formData.bloodGroup,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      dob: formData.dob,
      gender: formData.gender,
      occupation: formData.occupation,
      nakshatra: formData.nakshatra,
      rasi: formData.rasi,
      phoneSecondary: formData.phoneSecondary,
      emailSecondary: formData.emailSecondary,
      reminderBirthday: formData.reminderBirthday,
      reminderNakshatra: formData.reminderNakshatra,
      reminderFestivalGreetings: formData.reminderFestivalGreetings,
      reminderDonationAnniversary: formData.reminderDonationAnniversary,
      emergencyContact: formData.emergencyContact,
      status: formData.status,
      type: formData.membershipType,
      membershipType: formData.membershipType,
      location: formData.city || "Bangalore",
      templeId: formData.templeId,
      templeName: temples.find(t => t.id === formData.templeId)?.name || "Unknown Temple",
      communication: { whatsapp: formData.whatsapp, sms: formData.sms, email: formData.emailAlerts },
      family: formData.familyStr ? [{ name: formData.familyStr, relation: "Family" }] : [],
      volunteerRoles: formData.volunteerRolesStr ? formData.volunteerRolesStr.split(',').map(s => s.trim()) : [],
      engagementScore: isEdit ? 85 : 0
    };

    if (isEdit && id) {
      updateMockItem("devotees", id, newDevotee);
      toast.success("Devotee profile updated!");
    } else {
      addMockItem("devotees", newDevotee);
      toast.success("Devotee registered successfully!");
    }

    navigate("/devotees");
  };

  const tabs: ("Personal" | "Membership" | "History")[] = ["Personal", "Membership", "History"];

  const renderLeftPanel = () => {
    switch (activeTab) {
      case "Personal":
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ScanFace className="w-5 h-5 text-brand-primary" />
                Biometric Registration
              </h3>
              <p className="text-[11px] text-slate-500 mb-4">Fast-track entry by scanning fingerprint or facial features.</p>

              {!scanComplete ? (
                <button
                  type="button"
                  onClick={handleScan}
                  disabled={isScanning}
                  className="w-full p-4 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 hover:bg-slate-50 hover:border-brand-primary/50 transition-all disabled:opacity-50"
                >
                  {isScanning ? (
                    <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                  ) : (
                    <ScanFace className="w-8 h-8 text-slate-400" />
                  )}
                  <span className="text-xs font-bold text-slate-600">
                    {isScanning ? "Scanning Biometrics..." : "Start Biometric Scan"}
                  </span>
                </button>
              ) : (
                <div className="w-full p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col items-center justify-center gap-2 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-700">Biometric Profile Linked</span>
                  <button type="button" onClick={() => setScanComplete(false)} className="text-[10px] text-emerald-600 hover:underline mt-2">Rescan</button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-500" />
                Digital ID Card
              </h3>
              {idGenerated ? (
                <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white relative overflow-hidden shadow-md">
                  <div className="absolute top-0 right-0 p-3 opacity-20">
                    <QrCode className="w-24 h-24" />
                  </div>
                  <div className="relative z-10">
                    <h4 className="font-black text-lg mb-1">{formData.firstName || "Devotee"} {formData.lastName}</h4>
                    <p className="text-indigo-100 text-[10px] uppercase font-bold tracking-wider mb-4">{formData.membershipType}</p>
                    <div className="flex items-center gap-2 text-indigo-100 text-xs">
                      <User className="w-3.5 h-3.5" />
                      <span>{id || "DEV-NEW"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-24 h-24 bg-slate-100 rounded-xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-slate-200">
                    <QrCode className="w-8 h-8 text-slate-300" />
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateId}
                    disabled={isGeneratingId || !formData.firstName}
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs rounded-lg transition-colors w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isGeneratingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
                    {isGeneratingId ? "Generating..." : "Generate Digital ID"}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case "Membership":
        return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 lg:sticky lg:top-24">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Engagement Score
            </h3>
            <div className="text-center p-5 bg-amber-50 border border-amber-100 rounded-xl mb-4">
              <div className="text-4xl font-black text-amber-600 mb-1">{isEdit ? "85" : "0"}</div>
              <h4 className="font-bold text-amber-700 text-xs uppercase tracking-wider">Top 15% Devotee</h4>
            </div>
            <p className="text-[11px] text-slate-500 text-center">Score increases with donations, seva bookings, and volunteer participation.</p>
          </div>
        );
      case "History":
        return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 lg:sticky lg:top-24">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-primary" />
              Recent Activity Snapshot
            </h3>
            {activityHistory.length > 0 ? (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {activityHistory.map((item, idx) => (
                  <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-brand-primary text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-slate-100 bg-slate-50 shadow-sm">
                      <time className="text-[10px] font-bold text-brand-primary/80">{item.date}</time>
                      <div className="text-xs text-slate-700 mt-1">{item.action}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-slate-400">
                <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No recent activity found.</p>
              </div>
            )}
          </div>
        );
    }
  };

  const renderFormContent = () => {
    switch (activeTab) {
      case "Personal":
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 sm:space-y-4">

            {/* Primary Details Card */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
              <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><User className="w-4 h-4 text-indigo-600" /></span>
                Primary Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <div className="sm:col-span-2">
                  <SmartSelect label="Linked Temple Unit" icon={Building2} value={formData.templeId} onChange={v => setFormData(p => ({ ...p, templeId: v }))} options={temples.map(t => ({ value: t.id, label: t.name }))} />
                </div>
                <SmartField label="First Name" icon={User} value={formData.firstName} onChange={v => setFormData(p => ({ ...p, firstName: v }))} />
                <SmartField label="Last Name" icon={User} value={formData.lastName} onChange={v => setFormData(p => ({ ...p, lastName: v }))} />
                <SmartField label="Phone Number" icon={Phone} value={formData.phone} onChange={v => setFormData(p => ({ ...p, phone: v }))} formatter={formatPhone} validationFn={validatePhone} />
                <SmartField label="Email Address" icon={Mail} value={formData.email} onChange={v => setFormData(p => ({ ...p, email: v }))} validationFn={validateEmail} />
                <SmartField label="Secondary Phone" icon={Phone} value={formData.phoneSecondary} onChange={v => setFormData(p => ({ ...p, phoneSecondary: v }))} formatter={formatPhone} />
                <SmartField label="Secondary Email" icon={Mail} value={formData.emailSecondary} onChange={v => setFormData(p => ({ ...p, emailSecondary: v }))} validationFn={validateEmail} />
              </div>
            </div>

            {/* Demographics Card */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
              <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><Activity className="w-4 h-4 text-emerald-600" /></span>
                Demographics
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6">
                <SmartField label="Date of Birth" icon={User} type="date" value={formData.dob} onChange={v => setFormData(p => ({ ...p, dob: v }))} />
                <SmartSelect label="Gender" icon={User} value={formData.gender} onChange={v => setFormData(p => ({ ...p, gender: v }))} options={["Male", "Female", "Other"]} />
                <SmartField label="Occupation" icon={User} value={formData.occupation} onChange={v => setFormData(p => ({ ...p, occupation: v }))} />
              </div>
            </div>

            {/* Spiritual Identity Card */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
              <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><BookOpen className="w-4 h-4 text-amber-600" /></span>
                Spiritual Identity
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6">
                <SmartField label="Gothram" icon={BookOpen} value={formData.gothram} onChange={v => setFormData(p => ({ ...p, gothram: v }))} />
                <SmartField label="Nakshatra" icon={BookOpen} value={formData.nakshatra} onChange={v => setFormData(p => ({ ...p, nakshatra: v }))} />
                <SmartField label="Rasi" icon={BookOpen} value={formData.rasi} onChange={v => setFormData(p => ({ ...p, rasi: v }))} />
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
              <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center"><MapPin className="w-4 h-4 text-rose-600" /></span>
                Location
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6">
                <div className="sm:col-span-3">
                  <SmartField label="Full Address" icon={MapPin} value={formData.address} onChange={v => setFormData(p => ({ ...p, address: v }))} />
                </div>
                <SmartField label="City" icon={MapPin} value={formData.city} onChange={v => setFormData(p => ({ ...p, city: v }))} />
                <SmartField label="State" icon={MapPin} value={formData.state} onChange={v => setFormData(p => ({ ...p, state: v }))} />
                <SmartField label="Country" icon={MapPin} value={formData.country} onChange={v => setFormData(p => ({ ...p, country: v }))} />
              </div>
            </div>

            {/* Family & Emergency Card */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
              <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center"><Users className="w-4 h-4 text-brand-primary" /></span>
                Family & Emergency
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <SmartField label="Family Members" icon={Users} value={formData.familyStr} onChange={v => setFormData(p => ({ ...p, familyStr: v }))} placeholder="e.g. Anjali (Spouse), Arjun (Son)" />
                <SmartField label="Emergency Contact" icon={ShieldAlert} value={formData.emergencyContact} onChange={v => setFormData(p => ({ ...p, emergencyContact: v }))} />
              </div>
            </div>
          </motion.div>
        );
      case "Membership":
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 sm:space-y-4">
            {/* Membership Status */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
              <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><Award className="w-4 h-4 text-indigo-600" /></span>
                Membership Status
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <SmartSelect label="Membership Type" icon={Award} value={formData.membershipType} onChange={v => setFormData(p => ({ ...p, membershipType: v }))} options={["Life Member", "VIP", "Regular", "Donor"]} />
                <SmartSelect label="Account Status" icon={ShieldAlert} value={formData.status} onChange={v => setFormData(p => ({ ...p, status: v }))} options={["Active", "Inactive", "Suspended"]} />
              </div>
            </div>

            {/* Communication Preferences */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
              <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><Mail className="w-4 h-4 text-emerald-600" /></span>
                Communication Preferences
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SmartCheckbox
                  label="WhatsApp"
                  checked={formData.whatsapp}
                  onChange={(c) => setFormData(p => ({ ...p, whatsapp: c }))}
                />
                <SmartCheckbox
                  label="SMS"
                  checked={formData.sms}
                  onChange={(c) => setFormData(p => ({ ...p, sms: c }))}
                />
                <SmartCheckbox
                  label="Email"
                  checked={formData.emailAlerts}
                  onChange={(c) => setFormData(p => ({ ...p, emailAlerts: c }))}
                />
              </div>
            </div>

            {/* Reminders */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
              <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><Phone className="w-4 h-4 text-amber-600" /></span>
                Automated Reminders
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <SmartCheckbox
                  label="Birthday"
                  checked={formData.reminderBirthday}
                  onChange={(c) => setFormData(p => ({ ...p, reminderBirthday: c }))}
                />
                <SmartCheckbox
                  label="Nakshatra"
                  checked={formData.reminderNakshatra}
                  onChange={(c) => setFormData(p => ({ ...p, reminderNakshatra: c }))}
                />
                <SmartCheckbox
                  label="Festivals"
                  checked={formData.reminderFestivalGreetings}
                  onChange={(c) => setFormData(p => ({ ...p, reminderFestivalGreetings: c }))}
                />
                <SmartCheckbox
                  label="Donation Anniv."
                  checked={formData.reminderDonationAnniversary}
                  onChange={(c) => setFormData(p => ({ ...p, reminderDonationAnniversary: c }))}
                />
              </div>
            </div>

            {/* Volunteer Registration */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
              <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center"><User className="w-4 h-4 text-rose-600" /></span>
                Volunteer Registration
              </h4>
              <div className="w-full">
                <SmartField label="Volunteer Interests (Comma separated)" icon={User} value={formData.volunteerRolesStr} onChange={v => setFormData(p => ({ ...p, volunteerRolesStr: v }))} helperText="e.g. Crowd Control, Prasadam, Event Organizer" />
              </div>
            </div>
          </motion.div>
        );
      case "History":
        return (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex flex-col items-center justify-center py-4 sm:py-10 text-center">
            <History className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">Historical Records</h3>
            <p className="text-sm text-slate-500 max-w-sm">
              The full detailed history of donations, sevas, and temple visits is locked in edit mode. You can view the summary in the left panel.
            </p>
          </motion.div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="shrink-0 bg-[#fafafa] border-b border-slate-100 pb-4 mb-0 space-y-4">
        <div className="flex items-start sm:items-center gap-4">
          <button onClick={() => navigate("/devotees")} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shrink-0 mt-1 sm:mt-0">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{isEdit ? "Devotee CRM Profile" : "Onboard New Devotee"}</h1>
            <p className="text-xs sm:text-sm text-slate-500">Manage identity, memberships, and activity history.</p>
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
        <div className="max-w-7xl mx-auto space-y-6 py-4 pb-12 animate-in fade-in duration-500">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-6">
            <div className="lg:col-span-1">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {renderLeftPanel()}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="lg:col-span-2">
              <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-6 flex flex-col">
                <div className="pb-6">
                  <AnimatePresence mode="wait">
                    <motion.div key={activeTab}>
                      {renderFormContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-4 mt-auto">
                  <button type="button" onClick={() => navigate("/devotees")} className="w-full sm:w-auto px-4 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">Cancel</button>
                  <button type="submit" disabled={!formData.firstName || !formData.phone} className="w-full sm:w-auto px-4 py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 hover:bg-[#8e330b] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    <Save className="w-5 h-5" />
                    {isEdit ? "Update Profile" : "Register Profile"}
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

export default DevoteeForm;
