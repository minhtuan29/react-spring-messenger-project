import Button from "@material-ui/core/Button";
import CallIcon from "@material-ui/icons/Call";
import React, {FunctionComponent} from "react";
import CallEndIcon from '@material-ui/icons/CallEnd';
import {ReduxModel} from "../../model/redux-model";
import {TypeMessageEnum} from "../../utils/type-message-enum";
import {Box, Dialog, DialogTitle, IconButton} from "@material-ui/core";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {generateBackgroundColor} from "../../design/style/enable-dark-mode";
import {useThemeContext} from "../../context/theme-context";
import UUIDv4 from "../../utils/uuid-generator";
import {VideoCallModel} from "../../model/video-call-model";
import {RTCModel} from "../../model/RTCModel";
import {useAuthContext} from "../../context/auth-context";
import {TransportActionEnum} from "../../utils/transport-action-enum";
import {config} from "../../config/config";

interface RtcComponentType {
    groupUrl: string
    groupName: string

    sendMessage: (model: ReduxModel) => {}
    sendRtcMessage: (model: RTCModel) => {}
    callIncoming: VideoCallModel | null
    setIncomingCall: (model: VideoCallModel | null) => {}
    addToCurrentCalls: (url: string) => {}
    currentCalls: string[],
    callResponse: string
}

export const RtcVideoComponent: FunctionComponent<RtcComponentType> = ({
                                                                           groupUrl,
                                                                           groupName,
                                                                           sendRtcMessage,
                                                                           sendMessage,
                                                                           callIncoming,
                                                                           setIncomingCall,
                                                                           addToCurrentCalls,
                                                                           currentCalls,
                                                                           callResponse
                                                                       }) => {
    const {theme} = useThemeContext();
    const {user} = useAuthContext();

    function startVideoCall() {
        addToCurrentCalls(groupUrl)
        const videoUrl = UUIDv4()
        window.open(`${config.HTTP_TRANSPORT}://${config.HOST_URL}:${config.APP_PORT}/call/${videoUrl}?t=${groupUrl}&status=WAITING`, '_blank', "height=500,width=500");
        sendMessage(new ReduxModel(undefined, undefined, groupUrl, user?.id || 0, videoUrl, undefined, TypeMessageEnum.VIDEO))
    }

    function handleCallAction(isCallAccepted: boolean) {
        if (isCallAccepted) {
            sendRtcMessage(new RTCModel(TransportActionEnum.ACCEPT_VIDEO_CALL, user?.id || 0, groupUrl));
            window.open(`${config.HTTP_TRANSPORT}://${config.HOST_URL}:${config.APP_PORT}/call/${callIncoming?.roomUrl}?t=${groupUrl}`, '_blank', "height=500,width=500");
        }
        setIncomingCall(null)
    }

    return (
        <>
            <Button onClick={() => startVideoCall()} variant="text" component="span">
                <CallIcon/>
            </Button>
            <Dialog
                PaperProps={{
                    style: {
                        backgroundColor: generateBackgroundColor(theme)
                    },
                }}
                open={callIncoming !== null}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    id="alert-dialog-title">{`${callIncoming?.userCallInit} started a video call in ${callIncoming?.groupName}`}</DialogTitle>
                <Box m={1} style={{display: "flex", justifyContent: "center"}}>
                    <AccountCircleIcon style={{fontSize: 200}}/>
                </Box>
                <Box m={1} style={{display: "flex", justifyContent: "center"}}>
                    <Box m={1}>
                        <IconButton style={{border: "1px solid red", backgroundColor: "rgba(255,0,0,0.7)"}}
                                    onClick={() => handleCallAction(false)}>
                            <CallEndIcon style={{fontSize: 30}}/>
                        </IconButton>
                    </Box>
                    <Box m={1}>
                        <IconButton style={{border: "1px solid #4A4A4A", backgroundColor: "rgba(74,74,74,0.7)"}}
                                    onClick={() => handleCallAction(true)}>
                            <CallIcon style={{fontSize: 30}}/>
                        </IconButton>
                    </Box>
                </Box>
            </Dialog>
        </>
    )
}