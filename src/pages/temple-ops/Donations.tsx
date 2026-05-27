import React, { useState, useEffect } from "react";
import {
  HeartHandshake,
  
  IndianRupee,
  Wallet,
  Filter as FilterIcon,
  X,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  CreditCard,
  Pencil,
  Trash2,
  Plus,
  
  
  
  
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { type RootState } from "@/store/store";
import StatCard from "@/components/ui/StatCard";
import SmartSearchBar from "@/components/ui/SmartSearchBar";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import { getMockData, deleteMockItem } from "@/utils/mockData";
import { isAdminManagerRole } from "@/utils/userRole";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LiveDonationTicker } from "@/pages/temple-ops/components/LiveListWidgets";

// ── Backend ENUM values ───────────────────────────────────────────────────────
const PAY_METHODS = ["Cash", "UPI", "Card"];

interface Devotee {
  id: string;
  first_name: string;
  last_name: string;
}

const Donations: React.FC = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [devotees, setDevotees] = useState<Devotee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [methodFilter, setMethodFilter] = useState<string>("All");

  const navigate = useNavigate();
  // add / edit modal

  // delete modal
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: "",
    code: "",
  });

  const { activeTempleId, temples } = useSelector(
    (state: RootState) => state.temple,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const canManage = isAdminManagerRole(user);

  // ── Fetch donations ───────────────────────────────────────────────────────
  const fetchDonations = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = getMockData();
      const rows = data.donations.map((d: any) => ({
        ...d,
        id: d.id,
        donation_code: d.donation_code || d.id,
        amount: d.amount,
        category: d.purpose || d.category || "General",
        donation_date: d.date || d.donation_date || new Date().toISOString(),
        payment_method: d.method || d.payment_method || "UPI",
        payment_status: d.status || d.payment_status || "Success",
        devotee: { first_name: d.devotee?.split(' ')[0] || d.devotee || "Unknown", last_name: d.devotee?.split(' ')[1] || "" },
        templeId: d.templeId,
        templeName: temples.find(t => t.id === d.templeId)?.name || d.templeName || "Unknown Temple"
      }));
      setDonations(rows);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch devotees for select dropdown ───────────────────────────────────
  const fetchDevotees = async () => {
    try {
      const data = getMockData();
      const rows = data.devotees.map((d: any) => ({
        ...d,
        id: d.id,
        first_name: d.name?.split(' ')[0] || "",
        last_name: d.name?.split(' ')[1] || ""
      }));
      setDevotees(rows as any);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchDevotees();
  }, [activeTempleId]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate a major donation auto-prepending to the table occasionally
      if (Math.random() > 0.8) {
        setDonations(prev => {
          const newDonation = {
            id: `DON-${Date.now()}`,
            donation_code: `DON-${Date.now().toString().slice(-6)}`,
            devotee: { first_name: "Anonymous", last_name: "Devotee" },
            amount: (Math.floor(Math.random() * 5000) + 1000).toString(),
            category: "General",
            donation_date: new Date().toISOString(),
            channel: "Online",
            payment_method: "UPI",
            payment_status: "Success"
          };
          return [newDonation, ...prev];
        });
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalAmount = donations.reduce(
    (acc, d) => acc + parseFloat(d.amount ?? 0),
    0,
  );

  const stats = [
    {
      title: "Total Collection",
      value: `₹${(totalAmount / 100000).toFixed(2)}L`,
      icon: Wallet,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Registry Count",
      value: donations.length.toString(),
      icon: IndianRupee,
      color: "bg-brand-primary/10 text-brand-primary",
    },
    {
      title: "Successful",
      value: donations
        .filter((d) => d.payment_status === "Success")
        .length.toString(),
      icon: HeartHandshake,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  // ── Filter / search ───────────────────────────────────────────────────────
  const filteredList = donations.filter((d) => {
    const devoteeName = d.devotee
      ? `${d.devotee.first_name ?? ""} ${d.devotee.last_name ?? ""}`.trim()
      : "";
    const matchesSearch =
      devoteeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.donation_code ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || d.payment_status === statusFilter;
    const matchesMethod =
      methodFilter === "All" || d.payment_method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // ── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    setIsDeleting(deleteModal.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      deleteMockItem("donations", deleteModal.id);
      toast.success(`Donation ${deleteModal.code} removed`);
      fetchDonations();
      setDeleteModal({ isOpen: false, id: "", code: "" });
    } catch {
      toast.error("Error deleting donation");
    } finally {
      setIsDeleting(null);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const devoteeName = (d: any) => {
    if (d.devotee && typeof d.devotee === 'object' && (d.devotee.first_name || d.devotee.last_name)) {
      if (d.devotee.first_name !== "Unknown") {
        return `${d.devotee.first_name ?? ""} ${d.devotee.last_name ?? ""}`.trim();
      }
    }
    const dev = devotees.find((v) => v.id === d.devotee_id || v.id === d.devoteeId);
    return dev
      ? `${dev.first_name} ${dev.last_name}`.trim()
      : (d.donorName || d.devotee?.first_name || d.devotee || "—");
  };

  const templeName = (d: any) => {
    return d.templeName || "—";
  };

  const statusBadge = (status: string) => {
    if (status === "Success")
      return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (status === "Pending")
      return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-rose-600 bg-rose-50 border-rose-100";
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Donation Registry
          </h1>
          <p className="text-[13px] text-slate-400 mt-1">
            {activeTempleId === "all"
              ? "Consolidated trust collections"
              : "Linked temple collections"}
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          {canManage && (
            <button
              onClick={() => navigate("/donations/add")}
              className="flex-1 sm:flex-none px-4 py-2 bg-brand-primary text-white rounded-md text-[11px] font-semibold hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm shadow-brand-primary/20"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Donation
            </button>
          )}
        </div>
      </div>

      {/* Live Ticker */}
      <LiveDonationTicker />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/20">
          {/* Status tabs */}
          <div className="flex gap-4 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {["All", "Success", "Pending", "Failed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  statusFilter === tab
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/10"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab === "All" ? "All Transactions" : tab}
              </button>
            ))}
          </div>

          {/* Method filter + search */}
          <div className="flex items-center gap-2 w-full sm:w-auto relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-[12px] font-medium transition-all ${
                isFilterOpen || methodFilter !== "All"
                  ? "border-brand-primary text-brand-primary bg-brand-primary/5"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              <FilterIcon className="w-3.5 h-3.5" />
              Filters
            </button>

            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-100 shadow-xl rounded-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[12px] font-bold text-slate-700">
                    Filter Collections
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
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["All", ...PAY_METHODS].map((m) => (
                        <button
                          key={m}
                          onClick={() => setMethodFilter(m)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                            methodFilter === m
                              ? "bg-brand-primary text-white"
                              : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMethodFilter("All");
                      setStatusFilter("All");
                    }}
                    className="w-full py-2 text-[11px] font-bold text-slate-400 hover:text-slate-600 border-t border-slate-50"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            )}

              <SmartSearchBar 
                value={searchTerm} 
                onChange={setSearchTerm} 
                placeholder="by name or code..."
                containerClassName="flex-1 sm:w-64 group"
              />
          </div>
        </div>

        {/* Table */}
        <div className="w-full">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Donation Code
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Devotee
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Temple Unit
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Category
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
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-4 sm:py-10 text-center text-slate-400 text-[12px]"
                  >
                    Loading donations…
                  </td>
                </tr>
              ) : filteredList.length > 0 ? (
                <AnimatePresence>
                  {filteredList.map((tx, i) => (
                    <motion.tr
                      key={tx.id || i}
                      initial={{ opacity: 0, x: -20, backgroundColor: "#f0fdf4" }}
                      animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-white transition-all">
                          {tx.payment_status === "Success" ? (
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5 text-amber-500" />
                          )}
                        </div>
                        <span className="text-[11px] font-mono font-medium text-slate-500">
                          {tx.donation_code ?? tx.id?.slice(0, 8)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        {tx.devotee_id || tx.devoteeId ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/devotees/edit/${tx.devotee_id || tx.devoteeId}`);
                            }}
                            className="text-[12px] font-semibold text-brand-primary hover:underline text-left"
                          >
                            {devoteeName(tx)}
                          </button>
                        ) : (
                          <p className="text-[12px] font-semibold text-slate-700">
                            {devoteeName(tx)}
                          </p>
                        )}
                        <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                          {tx.donation_date
                            ? new Date(tx.donation_date).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-semibold whitespace-nowrap">
                        <MapPin className="w-3 h-3 text-brand-primary/80" />
                        {templeName(tx)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] font-bold text-slate-700">
                      ₹{parseFloat(tx.amount ?? 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
                          {tx.category ?? "—"}
                        </span>
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-medium">
                          <CreditCard className="w-2.5 h-2.5" />
                          {tx.payment_method ?? "—"}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${statusBadge(tx.payment_status)}`}
                      >
                        {tx.payment_status ?? "—"}
                      </span>
                    </td>
                    {canManage && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                               e.stopPropagation();
                               navigate(`/donations/edit/${tx.id}`);
                            }}
                            className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-300/60 hover:bg-amber-50 rounded-md shadow-sm transition-all duration-300 group/btn"
                            title="Edit Donation"
                          >
                            <Pencil className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                id: tx.id,
                                code: tx.donation_code ?? tx.id,
                              })
                            }
                            className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300/60 hover:bg-rose-50 rounded-md shadow-sm transition-all duration-300 group/btn"
                            title="Delete Donation"
                          >
                            <Trash2 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-4 sm:py-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <HeartHandshake className="w-8 h-8 text-slate-200" />
                      <p className="text-[12px] font-medium text-slate-400">
                        No donations found matching your filters.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("All");
                          setMethodFilter("All");
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

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        loading={!!isDeleting}
        title="Delete Donation"
        itemName={deleteModal.code}
        message="Are you sure you want to remove this donation record? This action cannot be undone."
      />
    </div>
  );
};

export default Donations;
