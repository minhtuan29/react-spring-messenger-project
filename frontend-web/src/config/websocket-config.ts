import {Client} from "@stomp/stompjs";
import UUIDv4 from "../utils/uuid-generator";
import {config} from "./config";

export function initWebSocket(userToken: string): Client {
    return new Client({
        brokerURL: `${config.WS_TRANSPORT}://${config.HOST_URL}:${config.HOST_PORT}/messenger/websocket?token=${userToken}`,
        // Uncomment lines to activate WS debug
        // debug: (str: string) => {
        //     console.log(str);
        // },
        connectHeaders: {clientSessionId: UUIDv4()},
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });
}