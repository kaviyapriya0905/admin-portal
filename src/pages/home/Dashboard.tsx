import React, { useState, useEffect } from "react";
import {
  Users,
  Building2,
  Activity,
  ChevronRight,
  MapPin,
  Loader2,
  Download,
  ShieldCheck,
  TrendingUp,
  MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { type RootState } from "../../redux/store";
import { getMockData } from "../../utils/mockData";
import { getUserRoleName, isCompanyAdminRole } from "../../utils/userRole";
import { cn } from "../../utils/cn";
import StatCard from "../../components/ui/StatCard";

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

interface RecentTemple {
  id: string;
  name: string;
  location: string;
  status: string;
  type: string;
  image?: string;
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
  const navigate = useNavigate();
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
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
            {canManage ? "Global Overview" : "Unit Oversight"}
          </h1>
          <p className="text-[13px] text-slate-500 font-medium">
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
        
        {/* Admins Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col">
          <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-[14px] font-semibold text-slate-800">
              Recent Administrators
            </h2>
            <button
              onClick={() => navigate("/admin-onboard")}
              className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg hover:text-slate-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    Administrator
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    Role
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentAdmins.map((admin, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {admin.image ? (
                          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                            <img
                              src={admin.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center text-[11px] font-bold text-brand-primary">
                            {admin.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-[13px] font-semibold text-slate-800">
                            {admin.name}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium truncate max-w-[150px]">
                            {admin.templeName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[12px] text-slate-600 font-medium">
                      {admin.role}
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                         <span className={cn(
                           "w-1.5 h-1.5 rounded-full",
                           admin.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
                         )}></span>
                         {admin.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Temple Branch List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col">
          <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-[14px] font-semibold text-slate-800">
              Branch Status
            </h2>
            <button
              onClick={() => navigate("/temple-onboard")}
              className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg hover:text-slate-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-1 flex-1">
            {recentTemples.map((temple, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  {temple.image && temple.image !== "/temple1.png" ? (
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                      <img
                        src={temple.image}
                        alt={temple.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-brand-primary/5 rounded-xl flex items-center justify-center text-brand-primary/60 group-hover:text-brand-primary transition-colors shrink-0">
                      <Building2 className="w-6 h-6 stroke-[1.5]" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-[13px] font-semibold text-slate-800">
                      {temple.name}
                    </h4>
                    <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {temple.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                      {temple.type}
                    </span>
                    <span className="text-[12px] font-semibold text-slate-700 mt-0.5">
                      {temple.status}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Hub */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-[14px] font-semibold text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-primary" />
              Operational Performance
            </h2>
            <p className="text-[12px] text-slate-500 font-medium">
              Consolidated metrics across all trust units.
            </p>
          </div>
          <button className="text-[12px] font-semibold text-brand-primary hover:text-brand-secondary bg-brand-primary/5 hover:bg-brand-primary/10 px-4 py-2 rounded-lg transition-colors">
            Full Analytics
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  Temple Unit
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center bg-slate-50/50">
                  Devotees
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center bg-slate-50/50">
                  Donations (MTD)
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center bg-slate-50/50">
                  Sevas Scheduled
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center bg-slate-50/50">
                  Asset Value
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right bg-slate-50/50">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentTemples.map((temple, i) => {
                const metrics = tableMetrics[i];
                return (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary/60 group-hover:bg-brand-primary group-hover:text-white transition-all">
                          <Building2 className="w-4 h-4 stroke-[1.5]" />
                        </div>
                        <span className="text-[13px] font-semibold text-slate-800">
                          {temple.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-600 font-medium text-center">
                      {metrics.devotees}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-800 font-semibold text-center">
                      {metrics.donations}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-600 font-medium text-center">
                      {metrics.sevas}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-600 font-medium text-center">
                      {metrics.assets}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-[11px] font-bold group-hover:bg-emerald-100 transition-colors">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        +{metrics.growth}%
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
