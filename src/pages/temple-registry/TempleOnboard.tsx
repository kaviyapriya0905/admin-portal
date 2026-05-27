import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Plus, Activity, ShieldCheck, Clock } from "lucide-react";
import { getMockData, deleteMockItem } from "@/utils/mockData";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";
import { getUserRoleName, isCompanyAdminRole } from "@/utils/userRole";
import StatCard from "@/components/ui/StatCard";
import TempleEnrollmentWizard from "@/pages/temple-registry/TempleEnrollmentWizard";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import TempleCard from "@/pages/temple-registry/components/TempleCard";
import TempleDetailsView from "@/pages/temple-registry/components/TempleDetailsView";

interface Temple {
  id: string;
  name: string;
  location: string;
  address: string;
  description: string;
  historicalContext?: string;
  image: string;
  city?: string;
  state?: string;
  country?: string;
  status: "active" | "inactive";
}

const TempleOnboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [, setLoading] = useState(false);
  const [viewingTemple, setViewingTemple] = useState<Temple | null>(null);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: "",
    name: "",
  });

  const navigate = useNavigate();
  const handleEditTemple = (temple: Temple | null) => {
    if (temple) {
      navigate(`/temple/edit/${temple.id}`);
    }
  };

  const { user } = useSelector((state: RootState) => state.auth);
  const canManage = isCompanyAdminRole(user);

  const fetchTemples = useCallback(async () => {
    setLoading(true);
    try {
      const mockData = getMockData();
      const data = mockData.temples || [];

      setTemples(
        data.map((t: any) => {
          const primaryAdmin = t.users?.find(
            (u: any) => getUserRoleName(u) === "superadmin",
          );

          let parsedHistory: any[] = [];
          if (Array.isArray(t.history)) {
            parsedHistory = t.history;
          } else if (typeof t.history === "string") {
            try {
              parsedHistory = JSON.parse(t.history);
            } catch (e) {
              console.error("Failed to parse history JSON", e);
            }
          }

          return {
            id: t.id || (t as any)._id || (t as any).temple_id,
            name: t.name,
            location: `${t.city}, ${t.state}`,
            address: t.address,
            description:
              t.description && t.description !== "None"
                ? t.description
                : t.historicalsig && t.historicalsig !== "None"
                  ? t.historicalsig
                  : "",
            historicalContext:
              t.historicalContext && t.historicalContext !== "None"
                ? t.historicalContext
                : parsedHistory &&
                    parsedHistory[0] &&
                    parsedHistory[0].description
                  ? parsedHistory[0].description
                  : "",
            image:
              t.logo ||
              (parsedHistory && parsedHistory[0] && parsedHistory[0].banner) ||
              (parsedHistory && parsedHistory[0] && parsedHistory[0].logo) ||
              "/temple1.png",
            city: t.city,
            state: t.state,
            country: t.country,
            status: (t.status || "active") as "active" | "inactive",
            bio: t.bio === "None" ? "" : t.bio || "",
            superadmin: t.superadmin
              ? {
                  firstName: t.superadmin.firstName || t.superadmin.first_name,
                  lastName: t.superadmin.lastName || t.superadmin.last_name,
                  email: t.superadmin.email,
                  bio: t.superadmin.bio,
                }
              : primaryAdmin
                ? {
                    firstName:
                      primaryAdmin.firstName || primaryAdmin.first_name,
                    lastName: primaryAdmin.lastName || primaryAdmin.last_name,
                    email: primaryAdmin.email,
                    bio: primaryAdmin.bio,
                  }
                : undefined,
            users: t.users || (t.superadmin ? [t.superadmin] : []),
            history: parsedHistory,
          };
        }),
      );
    } catch {
      toast.error("Failed to synchronize temple directory.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemples();
  }, [fetchTemples]);

  const confirmDelete = async () => {
    setIsDeleting(deleteModal.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      deleteMockItem("temples", deleteModal.id);
      toast.success(`${deleteModal.name} deleted successfully`);
      setTemples(temples.filter((t) => t.id !== deleteModal.id));
      await fetchTemples();
      setDeleteModal({ isOpen: false, id: "", name: "" });
    } catch {
      toast.error("Error deleting temple");
    } finally {
      setIsDeleting(null);
    }
  };



  if (showForm)
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TempleEnrollmentWizard
          mode="full"
          onComplete={() => {
            setShowForm(false);
            fetchTemples();
          }}
          onCancel={() => setShowForm(false)}
          onTempleCreated={(newTemple) =>
            setTemples((prev) => [...prev, newTemple])
          }
        />
      </div>
    );

  if (viewingTemple)
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <TempleDetailsView
          temple={viewingTemple}
          onBack={() => setViewingTemple(null)}
        />
      </div>
    );

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Temple Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Onboard and oversee multiple temple branches within the trust.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-brand-primary text-white rounded-md text-sm font-semibold hover:bg-brand-secondary transition-all flex items-center justify-center gap-2 group shadow-lg shadow-brand-primary/10"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />{" "}
            Add New Temple
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4">
        <StatCard
          title="Total Units"
          value={temples.length.toString().padStart(2, "0")}
          icon={Building2}
          color="bg-slate-50 text-slate-600"
        />
        <StatCard
          title="Active Management"
          value={temples
            .filter((t) => t.status === "active")
            .length.toString()
            .padStart(2, "0")}
          icon={Activity}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Heritage Protocol"
          value={temples
            .filter(
              (t) => t.historicalContext && t.historicalContext !== "None",
            )
            .length.toString()
            .padStart(2, "0")}
          icon={ShieldCheck}
          color="bg-brand-primary/10 text-brand-primary"
        />
        <StatCard
          title="Maintenance Logs"
          value="00"
          icon={Clock}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {temples.length > 0 ? (
          temples.map((t) => (
            <TempleCard
              key={t.id}
              temple={t}
              isDeleting={isDeleting === t.id}
              onSelect={setViewingTemple}
              onEdit={handleEditTemple}
              onDelete={(id, name) =>
                setDeleteModal({ isOpen: true, id, name })
              }
              canManage={canManage}
            />
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-2xl text-center">
            <Building2 className="w-8 h-8 text-slate-200 mb-4" />
            <h3 className="text-sm font-bold text-slate-900">
              No units onboarded yet
            </h3>
            {canManage && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-6 px-4 py-2 bg-brand-primary/5 text-brand-primary text-[11px] font-bold rounded-lg hover:bg-brand-primary hover:text-white transition-all"
              >
                Start Enrollment
              </button>
            )}
          </div>
        )}
      </div>

      
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        loading={!!isDeleting}
        title="Delete Temple Unit"
        itemName={deleteModal.name}
        message="Are you sure you want to permanently remove this temple from the trust network?"
      />
    </div>
  );
};

export default TempleOnboard;
// Force Vite HMR
