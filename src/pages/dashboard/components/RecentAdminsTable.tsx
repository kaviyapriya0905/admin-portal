import React from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";

export interface RecentAdmin {
  id: number;
  name: string;
  role: string;
  status: string;
  image?: string;
  templeName?: string;
}

interface RecentAdminsTableProps {
  recentAdmins: RecentAdmin[];
}

const RecentAdminsTable: React.FC<RecentAdminsTableProps> = ({ recentAdmins }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center shrink-0">
        <h2 className="text-[12px] font-semibold text-slate-800">
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
                      <span className="text-[11px] font-semibold text-slate-800">
                        {admin.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
                        {admin.templeName}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[10px] text-slate-600 font-medium">
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
  );
};

export default RecentAdminsTable;
