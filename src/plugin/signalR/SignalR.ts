interface SignalR {
    connection: any;
    emitter: Emitter;
    startConnection: any;
    status: string;
    print: any;
    printerStartConnection: any
    updateStatus: any
}

interface Emitter {
    all: any;
    emit: any;
    off: any;
    on: any
}