import React from "react";
import { Building2, MapPin, ChevronRight, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface RecentTemple {
  id: string;
  name: string;
  location: string;
  status: string;
  type: string;
  image?: string;
}

interface TempleBranchListProps {
  recentTemples: RecentTemple[];
}

const TempleBranchList: React.FC<TempleBranchListProps> = ({ recentTemples }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center shrink-0">
        <h2 className="text-[12px] font-semibold text-slate-800">
          Branch Status
        </h2>
        <button
          onClick={() => navigate("/temple-onboard")}
          className="p-1.5 text-slate-400 hover:bg-slate-50 rounded-lg hover:text-slate-800 transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
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
                <h4 className="text-[11px] font-semibold text-slate-800">
                  {temple.name}
                </h4>
                <p className="text-[10px] font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {temple.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
                  {temple.type}
                </span>
                <span className="text-[10px] font-semibold text-slate-700 mt-0.5">
                  {temple.status}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-brand-primary transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TempleBranchList;
