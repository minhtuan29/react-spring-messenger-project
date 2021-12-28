import {connect} from 'react-redux'
import {RtcVideoComponent} from "../../components/webrtc/rtc-video-component";
import {ReduxModel} from "../../model/redux-model";
import {sendWsMessage} from "../../actions/websocket-actions";
import {addToCurrentCalls, sendRTCMessage, setIncomingCall} from "../../actions/web-rtc-actions";
import {VideoCallModel} from "../../model/video-call-model";
import {RTCModel} from "../../model/RTCModel";

const mapStateToProps = (state: any) => {
    const {callIncoming, currentCalls, callResponse} = state.WebRTCReducer;
    return {
        callIncoming, currentCalls, callResponse
    };
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        sendMessage: (model: ReduxModel) => dispatch(sendWsMessage(model)),
        addToCurrentCalls: (groupUrl: string) => dispatch(addToCurrentCalls(groupUrl)),
        setIncomingCall: (model: VideoCallModel | null) => dispatch(setIncomingCall(model)),
        sendRtcMessage: (model: RTCModel) => dispatch(sendRTCMessage(model))
    }
}

const RtcVideoContainer = connect(mapStateToProps, mapDispatchToProps)(RtcVideoComponent);

export default RtcVideoContainer;