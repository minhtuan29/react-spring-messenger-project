import React, {useEffect} from "react";
import {generateColorMode, generateIconColorMode} from "../../design/style/enable-dark-mode";
import {useThemeContext} from "../../context/theme-context";
import AuthService from "../../service/auth-service";
import UserModel from "../../model/user-model";
import {AxiosResponse} from "axios";
import {initWebSocket} from "../../config/websocket-config";
import {Client, IMessage} from "@stomp/stompjs";
import {OutputTransportDTO} from "../../model/input-transport-model";
import {TransportActionEnum} from "../../utils/transport-action-enum";
import {RTCModel} from "../../model/RTCModel";
import {Box, CircularProgress} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CallEndRoundedIcon from "@material-ui/icons/CallEndRounded";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";

function publishOnRtcChannel(wsClient: Client, rtcModel: RTCModel) {
    if (wsClient && wsClient.active) {
        wsClient.publish({
            destination: "/app/rtc",
            body: JSON.stringify(rtcModel)
        });
    }
}

export const VideoCallComponent = () => {
    const {theme} = useThemeContext();
    let localVideoRef: HTMLVideoElement | null;
    let remoteVideo: HTMLVideoElement | null;
    const [isWaitingStatus, setStatus] = React.useState<boolean>(new URL(window.location.href).searchParams.get("status") === "WAITING")
    const [isMicMuted, setMicStatus] = React.useState<boolean>(false)

    useEffect(() => {
        initRTCData();
    }, []);

    async function startVideoCall(peerConnection: RTCPeerConnection) {
        // const openMediaDevices = await navigator.mediaDevices.getUserMedia({audio: true});
        const openMediaDevices = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        openMediaDevices.getTracks().forEach((track) => {
            peerConnection.addTrack(track);
        })
        try {
            if (localVideoRef) {
                localVideoRef.srcObject = openMediaDevices;
            }
            console.log('Got MediaStream:', openMediaDevices);
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    }

    async function initRTCData() {
        // Audio and video config
        const configuration: RTCConfiguration = {iceServers: [{'urls': 'stun:stun.l.google.com:19302'}]}
        const remoteStream = new MediaStream();
        if (remoteVideo) {
            remoteVideo.srcObject = remoteStream
        }
        const peerConnection = new RTCPeerConnection(configuration);
        startVideoCall(peerConnection);
        // end

        console.log("Starting initRTCData")
        // const currentUrl: string = window.location.pathname.split("/").slice(-1)[0];
        const params = new URL(window.location.href).searchParams;
        const groupUrl = params.get("t") || "";
        // console.log(`Window get parameter : ${params}`);
        const user: AxiosResponse<UserModel> | void = await new AuthService().testRoute().catch((err) => {
            console.log(err)
        });
        console.log("user : " + user)
        if (user) {
            const token = user.data.wsToken;
            const userId = user.data.id;
            const ws = await initWebSocket(token);
            // console.log("Connected : " + ws)
            // console.log("userId : " + userId)
            if (ws) {
                ws.onConnect = async () => {
                    ws.subscribe(`/queue/user/${userId}`, (res: IMessage) => {
                        const data: OutputTransportDTO = JSON.parse(res.body);
                        const response = data.object as RTCModel;
                        console.log(data.action)
                        switch (data.action) {
                            case TransportActionEnum.START_VIDEO_CALL:
                                setStatus(false);
                                peerConnection.createOffer().then((offer) => {
                                    peerConnection.setLocalDescription(offer).then(() => {
                                        console.log("Sending RTC OFFER TO SERVER")
                                        publishOnRtcChannel(ws, new RTCModel(TransportActionEnum.RTC_USER_OFFER, userId, groupUrl, offer, undefined))
                                    });
                                });
                                break;
                            case TransportActionEnum.RTC_USER_ANSWER:
                                const answer = response.rtcAnswer
                                console.log(`Receiving user answer : ${answer}`)
                                if (answer) {
                                    console.log("Setting local description with data")
                                    const remoteDesc = new RTCSessionDescription(answer);
                                    peerConnection.setRemoteDescription(remoteDesc);
                                }
                                break;
                            case TransportActionEnum.RTC_USER_OFFER:
                                const offer = response.rtcOffer
                                console.log(`Receiving user offer : ${offer}`)
                                if (offer) {
                                    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                                    peerConnection.createAnswer().then((answer) => {
                                        peerConnection.setLocalDescription(answer).then(() => {
                                            console.log("sending rtc answer to server")
                                            publishOnRtcChannel(ws, new RTCModel(TransportActionEnum.RTC_USER_ANSWER, userId, groupUrl, undefined, answer))
                                        });
                                    });
                                }
                                break;
                            case TransportActionEnum.RTC_NEW_ICE_CANDIDATE:
                                console.log("Receiving RTC new ice candidate")
                                // Listen for remote ICE candidates and add them to the local RTCPeerConnection
                                if (response.rtcIceCandidate) {
                                    try {
                                        peerConnection.addIceCandidate(response.rtcIceCandidate);
                                    } catch (e) {
                                        console.error('Error adding received ice candidate', e);
                                    }
                                }
                                break;
                            default:
                                console.log(`Unhandled action in VideoCallComponent : ${data.action}`)
                                break;
                        }
                    })
                    console.log("LOADING VALUE : " + isWaitingStatus)
                    if (!isWaitingStatus) {
                        console.log("SENDING READY STATE TO SERVER")
                        publishOnRtcChannel(ws, new RTCModel(TransportActionEnum.RTC_READY_STATE, userId, groupUrl));
                    }


                    // Listen for local ICE candidates on the local RTCPeerConnection
                    peerConnection.addEventListener('icecandidate', (event) => {
                            if (event.candidate && ws) {
                                console.log("sending RTC new ice candidate")
                                publishOnRtcChannel(ws, new RTCModel(TransportActionEnum.RTC_NEW_ICE_CANDIDATE, userId, groupUrl, undefined, undefined, event.candidate))
                            }
                        }
                    )

                    peerConnection.addEventListener('track', (event) => {
                        remoteStream.addTrack(event.track)
                    })

                    peerConnection.addEventListener("connectionstatechange", () => {
                        console.log(peerConnection.connectionState)
                        if (peerConnection.connectionState === "connected") {
                            console.log("PEER CONNECTION IS IN CONNECTED STATE")
                            // TODO CONNECTED STATE
                        }
                    })
                }
                ws.activate();
            }
        }
    }

    return (
        <div className={generateColorMode(theme)}
             style={{width: "100%", height: "100%", textAlign: "center"}}>
            {
                isWaitingStatus &&
                <div>
                    <Box p={2} style={{textAlign: "center"}}>
                        <CircularProgress color={"primary"} thickness={2} size={100}/>
                    </Box>
                    <h3>Waiting for other users to respond ...</h3>
                </div>
            }
            {
                !isWaitingStatus &&
                <div>
                    <div style={{display: "flex", justifyContent: "space-around"}}>
                        <video style={{width: "45%", height: "45%"}} ref={(el) => {
                            localVideoRef = el;
                        }} id="localVideo" autoPlay playsInline controls={false} muted/>

                        <video style={{width: "45%", height: "45%"}} ref={(el) => {
                            remoteVideo = el;
                        }} id="remoteVideo" autoPlay playsInline
                               controls={false} muted/>
                    </div>
                    <IconButton>
                        <CallEndRoundedIcon
                            className={generateIconColorMode(theme)}
                            style={{
                                backgroundColor: "#ff00008a",
                                borderRadius: "50%",
                                height: "40px",
                                width: "40px",
                                padding: "4px"
                            }}/>
                    </IconButton>

                    <IconButton>
                        {
                            isMicMuted ?
                                <MicOffIcon
                                    className={generateIconColorMode(theme)}
                                    style={{
                                        backgroundColor: "rgba(255,255,255,0.54)",
                                        borderRadius: "50%",
                                        height: "40px",
                                        width: "40px",
                                        padding: "4px"
                                    }}/>
                                :
                                <MicIcon
                                    className={generateIconColorMode(theme)}
                                    style={{
                                        backgroundColor: "rgba(255,255,255,0.54)",
                                        borderRadius: "50%",
                                        height: "40px",
                                        width: "40px",
                                        padding: "4px"
                                    }}/>
                        }
                    </IconButton>
                </div>
            }
        </div>
    )
}