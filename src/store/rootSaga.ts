import { all, fork } from "redux-saga/effects";
import { authSaga } from "@/store/sagas/authSaga";

export default function* rootSaga() {
  yield all([fork(authSaga)]);
}
