import HubService from "./hub_service";


const taskChatHub = new HubService(`${process.env.REACT_APP_API_BASE_URL}/hubs/task-chat`);

export default taskChatHub;