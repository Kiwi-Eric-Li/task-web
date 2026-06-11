import HubService from "./hub_service";
import {tokenService} from "../token";


const taskNotificationHub = new HubService(`${process.env.REACT_APP_API_BASE_URL}/hubs/task-notifications?access_token=${tokenService.getAccessToken()}`);

export default taskNotificationHub;