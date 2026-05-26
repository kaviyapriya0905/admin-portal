import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Car,
  Utensils,
  BatteryCharging,
  Target,
  Megaphone,
  CheckCircle,
  Radio,
  ShieldAlert,
  CloudRain,
  Sun,
  BedDouble,
  Flower2,
  Mic2,
  Globe2,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const LiveOperations: React.FC = () => {
  // Existing State
  const [isVipMode, setIsVipMode] = useState(false);
  const [parkingLotA, setParkingLotA] = useState(70);
  const [, setParkingLotB] = useState(20);
  const [mealsRemaining, setMealsRemaining] = useState(450);
  const [hundiLevels, setHundiLevels] = useState([30, 45, 80, 20]);
  const [campaignProgress, setCampaignProgress] = useState(85);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // New State
  const [weatherAlert, setWeatherAlert] = useState(false);
  const [rooms, setRooms] = useState([
    { id: "101", status: "Occupied" },
    { id: "402", status: "Needs Cleaning" },
    { id: "405", status: "Ready" },
    { id: "501", status: "Needs Cleaning" },
  ]);
  const [floralStatus, setFloralStatus] = useState("In Transit"); // In Transit -> Gate Scanned -> Sanctum
  const [paMessage, setPaMessage] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Simulate Live Data
  useEffect(() => {
    const interval = setInterval(() => {
      setParkingLotA((prev) => {
        const next = prev + Math.floor(Math.random() * 3);
        if (next >= 98 && prev < 98) toast.error("Parking Lot A nearing capacity.");
        return next > 100 ? 100 : next;
      });

      setMealsRemaining((prev) => {
        const next = prev - Math.floor(Math.random() * 5);
        if (next <= 50 && prev > 50) toast.error("Critical: Prasadam stock running low!");
        return next < 0 ? 0 : next;
      });

      setHundiLevels((prev) => {
        const newLevels = [...prev];
        const randomHundi = Math.floor(Math.random() * 4);
        newLevels[randomHundi] = Math.min(newLevels[randomHundi] + Math.floor(Math.random() * 5), 100);
        return newLevels;
      });
      
      // Randomly trigger a weather alert simulation if not active
      if (Math.random() > 0.9) {
          setWeatherAlert(true);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const triggerVipProtocol = () => {
    setIsVipMode(!isVipMode);
    toast(isVipMode ? "VIP Protocol Deactivated." : "VIP Protocol Activated.", { icon: isVipMode ? "✅" : "🚨" });
  };

  const divertTraffic = () => { setParkingLotA(30); setParkingLotB(80); toast.success("Traffic diverted to Lot B."); };
  const refillPrasadam = () => { setMealsRemaining(1000); toast.success("Next batch of Prasadam initiated."); };
    const emptyHundi = (index: number) => {
    setHundiLevels((prev) => { const newLevels = [...prev]; newLevels[index] = 0; return newLevels; });
    toast.success(`Hundi #${index + 1} collected securely.`);
  };

  const simulateDonation = () => {
    setCampaignProgress((prev) => {
      const next = prev + 5;
      if (next >= 100) {
        setShowConfetti(true);
        toast.success("Milestone Reached! Sending Thank You broadcasts...", { icon: "🎉", duration: 6000 });
        setTimeout(() => setShowConfetti(false), 8000);
        return 100;
      }
      return next;
    });
  };

  const activateWeatherProtocol = () => {
    setWeatherAlert(false);
    toast.success("Outdoor queues safely rerouted to indoor holding areas.", { icon: "☂️" });
  };

  const markRoomClean = (id: string) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, status: "Ready" } : r));
    toast.success(`Room ${id} is now Ready for booking.`);
  };

  const scanFloralDelivery = () => {
    if (floralStatus === "In Transit") {
        setFloralStatus("Gate Scanned");
        toast.success("6:00 PM Aarti Garland scanned at South Gate.");
    } else if (floralStatus === "Gate Scanned") {
        setFloralStatus("At Sanctum");
        toast.success("Floral delivery reached the main Sanctum.");
    }
  };

  const broadcastMessage = () => {
    if (!paMessage) return;
    setIsBroadcasting(true);
    setTimeout(() => {
        setIsBroadcasting(false);
        setPaMessage("");
        toast.success("Message translated and broadcasted to all zones.", { icon: "🔊" });
    }, 2500);
  };

  return (
    <div className="space-y-6 relative overflow-hidden pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Mock Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex justify-center">
          <div className="absolute top-0 w-full h-full flex flex-wrap gap-4 overflow-hidden opacity-80 mix-blend-screen">
             {[...Array(50)].map((_, i) => (
                <div key={i} className={`w-3 h-3 bg-brand-primary rounded-sm animate-bounce`} style={{ animationDelay: `${Math.random() * 2}s`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, position: 'absolute' }} />
             ))}
          </div>
        </div>
      )}

      {/* Emergency Banner Overlay */}
      <AnimatePresence>
        {isVipMode && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center justify-between shadow-[0_0_20px_rgba(239,68,68,0.15)] overflow-hidden">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-red-600 font-bold text-sm">VIP Protocol Active</h3>
                <p className="text-red-500/80 text-xs font-medium">South Gate locked. Route 4 cleared for VIP transit.</p>
              </div>
            </div>
            <button onClick={triggerVipProtocol} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors">Stand Down</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Radio className="w-5 h-5 text-brand-primary animate-pulse" />
            Live Operations Command Center
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">Real-time logistical monitoring, logistics, and emergency overrides.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          {!isVipMode && (
            <button onClick={triggerVipProtocol} className="px-5 py-2.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-[12px] font-bold hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Trigger VIP Protocol
            </button>
          )}
        </div>
      </div>

      {/* Broadcast Panel - Full Width */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
           <h2 className="font-bold text-slate-800 flex items-center gap-2">
             <Mic2 className="w-4 h-4 text-slate-400" />
             Global PA & Digital Signage Sync
           </h2>
           <span className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded">
             <Globe2 className="w-3 h-3" /> Auto-Translates to 3 Languages
           </span>
        </div>
        <div className="flex gap-3">
           <input 
             type="text" 
             value={paMessage}
             onChange={(e) => setPaMessage(e.target.value)}
             placeholder="Type emergency alert (e.g., 'Missing child near North Gate...')" 
             className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-brand-primary"
           />
           <button 
             onClick={broadcastMessage}
             disabled={!paMessage || isBroadcasting}
             className="px-6 py-2 bg-brand-secondary text-white rounded-lg text-sm font-bold hover:bg-slate-700 disabled:opacity-50 flex items-center gap-2 transition-all"
           >
             {isBroadcasting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
             {isBroadcasting ? "Syncing..." : "Broadcast Alert"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Logistics & External Panel */}
        <div className="space-y-6">
          
          {/* Weather Integration */}
          <div className={`bg-white rounded-xl border ${weatherAlert ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'border-slate-100'} p-6 shadow-sm transition-colors duration-500`}>
             <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                {weatherAlert ? <CloudRain className="w-4 h-4 text-amber-500 animate-bounce" /> : <Sun className="w-4 h-4 text-emerald-400" />}
                Micro-Weather Radar
              </h2>
            </div>
            <div className="flex items-center justify-between">
               <div>
                  <h3 className={`text-lg font-black ${weatherAlert ? 'text-amber-600' : 'text-slate-700'}`}>
                    {weatherAlert ? 'Severe Thunderstorm Warning' : 'Clear Skies, 32°C'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    {weatherAlert ? 'Storm detected 3km away. Outdoor queues vulnerable.' : 'Optimal conditions for outdoor queues.'}
                  </p>
               </div>
               {weatherAlert && (
                 <button onClick={activateWeatherProtocol} className="bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-amber-600 shadow-sm animate-pulse">
                   Reroute Queues Indoors
                 </button>
               )}
            </div>
          </div>

          {/* Smart Parking */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-6"><Car className="w-4 h-4 text-slate-400" /> Smart Parking Logistics</h2>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-600">Lot A (Main Gate)</span>
                  <span className={parkingLotA > 90 ? "text-red-500" : "text-brand-primary"}>{parkingLotA}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div className={`h-full rounded-full ${parkingLotA > 90 ? 'bg-red-500' : 'bg-brand-primary'}`} animate={{ width: `${parkingLotA}%` }} />
                </div>
              </div>
              {parkingLotA > 85 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[11px] font-semibold text-rose-500 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> High Congestion</span>
                  <button onClick={divertTraffic} className="text-[10px] bg-brand-secondary text-white px-3 py-1.5 rounded-md font-bold hover:bg-slate-700">Divert Traffic to Lot B</button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Guest House Turnaround */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
             <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-6"><BedDouble className="w-4 h-4 text-slate-400" /> Yatri Niwas (Guest House)</h2>
             <div className="grid grid-cols-2 gap-3">
                {rooms.map(room => (
                  <div key={room.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex justify-between items-center">
                     <div>
                        <p className="text-xs font-bold text-slate-700">Room {room.id}</p>
                        <p className={`text-[10px] font-bold mt-0.5 ${room.status === 'Ready' ? 'text-emerald-500' : room.status === 'Needs Cleaning' ? 'text-amber-500' : 'text-blue-500'}`}>
                          {room.status}
                        </p>
                     </div>
                     {room.status === 'Needs Cleaning' && (
                        <button onClick={() => markRoomClean(room.id)} className="p-1.5 bg-white border border-slate-200 rounded text-slate-400 hover:text-emerald-500 hover:border-emerald-200" title="Mark Cleaned">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                     )}
                  </div>
                ))}
             </div>
          </div>

        </div>

        {/* Ops & Internal Panel */}
        <div className="space-y-6">

          {/* Floral Delivery Tracking */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800 flex items-center gap-2"><Flower2 className="w-4 h-4 text-slate-400" /> Vastra & Floral Tracking</h2>
              <span className="text-[10px] font-bold text-slate-400">6:00 PM Aarti</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
               <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${floralStatus === 'At Sanctum' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                     <Flower2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Sponsor Garland</p>
                    <p className="text-[10px] font-semibold text-slate-500">{floralStatus}</p>
                  </div>
               </div>
               <button onClick={scanFloralDelivery} disabled={floralStatus === 'At Sanctum'} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded font-bold hover:bg-slate-100 disabled:opacity-50">
                 {floralStatus === 'At Sanctum' ? 'Delivered' : 'Simulate Scan'}
               </button>
            </div>
          </div>

          {/* Prasadam Burn-Rate */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-800 flex items-center gap-2"><Utensils className="w-4 h-4 text-slate-400" /> Prasadam Burn-Rate</h2>
            </div>
            <div className="flex items-center gap-6">
               <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                    <motion.circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={213} animate={{ strokeDashoffset: 213 - (213 * (mealsRemaining / 1000)) }} className={`${mealsRemaining < 200 ? 'text-red-500' : 'text-emerald-500'} transition-colors duration-500`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-black text-slate-800">{mealsRemaining}</span>
                  </div>
               </div>
               <div className="flex-1">
                 <p className="text-[10px] font-bold text-slate-400 mb-1">Burn Rate: <span className="text-slate-700">~45/min</span></p>
                 <p className="text-[10px] font-bold text-slate-400">Est. Depletion: <span className={mealsRemaining < 200 ? 'text-red-500 animate-pulse' : 'text-slate-700'}>{Math.floor(mealsRemaining / 45)} mins</span></p>
               </div>
               <button onClick={refillPrasadam} className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors border border-slate-200" title="Start Next Batch"><CheckCircle className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Smart Hundi Monitoring */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-6"><BatteryCharging className="w-4 h-4 text-slate-400" /> Smart Hundi Monitoring</h2>
            <div className="grid grid-cols-4 gap-2">
               {hundiLevels.map((level, i) => (
                 <div key={i} className="flex flex-col items-center p-2 border border-slate-100 rounded-xl bg-slate-50/50 group hover:border-brand-primary/20">
                    <div className="relative w-6 h-10 border-2 border-slate-300 rounded-sm p-0.5 mb-2 flex flex-col justify-end overflow-hidden">
                       <motion.div className={`w-full rounded-[1px] ${level > 85 ? 'bg-red-500' : 'bg-emerald-400'}`} animate={{ height: `${level}%` }} />
                    </div>
                    <span className={`text-[10px] font-black ${level > 85 ? 'text-red-500' : 'text-slate-700'}`}>{level}%</span>
                    {level >= 90 && <button onClick={() => emptyHundi(i)} className="mt-2 text-[8px] font-bold bg-brand-secondary text-white px-2 py-1 rounded w-full">Collect</button>}
                 </div>
               ))}
            </div>
          </div>

          {/* Campaign Milestone */}
          <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
            <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-slate-400" /> Campaign Milestone Tracker</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-xl font-black text-slate-800">₹{campaignProgress.toFixed(1)}L</span>
                <span className="text-xs font-bold text-slate-400">Goal: ₹100L</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-brand-primary to-[#ff6b2b] rounded-full" animate={{ width: `${campaignProgress}%` }} />
              </div>
            </div>
            <button onClick={simulateDonation} disabled={campaignProgress >= 100} className="mt-4 w-full py-2 border border-dashed border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:text-brand-primary hover:bg-brand-primary/5 disabled:opacity-50">
              {campaignProgress >= 100 ? "Goal Reached!" : "Simulate E-Hundi Drop"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LiveOperations;
