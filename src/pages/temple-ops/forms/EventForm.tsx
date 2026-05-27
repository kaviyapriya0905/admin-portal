import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Calendar, Clock, MapPin, User,
  Star, Flower2, Package, Bell, Repeat, ShieldCheck,
  Sparkles, ClipboardCheck, Utensils, Sun, CloudRain,
  CloudLightning, Info, Link2, Users, StickyNote
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import FormActions from "@/components/ui/FormActions";
import SmartField from "@/components/ui/SmartField";
import SmartSelect from "@/components/ui/SmartSelect";
import SmartTextarea from "@/components/ui/SmartTextarea";
import { getMockData, addMockItem, updateMockItem } from "@/utils/mockData";

const VENUES = [
  "Main Sanctum (Garbhagriha)",
  "Main Prayer Hall (Mandapa)",
  "Outer Courtyard (Prakara)",
  "Temple Kitchen (Madapalli)",
  "Annadhanam Hall",
  "Temple Garden (Nandavanam)",
  "Wedding Hall (Kalyana Mandapam)",
  "Yagasala",
  "Office Premises",
];

const STATUS_OPTIONS = ["Planned", "Scheduled", "In Progress", "Completed", "Cancelled"];

const EventForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    // Section 1: Identity & Event Mapping
    name: "",
    poojaType: "",
    festivalName: "",
    description: "",
    // Section 2: Logistics & Resources
    location: "",
    organizer: "",
    prasadam: "",
    resourceNeeded: "",
    // Section 3: Sequence Timing
    date: new Date().toISOString().split("T")[0],
    time: "",
    status: "Planned",
    attendees: "",
    // Recurring
    isRecurring: false,
    totalDays: 2,
  });

  const [weather, setWeather] = useState<"clear" | "rain" | "storm" | null>(null);

  useEffect(() => {
    if (isEdit) {
      const data = getMockData();
      const existing = data.events.find((e: any) => e.id === id);
      if (existing) {
        setFormData({
          name: (existing as any).name || (existing as any).title || "",
          poojaType: (existing as any).poojaType || (existing as any).type || "",
          festivalName: (existing as any).festivalName || "",
          description: (existing as any).description || "",
          location: (existing as any).location || (existing as any).venue || "",
          organizer: (existing as any).organizer || "",
          prasadam: (existing as any).prasadam || "",
          resourceNeeded: (existing as any).resourceNeeded || "",
          date: ((existing as any).date || "").split("T")[0] || new Date().toISOString().split("T")[0],
          time: (existing as any).time || "",
          status: (existing as any).status || "Planned",
          attendees: String((existing as any).attendees || ""),
          isRecurring: false,
          totalDays: 2,
        });
      }
    }
  }, [isEdit, id]);

  // Live weather forecast
  useEffect(() => {
    if (formData.date) {
      const timer = setTimeout(() => {
        const day = formData.date.slice(-2);
        if (day === "04" || day === "14") setWeather("storm");
        else if (day === "07" || day === "21") setWeather("rain");
        else setWeather("clear");
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setWeather(null);
    }
  }, [formData.date]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();



    if (weather === "storm") {
      toast.error("Warning: Severe weather expected on this date. Ensure indoor alternatives are ready.");
    }

    const baseEvent = {
      id: id || `EVT-${Math.floor(Math.random() * 10000)}`,
      name: formData.name,
      title: formData.name,
      poojaType: formData.poojaType,
      festivalName: formData.festivalName,
      description: formData.description,
      location: formData.location,
      venue: formData.location,
      organizer: formData.organizer,
      prasadam: formData.prasadam,
      resourceNeeded: formData.resourceNeeded,
      date: formData.date,
      time: formData.time,
      status: formData.status,
      attendees: Number(formData.attendees) || 0,
      templeId: "t1",
      templeName: "Sri Krishna Temple",
    };

    if (isEdit && id) {
      updateMockItem("events", id, baseEvent);
      toast.success("Event updated!");
    } else {
      if (formData.isRecurring && formData.totalDays > 1) {
        const startDate = new Date(formData.date);
        for (let i = 0; i < formData.totalDays; i++) {
          const d = new Date(startDate);
          d.setDate(startDate.getDate() + i);
          addMockItem("events", {
            ...baseEvent,
            id: `EVT-${Math.floor(Math.random() * 100000)}-${i}`,
            date: d.toISOString().split("T")[0],
            name: `${formData.name} (Day ${i + 1})`,
            title: `${formData.name} (Day ${i + 1})`,
          });
        }
        toast.success(`${formData.totalDays} recurring event entries created!`);
      } else {
        addMockItem("events", baseEvent);
        toast.success("Event created successfully!");
      }
    }
    navigate("/events");
  };

  const slug = formData.name
    ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    : "";

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Sticky Header */}
      <div className="shrink-0 bg-[#fafafa] border-b border-slate-100 px-0 pb-4 mb-0 flex items-start sm:items-center gap-4">
        <button onClick={() => navigate("/events")} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shrink-0 mt-1 sm:mt-0">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 flex items-center gap-2">
            {formData.festivalName ? <Sparkles className="w-5 h-5 text-brand-primary" /> : <ClipboardCheck className="w-5 h-5 text-brand-primary" />}
            {isEdit ? "Modify Event Registry" : "New Event Registration"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Ritual Management Sequence · Active Session
          </p>
        </div>
      </div>

      {/* Main body (No outer scrollbar, handled by inner columns) */}
      <div className="flex-1 min-h-0 overflow-hidden pb-4">
        <div className="max-w-7xl mx-auto h-full px-4 pt-4 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-4 h-full">
            {/* Left sidebar */}
            <div className="lg:col-span-1 space-y-6 h-full overflow-y-auto custom-scrollbar pr-2 pb-10 lg:pb-0">
              {/* Weather Forecast */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-500" /> Event Weather
                </h3>
                <p className="text-[11px] text-slate-400 mb-4">Select a date for live meteorological forecast.</p>

                {!weather ? (
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center text-slate-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Select Date for Forecast</span>
                  </div>
                ) : weather === "clear" ? (
                  <div className="p-5 bg-sky-50 border border-sky-200 rounded-xl">
                    <Sun className="w-7 h-7 text-amber-500 mb-2" />
                    <h4 className="font-bold text-sky-700 text-sm mb-1">Clear Skies</h4>
                    <p className="text-sky-600 text-[11px]">Perfect weather for outdoor processions and events.</p>
                  </div>
                ) : weather === "rain" ? (
                  <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <CloudRain className="w-7 h-7 text-indigo-500 mb-2" />
                    <h4 className="font-bold text-indigo-700 text-sm mb-1">Light Rain</h4>
                    <p className="text-indigo-600 text-[11px]">Consider arranging canopies for outdoor areas.</p>
                  </div>
                ) : (
                  <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl">
                    <CloudLightning className="w-7 h-7 text-rose-500 mb-2" />
                    <h4 className="font-bold text-rose-700 text-sm mb-1">Thunderstorms</h4>
                    <p className="text-rose-600 text-[11px] font-bold">CRITICAL: Prepare indoor alternatives immediately.</p>
                  </div>
                )}
              </div>

              {/* Event Summary */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-indigo-500" /> Event Summary
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Name", value: formData.name || "—" },
                    { label: "Category", value: formData.poojaType || "—" },
                    { label: "Festival", value: formData.festivalName || "—" },
                    { label: "Venue", value: formData.location ? formData.location.split("(")[0].trim() : "—" },
                    { label: "Date", value: formData.date || "—" },
                    { label: "Time", value: formData.time || "—" },
                    { label: "Status", value: formData.status || "—" },
                    { label: "Attendees", value: formData.attendees ? `~${formData.attendees}` : "—" },
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
            <div className="lg:col-span-2 h-full min-h-0">
              <form onSubmit={handleSave} className="flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-6 space-y-4">

                  {/* Section 1: Identity & Event Mapping */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                    <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"><Star className="w-4 h-4 text-indigo-600" /></span>
                      1. Identity & Event Mapping
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <SmartField
                          label="Event / Pooja Name"
                          icon={Star}

                          value={formData.name}
                          onChange={v => setFormData(p => ({ ...p, name: v }))}
                          validationFn={v => v.length > 3 ? true : null}
                          helperText="e.g. Maha Shivaratri Celebration"
                        />
                        <AnimatePresence>
                          {slug && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
                              className="mt-2 pl-4 flex items-center gap-1.5 text-[10px] font-mono text-slate-400"
                            >
                              <Link2 className="w-3 h-3" /> https://temple.org/events/{slug}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <SmartField
                        label="Pooja Category"
                        icon={Bell}
                        value={formData.poojaType}
                        onChange={v => setFormData(p => ({ ...p, poojaType: v }))}
                        helperText="e.g. Abhishekam"
                      />

                      <SmartField
                        label="Festival Reference"
                        icon={Flower2}
                        value={formData.festivalName}
                        onChange={v => setFormData(p => ({ ...p, festivalName: v }))}
                        helperText="e.g. Kartik Purnima"
                      />

                      <div className="sm:col-span-2">
                        <SmartTextarea
                          label="Ritual Description & Notes"
                          icon={StickyNote}
                          value={formData.description}
                          onChange={(val) => setFormData(p => ({ ...p, description: val }))}
                          placeholder="Detailed ritual process, special devotee requirements, or administrative notes..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Logistics & Resources */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                    <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center"><Package className="w-4 h-4 text-emerald-600" /></span>
                      2. Logistics & Resources
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <SmartSelect
                        label="Venue / Premises"
                        icon={MapPin}
                        value={formData.location}
                        onChange={v => setFormData(p => ({ ...p, location: v }))}
                        options={VENUES}
                      />

                      <SmartField
                        label="Main Coordinator"
                        icon={User}
                        value={formData.organizer}
                        onChange={v => setFormData(p => ({ ...p, organizer: v }))}
                        helperText="e.g. Temple Committee"
                      />

                      <SmartField
                        label="Prasadam Matrix"
                        icon={Utensils}
                        value={formData.prasadam}
                        onChange={v => setFormData(p => ({ ...p, prasadam: v }))}
                        helperText="e.g. Pongal & Tamarind Rice"
                      />

                      <SmartField
                        label="Resource / Samagri"
                        icon={Package}
                        value={formData.resourceNeeded}
                        onChange={v => setFormData(p => ({ ...p, resourceNeeded: v }))}
                        helperText="e.g. Flowers, Ghee, Milk"
                      />
                    </div>
                  </div>

                  {/* Section 3: Sequence Timing */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                    <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><Clock className="w-4 h-4 text-amber-600" /></span>
                      3. Sequence Timing
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <SmartField
                        label="Event Registry Date"
                        icon={Calendar}
                        type="date"

                        min={new Date().toISOString().split("T")[0]}
                        value={formData.date}
                        onChange={v => setFormData(p => ({ ...p, date: v }))}
                      />

                      <SmartField
                        label="Start Time (IST)"
                        icon={Clock}
                        type="time"
                        value={formData.time}
                        onChange={v => setFormData(p => ({ ...p, time: v }))}
                      />

                      <SmartSelect
                        label="Sequence Status"
                        icon={ClipboardCheck}
                        value={formData.status}
                        onChange={v => setFormData(p => ({ ...p, status: v }))}
                        options={STATUS_OPTIONS}
                      />

                      <SmartField
                        label="Expected Attendance"
                        icon={Users}
                        type="number"
                        value={formData.attendees}
                        onChange={v => setFormData(p => ({ ...p, attendees: v }))}
                        helperText="Estimated devotees"
                      />
                    </div>
                  </div>

                  {/* Section 4: Recurring (only on create) */}
                  {!isEdit && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            <Repeat className="w-4 h-4 text-brand-primary" /> Sequence Protocol
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1">Enable recurring / multi-day event scheduling</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isRecurring}
                            onChange={e => setFormData(p => ({ ...p, isRecurring: e.target.checked }))}
                            className="w-5 h-5 rounded accent-brand-primary cursor-pointer"
                          />
                        </label>
                      </div>

                      <AnimatePresence>
                        {formData.isRecurring && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-5 pt-5 border-t border-slate-100"
                          >
                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                                Total Sequence Cycle (Days)
                              </label>
                              <div className="flex items-center gap-5">
                                <div className="w-48">
                                  <SmartField
                                    label="Days"
                                    icon={Repeat}
                                    type="number"
                                    min={2}
                                    max={30}
                                    value={formData.totalDays.toString()}
                                    onChange={(val) => setFormData(p => ({ ...p, totalDays: Number(val) || 2 }))}
                                  />
                                </div>
                                <div>
                                  <p className="text-[12px] font-bold text-slate-700">Daily Iteration</p>
                                  <p className="text-[10px] text-slate-400">Registry persistence per day</p>
                                </div>
                              </div>
                              <div className="mt-3 flex items-center gap-2 text-brand-primary">
                                <Info className="w-3.5 h-3.5" />
                                <p className="text-[10px] font-bold">Automated creation of {formData.totalDays} event records.</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="shrink-0 pt-4 mt-2 border-t border-slate-200">
                  <FormActions
                    onCancel={() => navigate("/events")}
                    cancelText="Discard Changes"
                    submitText={isEdit ? "Complete Registry Entry" : formData.isRecurring ? `Create ${formData.totalDays} Events` : "Complete Registry Entry"}
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

export default EventForm;
