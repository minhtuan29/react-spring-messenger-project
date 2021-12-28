export class RTCModel {

    action: string;

    userId: number | undefined

    groupUrl: string | undefined

    rtcOffer: RTCSessionDescriptionInit | undefined

    rtcAnswer: RTCSessionDescriptionInit | undefined

    rtcIceCandidate: RTCIceCandidate | undefined

    constructor(action: string, userId?: number, groupUrl?: string, rtcOffer?: RTCSessionDescriptionInit, rtcAnswer?: RTCSessionDescriptionInit, rtcIceCandidate?: RTCIceCandidate) {
        this.action = action;
        this.userId = userId;
        this.groupUrl = groupUrl;
        this.rtcOffer = rtcOffer;
        this.rtcAnswer = rtcAnswer;
        this.rtcIceCandidate = rtcIceCandidate;
    }
}