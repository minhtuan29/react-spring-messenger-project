package com.mercure.utils;

public enum TransportActionEnum {
    INIT_USER_DATA,
    SEND_GROUP_MESSAGE,
    EDIT_GROUP_MESSAGE,
    FETCH_GROUP_MESSAGES,
    ADD_CHAT_HISTORY,
    NOTIFICATION_MESSAGE,
    GRANT_USER_ADMIN,
    MARK_MESSAGE_AS_SEEN,
    INIT_VIDEO_CALL,
    ACCEPT_VIDEO_CALL,
    START_VIDEO_CALL,

    RTC_OFFER_DESCRIPTION,
    RTC_USER_OFFER,
    RTC_USER_ANSWER,
    RTC_NEW_ICE_CANDIDATE,
    RTC_READY_STATE
}
