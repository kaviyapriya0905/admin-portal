import React, { useState, useEffect } from "react";
import {
  Users,
  
  Filter as FilterIcon,
  Mail,
  Phone,
  CheckCircle2,
  X,
  MapPin,
  Pencil,
  Trash2,
  Plus,
  Activity,
  
  
  
  
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { type RootState } from "@/store/store";
import StatCard from "@/components/ui/StatCard";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import SmartSearchBar from "@/components/ui/SmartSearchBar";
import { getMockData, deleteMockItem } from "@/utils/mockData";
import { isAdminManagerRole } from "@/utils/userRole";
import { motion } from "framer-motion";
import { LiveFootfallWidget } from "@/pages/temple-ops/components/LiveListWidgets";

const Devotees: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [devotees, setDevotees] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [typeFilter, setTypeFilter] = useState<
    "All" | "Life Member" | "Regular" | "Donor"
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
  const [liveInside, setLiveInside] = useState(1240);
  const [liveDevoteeIds, setLiveDevoteeIds] = useState<string[]>([]);

  const fetchDevotees = React.useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network
      const data = getMockData();
      const devoteeArray = data.devotees || [];
      const fetched = devoteeArray.map((d: any) => ({
        ...d,
        id: d.id, 
        name: d.name || `${d.first_name || ""} ${d.last_name || ""}`.trim(),
        email: d.email || "",
        phone: d.phone || "",
        status: d.status || "Active",
        type: d.membershipType || d.type || "Regular",
        location: d.location || "Unknown",
        engagementScore: d.engagementScore || 0,
        templeId: d.templeId || d.temple_id,
        templeName: temples.find((t) => t.id === (d.templeId || d.temple_id))?.name || d.templeName || "N/A",
        createdAt: d.createdAt || new Date().toISOString(),
      }));
      setDevotees(fetched);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load devotees");
    } finally {
      setLoading(false);
    }
  }, [temples]);

  useEffect(() => {
    fetchDevotees();
  }, [activeTempleId, fetchDevotees]);

  useEffect(() => {
    // Simulate real-time check-ins
    const interval = setInterval(() => {
      setLiveInside(prev => prev + Math.floor(Math.random() * 3));
      
      if (devotees.length > 0) {
        setLiveDevoteeIds(prev => {
          const newIds = [...prev];
          const randomDevotee = devotees[Math.floor(Math.random() * devotees.length)].id;
          if (!newIds.includes(randomDevotee)) {
            newIds.push(randomDevotee);
          }
          return newIds.slice(-5); // Keep last 5 active to simulate rotation
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [devotees]);

  const stats = [
    {
      title: "Total Devotees",
      value: devotees.length.toString(),
      icon: Users,
      color: "bg-brand-primary/10 text-brand-primary",
    },
    {
      title: "Active Registry",
      value: devotees.filter((d) => d.status === "Active").length.toString(),
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Highly Engaged",
      value: devotees.filter((d) => d.engagementScore > 80).length.toString(),
      icon: Activity,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const filteredList = devotees.filter((d) => {
    if (
      activeTempleId !== "all" &&
      d.temple_id &&
      d.temple_id.toString() !== activeTempleId.toString() &&
      d.templeId !== activeTempleId
    ) {
      return false;
    }
    const matchesSearch =
      (d.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.id || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    const matchesType = typeFilter === "All" || d.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const confirmDelete = async () => {
    setIsDeleting(deleteModal.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      deleteMockItem("devotees", deleteModal.id);
      toast.success(`${deleteModal.name} removed from registry`);
      fetchDevotees();
      setDeleteModal({ isOpen: false, id: "", name: "" });
    } catch {
      toast.error("Error deleting devotee");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
            Devotee Management
            <span className="flex items-center gap-1.5 px-2 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              Live Inside: {liveInside}
            </span>
          </h1>
          <p className="text-[13px] text-slate-400 mt-1">
            Displaying{" "}
            {activeTempleId === "all"
              ? "Consolidated Trust Data"
              : "Linked Temple Data"}
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          {canManage && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/devotees/add")}
              className="w-full sm:w-auto px-6 py-3 bg-brand-primary text-white rounded-xl text-sm font-bold hover:shadow-xl hover:shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Add Devotee
            </motion.button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <LiveFootfallWidget />

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/20">
          <SmartSearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="by name, email or ID..."
            containerClassName="w-full sm:w-96 group"
          />

          <div className="relative flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex-1 sm:flex-none px-4 py-2 border rounded-lg text-[12px] font-semibold transition-all flex items-center justify-center gap-2 ${
                isFilterOpen || statusFilter !== "All" || typeFilter !== "All"
                  ? "border-brand-primary text-brand-primary bg-brand-primary/5"
                  : "border-slate-200 text-slate-600 hover:bg-white hover:shadow-sm"
              }`}
            >
              <FilterIcon className="w-3.5 h-3.5" />
              Filters
              {(statusFilter !== "All" || typeFilter !== "All") && (
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
              )}
            </button>

            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-100 shadow-xl rounded-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[12px] font-bold text-slate-700">
                    Filter Registry
                  </h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-1 hover:bg-slate-50 rounded-md text-slate-400"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                      Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["All", "Active", "Inactive"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setStatusFilter(s as any)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                            statusFilter === s
                              ? "bg-brand-primary text-white"
                              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                      Membership Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["All", "Life Member", "Regular", "Donor"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setTypeFilter(t as any)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                            typeFilter === t
                              ? "bg-brand-primary text-white"
                              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-50 flex gap-2">
                    <button
                      onClick={() => {
                        setStatusFilter("All");
                        setTypeFilter("All");
                      }}
                      className="flex-1 py-2 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Reset All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Devotee Detail
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Temple Unit
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Membership
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
              {filteredList.length > 0 ? (
                filteredList.map((devotee, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors relative">
                          {devotee.name.charAt(0)}
                          {liveDevoteeIds.includes(devotee.id) && (
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" title="Currently inside temple" />
                          )}
                        </div>
                        <div>
                          <p className="text-[12px] font-semibold text-slate-700">
                            {devotee.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {devotee.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {devotee.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-semibold whitespace-nowrap">
                        <MapPin className="w-3 h-3 text-brand-primary/80" />
                        {devotee.templeName}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100/60 whitespace-nowrap">
                        {devotee.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                          devotee.status === "Active"
                            ? "text-emerald-600 bg-emerald-50 border border-emerald-100"
                            : "text-slate-500 bg-slate-100 border border-slate-200"
                        }`}
                      >
                        {devotee.status}
                      </span>
                    </td>
                    {canManage && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/devotees/edit/${devotee.id}`);
                            }}
                            className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-300/60 hover:bg-amber-50 rounded-md shadow-sm transition-all duration-300"
                            title="Edit Record"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                id: devotee.id,
                                name: devotee.name,
                              })
                            }
                            className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300/60 hover:bg-rose-50 rounded-md shadow-sm transition-all duration-300"
                            title="Delete Devotee"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-slate-200" />
                      <p className="text-[12px] font-medium text-slate-400">
                        No devotees found matching your filters.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("All");
                          setTypeFilter("All");
                        }}
                        className="text-[10px] font-bold text-brand-primary hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        loading={!!isDeleting}
        title="Delete Devotee"
        itemName={deleteModal.name}
        message="Are you sure you want to remove this devotee from the registry?"
      />
    </div>
  );
};

export default Devotees;
