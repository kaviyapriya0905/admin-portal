import React from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, Edit, Trash2, Loader2 } from "lucide-react";
import { cn } from "../../../../utils/cn";

interface Temple {
  id: string;
  name: string;
  location: string;
  address: string;
  description: string;
  image: string;
  city?: string;
  state?: string;
  status: "active" | "inactive";
}

interface TempleCardProps {
  temple: Temple;
  isDeleting: boolean;
  onSelect: (temple: Temple) => void;
  onEdit: (temple: Temple) => void;
  onDelete: (id: string, name: string) => void;
  canManage: boolean;
}

const TempleCard: React.FC<TempleCardProps> = ({
  temple,
  isDeleting,
  onSelect,
  onEdit,
  onDelete,
  canManage,
}) => {
  return (
    <motion.div
      layoutId={temple.id}
      onClick={() => onSelect(temple)}
      className="bg-white rounded-md border border-slate-100 overflow-hidden cursor-pointer group hover:-translate-y-1 transition-all duration-300"
    >
      <div className="h-60 relative overflow-hidden flex items-center justify-center bg-slate-50">
        {(() => {
          const finalImage = temple.image;

          if (finalImage && finalImage !== "/temple1.png") {
            return (
              <>
                <img
                  src={finalImage}
                  alt={temple.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                    Unit Details
                  </span>
                </div>
              </>
            );
          }
          return (
            <div className="flex flex-col items-center gap-2">
              <Building2 className="w-8 h-8 text-slate-200" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                No Facade
              </span>
            </div>
          );
        })()}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 text-sm mb-1">
              {temple.name}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <MapPin className="w-3 h-3" />
              {temple.location}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span
              className={cn(
                "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                temple.status === "active"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : "bg-slate-50 text-slate-400 border border-slate-100",
              )}
            >
              {temple.status || "active"}
            </span>
            {canManage && (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(temple);
                  }}
                  className="p-2 bg-slate-50 text-slate-500 hover:bg-brand-primary/10 hover:text-brand-primary rounded-md border border-slate-100 transition-all shadow-sm"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(temple.id, temple.name);
                  }}
                  disabled={isDeleting}
                  className="p-2 bg-slate-50 text-slate-500 hover:bg-brand-primary/10 hover:text-brand-primary rounded-md border border-slate-100 transition-all disabled:opacity-50 shadow-sm"
                >
                  {isDeleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TempleCard;
