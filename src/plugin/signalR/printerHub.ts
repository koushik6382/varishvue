import { io } from "socket.io-client";
import mitt from "mitt";

export default {
  install(app: any) {
    const emitter = mitt();
    var connection: any = null;

    interface ConfigObj {
      host: any;
      port: any
      timeout: any
    }

    const config: ConfigObj = {
      host: "",
      port: "",
      timeout: "",
    };
    var status = false;

    const socket = {
      emitter,

      getStatus() {
        return status;
      },
      getConfig() {
        return config;
      },
      startConnection() {
        connection = io("http://localhost:3000", {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        connection.on("connect", () => {
          status = true;
          emitter.emit("status", status);
        });

        connection.on("connect_error", () => {
          status = false;
          emitter.emit("status", status);
        });

        connection.on("init", ({ host, port, timeout }: ConfigObj) => {
          config.host = host;
          config.port = port;
          config.timeout = timeout;
        });

        connection.on("connected", () => {
          console.log("connected: ");
        });

        connection.on("wrote", () => {
          console.log("wrote: ");
        });
      },

      connect({ host, port, timeout }: ConfigObj) {
        console.log("connect: ", host, port, timeout);
        connection.emit("connect-device", { host, port, timeout });
      },

      write(data: any) {
        connection.emit("write", { data });
      },
    };

    socket.startConnection();
    return socket;
  },
};
