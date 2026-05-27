import React, { useState, useEffect } from "react";
import { Megaphone, TrendingUp, Pencil, Trash2, BarChart3, Plus, ShieldAlert } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { type RootState } from "@/store/store";
import { deleteCampaign, updateCampaignStatus, setCampaigns } from "@/store/slices/campaignSlice";
import SmartSearchBar from "@/components/ui/SmartSearchBar";
import StatCard from "@/components/ui/StatCard";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
import { isAdminManagerRole, isCompanyAdminRole } from "@/utils/userRole";
import { getMockData } from "@/utils/mockData";


const Campaigns: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: "", name: "" });

  const { activeTempleId } = useSelector((state: RootState) => state.temple);
  const { campaigns } = useSelector((state: RootState) => state.campaigns);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const canManage = isAdminManagerRole(user);
  const isSuperAdmin = isCompanyAdminRole(user);

  useEffect(() => {
    if (campaigns.length === 0) {
      const data = getMockData();
      const mockCampaigns = data.campaigns || [];
      const processed = mockCampaigns.map((c: any) => ({
        id: c.id,
        name: c.name || c.title || "Untitled",
        description: c.funds || "",
        type: (c.type as any) || "Donation",
        startDate: new Date().toISOString().split('T')[0],
        endDate: c.end || new Date().toISOString().split('T')[0],
        targetAmount: parseInt((c.budget || "50000").replace(/[^0-9]/g, "")),
        status: (c.status as any) || "Active",
        visibility: "Public" as const,
        paymentGateway: "Razorpay" as const,
        priority: "Medium" as const,
        dailyBudget: parseInt((c.dailyLimit || "5000").replace(/[^0-9]/g, "")),
        providerCost: 0,
        minDonation: 100,
        fundsRaised: parseInt((c.spent || "12000").replace(/[^0-9]/g, "")),
        expenses: [],
        transactions: [],
        templeId: c.templeId,
        templeName: c.templeName
      }));
      dispatch(setCampaigns(processed));
    }
  }, [campaigns.length, dispatch]);

  const stats = [
    {
      title: "Active Campaigns",
      value: campaigns.filter(c => c.status === "Active").length.toString().padStart(2, "0"),
      icon: Megaphone,
      color: "bg-brand-primary/10 text-brand-primary",
    },
    {
      title: "Pending Approval",
      value: campaigns.filter(c => c.status === "Pending Approval").length.toString().padStart(2, "0"),
      icon: ShieldAlert,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Total Raised",
      value: `₹${campaigns.reduce((sum, c) => sum + (c.fundsRaised || 0), 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  const filteredList = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "All" || c.status === activeTab;
    const matchesTemple = activeTempleId === "all" || c.templeId === activeTempleId;
    return matchesSearch && matchesTab && matchesTemple;
  });

  const confirmDelete = async () => {
    setIsDeleting(deleteModal.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      dispatch(deleteCampaign(deleteModal.id));
      toast.success(`Campaign ${deleteModal.name} removed`);
      setDeleteModal({ isOpen: false, id: "", name: "" });
    } catch (err) {
      toast.error("Error deleting campaign");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleApprove = (id: string) => {
    dispatch(updateCampaignStatus({ id, status: "Active" }));
    toast.success("Campaign Approved and Published!");
  };

  const handleReject = (id: string) => {
    dispatch(updateCampaignStatus({ id, status: "Rejected" }));
    toast.error("Campaign Rejected.");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Campaigns & Outreach</h1>
          <p className="text-[13px] text-slate-400 mt-1">
            Displaying {activeTempleId === "all" ? "Consolidated trust outreach" : "Linked temple outreach"}
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/20">
          <div className="flex gap-6 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {["All", "Active", "Pending Approval", "Draft", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-2 text-[12px] font-bold transition-all whitespace-nowrap ${activeTab === tab ? "text-brand-primary" : "text-slate-400 hover:text-slate-600"}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SmartSearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search campaigns..." />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Campaign</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type & Target</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Funds Raised</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredList.length > 0 ? (
                filteredList.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => navigate(`/campaigns/${camp.id}`)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                          <Megaphone className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-[13px]">{camp.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{camp.templeName || "Global"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-700 text-[12px]">{camp.type}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-medium">Target: ₹{camp.targetAmount?.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                        camp.status === "Active" ? "text-emerald-600 bg-emerald-50 border-emerald-100" :
                        camp.status === "Pending Approval" ? "text-amber-600 bg-amber-50 border-amber-100" :
                        camp.status === "Completed" ? "text-blue-600 bg-blue-50 border-blue-100" :
                        "text-slate-600 bg-slate-100 border-slate-200"
                      }`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-emerald-600 text-[13px]">₹{(camp.fundsRaised || 0).toLocaleString()}</div>
                      <div className="w-24 bg-slate-100 rounded-full h-1 mt-1 overflow-hidden">
                         <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(((camp.fundsRaised || 0) / (camp.targetAmount || 1)) * 100, 100)}%` }} />
                      </div>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {camp.status === "Pending Approval" && isSuperAdmin && (
                          <>
                            <button onClick={() => handleApprove(camp.id)} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md shadow-sm transition-all text-[10px] font-bold" title="Approve">
                              Approve
                            </button>
                            <button onClick={() => handleReject(camp.id)} className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md shadow-sm transition-all text-[10px] font-bold" title="Reject">
                              Reject
                            </button>
                          </>
                        )}
                        <button onClick={() => navigate(`/campaigns/${camp.id}`)} className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md shadow-sm transition-all" title="View Details">
                          <BarChart3 className="w-3.5 h-3.5" />
                        </button>
                        {canManage && (
                          <button onClick={() => navigate(`/campaigns/edit/${camp.id}`)} className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md shadow-sm transition-all" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canManage && (
                          <button onClick={() => setDeleteModal({ isOpen: true, id: camp.id, name: camp.name })} className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md shadow-sm transition-all" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Megaphone className="w-8 h-8 text-slate-200" />
                      <p className="text-[12px] font-medium text-slate-400">No campaigns found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmationModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })} onConfirm={confirmDelete} loading={!!isDeleting} title="Delete Campaign" itemName={deleteModal.name} message="Are you sure you want to remove this campaign? This action cannot be undone." />
    </div>
  );
};

export default Campaigns;
