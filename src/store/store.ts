import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "@/store/slices/authSlice";
import templeReducer from "@/store/slices/templeSlice";
import campaignReducer from "@/store/slices/campaignSlice";
import providerReducer from "@/store/slices/providerSlice";
import rootSaga from "@/store/rootSaga";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    temple: templeReducer,
    campaigns: campaignReducer,
    provider: providerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
