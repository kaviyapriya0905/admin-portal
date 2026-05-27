import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Building2,

  Bell,
  LogOut,
  User,
  Menu,
  X,
  Users,
  HeartHandshake,
  Flame,
  Calendar,
  Home,
  Megaphone,
  Package,
  ChevronsLeft,
  ChevronsRight,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logoutRequest } from "@/store/slices/authSlice";
import { setActiveTemple, setTemples } from "@/store/slices/templeSlice";
import { type RootState } from "@/store/store";
import {
  getUserRoleName,
  formatRoleName,
  isCompanyAdminRole,
} from "@/utils/userRole";
import { cn } from "@/utils/cn";
import { getMockData } from "@/utils/mockData";
import DropdownMenu from "@/components/ui/DropdownMenu";
import SmartSearchBar from "@/components/ui/SmartSearchBar";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  active?: boolean;
  isCollapsed?: boolean;
}

const SidebarItem = ({
  icon: Icon,
  label,
  path,
  active,
  isCollapsed,
}: SidebarItemProps) => (
  <Link
    to={path}
    className={cn(
      "flex items-center gap-3 px-4 py-2 transition-all duration-300 group relative",
      active
        ? "text-brand-primary font-semibold bg-brand-primary/5 rounded-md"
        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-md",
      isCollapsed ? "justify-center px-0" : "",
    )}
    title={isCollapsed ? label : undefined}
  >
    {active && (
      <motion.div
        layoutId="sidebar-active"
        className="absolute left-0 w-1 h-5 bg-brand-primary rounded-r-full"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
    <Icon
      className={cn(
        "w-5 h-5 shrink-0",
        active
          ? "text-brand-primary"
          : "text-slate-300 group-hover:text-slate-500",
      )}
    />
    {!isCollapsed && (
      <span className="text-[14px] font-medium tracking-tight whitespace-nowrap">
        {label}
      </span>
    )}
  </Link>
);

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeTempleId, temples } = useSelector(
    (state: RootState) => state.temple,
  );
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const canManageAll = isCompanyAdminRole(user);

  useEffect(() => {
    if (canManageAll) {
      const data = getMockData();
      const mappedTemples = (data.temples || []).map((t: any) => ({
        ...t,
        id: t.id || t._id || t.temple_id,
      }));
      dispatch(setTemples(mappedTemples));
    }
  }, [canManageAll, dispatch]);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsNavigating(true);
    }, 0);

    const endTimer = setTimeout(() => {
      setIsNavigating(false);
    }, 600);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [location.pathname]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    ...(temples && temples.length > 0 ? [{ icon: UserPlus, label: "Admin Onboard", path: "/admin-onboard" }] : []),
    { icon: Building2, label: "Temple Onboard", path: "/temple-onboard" },
    { icon: Users, label: "Devotees", path: "/devotees" },
    { icon: HeartHandshake, label: "Donations", path: "/donations" },
    { icon: Flame, label: "Pooja & Sevas", path: "/pooja-sevas" },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: Home, label: "Rental Venue", path: "/rental-venue" },
    { icon: Package, label: "Assets", path: "/assets" },
    { icon: Megaphone, label: "Campaigns", path: "/campaigns" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 bg-white border-r border-slate-100 flex flex-col z-[70] transition-all duration-300 lg:static lg:h-screen",
          isSidebarCollapsed && !isSidebarOpen ? "w-[72px]" : "w-64",
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div
          className={cn(
            "h-20 flex border-b border-slate-100 bg-white shrink-0 transition-all duration-300 relative",
            isSidebarCollapsed && !isSidebarOpen
              ? "flex-col items-center justify-center gap-1.5"
              : "items-center justify-between px-5",
          )}
        >
          <div
            className={cn(
              "flex items-center overflow-hidden",
              isSidebarCollapsed && !isSidebarOpen ? "justify-center" : "gap-3",
            )}
          >
            <div
              className={cn(
                "flex items-center justify-center shrink-0 transition-all duration-300",
                isSidebarCollapsed && !isSidebarOpen ? "w-8 h-8" : "w-9 h-9",
              )}
            >
              <img
                src="https://omgofficial.com/omg-logo.png"
                alt="OMG Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {(!isSidebarCollapsed || isSidebarOpen) && (
              <div className="flex flex-col justify-center whitespace-nowrap">
                <span className="text-[14px] font-bold text-slate-800 tracking-tight leading-none">
                  Admin Portal
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={cn(
              "hidden lg:flex text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-md transition-all shrink-0 items-center justify-center",
              isSidebarCollapsed && !isSidebarOpen ? "p-1" : "p-1.5",
            )}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronsRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronsLeft className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute right-4 p-2 text-slate-400 hover:text-slate-600 lg:hidden top-1/2 -translate-y-1/2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 sm:py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              path={item.path}
              active={location.pathname === item.path}
              isCollapsed={isSidebarCollapsed && !isSidebarOpen}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-50 mt-auto flex flex-col gap-2">
          <button
            onClick={() => dispatch(logoutRequest())}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-md text-slate-400 hover:bg-slate-50 hover:text-slate-800 transition-all group shadow-sm hover:shadow-md active:scale-[0.98]",
              isSidebarCollapsed && !isSidebarOpen ? "justify-center px-0" : "",
            )}
            title={
              isSidebarCollapsed && !isSidebarOpen ? "Sign out" : undefined
            }
          >
            <LogOut className="w-5 h-5 text-slate-300 group-hover:text-slate-500 shrink-0" />
            {(!isSidebarCollapsed || isSidebarOpen) && (
              <span className="text-[14px] tracking-tight font-semibold whitespace-nowrap">
                Sign out protocol
              </span>
            )}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative bg-[#fafafa]">
        <AnimatePresence>
          {isNavigating && (
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="fixed top-0 left-0 right-0 h-[3px] bg-brand-primary z-[100] shadow-[0_0_10px_rgba(183,65,14,0.5)]"
            />
          )}
        </AnimatePresence>

        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-4 sm:px-4 sm:px-4 sticky top-0 z-40 transition-all duration-300">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-400 hover:text-slate-600 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            {canManageAll ? (
              <div className="flex items-center gap-3 bg-slate-50/50 px-3 py-1.5 rounded-lg border border-slate-100">
                <Building2 className="w-3.5 h-3.5 text-brand-primary" />
                <select
                  value={activeTempleId}
                  onChange={(e) => dispatch(setActiveTemple(e.target.value))}
                  className="bg-transparent border-none text-[11px] font-bold text-slate-700 focus:ring-0 outline-none cursor-pointer pr-8"
                >
                  <option key="all" value="all">
                    Consolidated Network
                  </option>
                  {temples.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <SmartSearchBar
                placeholder="centralized resources..."
                containerClassName="flex-1 max-w-sm"
                className="bg-transparent border-none py-3 text-[12px] focus:ring-0 text-slate-600 placeholder:text-slate-200 font-semibold tracking-tight shadow-none"
              />
            )}
          </div>
          <div className="flex items-center gap-3 sm:gap-4 ml-4">
            <button className="hidden sm:flex p-2.5 text-slate-300 hover:text-brand-primary hover:bg-brand-primary/5 rounded-md transition-all relative group">
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-primary rounded-full border-2 border-white ring-2 ring-brand-primary/20"></span>
            </button>
            <div className="hidden sm:block h-6 w-[1px] bg-slate-100"></div>
            <DropdownMenu
              hideChevron
              buttonClassName="flex items-center gap-2 sm:gap-4 group pl-2 pr-1 py-1 hover:bg-slate-50 rounded-md transition-all border border-transparent hover:border-slate-100 !bg-transparent !shadow-none !ring-0"
              buttonContent={
                <>
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-[13px] font-semibold text-slate-900 leading-tight">
                      {user?.firstName
                        ? `${user.firstName} ${user.lastName || ""}`.trim()
                        : "Admin"}
                    </span>
                    <span className="text-[9px] text-brand-primary font-bold mt-1 normal-case tracking-normal leading-none opacity-80">
                      {formatRoleName(getUserRoleName(user))}
                    </span>
                  </div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-brand-primary/20 transition-all shadow-sm overflow-hidden">
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 group-hover:text-brand-primary transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </>
              }
              items={[
                { label: "Account Settings", icon: Settings, href: "/settings" },
                { label: "Sign out protocol", icon: LogOut, danger: true, onClick: () => dispatch(logoutRequest()) }
              ]}
            />
          </div>
        </header>
        <div className="p-4 sm:p-4 sm:p-4 flex-1 relative min-h-0 overflow-y-auto custom-scrollbar">
          <AnimatePresence>
            {isNavigating && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[4px] z-50 pointer-events-none"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full opacity-20"></div>
                    <div className="absolute inset-0 border-4 border-brand-primary rounded-full border-t-transparent animate-spin shadow-[0_0_15px_rgba(183,65,14,0.2)]"></div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-black text-slate-900 tracking-normal normal-case">
                      Synchronizing
                    </span>
                    <span className="text-[8px] text-slate-400 font-bold normal-case tracking-normal">
                      Network protocol
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-0 h-full flex flex-col"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
