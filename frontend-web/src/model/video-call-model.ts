export class VideoCallModel {
    userId: number
    groupName: string
    userCallInit: string
    roomUrl: string

    constructor(userId: number, groupName: string, userCallInit: string, roomUrl: string) {
        this.userId = userId;
        this.groupName = groupName;
        this.userCallInit = userCallInit;
        this.roomUrl = roomUrl;
    }
}