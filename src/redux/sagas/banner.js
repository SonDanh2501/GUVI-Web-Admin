import { takeLatest, call, put } from "redux-saga/effects";
import * as actions from "../actions/banner";
import * as api from "../../api/banner";
import { getType } from "../actions/banner";
import { loadingAction } from "../actions/loading";
import { errorNotify } from "../../helper/toast";

function* fetchBannersSaga(action) {
  try {
    const response = yield call(
      api.fetchBanners,
      action.payload.start,
      action.payload.length
    );
    yield put(
      actions.getBanners.getBannersSuccess({
        data: response.data,
        total: response.totalItem,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    yield put(loadingAction.loadingRequest(false));
    errorNotify({
      message: err?.message,
    });
    yield put(actions.getBanners.getBannersFailure(err));
  }
}

function* createBannerSaga(action) {
  try {
    const Banner = yield call(api.createBanner, action.payload);
    window.location.reload();
    yield put(actions.createBanner.createBannerSuccess(Banner.data));
  } catch (err) {
    errorNotify({
      message: err?.message,
    });
    yield put(loadingAction.loadingRequest(false));
    yield put(actions.createBanner.createBannerFailure(err));
  }
}

function* updateBannerSaga(action) {
  try {
    const updatedBanner = yield call(
      api.updateBanner,
      action.payload.id,
      action.payload.data
    );
    window.location.reload();
    yield put(actions.updateBanner.updateBannerSuccess(updatedBanner.data));
  } catch (err) {
    yield put(actions.updateBanner.updateBannerFailure(err));
    yield put(loadingAction.loadingRequest(false));
    errorNotify({
      message: err?.message,
    });
  }
}

function* BannerSaga() {
  yield takeLatest(
    getType(actions.getBanners.getBannersRequest),
    fetchBannersSaga
  );
  yield takeLatest(actions.createBanner.createBannerRequest, createBannerSaga);
  yield takeLatest(actions.updateBanner.updateBannerRequest, updateBannerSaga);
}

// generator function ES6

export default BannerSaga;
