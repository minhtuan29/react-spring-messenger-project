import {
    SET_CURRENT_CALL,
    SET_INCOMING_CALL, START_VIDEO_CALL,
} from "../utils/redux-constants";
import {ReducerType, WebRTCReducerInitType} from "./types";

const initialState: WebRTCReducerInitType = {
    callIncoming: null,
    currentCalls: [],
    callResponse: ""
}

const WebRTCReducer = (state = initialState, action: ReducerType) => {
    switch (action.type) {
        case SET_INCOMING_CALL:
            return {...state, callIncoming: action.payload}
        case SET_CURRENT_CALL:
            return {
                ...state,
                currentCalls: [...state.currentCalls, action.payload]
            }
        case START_VIDEO_CALL:
            return {...state, callResponse: action.payload}
        default:
            return state;
    }
}

export default WebRTCReducer;