import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ProviderSettings {
  costs: {
    SMS: number;
    WhatsApp: number;
    Email: number;
  };
}

const initialState: ProviderSettings = {
  costs: {
    SMS: 0.20,
    WhatsApp: 1.00,
    Email: 0.06,
  },
};

const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    updateCosts: (state, action: PayloadAction<Partial<ProviderSettings["costs"]>>) => {
      state.costs = { ...state.costs, ...action.payload };
    },
  },
});

export const { updateCosts } = providerSlice.actions;

export default providerSlice.reducer;
