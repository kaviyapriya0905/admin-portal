import React, { useState, useEffect } from "react";
import {
  Search,
  Filter as FilterIcon,
  X,
  Pencil,
  Trash2,
  Flame,
  CalendarDays,
  Timer,
  Clock,
  Calendar,
  CheckCircle2,
  MapPin,
  Plus,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { type RootState } from "../../../redux/store";
import { getMockData, deleteMockItem } from "../../../utils/mockData";
import { ActiveRitualsMonitor } from "./components/LiveListWidgets";
import StatCard from "../../../components/ui/StatCard";

import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
import { isAdminManagerRole } from "../../../utils/userRole";
import { motion, AnimatePresence } from "framer-motion";

const PoojaSevas: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "All" | "Upcoming" | "Recurring" | "History"
  >("All");
  const [sevas, setSevas] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Confirmed" | "Pending"
  >("All");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: "",
    name: "",
  });

  const { activeTempleId, temples } = useSelector(
    (state: RootState) => state.temple,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const canManage = isAdminManagerRole(user);
  const [, setLoading] = useState(false);
  const [liveTimers, setLiveTimers] = useState<Record<string, number>>({});

  const fetchSevas = React.useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = getMockData();
      const fetchedSevas = data.poojaSevas || [];
      const processed = fetchedSevas.map((s: any) => {
        const devoteeName = s.devotee || s.devoteeName || "";
        const templeId = s.templeId;
        const templeName = temples.find((t) => t.id === templeId)?.name || s.templeName || "Unknown";

        let dateStr = "N/A";
        let timeStr = "N/A";
        let formDate = "";
        let formTime = "";
        let type = "Upcoming";

        if (s.seva_date) {
          const dateObj = new Date(s.seva_date);
          dateStr = dateObj.toLocaleDateString();
          timeStr = dateObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          if (s.notes && s.notes.includes("TYPE:")) {
            const match = s.notes.match(/TYPE:(\w+)/);
            if (match && match[1]) {
              type = match[1];
            }
          } else if (dateObj < new Date() && s.status !== "Completed") {
            type = "History";
          }

          const yyyy = dateObj.getFullYear();
          const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
          const dd = String(dateObj.getDate()).padStart(2, "0");
          formDate = `${yyyy}-${mm}-${dd}`;

          const hh = String(dateObj.getHours()).padStart(2, "0");
          const min = String(dateObj.getMinutes()).padStart(2, "0");
          formTime = `${hh}:${min}`;
        }

        // Map Scheduled -> Confirmed for UI
        let uiStatus = s.status;
        if (uiStatus === "Scheduled") uiStatus = "Confirmed";

        return {
          id: s.id,
          name: s.seva_name,
          amount: s.seva_amount,
          date: dateStr,
          time: timeStr,
          originalDate: s.seva_date,
          formDate: formDate,
          formTime: formTime,
          devotee: devoteeName || s.devotee_id,
          devoteeId: s.devotee_id,
          templeId: templeId,
          templeName: templeName,
          status: uiStatus,
          payment_status: s.payment_status,
          type: type,
        };
      });
      setSevas(processed);
    } catch (error) {
      console.error("Error fetching sevas", error);
      toast.error("Failed to load pooja sevas");
    } finally {
      setLoading(false);
    }
  }, [temples]);




  useEffect(() => {
    fetchSevas();
  }, [activeTempleId, fetchSevas]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTimers(prev => {
        const next = { ...prev };
        // Randomly start an upcoming seva to simulate real-time queue shift
        if (sevas.length > 0 && Math.random() > 0.8) {
          const upcoming = sevas.filter(s => s.status === "Confirmed" && !next[s.id]);
          if (upcoming.length > 0) {
            const randomSeva = upcoming[Math.floor(Math.random() * upcoming.length)];
            next[randomSeva.id] = 45 * 60; // 45 mins in seconds
          }
        }
        
        // Decrement existing timers
        let updated = false;
        Object.keys(next).forEach(id => {
          if (next[id] > 0) {
             next[id] -= 1; // decrement by 1 sec
             updated = true;
          } else if (next[id] === 0) {
             next[id] = -1; // marked as completed
             updated = true;
          }
        });
        return updated ? next : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sevas]);

  const stats = [
    {
      title: "Today's Sevas",
      value: sevas.length.toString(),
      icon: Flame,
      color: "bg-brand-primary/10 text-brand-primary",
    },
    {
      title: "Booked Slots",
      value: (sevas.length * 4).toString(),
      icon: CalendarDays,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Avg Duration",
      value: "45m",
      icon: Timer,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const filteredList = sevas.filter((s) => {
    const matchesSearch =
      (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.devotee || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;

    let matchesTab = true;
    if (activeTab === "Upcoming") {
      matchesTab =
        s.type === "Upcoming" || (!s.type && s.status !== "Completed");
    } else if (activeTab === "Recurring") {
      matchesTab = s.type === "Recurring";
    } else if (activeTab === "History") {
      matchesTab = s.type === "History" || s.status === "Completed";
    } else if (activeTab === "All") {
      matchesTab = true;
    }

    return matchesSearch && matchesStatus && matchesTab;
  });

  const confirmDelete = async () => {
    setIsDeleting(deleteModal.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      deleteMockItem("poojaSevas", deleteModal.id);
      toast.success(`${deleteModal.name} removed from schedule`);
      fetchSevas();
      setDeleteModal({ isOpen: false, id: "", name: "" });
    } catch {
      toast.error("Error deleting seva booking");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Pooja & Seva Management
          </h1>
          <p className="text-[13px] text-slate-400 mt-1">
            Displaying{" "}
            {activeTempleId === "all"
              ? "Consolidated trust schedule"
              : "Linked temple schedule"}
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          {canManage && (
            <button
              onClick={() => navigate("/pooja-sevas/add")}
              className="flex-1 sm:flex-none px-4 py-2 bg-brand-primary text-white rounded-md text-[11px] font-semibold hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm shadow-brand-primary/20"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Pooja
            </button>
          )}
        </div>
      </div>

      <ActiveRitualsMonitor />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/20">
          <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-100 shadow-sm">
            {(["All", "Upcoming", "Recurring", "History"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                    activeTab === tab
                      ? "bg-brand-primary text-white"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab}
                </button>
              ),
            )}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-[12px] font-medium transition-all ${
                isFilterOpen || statusFilter !== "All"
                  ? "border-brand-primary text-brand-primary bg-brand-primary/5"
                  : "border-slate-200 text-slate-600 hover:bg-white"
              }`}
            >
              <FilterIcon className="w-3.5 h-3.5" />
              Filters
            </button>

            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-100 shadow-xl rounded-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[11px] font-bold text-slate-700">
                    Filter Schedule
                  </h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-1 hover:bg-slate-50 rounded-md"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                      Booking Status
                    </label>
                    <div className="space-y-1">
                      {["All", "Confirmed", "Pending"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatusFilter(s as any)}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                            statusFilter === s
                              ? "bg-brand-primary/10 text-brand-primary"
                              : "text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setStatusFilter("All")}
                    className="w-full pt-2 border-t border-slate-50 text-[10px] font-bold text-slate-400 hover:text-slate-600"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:border-brand-primary/30 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="w-full">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Service Detail
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Devotee
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Temple Unit
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                {canManage && (
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence>
              {filteredList.length > 0 ? (
                filteredList.map((seva, i) => {
                  const timer = liveTimers[seva.id];
                  const isOngoing = timer !== undefined && timer > 0;
                  const isJustCompleted = timer === -1;
                  const displayStatus = isOngoing ? "Ongoing" : (isJustCompleted ? "Completed" : seva.status);
                  
                  const formatTime = (seconds: number) => {
                    const m = Math.floor(seconds / 60);
                    const s = seconds % 60;
                    return `${m}:${s.toString().padStart(2, '0')}`;
                  };

                  return (
                  <motion.tr
                    key={seva.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`transition-colors group ${isOngoing ? 'bg-amber-50/30' : 'hover:bg-slate-50/60'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                          <Flame className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[12px] font-semibold text-slate-700">
                            {seva.name}
                          </p>
                          <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                            {seva.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-600 font-medium">
                      {seva.devotee}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-semibold whitespace-nowrap">
                        <MapPin className="w-3 h-3 text-brand-primary/80" />
                        {seva.templeName}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                          <Clock className={`w-3 h-3 ${isOngoing ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
                          {isOngoing ? (
                             <span className="text-amber-600 font-bold font-mono bg-amber-100 px-1.5 rounded">{formatTime(timer)} left</span>
                          ) : (
                             seva.time
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {seva.date}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border text-slate-600 bg-slate-50 border-slate-200">
                        {seva.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                          displayStatus === "Confirmed"
                            ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                            : displayStatus === "Completed"
                              ? "text-blue-600 bg-blue-50 border-blue-100"
                              : displayStatus === "Ongoing"
                              ? "text-amber-600 bg-amber-50 border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.2)] animate-pulse"
                              : "text-slate-600 bg-slate-50 border-slate-200"
                        }`}
                      >
                        {(displayStatus === "Confirmed" ||
                          displayStatus === "Completed") && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {displayStatus === "Ongoing" && <Timer className="w-3 h-3" />}
                        {displayStatus}
                      </span>
                    </td>
                    {canManage && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              navigate(`/pooja-sevas/edit/${seva.id}`)
                            }
                            className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-300/60 hover:bg-amber-50 rounded-md shadow-sm transition-all duration-300 group/btn"
                            title="Edit Booking"
                          >
                            <Pencil className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                id: seva.id,
                                name: seva.id,
                              })
                            }
                            className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300/60 hover:bg-rose-50 rounded-md shadow-sm transition-all duration-300 group/btn"
                            title="Delete Booking"
                          >
                            <Trash2 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                );
               })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-slate-400 text-[12px]"
                  >
                    No seva bookings found matching your search.
                  </td>
                </tr>
              )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
            <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        loading={!!isDeleting}
        title="Delete Booking"
        itemName={deleteModal.name}
        message="Are you sure you want to remove this booking? This action cannot be undone."
      />
    </div>
  );
};

export default PoojaSevas;
