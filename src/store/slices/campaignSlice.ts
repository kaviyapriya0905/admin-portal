import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export interface Expense {
  id: string;
  category: "Advertisement" | "Vendor" | "Event" | "Marketing";
  amount: number;
  date: string;
  description: string;
}

export interface Transaction {
  id: string;
  amount: number;
  status: "Success" | "Pending" | "Failed" | "Refunded";
  date: string;
  donorName: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: "Donation" | "Event" | "Festival" | "Annadhanam" | "Renovation";
  startDate: string;
  endDate: string;
  targetAmount: number;
  image?: string;
  status: "Draft" | "Pending Approval" | "Active" | "Completed" | "Rejected" | "Archived";
  
  // Configuration
  categories?: string[];
  minDonation?: number;
  visibility?: "Public" | "Private";
  paymentGateway?: string;
  priority?: "High" | "Medium" | "Low";
  dailyBudget?: number;
  providerCost?: number;
  
  // Computed tracking
  fundsRaised: number;
  expenses: Expense[];
  transactions: Transaction[];
  templeId?: string;
  templeName?: string;
  channels?: string[];
  audienceCount?: number;
  estimatedCost?: number;
}

interface CampaignState {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
}

const initialState: CampaignState = {
  campaigns: [],
  loading: false,
  error: null,
};

const campaignSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCampaigns: (state, action: PayloadAction<Campaign[]>) => {
      state.campaigns = action.payload;
    },
    addCampaign: (state, action: PayloadAction<Campaign>) => {
      state.campaigns.unshift(action.payload);
    },
    updateCampaign: (state, action: PayloadAction<Campaign>) => {
      const idx = state.campaigns.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) {
        state.campaigns[idx] = action.payload;
      }
    },
    updateCampaignStatus: (state, action: PayloadAction<{ id: string; status: Campaign["status"] }>) => {
      const idx = state.campaigns.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) {
        state.campaigns[idx].status = action.payload.status;
      }
    },
    addExpense: (state, action: PayloadAction<{ id: string; expense: Expense }>) => {
      const idx = state.campaigns.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) {
        state.campaigns[idx].expenses.unshift(action.payload.expense);
      }
    },
    deleteCampaign: (state, action: PayloadAction<string>) => {
      state.campaigns = state.campaigns.filter(c => c.id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setCampaigns,
  addCampaign,
  updateCampaign,
  updateCampaignStatus,
  addExpense,
  deleteCampaign,
} = campaignSlice.actions;

export default campaignSlice.reducer;
