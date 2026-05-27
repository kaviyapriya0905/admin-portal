import React from "react";
import { Activity, Building2, TrendingUp } from "lucide-react";
import type { RecentTemple } from "./TempleBranchList";

interface PerformanceHubTableProps {
  recentTemples: RecentTemple[];
  tableMetrics: {
    devotees: number;
    donations: string;
    sevas: number;
    assets: string;
    growth: string;
  }[];
}

const PerformanceHubTable: React.FC<PerformanceHubTableProps> = ({ recentTemples, tableMetrics }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
      <div className="px-4 py-4 border-b border-slate-50 flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-[12px] font-semibold text-slate-800 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-brand-primary" />
            Operational Performance
          </h2>
          <p className="text-[10px] text-slate-500 font-medium">
            Consolidated metrics across all trust units.
          </p>
        </div>
        <button className="text-[10px] font-semibold text-brand-primary hover:text-brand-secondary bg-brand-primary/5 hover:bg-brand-primary/10 px-3 py-1.5 rounded-lg transition-colors">
          Full Analytics
        </button>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-96 custom-scrollbar relative">
        <table className="w-full text-left">
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm shadow-sm">
            <tr>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
                Temple Unit
              </th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center bg-slate-50/50">
                Devotees
              </th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center bg-slate-50/50">
                Donations (MTD)
              </th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center bg-slate-50/50">
                Sevas Scheduled
              </th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center bg-slate-50/50">
                Asset Value
              </th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right bg-slate-50/50">
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
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary/60 group-hover:bg-brand-primary group-hover:text-white transition-all">
                        <Building2 className="w-3.5 h-3.5 stroke-[1.5]" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-800">
                        {temple.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-600 font-medium text-center">
                    {metrics.devotees}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-800 font-semibold text-center">
                    {metrics.donations}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-600 font-medium text-center">
                    {metrics.sevas}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-600 font-medium text-center">
                    {metrics.assets}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold group-hover:bg-emerald-100 transition-colors">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
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
  );
};

export default PerformanceHubTable;
