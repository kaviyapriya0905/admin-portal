import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import CreatePassword from "./pages/auth/CreatePassword";
import Dashboard from "./pages/home/Dashboard";
import AdminOnboard from "./pages/apps/admin/AdminOnboard";
import TempleOnboard from "./pages/apps/temple/TempleOnboard";
import Devotees from "./pages/apps/temple-management/Devotees";
import Donations from "./pages/apps/temple-management/Donations";
import PoojaSevas from "./pages/apps/temple-management/PoojaSevas";
import RentalVenue from "./pages/apps/temple-management/RentalVenue";
import Assets from "./pages/apps/temple-management/Assets";
import Campaigns from "./pages/apps/temple-management/Campaigns";
import EventsCalendar from "./pages/apps/temple-management/EventsCalendar";
import LiveOperations from "./pages/apps/temple-management/LiveOperations";

// Form Pages
import DevoteeForm from "./pages/apps/temple-management/forms/DevoteeForm";
import DonationForm from "./pages/apps/temple-management/forms/DonationForm";
import AdminForm from "./pages/apps/admin/AdminForm";
import TempleForm from "./pages/apps/temple/TempleForm";
import PoojaSevaForm from "./pages/apps/temple-management/forms/PoojaSevaForm";
import RentalVenueForm from "./pages/apps/temple-management/forms/RentalVenueForm";
import AssetForm from "./pages/apps/temple-management/forms/AssetForm";
import CampaignForm from "./pages/apps/temple-management/forms/CampaignForm";
import EventForm from "./pages/apps/temple-management/forms/EventForm";
import Settings from "./pages/apps/settings/Settings";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSelector } from "react-redux";
import { type RootState } from "./redux/store";
import { Outlet } from "react-router-dom";

const LayoutWrapper = () => (
  <ProtectedRoute>
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  </ProtectedRoute>
);

const CatchAllRedirect = () => {
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#334155",
            padding: "12px 24px",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "600",
            border: "1px solid #f1f5f9",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
          },
          success: {
            iconTheme: {
              primary: "#A34015",
              secondary: "#fff",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<CatchAllRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/auth/create_password/:hash"
          element={<CreatePassword />}
        />
        <Route element={<LayoutWrapper />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-onboard" element={<AdminOnboard />} />
          <Route path="/admin/edit/:id" element={<AdminForm />} />
          <Route path="/temple-onboard" element={<TempleOnboard />} />
          <Route path="/temple/edit/:id" element={<TempleForm />} />
          <Route path="/devotees" element={<Devotees />} />
          <Route path="/devotees/add" element={<DevoteeForm />} />
          <Route path="/devotees/edit/:id" element={<DevoteeForm />} />

          <Route path="/donations" element={<Donations />} />
          <Route path="/donations/add" element={<DonationForm />} />
          <Route path="/donations/edit/:id" element={<DonationForm />} />

          <Route path="/pooja-sevas" element={<PoojaSevas />} />
          <Route path="/pooja-sevas/add" element={<PoojaSevaForm />} />
          <Route path="/pooja-sevas/edit/:id" element={<PoojaSevaForm />} />

          <Route path="/rental-venue" element={<RentalVenue />} />
          <Route path="/rental-venue/add" element={<RentalVenueForm />} />
          <Route path="/rental-venue/edit/:id" element={<RentalVenueForm />} />

          <Route path="/assets" element={<Assets />} />
          <Route path="/assets/add" element={<AssetForm />} />
          <Route path="/assets/edit/:id" element={<AssetForm />} />

          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/add" element={<CampaignForm />} />
          <Route path="/campaigns/edit/:id" element={<CampaignForm />} />

          <Route path="/events" element={<EventsCalendar />} />
          <Route path="/events/add" element={<EventForm />} />
          <Route path="/events/edit/:id" element={<EventForm />} />

          <Route path="/live-operations" element={<LiveOperations />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<CatchAllRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
