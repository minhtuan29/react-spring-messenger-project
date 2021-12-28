package com.mercure.controller;

import com.mercure.dto.OutputTransportDTO;
import com.mercure.dto.RTCWebDTO;
import com.mercure.entity.CallEntity;
import com.mercure.service.CallService;
import com.mercure.service.MessageService;
import com.mercure.utils.TransportActionEnum;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin
public class WsRtcController {

    private Logger log = LoggerFactory.getLogger(WsRtcController.class);

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageService messageService;

    @Autowired
    private CallService callService;

    @MessageMapping("/rtc")
    public void videoCallChannel(RTCWebDTO dto) {
        log.info("Receiving WS data from " + dto.getUserId() + " -> " + dto.getAction());
        switch (dto.getAction()) {
            case RTC_READY_STATE:
                OutputTransportDTO res = new OutputTransportDTO();
                res.setAction(TransportActionEnum.START_VIDEO_CALL);
                RTCWebDTO rtcWebDTO = new RTCWebDTO();
                rtcWebDTO.setGroupUrl(dto.getGroupUrl());
                res.setObject(rtcWebDTO);
                CallEntity savedCall = callService.findByGroupUrl(dto.getGroupUrl());
                if (savedCall != null) {
                    messagingTemplate.convertAndSend("/queue/user/" + savedCall.getInitiator(), res);
                }
                break;
            case RTC_USER_OFFER:
                List<Integer> toSend = messageService.createNotificationList(dto.getGroupUrl());
                OutputTransportDTO transfer = new OutputTransportDTO();
                transfer.setAction(TransportActionEnum.RTC_USER_OFFER);
                RTCWebDTO webDTO = new RTCWebDTO();
                webDTO.setRtcOffer(dto.getRtcOffer());
                transfer.setObject(webDTO);
                toSend.stream().filter(elt -> elt.equals(dto.getUserId())).forEach(id -> messagingTemplate.convertAndSend("/queue/user/" + id, transfer));
                break;
            case RTC_USER_ANSWER:
                CallEntity call = callService.findByGroupUrl(dto.getGroupUrl());
                OutputTransportDTO transportDTO = new OutputTransportDTO();
                transportDTO.setAction(TransportActionEnum.RTC_USER_ANSWER);
                RTCWebDTO answerDTO = new RTCWebDTO();
                answerDTO.setRtcAnswer(dto.getRtcAnswer());
                messagingTemplate.convertAndSend("/queue/user" + call.getInitiator(), transportDTO);
                break;
            case RTC_NEW_ICE_CANDIDATE:
                List<Integer> iceCandidateToSend = messageService.createNotificationList(dto.getGroupUrl());
                OutputTransportDTO iceDTO = new OutputTransportDTO();
                iceDTO.setAction(TransportActionEnum.RTC_NEW_ICE_CANDIDATE);
                RTCWebDTO iceAnswerDTO = new RTCWebDTO();
                iceAnswerDTO.setRtcIceCandidate(dto.getRtcIceCandidate());
                iceDTO.setObject(iceAnswerDTO);
                iceCandidateToSend.stream().filter(elt -> elt.equals(dto.getUserId())).forEach(id -> messagingTemplate.convertAndSend("/queue/user/" + id, iceDTO));
                break;
            default:
                break;
        }
    }
}
