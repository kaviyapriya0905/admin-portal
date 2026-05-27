import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Users, TrendingUp, Loader2, Award } from "lucide-react";
import { useSelector } from "react-redux";
import { getMockData, deleteMockItem } from "@/utils/mockData";
import toast from "react-hot-toast";
import { type RootState } from "@/store/store";
import { isAdminManagerRole } from "@/utils/userRole";
import StatCard from "@/components/ui/StatCard";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import TempleEnrollmentWizard from "@/pages/temple-registry/TempleEnrollmentWizard";
import AdminDirectoryTable from "@/pages/admin/components/AdminDirectoryTable";

interface AdminMember {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  status: "Active" | "Pending" | "Inactive";
  dateJoined: string;
  image: string;
  templeName?: string;
  bio?: string;
}

interface Temple {
  id: string;
  name: string;
}

const AdminOnboard: React.FC = () => {
  const [admins, setAdmins] = useState<AdminMember[]>([]);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: "",
    name: "",
  });


  const navigate = useNavigate();
  const handleEditAdmin = (admin: AdminMember | null) => {
    if (admin) {
      navigate(`/admin/edit/${admin.id}`);
    }
  };
  const { user } = useSelector((state: RootState) => state.auth);
  const canManage = isAdminManagerRole(user);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const templeMap = new Map<string, string>();
    try {
      const mockData = getMockData();
      const mappedTemples = (mockData.temples || []).map((t: any) => ({
        ...t,
        id: t.id || t._id || t.temple_id,
      }));
      setTemples(mappedTemples);
      mappedTemples.forEach((t) => templeMap.set(t.id, t.name));

      const fetchedAdmins: any[] = [];

      try {
        const usersData = mockData.users || [];
        if (Array.isArray(usersData)) {
          usersData.forEach((u: any) => {
            fetchedAdmins.push({ ...u, templeId: u.templeId });
          });
        }
      } catch (err) {
        console.warn(
          "Failed to fetch users from mockData",
          err,
        );
      }

      mappedTemples.forEach((t: any) => {
        if (t.users && Array.isArray(t.users)) {
          t.users.forEach((u: any) => {
            if (!fetchedAdmins.find((existing) => existing.email === u.email)) {
              fetchedAdmins.push({ ...u, templeId: t.id });
            }
          });
        }
        if (t.superadmin && typeof t.superadmin === "object") {
          const email = t.superadmin.email;
          if (!fetchedAdmins.find((u) => u.email === email)) {
            fetchedAdmins.push({
              ...t.superadmin,
              firstName: t.superadmin.firstName || t.superadmin.first_name,
              lastName: t.superadmin.lastName || t.superadmin.last_name,
              templeId: t.id,
            });
          }
        }
      });

      const allAdmins = fetchedAdmins.map((u: any) => ({
        id: u.id ? u.id.toString() : Date.now().toString(),
        name:
          `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Unknown Admin",
        email: u.email || "No Email",
        username: `ID: #${(u.id || "").toString().substring(0, 4).padStart(4, "0")}`,
        role: (() => {
          const r =
            u.role?.name ||
            u.Role?.role_name ||
            (typeof u.role === "string" ? u.role : "");
          if (r) return r.replace(/[-_]/g, " ");
          return u.email === "company-admin@gwcdata.ai" ||
            u.firstName?.toLowerCase() === "company"
            ? "Company Admin"
            : "Super Admin";
        })(),
        status: (u.accountStatus === "inactive"
          ? "Inactive"
          : u.accountStatus === "suspended"
            ? "Pending"
            : u.status === "Inactive"
              ? "Inactive"
              : u.status === "Pending"
                ? "Pending"
                : "Active") as "Active" | "Pending" | "Inactive",
        dateJoined: u.createdAt
          ? new Date(u.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "Recently",
        image: u.profilePic || u.image || "",
        templeName: templeMap.get(u.templeId) || "Corporate Lead",
        bio: u.bio === "None" ? "" : u.bio || "",
      }));

      setAdmins(allAdmins);
    } catch (err) {
      console.error("Failed to fetch admins", err);
      setAdmins([]);
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdmins();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchAdmins]);

  const confirmDelete = async () => {
    setIsDeleting(deleteModal.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      deleteMockItem("users", deleteModal.id);

      toast.success(`Administrator ${deleteModal.name} removed`);
      setAdmins(admins.filter((a) => a.id !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: "", name: "" });
    } catch {
      toast.error(
        "Failed to delete administrator.",
      );
    } finally {
      setIsDeleting(null);
    }
  };


  if (showForm)
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <TempleEnrollmentWizard
          mode="admin"
          temples={temples}
          onComplete={() => {
            setShowForm(false);
            fetchAdmins();
          }}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );

  return (
    <div className="space-y-4 animate-in fade-in duration-700 p-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
            Admin Management
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Personnel directory & executive control
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-brand-primary text-white rounded-md text-sm font-semibold hover:bg-brand-secondary transition-all flex items-center justify-center gap-2 group shadow-lg shadow-brand-primary/10"
          >
            <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Add New Admin
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4">
        <StatCard
          title="Total Executives"
          value={admins.length.toString().padStart(2, "0")}
          icon={Users}
          color="bg-slate-50 text-slate-600"
        />
        <StatCard
          title="Active Protocols"
          value={admins
            .filter((a) => a.status === "Active")
            .length.toString()
            .padStart(2, "0")}
          icon={TrendingUp}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Pending Review"
          value={admins
            .filter((a) => a.status === "Pending")
            .length.toString()
            .padStart(2, "0")}
          icon={Loader2}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Trustees"
          value={admins
            .filter((a) => a.role.includes("admin"))
            .length.toString()
            .padStart(2, "0")}
          icon={Award}
          color="bg-brand-primary/10 text-brand-primary"
        />
      </div>

      <AdminDirectoryTable
        admins={admins}
        loading={loading}
        isDeleting={isDeleting}
        onEdit={handleEditAdmin}
        onDelete={(id, name) => setDeleteModal({ isOpen: true, id, name })}
        canManage={canManage}
      />

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        loading={!!isDeleting}
        title="Remove Executive Access"
        itemName={deleteModal.name}
        message="Are you sure you want to permanently revoke administrative privileges for this user?"
      />
    </div>
  );
};

export default AdminOnboard;
