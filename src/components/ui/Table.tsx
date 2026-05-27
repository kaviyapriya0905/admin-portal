import React from "react";
import { cn } from "@/utils/cn";

interface TableProps {
  className?: string;
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ className, children }) => (
  <div className="overflow-x-auto">
    <table className={cn("w-full text-left border-collapse", className)}>
      {children}
    </table>
  </div>
);

export const THead: React.FC<TableProps> = ({ className, children }) => (
  <thead className={cn("bg-slate-50/30 border-b border-slate-50", className)}>
    {children}
  </thead>
);

export const TBody: React.FC<TableProps> = ({ className, children }) => (
  <tbody className={cn("divide-y divide-slate-50", className)}>
    {children}
  </tbody>
);

export const TR: React.FC<TableProps> = ({ className, children }) => (
  <tr className={cn("hover:bg-slate-50/50 transition-colors group", className)}>
    {children}
  </tr>
);

export const TH: React.FC<
  TableProps &
    React.ThHTMLAttributes<HTMLTableCellElement> & {
      align?: "left" | "center" | "right";
    }
> = ({ className, children, align = "left", ...props }) => (
  <th
    {...props}
    className={cn(
      "px-4 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest",
      align === "center" && "text-center",
      align === "right" && "text-right",
      className,
    )}
  >
    {children}
  </th>
);

export const TD: React.FC<
  TableProps &
    React.TdHTMLAttributes<HTMLTableCellElement> & {
      align?: "left" | "center" | "right";
    }
> = ({ className, children, align = "left", ...props }) => (
  <td
    {...props}
    className={cn(
      "px-4 py-3 text-[13px] text-slate-700",
      align === "center" && "text-center",
      align === "right" && "text-right",
      className,
    )}
  >
    {children}
  </td>
);
