import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, TrendingUp, Sparkles, Building2, 
  PackageSearch, Mail, Clock
} from "lucide-react";

// 1. Devotees: Live Footfall Tracker
export const LiveFootfallWidget = () => {
  const [count, setCount] = useState(1402);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3));
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between mb-6 overflow-hidden relative">
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200 relative">
          <Users className="w-5 h-5 text-emerald-600" />
          {pulse && <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-50 animate-ping" />}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">Live Temple Footfall</h4>
          <p className="text-[11px] text-slate-500 font-medium">Estimated devotees currently inside</p>
        </div>
      </div>
      <div className="text-right">
        <motion.div 
          key={count}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-black text-brand-primary"
        >
          {count.toLocaleString()}
        </motion.div>
        <span className="text-[10px] font-bold text-emerald-500 flex items-center justify-end gap-1">
          <TrendingUp className="w-3 h-3" /> Auto-syncing
        </span>
      </div>
    </div>
  );
};

// 2. Donations: Live Donation Ticker
export const LiveDonationTicker = () => {
  const [donations, setDonations] = useState([
    { id: 1, name: "Anonymous", amount: 500 },
    { id: 2, name: "Suresh", amount: 1500 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const names = ["Priya", "Rahul", "Anonymous", "Karthik", "Sneha"];
      const newD = {
        id: Date.now(),
        name: names[Math.floor(Math.random() * names.length)],
        amount: Math.floor(Math.random() * 5000) + 100,
      };
      setDonations(prev => [newD, ...prev].slice(0, 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-brand-primary p-4 rounded-xl shadow-lg mb-6 flex items-center gap-4 text-white overflow-hidden">
      <div className="flex items-center gap-2 shrink-0 border-r border-slate-700 pr-4">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Live Gateway</span>
      </div>
      <div className="flex-1 flex gap-4 overflow-hidden relative h-8 items-center">
        <AnimatePresence>
          {donations.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 - i * 0.3 }}
              exit={{ x: -100, opacity: 0 }}
              className="flex items-center gap-2 whitespace-nowrap bg-brand-secondary px-3 py-1.5 rounded-md border border-slate-700 shrink-0"
            >
              <span className="text-xs font-medium text-slate-300">{d.name}</span>
              <span className="text-xs font-bold text-emerald-400">₹{d.amount.toLocaleString()}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// 3. Pooja Sevas: Active Rituals
export const ActiveRitualsMonitor = () => {
  const [progress, setProgress] = useState(45);

  useEffect(() => {
    const i = setInterval(() => setProgress(p => (p < 100 ? p + 2 : 0)), 2000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex items-center gap-6">
      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200 shrink-0">
        <Sparkles className="w-6 h-6 text-orange-500 animate-pulse" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">In Progress</span>
            <h4 className="text-sm font-bold text-slate-800">Maha Ganapati Homa</h4>
          </div>
          <span className="text-[11px] font-medium text-slate-500">Priest Sharma • Main Sanctum</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <motion.div 
            className="bg-orange-500 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// 4. Rental Venue: Live Occupancy
export const LiveOccupancyBoard = () => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[
        { name: "Main Hall", status: "Occupied", color: "rose" },
        { name: "Mini Hall A", status: "Cleaning", color: "amber" },
        { name: "Dining Hall", status: "Available", color: "emerald" },
      ].map(h => (
        <div key={h.name} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className={`w-5 h-5 text-${h.color}-500`} />
            <div>
              <h4 className="text-[11px] font-bold text-slate-800">{h.name}</h4>
              <p className={`text-[10px] font-bold text-${h.color}-600 uppercase`}>{h.status}</p>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full bg-${h.color}-500 animate-pulse`} />
        </div>
      ))}
    </div>
  );
};

// 5. Assets: Inventory Movement
export const LiveInventoryMovement = () => {
  const [logs, setLogs] = useState(["Silver Chariot checked out for maintenance", "20 Chairs returned to Mini Hall"]);

  useEffect(() => {
    const i = setInterval(() => {
      const events = ["PA System moved to Main Hall", "Flower baskets audited", "Gold ornaments secured in vault", "Cleaning supplies restocked"];
      setLogs(p => [events[Math.floor(Math.random() * events.length)], ...p].slice(0, 2));
    }, 6000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex gap-4 items-center">
      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
        <PackageSearch className="w-5 h-5 text-indigo-600" />
      </div>
      <div className="flex-1 overflow-hidden">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Live Inventory Log</h4>
        <div className="h-[20px] overflow-hidden relative">
          <AnimatePresence>
            <motion.p
              key={logs[0]}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="absolute text-xs font-medium text-slate-700 truncate"
            >
              {logs[0]} <span className="text-[9px] text-slate-400 ml-2">Just now</span>
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// 6. Campaigns: Live Broadcast
export const LiveBroadcastAnalytics = () => {
  const [delivered, setDelivered] = useState(1402);
  const total = 5000;

  useEffect(() => {
    const i = setInterval(() => {
      setDelivered(p => (p < total ? p + Math.floor(Math.random() * 15) : total));
    }, 1500);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl border border-brand-primary/20 shadow-[0_0_15px_rgba(163,64,21,0.05)] mb-6 flex items-center gap-6">
      <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center shrink-0">
        <Mail className="w-6 h-6 text-brand-primary animate-pulse" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Navaratri Fundraiser Email</h4>
            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">Sending in progress...</span>
          </div>
          <span className="text-xs font-black text-slate-700">{delivered.toLocaleString()} / {total.toLocaleString()}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <motion.div 
            className="bg-brand-primary h-full"
            animate={{ width: `${(delivered/total)*100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// 7. Events: Countdown
export const UpcomingEventCountdown = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-xl shadow-lg mb-6 flex justify-between items-center text-white">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/10 rounded-lg backdrop-blur border border-white/20">
          <Clock className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h4 className="text-lg font-black tracking-tight mb-1">Maha Shivaratri Procession</h4>
          <p className="text-xs text-slate-300 font-medium flex items-center gap-2">
            <Users className="w-3 h-3" /> Live RSVP: <span className="font-bold text-emerald-400">12,450 Expected</span>
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        {[{l: 'DAYS', v: '04'}, {l: 'HRS', v: '12'}, {l: 'MIN', v: '45'}].map(t => (
          <div key={t.l} className="flex flex-col items-center bg-brand-primary/20 px-3 py-1.5 rounded border border-white/10">
            <span className="text-lg font-black text-white">{t.v}</span>
            <span className="text-[8px] font-bold text-slate-400 tracking-widest">{t.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
