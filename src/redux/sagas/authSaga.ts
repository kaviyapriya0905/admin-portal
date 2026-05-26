import { put, takeLatest, delay } from "redux-saga/effects";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logout,
} from "../slices/authSlice";
import { getMockData } from "../../utils/mockData";

function* handleLogin(
  action: ReturnType<typeof loginRequest>,
): Generator<unknown, void, unknown> {
  try {
    // Simulate network delay
    yield delay(500);

    const { email, password } = action.payload;
    const { users } = getMockData();

    const user = users?.find(
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      // Remove password before storing
      const { password: _p, ...userWithoutPassword } = user;
      yield put(loginSuccess({ user: userWithoutPassword as any }));
    } else {
      yield put(loginFailure("Invalid email or password"));
    }
  } catch (error: unknown) {
    yield put(loginFailure("An error occurred during login."));
  }
}

function* handleLogout(): Generator<unknown, void, unknown> {
  try {
    yield delay(200);
  } finally {
    yield put(logout());
  }
}

export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(logoutRequest.type, handleLogout);
}
