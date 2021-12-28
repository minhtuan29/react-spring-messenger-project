package com.mercure.dto;

public class VideoCallDTO {

    private int userId;

    private String groupName;

    private String userCallInit;

    private String roomUrl;

    public VideoCallDTO(int userId, String groupName, String userCallInit, String roomUrl) {
        this.userId = userId;
        this.groupName = groupName;
        this.userCallInit = userCallInit;
        this.roomUrl = roomUrl;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getUserCallInit() {
        return userCallInit;
    }

    public void setUserCallInit(String userCallInit) {
        this.userCallInit = userCallInit;
    }

    public String getRoomUrl() {
        return roomUrl;
    }

    public void setRoomUrl(String roomUrl) {
        this.roomUrl = roomUrl;
    }
}
