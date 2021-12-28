package com.mercure.dto;

import com.mercure.utils.TransportActionEnum;

public class RTCWebDTO {

    private TransportActionEnum action;

    private int userId;

    private String groupUrl;

    private Object rtcOffer;

    private Object rtcAnswer;

    private Object rtcIceCandidate;

    public TransportActionEnum getAction() {
        return action;
    }

    public void setAction(TransportActionEnum action) {
        this.action = action;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getGroupUrl() {
        return groupUrl;
    }

    public void setGroupUrl(String groupUrl) {
        this.groupUrl = groupUrl;
    }

    public Object getRtcOffer() {
        return rtcOffer;
    }

    public void setRtcOffer(Object rtcOffer) {
        this.rtcOffer = rtcOffer;
    }

    public Object getRtcAnswer() {
        return rtcAnswer;
    }

    public void setRtcAnswer(Object rtcAnswer) {
        this.rtcAnswer = rtcAnswer;
    }

    public Object getRtcIceCandidate() {
        return rtcIceCandidate;
    }

    public void setRtcIceCandidate(Object rtcIceCandidate) {
        this.rtcIceCandidate = rtcIceCandidate;
    }
}
