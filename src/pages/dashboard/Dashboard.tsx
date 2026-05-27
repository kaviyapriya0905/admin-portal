import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Activity,
  Loader2,
  Download,
  ShieldCheck,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { type RootState } from "@/store/store";
import { getMockData } from "@/utils/mockData";
import { getUserRoleName, isCompanyAdminRole } from "@/utils/userRole";
import StatCard from "@/components/ui/StatCard";
import RecentAdminsTable from "./components/RecentAdminsTable";
import TempleBranchList, { type RecentTemple } from "./components/TempleBranchList";
import PerformanceHubTable from "./components/PerformanceHubTable";

interface DashboardStats {
  totalTemples: number;
  totalAdmins: number;
  activeBranches: number;
  pendingAdmins: number;
}

interface RecentAdmin {
  id: number;
  name: string;
  role: string;
  status: string;
  image?: string;
  templeName?: string;
}

interface RawUserExport {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: { name: string } | string;
  accountStatus: string;
  isFirstLogin: boolean;
  templeId?: string;
  status?: string;
  Role?: { role_name: string };
}

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeTempleId } = useSelector((state: RootState) => state.temple);
  const canManage = isCompanyAdminRole(user);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAdmins, setRecentAdmins] = useState<RecentAdmin[]>([]);
  const [recentTemples, setRecentTemples] = useState<RecentTemple[]>([]);

  const tableMetrics = React.useMemo(
    () =>
      recentTemples.map((t) => {
        const seed = t.name.length;
        return {
          devotees: Math.floor(seed * 50) + 100,
          donations: `₹${(seed * 5 + 10).toFixed(1)}k`,
          sevas: Math.floor(seed * 3) + 5,
          assets: `₹${(seed * 0.5 + 1).toFixed(1)}L`,
          growth: (seed * 1.5 + 5).toFixed(1),
        };
      }),
    [recentTemples],
  );

  const templeId = (user as any)?.templeId;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const mockData = getMockData();
        const allTemples: any[] = mockData.temples || [];
        const allUsers: any[] = mockData.users || [];

        allTemples.forEach((t: any) => {
          if (t.users && Array.isArray(t.users)) {
            t.users.forEach((u: any) => {
              if (!allUsers.find((existing) => existing.email === u.email)) {
                allUsers.push({ ...u, templeId: t.id });
              }
            });
          }
          if (t.superadmin && typeof t.superadmin === "object") {
            const email = t.superadmin.email;
            if (!allUsers.find((u) => u.email === email)) {
              allUsers.push({
                ...t.superadmin,
                firstName: t.superadmin.firstName || t.superadmin.first_name,
                lastName: t.superadmin.lastName || t.superadmin.last_name,
                templeId: t.id,
              });
            }
          }
        });

        let displayTemples = allTemples;
        let displayUsers = allUsers;

        if (!canManage && (user as any)?.templeId) {
          displayTemples = allTemples.filter(
            (t) => t.id === (user as any).templeId,
          );
          displayUsers = allUsers.filter(
            (u) => u.templeId === (user as any).templeId,
          );
        } else if (activeTempleId && activeTempleId !== "all") {
          displayTemples = allTemples.filter(
            (t) =>
              t.id === activeTempleId || t.id.toString() === activeTempleId,
          );
          displayUsers = allUsers.filter(
            (u) =>
              u.templeId === activeTempleId ||
              (u.templeId && u.templeId.toString() === activeTempleId),
          );
        }

        const adminUsers = displayUsers;

        setStats({
          totalTemples: displayTemples.length,
          totalAdmins: adminUsers.length,
          activeBranches: displayTemples.filter((t) => t.status === "active")
            .length,
          pendingAdmins: adminUsers.filter(
            (u) =>
              u.accountStatus === "suspended" ||
              u.accountStatus === "pending" ||
              u.status === "Pending" ||
              u.status === "pending",
          ).length,
        });

        setRecentAdmins(
          adminUsers.slice(0, 5).map((u) => ({
            id: u.id,
            name:
              `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
              "Unknown Admin",
            role: (() => {
              const r =
                (typeof u.role === "string" ? u.role : u.role?.name) ||
                u.Role?.role_name ||
                "";
              if (r) return r.replace(/[-_]/g, " ");
              return u.email === "company-admin@gwcdata.ai" ||
                u.firstName?.toLowerCase() === "company"
                ? "Company Admin"
                : "Super Admin";
            })(),
            status:
              u.accountStatus === "inactive"
                ? "Inactive"
                : u.accountStatus === "suspended"
                  ? "Pending"
                  : u.status === "Inactive"
                    ? "Inactive"
                    : u.status === "Pending"
                      ? "Pending"
                      : "Active",
            image: (u as any).profilePic || (u as any).image,
            templeName:
              displayTemples.find((t) => t.id === u.templeId)?.name ||
              "Corporate",
          })),
        );

        setRecentTemples(
          displayTemples.slice(0, 5).map((t) => ({
            id: t.id,
            name: t.name,
            location: `${t.city}, ${t.state}`,
            status: t.status === "active" ? "Operational" : "Maintenance",
            type: "Branch",
            image: t.logo,
          })),
        );
      } catch {
        // Silent error
      }
    };

    fetchDashboardData();
  }, [canManage, templeId, user, activeTempleId]);

  const handleExport = async () => {
    const toastId = toast.loading("Preparing consolidated executive report...");
    try {
      const mockData = getMockData();
      const allTemples: any[] = mockData.temples || [];
      const allUsers: any[] = mockData.users || [];

      if (allTemples.length === 0) {
        toast.error("No data available to export", { id: toastId });
        return;
      }

      // Map admins to temples for quick lookup
      const adminMap: Record<string, RawUserExport[]> = {};
      allUsers.forEach((user) => {
        if (user.templeId) {
          if (!adminMap[user.templeId]) adminMap[user.templeId] = [];
          adminMap[user.templeId].push(user);
        }
      });

      const headers = [
        "Registry ID",
        "Temple Designation",
        "City Hub",
        "Administrative Region",
        "Operational Status",
        "Primary Administrator",
        "Admin Email",
        "Admin Role",
      ];

      const rows = allTemples.map((t) => {
        const admins = adminMap[t.id] || [];
        // Use the first admin found or a placeholder
        const primaryAdmin = admins[0];

        return [
          t.id,
          `"${t.name}"`,
          `"${t.city}"`,
          `"${t.state}"`,
          t.status.toUpperCase(),
          primaryAdmin
            ? `"${primaryAdmin.firstName} ${primaryAdmin.lastName}"`
            : '"N/A"',
          primaryAdmin ? `"${primaryAdmin.email}"` : '"N/A"',
          primaryAdmin
            ? `"${getUserRoleName(primaryAdmin) || "N/A"}"`
            : '"N/A"',
        ];
      });

      const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `Consolidated_Trust_Report_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Consolidated report exported successfully", {
        id: toastId,
      });
    } catch {
      toast.error("Failed to synchronize registry data", { id: toastId });
    }
  };

  const handleSystemAudit = async () => {
    const toastId = toast.loading("Initiating deep system audit...", {
      style: { minWidth: "350px" },
    });

    try {
      // Phase 1: Registry Integrity
      await new Promise((r) => setTimeout(r, 1000));
      toast.loading("Analyzing trust registry integrity...", { id: toastId });

      const mockData = getMockData();
      const temples: any[] = mockData.temples || [];
      const users: any[] = mockData.users || [];

      // Phase 2: Authority Mapping
      await new Promise((r) => setTimeout(r, 800));
      toast.loading("Scanning administrative authority levels...", {
        id: toastId,
      });

      const orphanedTemples = temples.filter(
        (t) => !users.some((u) => u.templeId === t.id),
      );
      const pendingAdmins = users.filter(
        (u) => u.accountStatus === "pending" || u.isFirstLogin,
      );
      const inactiveUnits = temples.filter((t) => t.status !== "active");

      // Phase 3: Final Synthesis
      await new Promise((r) => setTimeout(r, 800));
      toast.loading("Synthesizing governance health report...", {
        id: toastId,
      });
      await new Promise((r) => setTimeout(r, 500));

      const issueCount = orphanedTemples.length + pendingAdmins.length;

      if (issueCount > 0) {
        toast.error(
          <div className="space-y-1">
            <p className="font-bold text-[13px]">Governance Audit: Action Required</p>
            <p className="text-[11px] opacity-90">
              Found {orphanedTemples.length} unassigned units &{" "}
              {pendingAdmins.length} pending executives.
              {inactiveUnits.length > 0 &&
                ` ${inactiveUnits.length} units in maintenance.`}
            </p>
          </div>,
          { id: toastId, duration: 6000 },
        );
      } else {
        toast.success(
          <div className="space-y-1">
            <p className="font-bold text-[13px]">System Integrity Verified</p>
            <p className="text-[11px] opacity-90">
              All {temples.length} units are securely managed with verified
              executive oversight.
            </p>
          </div>,
          { id: toastId, duration: 6000 },
        );
      }
    } catch {
      toast.error("Audit failed: Connectivity or permission interruption.", {
        id: toastId,
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-4 border-b border-slate-100">
        <div className="space-y-1.5">
          <h1 className="text-lg font-semibold text-slate-800 tracking-tight">
            {canManage ? "Global Overview" : "Unit Oversight"}
          </h1>
          <p className="text-[11px] text-slate-500 font-medium">
            {canManage
              ? "Consolidated summary of branch operations and administrative health."
              : "Executive summary and metrics for your assigned unit."}
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          {canManage && (
            <>
              <button
                onClick={handleExport}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[12px] font-semibold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
              <button
                onClick={handleSystemAudit}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-brand-primary text-white rounded-xl text-[12px] font-semibold hover:bg-brand-secondary transition-all flex items-center justify-center gap-2 shadow-sm shadow-brand-primary/20"
              >
                <ShieldCheck className="w-4 h-4" />
                System Audit
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Temples"
          value={stats?.totalTemples.toString().padStart(2, "0") || "00"}
          icon={Building2}
          color="bg-slate-50 text-slate-600"
        />
        <StatCard
          title="Total Admins"
          value={stats?.totalAdmins.toString().padStart(2, "0") || "00"}
          icon={Users}
          color="bg-brand-primary/10 text-brand-primary"
        />
        <StatCard
          title="Active Branches"
          value={stats?.activeBranches.toString().padStart(2, "0") || "00"}
          icon={Activity}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="Pending Admins"
          value={stats?.pendingAdmins.toString().padStart(2, "0") || "00"}
          icon={Loader2}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentAdminsTable recentAdmins={recentAdmins} />
        <TempleBranchList recentTemples={recentTemples} />
      </div>

      {/* Performance Hub */}
      <PerformanceHubTable recentTemples={recentTemples} tableMetrics={tableMetrics} />
    </div>
  );
};

export default Dashboard;
