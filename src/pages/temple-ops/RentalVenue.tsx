import React, { useState, useEffect } from "react";
import {
  
  Calendar,
  Pencil,
  Trash2,
  Home,
  AlertCircle,
  Building,
  Key,
  MapPin,
  Filter,
  Plus,
  Lock,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { type RootState } from "@/store/store";
import { LiveOccupancyBoard } from "@/pages/temple-ops/components/LiveListWidgets";
import SmartSearchBar from "@/components/ui/SmartSearchBar";
import StatCard from "@/components/ui/StatCard";
import { getMockData } from "@/utils/mockData";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
import { isAdminManagerRole } from "@/utils/userRole";

const RentalVenue: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All Bookings");
  const [bookings, setBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: "",
    name: "",
  });
  const [liveLock, setLiveLock] = useState<{ id: string; admin: string } | null>(null);

  const { activeTempleId } = useSelector((state: RootState) => state.temple);
  const { user } = useSelector((state: RootState) => state.auth);
  const canManage = isAdminManagerRole(user);

  useEffect(() => {
    const mock = getMockData().rentalVenues;
    const processed = mock.map((m) => ({
      ...m,
      ...(activeTempleId !== "all" ? { templeId: activeTempleId } : {}),
    }));
    if (activeTab !== "All Bookings") {
      setBookings(processed.filter((d: any) => d.status === activeTab));
    } else {
      setBookings(processed);
    }
  }, [activeTempleId, activeTab]);

  useEffect(() => {
    // Simulate real-time booking locks by other admins to prevent double-booking
    const interval = setInterval(() => {
       if (bookings.length > 0 && Math.random() > 0.6) {
          const randomBooking = bookings[Math.floor(Math.random() * bookings.length)];
          const mockAdmins = ["Admin Rahul", "Admin Priya", "Manager Sharma"];
          const randomAdmin = mockAdmins[Math.floor(Math.random() * mockAdmins.length)];
          
          setLiveLock({ id: randomBooking.id, admin: randomAdmin });
          
          // Clear lock after 5 seconds
          setTimeout(() => {
             setLiveLock(null);
          }, 5000);
       }
    }, 8000);
    return () => clearInterval(interval);
  }, [bookings]);

  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length.toString(),
      icon: Home,
      color: "bg-brand-primary/10 text-brand-primary",
    },
    {
      title: "Upcoming Events",
      value: bookings
        .filter((b) => b.status === "Confirmed" || b.status === "Pending")
        .length.toString(),
      icon: Calendar,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Maintenance",
      value: bookings
        .filter((b) => b.status === "Maintenance")
        .length.toString(),
      icon: AlertCircle,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const filteredList = bookings.filter(
    (b) =>
      b.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.client.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const confirmDelete = async () => {
    setIsDeleting(deleteModal.id);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(`Booking ${deleteModal.name} removed`);
      setBookings((prev) => prev.filter((b) => b.id !== deleteModal.id));
      setDeleteModal({ isOpen: false, id: "", name: "" });
    } catch {
      toast.error("Error deleting booking");
    } finally {
      setIsDeleting(null);
    }
  };


  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Rental Venue Management
          </h1>
          <p className="text-[13px] text-slate-400 mt-1">
            Displaying{" "}
            {activeTempleId === "all"
              ? "Consolidated trust facilities"
              : "Linked temple facilities"}
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group">
            <Building className="w-3.5 h-3.5" />
            Facility Registry
          </button>
          {canManage && (
            <button
              onClick={() => navigate("/rental-venue/add")}
              className="flex-1 sm:flex-none px-4 py-2 bg-brand-primary text-white rounded-md text-[11px] font-semibold hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Booking
            </button>
          )}
        </div>
      </div>

      <LiveOccupancyBoard />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/20">
          <div className="flex gap-4 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {["All Bookings", "Upcoming", "Completed", "Maintenance"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-2 text-[12px] font-bold transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? "text-brand-primary"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />
                  )}
                </button>
              ),
            )}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-white transition-all"
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
            </button>
            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-100 shadow-xl rounded-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[11px] font-bold text-slate-700">
                    Filter Bookings
                  </h3>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-1 hover:bg-slate-50 rounded-md"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 py-2">
                  Advanced filters coming soon
                </div>
              </div>
            )}
            <SmartSearchBar 
                value={searchTerm} 
                onChange={setSearchTerm} 
                placeholder="bookings..." 
              />
          </div>
        </div>

        <div className="w-full overflow-x-auto overflow-y-auto max-h-[calc(100vh-18rem)] custom-scrollbar relative">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm shadow-sm">
              <tr className="bg-slate-50/50">
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Venue / Booking ID
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Temple Unit
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Client / Purpose
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                {canManage && (
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredList.length > 0 ? (
                filteredList.map((booking, i) => (
                  <tr
                    key={i}
                    className={`transition-colors group ${liveLock !== null && liveLock.id === booking.id ? 'bg-red-50/50' : 'hover:bg-slate-50/60'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5 relative">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                          {liveLock !== null && liveLock.id === booking.id ? <Lock className="w-4 h-4 text-red-500 animate-pulse" /> : <Key className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-[12px] font-bold text-slate-700">
                            {booking.venue}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[9px] text-slate-400 font-medium">
                              {booking.id}
                            </p>
                            {liveLock !== null && liveLock.id === booking.id && (
                               <span className="text-[9px] font-bold text-red-500 animate-pulse flex items-center gap-1">
                                 Currently editing by {liveLock.admin}
                               </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-700 font-semibold whitespace-nowrap">
                        <MapPin className="w-3 h-3 text-brand-primary/80" />
                        {booking.templeName}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-[12px] font-semibold text-slate-700">
                          {booking.client}
                        </p>
                        <span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mt-0.5 inline-block">
                          {booking.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {booking.date}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                          booking.status === "Confirmed" ||
                          booking.status === "Completed"
                            ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                            : booking.status === "Maintenance"
                              ? "text-rose-600 bg-rose-50 border-rose-100"
                              : "text-amber-600 bg-amber-50 border-amber-100"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    {canManage && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              navigate(`/rental-venue/edit/${booking.id}`)
                            }
                            disabled={liveLock !== null && liveLock.id === booking.id}
                            className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-300/60 hover:bg-amber-50 rounded-md shadow-sm transition-all duration-300 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                            title={liveLock !== null && liveLock.id === booking.id ? "Locked by another admin" : "Edit Booking"}
                          >
                            <Pencil className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                id: booking.id,
                                name: booking.id,
                              })
                            }
                            disabled={liveLock !== null && liveLock.id === booking.id}
                            className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300/60 hover:bg-rose-50 rounded-md shadow-sm transition-all duration-300 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                            title={liveLock !== null && liveLock.id === booking.id ? "Locked by another admin" : "Delete Booking"}
                          >
                            <Trash2 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 sm:py-10 text-center text-slate-400 text-[12px]"
                  >
                    No rental bookings found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
            <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        loading={!!isDeleting}
        title="Delete Booking"
        itemName={deleteModal.name}
        message="Are you sure you want to remove this booking? This action cannot be undone."
      />
    </div>
  );
};

export default RentalVenue;
