import HubService from "./hub_service";


const taskNotificationHub = new HubService(`${process.env.REACT_APP_API_BASE_URL}/hubs/task-notifications`);

export default taskNotificationHub;