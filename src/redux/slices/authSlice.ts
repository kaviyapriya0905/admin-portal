import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  role: { name: string };
  templeId?: string;
  userPermissions?: any[];
  profilePic?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const getStorageItem = (key: string) => {
  const item = sessionStorage.getItem(key);
  if (item === "null" || item === "undefined") return null;
  return item;
};

const normalizeUser = (user: any): User | null => {
  if (!user) return null;
  const roleObj = user.role || null;

  let roleName = null;
  if (typeof roleObj === "string") {
    roleName = roleObj;
  } else if (roleObj) {
    roleName = roleObj.name || roleObj.role_name || roleObj.roleName || null;
  }

  return {
    ...user,
    role: roleName ? { name: roleName } : null,
  } as User;
};

// Try to load user from local storage
let initialUser: User | null = null;
try {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    initialUser = JSON.parse(storedUser);
  }
} catch (e) {
  console.error("Failed to parse user from local storage");
}

const initialState: AuthState = {
  user: initialUser,
  loading: false,
  error: null,
  isAuthenticated: getStorageItem("isLoggedIn") === "true",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _action: PayloadAction<{ email: string; password: string }>,
    ) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: User;
      }>,
    ) => {
      state.loading = false;
      const normalizedUser = normalizeUser(action.payload.user);
      state.user = normalizedUser;
      state.isAuthenticated = true;
      state.error = null;
      
      if (normalizedUser) {
        localStorage.setItem("user", JSON.stringify(normalizedUser));
      }
      sessionStorage.setItem("isLoggedIn", "true");
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logoutRequest: (state) => {
      state.loading = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      
      localStorage.removeItem("user");
      sessionStorage.removeItem("isLoggedIn");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logout,
  clearError,
} = authSlice.actions;
export default authSlice.reducer;
