import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Map, AlertTriangle } from "lucide-react";

interface Zone {
  id: string;
  name: string;
  density: "low" | "medium" | "high";
  volunteers: number;
  x: number; // percentage
  y: number; // percentage
  width: number;
  height: number;
}

const LiveTempleHeatmap: React.FC<{ templeName: string }> = ({ templeName }) => {
  const [zones, setZones] = useState<Zone[]>([
    { id: "main_sanctum", name: "Main Sanctum", density: "high", volunteers: 4, x: 40, y: 30, width: 20, height: 20 },
    { id: "darshan_q", name: "Darshan Queue", density: "high", volunteers: 6, x: 20, y: 50, width: 60, height: 15 },
    { id: "prasadam", name: "Prasadam Hall", density: "medium", volunteers: 3, x: 70, y: 20, width: 25, height: 25 },
    { id: "shoe_counter", name: "Shoe Counter", density: "medium", volunteers: 2, x: 10, y: 75, width: 20, height: 15 },
    { id: "parking", name: "Parking Area", density: "low", volunteers: 5, x: 50, y: 80, width: 40, height: 15 },
  ]);

  // Simulate real-time data changes
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(currentZones => 
        currentZones.map(zone => {
          // Randomly change density occasionally
          if (Math.random() > 0.7) {
            const densities: ("low" | "medium" | "high")[] = ["low", "medium", "high"];
            const newDensity = densities[Math.floor(Math.random() * densities.length)];
            return { ...zone, density: newDensity };
          }
          return zone;
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getDensityStyle = (density: string) => {
    switch(density) {
      case "high": return {
        background: "radial-gradient(circle, rgba(239,68,68,0.85) 0%, rgba(249,115,22,0.6) 40%, rgba(250,204,21,0.3) 70%, transparent 100%)",
        filter: "blur(4px)"
      };
      case "medium": return {
        background: "radial-gradient(circle, rgba(249,115,22,0.75) 0%, rgba(250,204,21,0.5) 50%, transparent 100%)",
        filter: "blur(4px)"
      };
      case "low": return {
        background: "radial-gradient(circle, rgba(16,185,129,0.65) 0%, rgba(52,211,153,0.3) 50%, transparent 100%)",
        filter: "blur(4px)"
      };
      default: return {
        background: "radial-gradient(circle, rgba(100,116,139,0.6) 0%, transparent 100%)",
        filter: "blur(4px)"
      };
    }
  };

  const getRippleColor = (density: string) => {
    switch(density) {
      case "high": return "bg-rose-400";
      case "medium": return "bg-amber-400";
      case "low": return "bg-emerald-400";
      default: return "bg-slate-400";
    }
  };

  return (
    <div className="bg-brand-primary rounded-md border border-slate-800 overflow-hidden relative shadow-lg h-full min-h-[350px] flex flex-col">
      <div className="p-4 border-b border-slate-800 bg-brand-primary/80 backdrop-blur flex justify-between items-center shrink-0 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
            <Map className="w-4 h-4 text-brand-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-none mb-1">Live Crowd Heatmap</h3>
            <p className="text-[10px] text-slate-400 font-medium">Auto-syncing real-time feed for {templeName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-[10px] font-bold">
          <div className="flex items-center gap-1 text-slate-300"><span className="w-2 h-2 rounded-full bg-rose-500"></span> High</div>
          <div className="flex items-center gap-1 text-slate-300"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Med</div>
          <div className="flex items-center gap-1 text-slate-300"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low</div>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative flex-1 bg-slate-950 overflow-hidden p-4">
        {/* Real Image Background */}
        <div 
          className="absolute inset-0 bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: 'url(/temple-heatmap-bg.png)' }}
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-slate-950/40" />
        
        <div className="relative w-full h-full">
          {zones.map((zone) => (
            <motion.div
              key={zone.id}
              layout
              className="absolute flex flex-col items-center justify-center text-white transition-all duration-1000"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.width}%`,
                height: `${zone.height}%`,
              }}
            >
              {/* The blurred heatmap layer */}
              <div 
                className="absolute inset-0 transition-all duration-1000 pointer-events-none scale-150 rounded-full"
                style={getDensityStyle(zone.density)}
              />

              {/* Heat Ripple for High Density */}
              {zone.density === "high" && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 scale-150">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-30 ${getRippleColor(zone.density)}`}></span>
                </span>
              )}

              {/* Unblurred Content */}
              <div className="relative z-20 flex flex-col items-center">
                <span className="text-[11px] font-black tracking-wide uppercase text-white text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] px-1">
                  {zone.name}
                </span>
                
                {/* Volunteer Indicators */}
                <div className="flex gap-1 mt-1 flex-wrap justify-center max-w-[80%]">
                  {Array.from({ length: Math.min(zone.volunteers, 5) }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-300 border border-blue-100 shadow-[0_0_5px_rgba(147,197,253,0.8)]" title="Volunteer" />
                  ))}
                  {zone.volunteers > 5 && <span className="text-[8px] font-bold text-blue-200 drop-shadow-md">+{zone.volunteers - 5}</span>}
                </div>

                {zone.density === "high" && (
                  <AlertTriangle className="w-4 h-4 text-white mt-1 opacity-90 animate-pulse drop-shadow-md" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTempleHeatmap;
