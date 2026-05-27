import React from "react";
import { motion } from "framer-motion";
import { Building2, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface Temple {
  id: string;
  name: string;
  location: string;
  address: string;
  description: string;
  historicalContext?: string;
  image: string;
}

interface TempleDetailModalProps {
  selectedTemple: Temple | null;
  setSelectedTemple: (temple: Temple | null) => void;
  onEdit: (temple: Temple) => void;
  onDelete: (id: string, name: string) => void;
  canManage: boolean;
}

const TempleDetailModal: React.FC<TempleDetailModalProps> = ({
  selectedTemple,
  setSelectedTemple,
  onEdit,
  onDelete,
  canManage,
}) => {
  if (!selectedTemple) return null;

  const cachedImage = selectedTemple.image;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedTemple(null)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div
        layoutId={selectedTemple.id}
        className="bg-white w-full max-w-2xl rounded-md overflow-hidden relative z-10"
      >
        <button
          onClick={() => setSelectedTemple(null)}
          className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white z-20 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="h-64 relative flex items-center justify-center bg-slate-50">
          {cachedImage ? (
            <>
              <img
                src={cachedImage}
                alt={selectedTemple.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Building2 className="w-12 h-12 text-slate-200" />
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                Archival Mode: No Facade
              </span>
            </div>
          )}
          <div className="absolute bottom-6 left-8 text-white">
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2 py-0.5 bg-brand-primary rounded text-[9px] font-bold uppercase tracking-widest text-white">
                {cachedImage ? "Unit Facade" : "Archival Registry"}
              </div>
            </div>
            <h2
              className={cn(
                "text-2xl font-bold tracking-tight",
                !cachedImage && "text-slate-900",
              )}
            >
              {selectedTemple.name}
            </h2>
          </div>
        </div>

        <div className="p-4 sm:p-4 space-y-4 sm:space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:gap-4">
            <div className="space-y-1.5">
              <span className="text-[10px] font-medium text-slate-400 block">
                Location
              </span>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <MapPin className="w-4 h-4 text-brand-primary" />
                {selectedTemple.location}
              </div>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-medium text-slate-400 block">
                Status
              </span>
              <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Active Management
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-medium text-slate-400 block">
              Address
            </span>
            <p className="text-slate-600 text-xs leading-relaxed">
              {selectedTemple.address}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-medium text-slate-400 block">
              About the Temple
            </span>
            <p className="text-slate-600 text-xs leading-relaxed">
              {(selectedTemple.description === "None"
                ? ""
                : selectedTemple.description) || "No description provided."}
            </p>
          </div>

          {selectedTemple.historicalContext &&
            selectedTemple.historicalContext !== "None" && (
              <div className="space-y-2">
                <span className="text-[10px] font-medium text-slate-400 block">
                  Historical Heritage
                </span>
                <p className="text-slate-600 text-xs leading-relaxed italic">
                  {selectedTemple.historicalContext}
                </p>
              </div>
            )}

          {canManage && (
            <div className="pt-4 border-t border-slate-50 flex gap-4">
              <Button
                onClick={() => {
                  onEdit(selectedTemple);
                  setSelectedTemple(null);
                }}
                className="flex-1 bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-3 rounded-md text-sm"
              >
                Edit Registry
              </Button>
              <Button
                onClick={() => {
                  onDelete(selectedTemple.id, selectedTemple.name);
                  setSelectedTemple(null);
                }}
                variant="outline"
                className="flex-1 border-brand-primary/20 text-brand-primary hover:bg-brand-primary/5 font-semibold py-3 rounded-md text-sm"
              >
                Delete Unit
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TempleDetailModal;
