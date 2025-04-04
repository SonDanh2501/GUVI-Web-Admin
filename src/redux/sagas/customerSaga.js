import { call, put, takeLatest } from "redux-saga/effects";
import * as api from "../../api/customer.jsx";
import { getGroupCustomerApi } from "../../api/promotion";
import { errorNotify } from "../../helper/toast";
import * as actions from "../actions/customerAction";
import { getType } from "../actions/customerAction";
import { loadingAction } from "../actions/loading";

function* fetchCustomersSaga(action) {
  try {
    const resoponse = yield call(
      api.fetchCustomers,
      action.payload.start,
      action.payload.length,
      action.payload.type
    );
    yield put(
      actions.getCustomers.getCustomersSuccess({
        data: resoponse.data,
        total: resoponse.totalItems,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    errorNotify({
      message: err?.message,
    });
    yield put(actions.getCustomers.getCustomersFailure(err));
    yield put(loadingAction.loadingRequest(false));
  }
}

function* createCustomerSaga(action) {
  try {
    const Customer = yield call(api.createCustomer, action.payload);
    window.location.reload();
    yield put(actions.createCustomer.createCustomerSuccess(Customer.data));
  } catch (err) {
    errorNotify({
      message: err?.message,
    });
    yield put(actions.createCustomer.createCustomerFailure(err));
    yield put(loadingAction.loadingRequest(false));
  }
}

function* updateCustomerSaga(action) {
  try {
    const updatedCustomer = yield call(
      api.updateCustomer,
      action.payload.id,
      action.payload.data
    );
    window.location.reload();
    yield put(
      actions.updateCustomer.updateCustomerSuccess(updatedCustomer.data)
    );
  } catch (err) {
    errorNotify({
      message: err?.message,
    });
    yield put(actions.updateCustomer.updateCustomerFailure(err));
    yield put(loadingAction.loadingRequest(false));
  }
}

function* deleteCustomerSaga(action) {
  try {
    const deleteCustomer = yield call(
      api.deleteCustomer,
      action.payload.id,
      action.payload.data
    );
    window.location.reload();
    yield put(
      actions.deleteCustomerAction.deleteCustomerSuccess(deleteCustomer.data)
    );
  } catch (err) {
    errorNotify({
      message: err?.message,
    });
    yield put(actions.deleteCustomerAction.deleteCustomerFailure(err));
    yield put(loadingAction.loadingRequest(false));
  }
}

function* fetchGroupCustomersSaga(action) {
  try {
    const resoponse = yield call(
      getGroupCustomerApi,
      action.payload.start,
      action.payload.length
    );
    yield put(
      actions.getGroupCustomers.getGroupCustomersSuccess({
        data: resoponse.data,
        total: resoponse.totalItem,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    errorNotify({
      message: err?.message,
    });
    yield put(actions.getGroupCustomers.getGroupCustomersFailure(err));
    yield put(loadingAction.loadingRequest(false));
  }
}

function* customerSaga() {
  yield takeLatest(
    getType(actions.getCustomers.getCustomersRequest),
    fetchCustomersSaga
  );
  yield takeLatest(
    actions.createCustomer.createCustomerRequest,
    createCustomerSaga
  );
  yield takeLatest(
    actions.updateCustomer.updateCustomerRequest,
    updateCustomerSaga
  );
  yield takeLatest(
    actions.deleteCustomerAction.deleteCustomerRequest,
    deleteCustomerSaga
  );
  yield takeLatest(
    actions.getGroupCustomers.getGroupCustomersRequest,
    fetchGroupCustomersSaga
  );
}

// generator function ES6

export default customerSaga;
