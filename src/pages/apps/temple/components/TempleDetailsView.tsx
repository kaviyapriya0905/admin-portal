import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  ArrowLeft,
  MapPin,
  Users,
  Activity,
  Mail,
  Shield,
  User,
} from "lucide-react";
import { cn } from "../../../../utils/cn";
import { getMockData } from "../../../../utils/mockData";
import LiveTempleHeatmap from "./LiveTempleHeatmap";

interface Temple {
  id: string;
  name: string;
  location: string;
  address: string;
  description: string;
  city?: string;
  state?: string;
  country?: string;
  historicalContext?: string;
  image: string;
  status: "active" | "inactive";
  bio?: string;
  users?: any[];
}

interface AdminMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending" | "Inactive";
  image: string;
  bio?: string;
  designation?: string;
}

interface TempleDetailsViewProps {
  temple: Temple;
  onBack: () => void;
}

const TempleDetailsView: React.FC<TempleDetailsViewProps> = ({
  temple,
  onBack,
}) => {
  const [admins, setAdmins] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchUsers = async () => {
      try {
        let fetchedAdmins: any[] = [];
        try {
          const mockData = getMockData();
          const allUsers = mockData.users || [];
          if (Array.isArray(allUsers)) {
            fetchedAdmins = allUsers.filter(
              (u: any) => u.templeId === temple.id,
            );
          }
        } catch (err) {
          console.warn("Failed to fetch users from mockData", err);
        }

        // Also push superadmin from the temple object if they aren't already included
        const sa = (temple as any).superadmin;
        if (sa && typeof sa === "object") {
          if (!fetchedAdmins.find((u: any) => u.email === sa.email)) {
            fetchedAdmins.push({
              ...sa,
              firstName: sa.firstName || sa.first_name,
              lastName: sa.lastName || sa.last_name,
            });
          }
        }

        const filteredAdmins = fetchedAdmins.map((u: any) => {
          return {
            id: u.id ? u.id.toString() : Date.now().toString(),
            name:
              `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
              "Unknown Admin",
            email: u.email || "No Email",
            role: (
              u.role?.name ||
              u.Role?.role_name ||
              (typeof u.role === "string" ? u.role : "superadmin")
            ).replace("_", " "),
            status:
              u.accountStatus === "active" || u.status === "active"
                ? ("Active" as const)
                : u.accountStatus === "inactive" || u.status === "inactive"
                  ? ("Inactive" as const)
                  : ("Pending" as const),
            image: u.profilePic || u.image || "",
            bio: u.bio,
            designation: u.designation,
          };
        });
        setAdmins(filteredAdmins);
      } catch (err) {
        console.error("Error processing admins", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [temple]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors group"
        >
          <div className="w-8 h-8 rounded-md bg-white border border-slate-100 flex items-center justify-center group-hover:border-brand-primary/20 group-hover:bg-brand-primary/5 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold normal-case tracking-normal">
            Back to directory
          </span>
        </button>
      </div>

      <div className="grid grid-rows-1 lg:grid-rows-5 gap-8">
        <div className="lg:row-span-2 space-y-6">
          <div className="bg-white rounded-md border border-slate-100 overflow-hidden shadow-sm flex flex-col md:flex-row h-auto md:h-[420px]">
            <div className="md:w-2/5 relative bg-slate-50 shrink-0 h-[320px] md:h-full">
              {(() => {
                const finalImage = temple.image;
                if (finalImage && finalImage !== "/temple1.png") {
                  return (
                    <img
                      src={finalImage}
                      alt={temple.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  );
                }
                return (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <Building2 className="w-10 h-10 text-slate-200" />
                    <span className="text-[10px] font-bold text-slate-300 normal-case">
                      No facade imagery
                    </span>
                  </div>
                );
              })()}
            </div>
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {temple.name}
              </h2>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-4 mt-3">
                <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                {temple.location}
              </div>
              <div className="pt-4 border-t border-slate-50 space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Physical registry
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {temple.address}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Description
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                    {(temple.description === "None"
                      ? ""
                      : temple.description) || "No description provided."}
                  </p>
                </div>
                {temple.historicalContext &&
                  temple.historicalContext !== "None" && (
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Unit Summary (Bio)
                      </span>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                        {temple.bio || temple.description}
                      </p>
                    </div>
                  )}
                {temple.historicalContext &&
                  temple.historicalContext !== "None" && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Historical heritage
                      </span>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                        {temple.historicalContext}
                      </p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:row-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-md border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-brand-primary/5 flex items-center justify-center border border-brand-primary/10">
                <Users className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 normal-case tracking-normal">
                  Assigned executives
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {admins.length.toString().padStart(2, "0")}
                </p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-md border border-slate-100 flex items-center gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-md flex items-center justify-center border",
                  temple.status === "active"
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-slate-50 border-slate-100",
                )}
              >
                <Activity
                  className={cn(
                    "w-6 h-6",
                    temple.status === "active"
                      ? "text-emerald-600"
                      : "text-slate-400",
                  )}
                />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 normal-case tracking-normal">
                  Operational status
                </p>
                <p
                  className={cn(
                    "text-lg font-bold",
                    temple.status === "active"
                      ? "text-emerald-600"
                      : "text-slate-400",
                  )}
                >
                  {temple.status === "active" ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </div>

          <div className="h-[350px]">
            <LiveTempleHeatmap templeName={temple.name} />
          </div>

          <div className="bg-white rounded-md border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-800">
                  Temple admin list
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400 normal-case">
                Personnel registry
              </span>
            </div>

            <div className="divide-y divide-slate-50">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-300">
                  <div className="w-6 h-6 border-2 border-brand-primary rounded-full border-t-transparent animate-spin" />
                  <span className="text-[10px] font-bold normal-case">
                    Synchronizing registry...
                  </span>
                </div>
              ) : admins.length > 0 ? (
                admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                        {admin.image ? (
                          <img
                            src={admin.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-800 tracking-tight leading-none mb-1">
                          {admin.name}
                        </p>
                        {admin.bio && admin.bio !== "None" && (
                          <p className="text-[10px] text-slate-500 font-medium line-clamp-1 mb-1 italic">
                            "{admin.bio}"
                          </p>
                        )}
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-brand-primary font-bold normal-case">
                            {admin.role}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {admin.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "px-3 py-1 rounded-md text-[9px] font-bold flex items-center gap-1.5",
                        admin.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : admin.status === "Pending"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-slate-50 text-slate-400 border border-slate-200",
                      )}
                    >
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          admin.status === "Active"
                            ? "bg-emerald-500"
                            : admin.status === "Pending"
                              ? "bg-amber-500"
                              : "bg-slate-400",
                        )}
                      />
                      {admin.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center px-8">
                  <div className="w-12 h-12 bg-slate-50 rounded-md border border-dashed border-slate-200 flex items-center justify-center mb-4 text-slate-300">
                    <Users className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    No assigned executives
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[200px]">
                    No personnel have been designated for this unit in the trust
                    registry.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TempleDetailsView;
