import { INIT_STATE } from "../../utils/contant";

import {
  createGroupServiceAction,
  getGroupServiceAction,
  getProvinceAction,
  getServiceAction,
  getType,
  updateGroupServiceAction,
} from "../actions/service";

export default function ServiceReducers(state = INIT_STATE.service, action) {
  switch (action.type) {
    case getType(getGroupServiceAction.getGroupServiceRequest):
      return {
        ...state,
      };
    case getType(getGroupServiceAction.getGroupServiceSuccess):
      return {
        ...state,
        groupService: action.payload.data,
        groupServiceTotal: action.payload.total,
      };
    case getType(getGroupServiceAction.getGroupServiceFailure):
      return {
        ...state,
      };
    case getType(createGroupServiceAction.createGroupServiceSuccess):
      return {
        ...state,
        groupService: [...state.groupService, action.payload],
      };
    case getType(updateGroupServiceAction.updateGroupServiceRequest):
      return {
        ...state,
      };
    case getType(getServiceAction.getServiceRequest):
      return {
        ...state,
      };
    case getType(getServiceAction.getServiceSuccess):
      return {
        ...state,
        services: action.payload,
      };
    case getType(getServiceAction.getServiceFailure):
      return {
        ...state,
      };
    case getType(getProvinceAction.getProvinceRequest):
      return {
        ...state,
      };
    case getType(getProvinceAction.getProvinceSuccess):
      return {
        ...state,
        province: action.payload,
      };
    default:
      return state;
  }
}
