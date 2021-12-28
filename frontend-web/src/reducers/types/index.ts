import {GroupModel} from "../../model/group-model";
import {FullMessageModel} from "../../model/full-message-model";
import {Client} from "@stomp/stompjs";

export interface ReducerType {
    type: string
    payload: any
}

export interface WsReducerInitType {
    isWsConnected: boolean,
    wsObject: Client | null,
    wsUserTokenValue: string,
    wsUserGroups: GroupModel[],
    currentActiveGroup: string,
    allMessagesFetched: boolean,
    usersInConversationList: [],
    chatHistory: FullMessageModel[]
}

export interface WebRTCReducerInitType {
    callIncoming: CallIncomingType | null
    callResponse: string
    currentCalls: string[]
}

interface CallIncomingType {
    groupName: string
    userCallInit: string
}