require('dotenv').config()

const isProduction = process.env.NODE_ENV === "production";
const isPreProduction = process.env.REACT_APP_ENV === "test";

export const config = {
    HTTP_TRANSPORT: isProduction ? "https" : isPreProduction ? "https" : "http",
    WS_TRANSPORT: isProduction ? "wss" : "ws",
    HOST_URL: isProduction ? "192.168.0.23" : isPreProduction ? "192.168.0.23" : "localhost",
    HOST_PORT: 9090,
    APP_PORT: 3000
}