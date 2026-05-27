import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import CreatePassword from "@/pages/auth/CreatePassword";
import Dashboard from "@/pages/dashboard/Dashboard";
import AdminOnboard from "@/pages/admin/AdminOnboard";
import TempleOnboard from "@/pages/temple-registry/TempleOnboard";
import Devotees from "@/pages/temple-ops/Devotees";
import Donations from "@/pages/temple-ops/Donations";
import PoojaSevas from "@/pages/temple-ops/PoojaSevas";
import RentalVenue from "@/pages/temple-ops/RentalVenue";
import Assets from "@/pages/temple-ops/Assets";
import Campaigns from "@/pages/temple-ops/Campaigns";
import CampaignDetails from "@/pages/temple-ops/CampaignDetails";
import EventsCalendar from "@/pages/temple-ops/EventsCalendar";

// Form Pages
import DevoteeForm from "@/pages/temple-ops/forms/DevoteeForm";
import DonationForm from "@/pages/temple-ops/forms/DonationForm";
import AdminForm from "@/pages/admin/AdminForm";
import TempleForm from "@/pages/temple-registry/TempleForm";
import PoojaSevaForm from "@/pages/temple-ops/forms/PoojaSevaForm";
import RentalVenueForm from "@/pages/temple-ops/forms/RentalVenueForm";
import AssetForm from "@/pages/temple-ops/forms/AssetForm";
import CampaignForm from "@/pages/temple-ops/forms/CampaignForm";
import EventForm from "@/pages/temple-ops/forms/EventForm";
import Settings from "@/pages/settings/Settings";

import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";
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
          <Route path="/campaigns/:id" element={<CampaignDetails />} />

          <Route path="/events" element={<EventsCalendar />} />
          <Route path="/events/add" element={<EventForm />} />
          <Route path="/events/edit/:id" element={<EventForm />} />

          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<CatchAllRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
