import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  
  Users,
  Star,
  MoreHorizontal,
  Pencil,
  Trash2,
  Radio,
  
  } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/utils/cn";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";
import { isAdminManagerRole } from "@/utils/userRole";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import SmartSearchBar from "@/components/ui/SmartSearchBar";
import { getMockData, deleteMockItem } from "@/utils/mockData";
import { UpcomingEventCountdown } from "@/pages/temple-ops/components/LiveListWidgets";

interface EventItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: "pooja" | "festival" | "meeting" | "maintenance";
  attendees: number;
  status: string;
  description: string;
  organizer: string;
  prasadam: string;
  resources: string;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const EventsCalendar: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [liveEvents, setLiveEvents] = useState<string[]>([]);

  const { user } = useSelector((state: RootState) => state.auth);
  const { activeTempleId } = useSelector((state: RootState) => state.temple);
  const canManage = isAdminManagerRole(user);

  // Modal State
    const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: "",
    name: "",
  });
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const fetchEvents = React.useCallback(async () => {
    try {
      const data = getMockData();
      let allEvents = data.events || [];
      if (activeTempleId && activeTempleId !== "all") {
        allEvents = allEvents.filter(e => e.templeId === activeTempleId);
      }
      const mapped = allEvents.map((e: any) => ({
        id: e.id,
        title: e.title || e.event_name,
        date: e.date ? new Date(e.date).toISOString().split("T")[0] : "",
        time: e.time,
        type: e.type || e.pooja_type || "pooja",
        attendees: Number(e.attendees || e.expected_devotees) || 0,
        status: e.status || "Planned",
        description: e.description || "",
        organizer: e.organizer || e.organizer_name || "",
        prasadam: e.prasadam || e.prasadam_planned || "",
        resources: e.resources || e.resource_needed || "",
      }));
      setEvents(mapped);
    } catch (err) {
      console.error("Failed to fetch events", err);
    }
  }, [activeTempleId]);

  React.useEffect(() => {
    fetchEvents();
  }, [activeTempleId, fetchEvents]);

  React.useEffect(() => {
    const interval = setInterval(() => {
       setLiveEvents(prev => {
          if (events.length > 0 && Math.random() > 0.7) {
             const upcoming = events.filter(e => e.status !== "Completed" && e.status !== "In Progress");
             if (upcoming.length > 0) {
                const randomEvent = upcoming[Math.floor(Math.random() * upcoming.length)];
                return [...prev.slice(-2), randomEvent.id]; // keep up to 3 live
             }
          }
          return prev;
       });
    }, 5000);
    return () => clearInterval(interval);
  }, [events]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDate = (date: Date) => {
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return events
      .filter((e) => e.date === dateString)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const filteredAgenda = selectedDate
    ? getEventsForDate(selectedDate).filter((e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  const confirmDelete = async () => {
    setIsDeleting(deleteModal.id);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      deleteMockItem("events", deleteModal.id);
      toast.success(`Event ${deleteModal.name} removed`);
      fetchEvents();
      setDeleteModal({ isOpen: false, id: "", name: "" });
    } catch (err) {
      toast.error("Error deleting event");
    } finally {
      setIsDeleting(null);
    }
  };

  const getEventStyle = (type: string) => {
    switch (type) {
      case "festival":
        return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:border-slate-300";
      case "pooja":
        return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:border-slate-300";
      case "meeting":
        return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:border-slate-300";
      case "maintenance":
        return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:border-slate-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:border-slate-300";
    }
  };

  const getEventDotColor = (type: string) => {
    switch (type) {
      case "festival":
        return "bg-slate-500";
      case "pooja":
        return "bg-slate-500";
      case "meeting":
        return "bg-slate-500";
      case "maintenance":
        return "bg-slate-500";
      default:
        return "bg-slate-500";
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="aspect-square border border-transparent"
        />,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const thisDate = new Date(year, month, day);
      const isToday = new Date().toDateString() === thisDate.toDateString();
      const isSelected =
        selectedDate?.toDateString() === thisDate.toDateString();
      const dayEvents = getEventsForDate(thisDate);

      days.push(
        <motion.div
          whileHover={{ scale: 1.02, zIndex: 20 }}
          key={day}
          onClick={() => setSelectedDate(thisDate)}
          className={cn(
            "aspect-square flex flex-col border border-slate-200/60 p-1.5 sm:p-2 relative group cursor-pointer transition-all duration-300 overflow-hidden",
            "bg-white/60 backdrop-blur-sm",
            isSelected
              ? "ring-2 ring-brand-primary/50 shadow-lg z-10 rounded-xl bg-white scale-[1.02]"
              : "hover:shadow-md hover:border-brand-primary/30 hover:bg-white rounded-lg m-[1px]",
          )}
        >
          <div className="flex justify-between items-start mb-2">
            <span
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all duration-300",
                isToday
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/30"
                  : isSelected
                    ? "bg-brand-primary/10 text-brand-primary"
                    : "text-slate-600 group-hover:text-brand-primary group-hover:bg-brand-primary/5",
              )}
            >
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-100 text-[8px] font-bold text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                {dayEvents.length}
              </span>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-1 sm:gap-1.5 overflow-hidden">
            {dayEvents.slice(0, 3).map((evt) => (
              <div
                key={evt.id}
                className={cn(
                  "px-2 py-0.5 rounded-md text-[9px] font-semibold truncate border transition-colors flex items-center gap-1.5",
                  getEventStyle(evt.type),
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    getEventDotColor(evt.type),
                  )}
                />
                {evt.title}
                {liveEvents.includes(evt.id) && (
                   <span className="w-1.5 h-1.5 rounded-full bg-red-500 ml-auto animate-pulse shrink-0" title="Live Now" />
                )}
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="flex items-center justify-center gap-1 mt-1 text-[10px] font-bold text-slate-400 group-hover:text-brand-primary transition-colors">
                <MoreHorizontal className="w-3 h-3" />
              </div>
            )}
          </div>
        </motion.div>,
      );
    }
    return days;
  };

  return (
    <div className="space-y-4 sm:space-y-4 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 relative z-20">
        <div className="space-y-1">
          <h1 className="text-base sm:text-lg font-semibold text-slate-800 tracking-tight">
            Events & Calendar
          </h1>
          <p className="text-[11px] text-slate-500 font-medium">
            Manage poojas, festivals, meetings, and schedules across the trust.
          </p>
        </div>
        {canManage && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/events/add")}
            className="w-full sm:w-auto px-4 py-3 bg-brand-primary text-white rounded-xl text-sm font-bold hover:shadow-xl hover:shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Create Event
          </motion.button>
        )}
      </div>

      <UpcomingEventCountdown />

      <div className="flex flex-col xl:flex-row gap-4 sm:gap-4">
        <div className="xl:w-2/3 flex flex-col relative z-10">
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden flex flex-col">
            <div className="p-4 sm:p-4 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <h2 className="text-base sm:text-lg font-semibold text-slate-800 tracking-tight">
                  {MONTHS[month]}{" "}
                  <span className="text-brand-primary">{year}</span>
                </h2>
              </div>
              <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 rounded-xl border border-slate-200/50 shadow-inner">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-lg hover:bg-white text-slate-500 hover:text-slate-800 transition-all hover:shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setCurrentDate(new Date());
                    setSelectedDate(new Date());
                  }}
                  className="px-5 py-2 rounded-lg hover:bg-white text-brand-primary font-medium transition-all hover:shadow-sm text-[13px] tracking-wide"
                >
                  Today
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg hover:bg-white text-slate-500 hover:text-slate-800 transition-all hover:shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar Body */}
            <div className="flex-1 flex flex-col p-4 sm:p-4 sm:p-4 pt-4 bg-slate-50/30">
              <div className="grid grid-cols-7 gap-1 mb-3">
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day}
                    className="text-center text-[9px] font-medium text-slate-400 uppercase tracking-wider py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-[1px] bg-slate-200/60 rounded-2xl overflow-hidden flex-1 border border-slate-200/50 shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${year}-${month}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="contents"
                  >
                    {renderCalendarDays()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:w-1/3 flex flex-col gap-4 relative z-10">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-4 sm:p-4 sm:p-4 flex flex-col h-[500px] xl:h-auto xl:min-h-[500px] overflow-hidden relative">
            <div className="flex flex-col gap-2 mb-8 relative z-10">
              <h3 className="text-sm font-semibold text-slate-800 tracking-tight flex items-center gap-2">
                {selectedDate?.toDateString() === new Date().toDateString()
                  ? "Today's Agenda"
                  : selectedDate?.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    }) || "Select a Date"}
              </h3>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-medium tracking-widest uppercase">
                  {filteredAgenda.length} Event
                  {filteredAgenda.length !== 1 && "s"}
                </span>
              </div>
            </div>

              <SmartSearchBar 
                value={searchQuery} 
                onChange={setSearchQuery} 
                placeholder="agenda..."
                containerClassName="mb-6 z-10 w-full"
                className="py-3.5 bg-slate-50/80 text-sm focus:ring-4 focus:ring-brand-primary/10"
              />
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 pb-4 z-10">
              <AnimatePresence>
                {filteredAgenda.length > 0 ? (
                  filteredAgenda.map((evt, idx) => (
                    <motion.div
                      key={evt.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      className="group p-5 rounded-2xl border border-slate-100 hover:border-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/5 transition-all cursor-pointer bg-white relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-4 pl-3">
                        <h4 className="font-semibold text-slate-800 text-[11px] leading-tight pr-4 group-hover:text-brand-primary transition-colors">
                          {evt.title}
                        </h4>
                        <div className="flex items-center gap-2 shrink-0">
                           {liveEvents.includes(evt.id) && (
                             <div className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold text-red-600 bg-red-50 border border-red-100 animate-pulse">
                               <Radio className="w-2.5 h-2.5" />
                               LIVE NOW
                             </div>
                           )}
                           <div
                             className={cn(
                               "px-2.5 py-1 rounded-md text-[9px] font-medium uppercase tracking-wider",
                               getEventStyle(evt.type),
                             )}
                           >
                             {evt.type}
                           </div>
                        </div>
                      </div>

                      <div className="space-y-2.5 pl-3">
                        <div className="flex items-center gap-3 text-slate-500 text-[11px] font-medium">
                          <div className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center shrink-0">
                            <Clock className="w-3 h-3 text-slate-400" />
                          </div>
                          {evt.time}
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 text-[11px] font-medium">
                          <div className="w-5 h-5 rounded-md bg-slate-50 flex items-center justify-center shrink-0">
                            <MapPin className="w-3 h-3 text-slate-400" />
                          </div>
                          {evt.description || "TBD"}
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 text-[11px] font-medium pt-3 mt-1 border-t border-slate-100/80">
                          <div className="w-5 h-5 rounded-md bg-brand-primary/5 flex items-center justify-center shrink-0">
                            <Users className="w-3 h-3 text-brand-primary" />
                          </div>
                          <span className="text-slate-600 font-semibold">
                            {evt.attendees.toLocaleString()}
                          </span>{" "}
                          Expected
                        </div>
                        {canManage && (
                          <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-slate-50/50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/events/edit/${evt.id}`);
                              }}
                              className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-300/60 hover:bg-amber-50 rounded-md shadow-sm transition-all duration-300"
                              title="Edit Event"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteModal({
                                  isOpen: true,
                                  id: evt.id,
                                  name: evt.title,
                                });
                              }}
                              className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300/60 hover:bg-rose-50 rounded-md shadow-sm transition-all duration-300"
                              title="Delete Event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center py-4 sm:py-10 px-4"
                  >
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-5 rotate-3 shadow-inner border border-slate-100">
                      <Star className="w-8 h-8 text-slate-300" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-lg mb-2">
                      Clear Agenda
                    </h4>
                    <p className="text-[13px] text-slate-500 leading-relaxed max-w-[220px]">
                      There are no scheduled events for this date. Click 'Create
                      Event' to add a new activity.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

            <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        loading={!!isDeleting}
        title="Delete Event"
        itemName={deleteModal.name}
        message="Are you sure you want to delete this event? This action cannot be undone."
      />
    </div>
  );
};

export default EventsCalendar;
