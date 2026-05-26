import React from "react";
import { User, Loader2, Edit, Trash2, Search, Users } from "lucide-react";
import { cn } from "../../../../utils/cn";
import {
  Table,
  THead,
  TBody,
  TR,
  TH,
  TD,
} from "../../../../components/ui/Table";

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

interface AdminTableProps {
  admins: AdminMember[];
  loading: boolean;
  isDeleting: string | null;
  onEdit: (admin: AdminMember) => void;
  onDelete: (id: string, name: string) => void;
  canManage: boolean;
}

const AdminDirectoryTable: React.FC<AdminTableProps> = ({
  admins,
  loading,
  isDeleting,
  onEdit,
  onDelete,
  canManage,
}) => {
  return (
    <div className="bg-white rounded-md border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/10">
        <h2 className="font-semibold text-slate-800 text-sm">
          Personnel Directory
        </h2>
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-brand-primary transition-colors" />
          <input
            type="text"
            placeholder="Search directory..."
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-md text-[12px] outline-none focus:border-brand-primary/30 w-64 transition-all focus:bg-white font-medium text-slate-700"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-300">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-xs font-bold normal-case tracking-normal">
              Synchronizing registry...
            </p>
          </div>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Designated unit</TH>
                <TH>Credentials</TH>
                <TH>Designation</TH>
                <TH>Status</TH>
                {canManage && <TH className="w-20 text-right">Actions</TH>}
              </TR>
            </THead>
            <TBody>
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <TR key={admin.id}>
                    <TD className="py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shrink-0 overflow-hidden">
                          {admin.image && admin.image !== "None" ? (
                            <img
                              src={admin.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[13px] font-semibold text-slate-700 tracking-tight leading-none">
                            {admin.name}
                          </span>
                          {admin.bio && admin.bio !== "None" && (
                            <span className="text-[10px] text-slate-400 font-medium italic line-clamp-1">
                              "{admin.bio}"
                            </span>
                          )}
                        </div>
                      </div>
                    </TD>
                    <TD className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                        <span className="text-[11px] text-slate-600 font-bold tracking-tight">
                          {admin.templeName || "Corporate Lead"}
                        </span>
                      </div>
                    </TD>
                    <TD className="py-2.5">
                      <div className="flex flex-col gap-0">
                        <span className="text-[11px] text-slate-600 font-semibold tracking-tight">
                          {admin.email}
                        </span>
                        <span className="text-[9px] text-slate-300 font-medium">
                          {admin.username}
                        </span>
                      </div>
                    </TD>
                    <TD className="py-2.5">
                      <span className="text-[10px] bg-brand-primary/5 text-brand-primary px-2 py-0.5 rounded-md font-bold normal-case tracking-normal">
                        {admin.role}
                      </span>
                    </TD>
                    <TD className="py-2.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all",
                          admin.status === "Active"
                            ? "text-emerald-600 bg-emerald-50 border border-emerald-100"
                            : admin.status === "Pending"
                              ? "text-amber-600 bg-amber-50 border border-amber-100"
                              : "text-slate-400 bg-slate-50 border border-slate-100",
                        )}
                      >
                        <div
                          className={cn(
                            "w-1 h-1 rounded-full",
                            admin.status === "Active"
                              ? "bg-emerald-500"
                              : admin.status === "Pending"
                                ? "bg-amber-500"
                                : "bg-slate-400",
                          )}
                        />
                        {admin.status}
                      </span>
                    </TD>
                    {canManage && (
                      <TD className="py-2.5 text-right">
                        <div className="flex justify-end gap-2 transition-opacity">
                          <button
                            onClick={() => onEdit(admin)}
                            className="p-1.5 bg-slate-50 text-slate-400 hover:bg-brand-primary/10 hover:text-brand-primary rounded-md transition-all duration-300"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(admin.id, admin.name)}
                            className="p-1.5 bg-slate-50 text-slate-400 hover:bg-brand-primary/10 hover:text-brand-primary rounded-md transition-all duration-300 disabled:opacity-50"
                          >
                            {isDeleting === admin.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </TD>
                    )}
                  </TR>
                ))
              ) : (
                <TR>
                  <TD colSpan={canManage ? 6 : 5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-10 h-10 text-slate-100" />
                      <p className="text-xs font-bold text-slate-300 normal-case tracking-normal">
                        No administrators found
                      </p>
                    </div>
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminDirectoryTable;
