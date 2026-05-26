import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TempleState {
  activeTempleId: string | "all";
  temples: { id: string; name: string }[];
  loading: boolean;
}

const initialState: TempleState = {
  activeTempleId: localStorage.getItem("activeTempleId") || "all",
  temples: [],
  loading: false,
};

const templeSlice = createSlice({
  name: "temple",
  initialState,
  reducers: {
    setActiveTemple: (state, action: PayloadAction<string | "all">) => {
      state.activeTempleId = action.payload;
      localStorage.setItem("activeTempleId", action.payload);
    },
    setTemples: (
      state,
      action: PayloadAction<{ id: string; name: string }[]>,
    ) => {
      state.temples = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setActiveTemple, setTemples, setLoading } = templeSlice.actions;
export default templeSlice.reducer;
