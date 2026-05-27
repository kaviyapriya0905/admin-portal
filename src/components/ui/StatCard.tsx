import React from "react";
import { cn } from "@/utils/cn";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
}) => (
  <div className="bg-white p-5 rounded-md border border-slate-100 flex items-center justify-between group hover:border-brand-primary/20 transition-all duration-300">
    <div>
      <h3 className="text-base font-semibold text-slate-800 tracking-tight leading-none">
        {value}
      </h3>
      <p className="text-[10px] font-medium text-slate-400 mt-1.5">{title}</p>
    </div>
    <div
      className={cn(
        "p-2.5 rounded-md transition-all group-hover:scale-110",
        color,
      )}
    >
      <Icon className="w-4 h-4" />
    </div>
  </div>
);

export default StatCard;
