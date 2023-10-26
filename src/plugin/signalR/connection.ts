import mitt from "mitt";
import {
    HubConnectionBuilder,
    LogLevel,
    HubConnectionState,
} from "@microsoft/signalr";
import axios from "@/services/http-common";
import { inject, provide, ref } from "vue";

export default {
    install: (app: any) => {
        const emitter = mitt();
        var hubConnection = null;
        var hubConnectionStatus = HubConnectionState.Disconnected;

        var signalRHub = ref<any>({
            status: hubConnectionStatus,
            emitter,
            updateStatus(status: any) {
                hubConnectionStatus = status;
                console.log(new Date(), "SignalR Status : ", status);
                emitter.emit("status", status);
            },
            connection() {
                var signalRUrl = axios.defaults.baseURL!.replace(
                    "api/",
                    "hubs/dispatch"
                );
                let connection = new HubConnectionBuilder()
                    .withUrl(signalRUrl)
                    .withAutomaticReconnect([0, 5000, 10000, 30000])
                    .configureLogging(LogLevel.Information)
                    .build();

                connection.onreconnecting(() => {
                    this.updateStatus(HubConnectionState.Reconnecting);
                });

                connection.onreconnected(() => {
                    this.updateStatus(HubConnectionState.Connected);
                });

                connection.onclose(() => {
                    this.updateStatus(HubConnectionState.Disconnected);
                });

                connection.on("ProductPicked", (orderId: number, orderLineId: number, qty: number, orderLineStatus: any) => {
                    emitter.emit("ProductPicked", { orderId, orderLineId, qty, orderLineStatus })
                });

                return connection;
            },

            startConnection() {
                return new Promise(async (resolve: any, reject: any) => {
                    try {
                        hubConnection = this.connection();
                        await hubConnection.start();
                        this.updateStatus(HubConnectionState.Connected);
                        resolve();
                    } catch (err) {
                        this.updateStatus(HubConnectionState.Disconnected);
                        reject(err);
                    }
                });
            },
        });

        signalRHub.value.startConnection();
        return signalRHub.value;
    }

}