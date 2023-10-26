import mitt from "mitt";
import { inject, provide, ref } from "vue";

export default {
    install: (app: any) => {
        const emitter = mitt();

        var port: any = null;
        var device: any = null;
        var status = ref(false);
        var isPort = ref(false);

        var webSerial = {
            getStatus() {
                return status
            },
            setPort(val: boolean) {
                return isPort.value = val
            },
            async startConnection() {
                //console.log('isPort', isPort);
                navigator.usb.getDevices().then((devices) => {
  console.log(`Total devices: ${devices.length}`);
  devices.forEach((device) => {
    console.log(
      `Product name: ${device.productName}, serial number ${device.serialNumber}`,
    );
  });
});
                try {
                    if (isPort.value) {
                        port = await navigator.serial.requestPort();
                        console.log('getAllPort', navigator.serial.getPorts());
                        await port.open({ baudRate: 19200, databits: 8, stopbits: 1, parity: "none", flowControl: "none" });
                    }
                    else {
                        device = await navigator.usb.requestDevice();
                        console.log('getAllUsb', navigator.usb.getDevices());
                        await device.open();
                        await device.selectConfiguration(1);
                        await device.claimInterface(0);
                    }
                    status.value = true;
                    emitter.emit("status", status);
                }
                catch (error) {
                    status.value = false;
                    emitter.emit("status", status);
                    console.error('printer error', error);
                }
            },
            async destroy() {
                try {
                    await port.close();
                    status.value = false;
                    emitter.emit("status", status);
                } catch (error) {
                    emitter.emit("status", status);
                    console.error('printer close error', error);
                }

            },
            print(content: any) {
                console.log("WebSerialApi: ", "print");
                return new Promise(async (resolve, reject) => {
                    try {
                        const encoder = new TextEncoder()
                        const encodedValue = encoder.encode(content)
                        console.log(content, encodedValue);
                        const writer = port.writable.getWriter();
                        await writer.write(encodedValue);
                        setTimeout(async () => {
                            var CUT_COMMAND = '\x1B' + '@' + '\x1D' + 'V' + '\x30' //cut;
                            const encodedCutCommand = encoder.encode(CUT_COMMAND)
                            await writer.write(encodedCutCommand);
                            setTimeout(() => {
                                writer.releaseLock();
                                resolve(true);
                            }, 100);
                        }, 150)
                    } catch (error) {
                        console.log(error);
                        resolve(false);
                    }
                })
            }

        };
        return webSerial;
    }

}