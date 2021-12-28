package com.mercure.dto;

import com.mercure.utils.MessageTypeEnum;
import com.mercure.utils.TransportActionEnum;

public class InputTransportDTO {

    private int userId;

    private TransportActionEnum action;

    private String wsToken;

    private String groupUrl;

    private String message;

    private int messageId;

    private MessageTypeEnum messageType;

    public int getUserId() {
        return userId;
    }

    public TransportActionEnum getAction() {
        return action;
    }

    public String getWsToken() {
        return wsToken;
    }

    public String getGroupUrl() {
        return groupUrl;
    }

    public String getMessage() {
        return message;
    }

    public int getMessageId() {
        return messageId;
    }

    public MessageTypeEnum getMessageType() {
        return messageType;
    }
}
