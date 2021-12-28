import React, {useEffect} from "react";
import {BottomNavigation, BottomNavigationAction, Collapse} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import ForumIcon from "@material-ui/icons/Forum";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {useHistory} from "react-router-dom";
import {useAuthContext} from "../../context/auth-context";
import AuthService from "../../service/auth-service";
import {FeedbackModel} from "../../model/feedback-model";
import UUIDv4 from "../../utils/uuid-generator";
import {useAlertContext} from "../../context/alert-context";


export const BottomNavigationComponent = () => {
    const history = useHistory();
    const {user, setUser} = useAuthContext();
    const {alerts, setAlerts} = useAlertContext();
    const [isMessageRoute, setMessageRoute] = React.useState<boolean>(false);

    useEffect(() => {
        console.log(window.location.pathname.split("/")[1] === "t")
        setMessageRoute(window.location.pathname.split("/")[1] === "t")
    }, [])

    function dispatchLogout() {
        new AuthService().logout().then(() => {
            setUser(undefined);
            history.push("/");
            setAlerts([...alerts, new FeedbackModel(UUIDv4(), "You log out successfully", "success", true)])
        }).catch((err: any) => {
            console.log(err)
        })
    }

    return (
        <>
            {!isMessageRoute &&
            <BottomNavigation
                className={"bottom-nav"}
                showLabels>
                <BottomNavigationAction onClick={() => history.push("/")} label="Home" icon={<HomeIcon/>}/>
                <BottomNavigationAction onClick={() => history.push("/create")}
                                        label="Create group"
                                        icon={<GroupAddIcon/>}/>
                <BottomNavigationAction onClick={() => history.push(`/t/messages/${user?.firstGroupUrl}`)}
                                        label="Messages" icon={<ForumIcon/>}/>
                <BottomNavigationAction onClick={() => dispatchLogout()} label="Logout"
                                        icon={<ExitToAppIcon/>}/>
            </BottomNavigation>

            }
        </>
    )
}