import axios from 'axios';
import JwtModel from "../model/jwt-model";
import {config} from "../config/config";

const API_URL = `${config.HTTP_TRANSPORT}://${config.HOST_URL}:${config.HOST_PORT}/api`

const instance = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

export default class AuthService {

    authenticate(username: string, password: string) {
        const toSend = new JwtModel(username, password);
        return instance.post("/auth", toSend);
    }

    async testRoute() {
        return await instance.get("/fetch");
    }

    logout() {
        return instance.get("/logout");
    }

    createGroup(groupName: string) {
        return instance.post("/create", {name: groupName})
    }

    fetchMessages(id: number) {
        return instance.post(API_URL + "/fetchMessages", {id: id})
    }

    addUserToGroup(userId: number | string, groupUrl: string) {
        return instance.get(API_URL + "/user/add/" + userId + "/" + groupUrl)
    }

    fetchAllUsersInConversation(groupUrl: string) {
        return instance.get(API_URL + "/users/group/" + groupUrl, {})
    }

    fetchAllUsersWithoutAlreadyInGroup(groupUrl: string) {
        return instance.get(API_URL + "/users/all/" + groupUrl, {})
    }

    createUser(firstname: string, lastname: string, email: string, password: string) {
        return instance.post(API_URL + "/user/register", {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password
        })
    }

    leaveConversation(userIdToRemove: number, groupId: string) {
        return instance.get(API_URL + "/user/leave/" + userIdToRemove + "/group/" + groupId);
    }

    removeUserFromConversation(userIdToRemove: string | number, groupUrl: string) {
        return instance.get(API_URL + "/user/remove/" + userIdToRemove + "/group/" + groupUrl);
    }

    removeAdminUserInConversation(userIdToRemove: string | number, groupUrl: string) {
        return instance.get(API_URL + "/user/remove/admin/" + userIdToRemove + "/group/" + groupUrl);
    }

    grantUserAdminInConversation(userIdToGrant: number | string, groupId: string) {
        return instance.get(API_URL + "/user/grant/" + userIdToGrant + "/group/" + groupId);
    }

    uploadFile(data: FormData) {
        return instance.post(API_URL + "upload", data);
    }
}