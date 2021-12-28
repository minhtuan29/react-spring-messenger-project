import {
    SEND_RTC_MESSAGE, SET_CURRENT_CALL, SET_INCOMING_CALL
} from "../utils/redux-constants";
import {VideoCallModel} from "../model/video-call-model";
import {RTCModel} from "../model/RTCModel";


export const setIncomingCall = (model: VideoCallModel | null) => ({
    type: SET_INCOMING_CALL,
    payload: model
})

export const addToCurrentCalls = (groupUrl: string) => ({
    type: SET_CURRENT_CALL,
    payload: groupUrl
})

export const sendRTCMessage = (model: RTCModel) => ({
    type: SEND_RTC_MESSAGE,
    payload: model
})