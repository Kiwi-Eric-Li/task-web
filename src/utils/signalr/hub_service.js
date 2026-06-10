import * as signalR from "@microsoft/signalr"

export default class HubService{
    constructor(url){
        this.url = url;
        this.connection = null;
        this.isStarting = false;
    }
    async start(){
        if(this.connection && this.connection.state === signalR.HubConnectionState.Connected){
            return;
        }
        if(this.isStarting){
            return;
        }
        this.isStarting = true;
        try{
            this.connection = new signalR.HubConnectionBuilder().withUrl(this.url, {
                accessTokenFactory: () => {
                    localStorage.getItem("access_token");
                }
            }).withAutomaticReconnect().build();

            this.connection.onreconnecting(error => {
                console.warn(`[SignalR] Reconnecting: ${this.url}`, error)
            });

            this.connection.onreconnected(connectionId => {
                console.log(`[SignalR] Reconnected: ${this.url}`, connectionId);
            });

            this.connection.onclose(error => {
                console.error(`[SignalR] Closed: ${this.url}`, error);
            });
            
            await this.connection.start();
            console.log(`[SignalR] Connected: ${this.url}`);

        }catch(e){
            console.error(`[SignalR] Start Failed: ${this.url}`, e);
            throw e;
        }finally{
            this.isStarting = false;
        }
    }

    async stop(){
        if(!this.connection){
            return;
        }
        await this.connection.stop();
        console.log(`[SignalR] Disconnected: ${this.url}`);
    }

    on(eventName, callback){
        if(!this.connection){
            return;
        }
        this.connection.on(eventName, callback);
    }

    off(eventName, callback){
        if(!this.connection){
            return;
        }
        this.connection.off(eventName, callback);
    }

    async invoke(methodName, ...args){
        if(!this.connection){
            throw new Error("SignalR connection not initialized.");
        }

        return await this.connection.invoke(methodName, ...args);
    }

    async send(methodName, ...args){
        if(!this.connection){
            throw new Error("SignalR connection not initialized.");
        }
        return await this.connection.send(methodName, ...args);
    }

    getConnectionId(){
        return this.connection?.connectionId;
    }

    isConnected(){
        return this.connection?.state === signalR.HubConnectionState.Connected;
    }
}