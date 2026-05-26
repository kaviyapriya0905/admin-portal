import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Megaphone,
  Globe,
  TrendingUp,
  Pencil,
  Trash2,
  BarChart3,
  Filter,
  X,
  Target,
  MapPin,
  Users,
  Plus,
  Send,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { type RootState } from "../../../redux/store";
import StatCard from "../../../components/ui/StatCard";
import { getMockData, deleteMockItem } from "../../../utils/mockData";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
import { isAdminManagerRole } from "../../../utils/userRole";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { LiveBroadcastAnalytics } from "./components/LiveListWidgets";

const Campaigns: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: "",
    name: "",
  });
  const [liveProgress, setLiveProgress] = useState<Record<string, number>>({});
  const [goalReachedCampaign, setGoalReachedCampaign] = useState<any | null>(null);

  const { activeTempleId, temples } = useSelector(
    (state: RootState) => state.temple,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const canManage = isAdminManagerRole(user);

  const fetchCampaigns = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = getMockData();
      const mockCampaigns = data.campaigns || [];
      const processed = mockCampaigns.map((c: any) => ({
        ...c,
        id: c.id,
        templeName: c.templeName || temples.find(t => t.id === c.templeId)?.name || "Unknown",
        name: c.name || c.title || "Untitled",
        type: c.type || "Email",
        reach: c.reach || "0",
        funds: c.funds || "₹0L",
        status: c.status || "Active",
        end: c.end || new Date().toLocaleDateString(),
      }));

      if (activeTab !== "All") {
        setCampaigns(processed.filter((d: any) => d.status === activeTab));
      } else {
        setCampaigns(processed);
      }
    } catch (err) {
      console.error("Failed to fetch campaigns", err);
    }
  }, [activeTempleId, activeTab, temples]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns, temples]);

  useEffect(() => {
    const interval = setInterval(() => {
       setLiveProgress(prev => {
          const next = { ...prev };
          let updated = false;
          campaigns.forEach(camp => {
             if (camp.status === "Active") {
                const current = next[camp.id] || 0;
                if (current < 100) {
                   next[camp.id] = Math.min(current + (Math.random() * 8 + 2), 100);
                   updated = true;
                } else if (current === 100) {
                   // Mark done momentarily
                   setTimeout(() => {
                      confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ["#f59e0b", "#10b981", "#3b82f6"]
                      });
                      setGoalReachedCampaign(camp);
                      setLiveProgress(p => ({...p, [camp.id]: 101})); // 101 means finished in this mock
                   }, 500);
                }
             }
          });
          return updated ? next : prev;
       });
    }, 2500);
    return () => clearInterval(interval);
  }, [campaigns]);

  const stats = [
    {
      title: "Active Campaigns",
      value: campaigns.length.toString().padStart(2, "0"),
      icon: Megaphone,
      color: "bg-brand-primary/10 text-brand-primary",
    },
    {
      title: "Total Reach",
      value: "12.4k",
      icon: Globe,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Conversion",
      value: "18%",
      icon: TrendingUp,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const filteredList = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const confirmDelete = async () => {
    setIsDeleting(deleteModal.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      deleteMockItem("campaigns", deleteModal.id);
      toast.success(`Campaign ${deleteModal.name} removed`);
      fetchCampaigns();
      setDeleteModal({ isOpen: false, id: "", name: "" });
    } catch (err) {
      toast.error("Error deleting campaign");
    } finally {
      setIsDeleting(null);
    }
  };



  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Campaigns & Outreach
          </h1>
          <p className="text-[13px] text-slate-400 mt-1">
            Displaying{" "}
            {activeTempleId === "all"
              ? "Consolidated trust outreach"
              : "Linked temple outreach"}
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group">
            <BarChart3 className="w-3.5 h-3.5" />
            Analytics Dashboard
          </button>
          {canManage && (
            <button
              onClick={() => navigate("/campaigns/add")}
              className="flex-1 sm:flex-none px-4 py-2 bg-brand-primary text-white rounded-md text-[11px] font-semibold hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Campaign
            </button>
          )}
        </div>
      </div>

      <LiveBroadcastAnalytics />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/20">
          <div className="flex gap-6 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {["All", "Active", "Scheduled", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-2 text-[12px] font-bold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "text-brand-primary"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-white transition-all"
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
            </button>
            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-100 shadow-xl rounded-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[11px] font-bold text-slate-700">
                    Filter Campaigns
                  </h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-1 hover:bg-slate-50 rounded-md"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 py-2">
                  Advanced filters coming soon
                </div>
              </div>
            )}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                type="text"
                placeholder="Search campaigns..."
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
                  Campaign Identity
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Temple Unit
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Target Reach
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Budget Status
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Integrations
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
                filteredList.map((camp, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                          <Target className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-slate-700">
                            {camp.name}
                          </p>
                          <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mt-0.5 inline-block">
                            {camp.type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-semibold whitespace-nowrap">
                        <MapPin className="w-3 h-3 text-brand-primary/80" />
                        {camp.templeName}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                        <Users className="w-3 h-3 text-slate-400" />
                        {camp.reach}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 w-32">
                        <div className="flex justify-between text-[10px] font-medium text-slate-600">
                          <span>₹{(parseInt(camp.spent || '0') / 1000).toFixed(1)}k</span>
                          <span className="text-slate-400">₹{(parseInt(camp.budget || '0') / 1000).toFixed(1)}k</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${parseInt(camp.spent || '0') >= parseInt(camp.budget || '1') ? 'bg-rose-500' : 'bg-brand-primary'}`}
                            style={{ width: `${Math.min((parseInt(camp.spent || '0') / parseInt(camp.budget || '1')) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {camp.metaConnected && (
                          <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100" title="Meta Ads Linked">
                            <span className="text-[10px] font-bold text-blue-600">M</span>
                          </div>
                        )}
                        {camp.provider && (
                          <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200" title={camp.provider}>
                            <Globe className="w-3 h-3 text-slate-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-flex w-fit items-center px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                            camp.status === "Active"
                              ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                              : camp.status === "Scheduled"
                                ? "text-brand-primary bg-brand-primary/10 border-brand-primary/20"
                                : "text-slate-600 bg-slate-100 border-slate-200"
                          }`}
                        >
                          {camp.status === "Active" && liveProgress[camp.id] && liveProgress[camp.id] < 100 && (
                             <Send className="w-3 h-3 mr-1 animate-pulse" />
                          )}
                          {camp.status}
                        </span>
                        
                        {camp.status === "Active" && liveProgress[camp.id] !== undefined && liveProgress[camp.id] <= 100 && (
                           <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <motion.div 
                                className="bg-emerald-500 h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${liveProgress[camp.id]}%` }}
                                transition={{ ease: "linear" }}
                              />
                           </div>
                        )}
                      </div>
                    </td>
                    {canManage && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              navigate(`/campaigns/edit/${camp.id}`)
                            }
                            className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-300/60 hover:bg-amber-50 rounded-md shadow-sm transition-all duration-300 group/btn"
                            title="Edit Campaign"
                          >
                            <Pencil className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                id: camp.id,
                                name: camp.name,
                              })
                            }
                            className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300/60 hover:bg-rose-50 rounded-md shadow-sm transition-all duration-300 group/btn"
                            title="Delete Campaign"
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
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Megaphone className="w-8 h-8 text-slate-200" />
                      <p className="text-[12px] font-medium text-slate-400">
                        No campaigns found matching your filters.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setActiveTab("All");
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
        title="Delete Campaign"
        itemName={deleteModal.name}
        message="Are you sure you want to remove this campaign? This action cannot be undone."
      />

      <AnimatePresence>
        {goalReachedCampaign && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-primary/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-brand-primary to-emerald-400" />
              
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 shadow-sm mx-auto">
                <Target className="w-8 h-8 text-emerald-500" />
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Goal Reached! 🎉</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed">
                  The <span className="font-bold text-slate-700">"{goalReachedCampaign.name}"</span> campaign has successfully reached 100% completion.
                </p>
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 inline-block">
                  <p className="text-[12px] font-semibold text-slate-700">
                    Dispatch automated Thank You emails to {Number(goalReachedCampaign.reach).toLocaleString()} {goalReachedCampaign.type}?
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setGoalReachedCampaign(null)}
                  className="flex-1 px-4 py-2.5 text-[13px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    toast.success(`Thank you emails dispatched for ${goalReachedCampaign.name}!`, { icon: "✉️" });
                    setGoalReachedCampaign(null);
                  }}
                  className="flex-1 px-4 py-2.5 text-[13px] font-bold text-white bg-brand-primary hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/30 rounded-xl transition-all"
                >
                  Dispatch Emails
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Campaigns;
