import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Pencil,
  Trash2,
  Package,
  Box,
  AlertCircle,
  RotateCcw,
  MapPin,
  Tag,
  Warehouse,
  Filter as FilterIcon,
  X,
  Plus,
  ThermometerSun,
  Droplets,
  CheckSquare,
  Wrench,
  Loader2,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { type RootState } from "../../../redux/store";
import { LiveInventoryMovement } from "./components/LiveListWidgets";
import StatCard from "../../../components/ui/StatCard";
import { getMockData, deleteMockItem } from "../../../utils/mockData";

import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
import { isAdminManagerRole } from "../../../utils/userRole";
import { motion, AnimatePresence } from "framer-motion";

const Assets: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [assets, setAssets] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<
    "All" | "Sacred Item" | "Kitchen" | "Infrastructure"
  >("All");
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: "",
    name: "",
  });
  const [liveMetrics, setLiveMetrics] = useState<Record<string, { temp?: number; fuel?: number }>>({});
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  const { activeTempleId, temples } = useSelector(
    (state: RootState) => state.temple,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const canManage = isAdminManagerRole(user);

  const fetchAssets = useCallback(async () => {
    try {
      const data = getMockData();
      let allAssets = data.assets || [];
      if (activeTempleId && activeTempleId !== "all") {
        allAssets = allAssets.filter(a => a.templeId === activeTempleId);
      }
      const processed = allAssets.map((a: any) => ({
        id: a.id,
        templeName: a.temple_id || a.templeName || "Unknown",
        name: a.name || a.assetName || "Unknown",
        category: a.category || "General",
        value: a.value || "0",
        lastAudit: (a.purchaseDate || a.purchase_date)
          ? new Date(a.purchaseDate || a.purchase_date).toLocaleDateString()
          : a.lastAudit || "-",
        location: a.notes || a.location || "Storage",
        status:
          a.maintenanceStatus === "Overdue" || a.condition === "Poor" || a.status === "Maintenance"
              ? "Maintenance"
              : "Active",
      }));
      setAssets(processed);
    } catch (err) {
      console.error("Failed to fetch assets", err);
    }
  }, [activeTempleId]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets, temples]);

  useEffect(() => {
    const interval = setInterval(() => {
       setLiveMetrics(prev => {
          const next = { ...prev };
          assets.forEach(asset => {
             if (asset.category === "Kitchen") {
                const currentTemp = next[asset.id]?.temp || 4;
                const change = (Math.random() - 0.5) * 1.5;
                next[asset.id] = { ...next[asset.id], temp: Math.min(Math.max(currentTemp + change, 1), 8) };
             } else if (asset.category === "Infrastructure") {
                const currentFuel = next[asset.id]?.fuel || 85;
                const change = Math.random() * 0.5;
                next[asset.id] = { ...next[asset.id], fuel: Math.max(currentFuel - change, 10) };
             }
          });
          return next;
       });
    }, 3000);
    return () => clearInterval(interval);
  }, [assets]);

  const stats = [
    {
      title: "Total Assets",
      value: assets.length.toString(),
      icon: Package,
      color: "bg-slate-50 text-slate-600",
    },
    {
      title: "In Use",
      value: assets.filter((a) => a.status === "Active").length.toString(),
      icon: Box,
      color: "bg-brand-primary/10 text-brand-primary",
    },
    {
      title: "Needs Service",
      value: assets.filter((a) => a.status === "Maintenance").length.toString(),
      icon: AlertCircle,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  const filteredList = assets.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || a.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const confirmDelete = async () => {
    setIsDeleting(deleteModal.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      deleteMockItem("assets", deleteModal.id);
      toast.success(`Asset ${deleteModal.name} removed`);
      fetchAssets();
      setDeleteModal({ isOpen: false, id: "", name: "" });
    } catch (err) {
      toast.error("Error deleting asset");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkMaintenance = async () => {
    setIsBulkUpdating(true);
    // Simulate API delay for bulk update
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAssets(prev => prev.map(a => 
      selectedAssets.includes(a.id) ? { ...a, status: "Maintenance Pending" } : a
    ));
    
    toast.success(`${selectedAssets.length} assets scheduled for maintenance`);
    setSelectedAssets([]);
    setIsBulkUpdating(false);
  };
  
  const toggleSelection = (id: string) => {
    setSelectedAssets(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };



  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Asset & Inventory Registry
          </h1>
          <p className="text-[13px] text-slate-400 mt-1">
            Governance for{" "}
            {activeTempleId === "all"
              ? "Consolidated trust property"
              : "Linked temple property"}
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group">
            <RotateCcw className="w-3.5 h-3.5" />
            Audit Sync
          </button>
          {canManage && (
            <button
              onClick={() => navigate("/assets/add")}
              className="flex-1 sm:flex-none px-4 py-2 bg-brand-primary text-white rounded-md text-[11px] font-semibold hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Asset
            </button>
          )}
        </div>
      </div>

      <LiveInventoryMovement />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/20">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {["All", "Sacred Item", "Kitchen", "Infrastructure"].map((t) => (
              <button
                key={t}
                onClick={() => setCategoryFilter(t as any)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${categoryFilter === t ? "bg-white text-brand-primary shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}
              >
                {t === "All" ? "All Assets" : t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-[12px] font-medium transition-all ${
                isFilterOpen
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
                    Inventory Filters
                  </h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-1 hover:bg-slate-50 rounded-md"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  Advanced filters coming soon...
                </p>
              </div>
            )}

            <div className="relative w-full sm:w-72 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
              <input
                type="text"
                placeholder="Search assets by ID or name..."
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
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-10">
                  <div className="flex items-center justify-center">
                    <CheckSquare className="w-4 h-4 text-slate-300" />
                  </div>
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Asset / Identification
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Temple Unit
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Classification
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Location Hub
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
                filteredList.map((item, i) => (
                  <tr
                    key={i}
                    className={`transition-colors group cursor-pointer ${selectedAssets.includes(item.id) ? 'bg-brand-primary/5' : 'hover:bg-slate-50/60'}`}
                    onClick={(e) => {
                       // prevent triggering if clicking buttons
                       if ((e.target as HTMLElement).closest('button')) return;
                       toggleSelection(item.id);
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                          checked={selectedAssets.includes(item.id)}
                          onChange={() => toggleSelection(item.id)}
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-all duration-300">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[12px] font-semibold text-slate-700">
                            {item.name}
                          </p>
                          <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                            {item.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-semibold whitespace-nowrap">
                        <MapPin className="w-3 h-3 text-brand-primary/80" />
                        {item.templeName}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                          <Tag className="w-3 h-3 text-slate-400" />
                          {item.category}
                        </div>
                        {item.category === "Kitchen" && liveMetrics[item.id] && (
                           <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 w-fit animate-pulse">
                              <ThermometerSun className="w-2.5 h-2.5" />
                              {liveMetrics[item.id].temp?.toFixed(1)}°C
                           </div>
                        )}
                        {item.category === "Infrastructure" && liveMetrics[item.id] && (
                           <div className="flex items-center gap-1 text-[10px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 w-fit animate-pulse">
                              <Droplets className="w-2.5 h-2.5" />
                              {liveMetrics[item.id].fuel?.toFixed(1)}% Fuel
                           </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Warehouse className="w-3.5 h-3.5 text-slate-400" />
                        {item.location}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                          item.status === "Maintenance" || item.status === "Maintenance Pending"
                            ? "text-rose-600 bg-rose-50 border-rose-100"
                            : "text-emerald-600 bg-emerald-50 border-emerald-100"
                        }`}
                      >
                        {item.status === "Maintenance Pending" && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                        {item.status}
                      </span>
                    </td>
                    {canManage && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              navigate(`/assets/edit/${item.id}`)
                            }
                            className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-300/60 hover:bg-amber-50 rounded-md shadow-sm transition-all duration-300 group/btn"
                            title="Edit Asset"
                          >
                            <Pencil className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                id: item.id,
                                name: item.name,
                              })
                            }
                            className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300/60 hover:bg-rose-50 rounded-md shadow-sm transition-all duration-300 group/btn"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
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
                      <Package className="w-8 h-8 text-slate-200" />
                      <p className="text-[12px] font-medium text-slate-400">
                        No assets found matching your filters.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setCategoryFilter("All");
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
        title="Delete Asset"
        itemName={deleteModal.name}
        message="Are you sure you want to remove this asset? This action cannot be undone."
      />
      
      {/* Floating Action Bar for Bulk Selection */}
      <AnimatePresence>
         {selectedAssets.length > 0 && (
            <motion.div 
               initial={{ y: 100, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 100, opacity: 0 }}
               className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 flex items-center gap-6 z-50 w-full max-w-lg"
            >
               <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-800">{selectedAssets.length} Assets Selected</span>
                  <span className="text-[11px] text-slate-500">Ready for bulk actions</span>
               </div>
               <div className="flex gap-3 ml-auto">
                  <button 
                     onClick={() => setSelectedAssets([])}
                     className="px-4 py-2 text-[12px] font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                     Cancel
                  </button>
                  <button 
                     onClick={handleBulkMaintenance}
                     disabled={isBulkUpdating}
                     className="px-4 py-2 text-[12px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg flex items-center gap-2 shadow-sm shadow-rose-600/20 disabled:opacity-70 transition-colors"
                  >
                     {isBulkUpdating ? (
                        <>
                           <Loader2 className="w-4 h-4 animate-spin" />
                           Scheduling...
                        </>
                     ) : (
                        <>
                           <Wrench className="w-4 h-4" />
                           Schedule Maintenance
                        </>
                     )}
                  </button>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default Assets;
