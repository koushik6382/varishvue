<template>
  <Loading v-model:isLoading="isLoading" />
  <WModel v-model:isOpen="_isOpen" :title="title" :size="size" pos="Print Label" :posDisabled="true" :negDisabled="true" @next="next" @close="close">
    <template v-slot:component>
      <div class="flex flex-col space-2 p-0">
        <radio-group v-model="printRadioGroup" label="Select Print Type" dir="row">
          <radio-btn :value="0" label="Mobile Print" />
          <radio-btn :value="1" label="Web Print" />
          <radio-btn :value="2" label="Internal Print" />
          <radio-btn :value="3" label="Print from web" />
        </radio-group>

        <div class="relative pt-4 w-full">
          <h3 class="absolute top-1 text-base left-4 bg-white dark:bg-darkmode-600 text-black dark:text-white">
            {{ _printerGroupTitle }}
          </h3>
          <div class="border rounded-md border-slate-600 dark:border-white border-solid p-4 h-full grid grid-cols-1 gap-2`">
            <div v-if="printRadioGroup > 1">{{ _printerGroupLabel }}</div>
            <TextField v-model="_payload.ip" label="Label Printer IP" v-if="printRadioGroup > 1" />
            <TextField v-model="_payload.port" label="Port" v-if="printRadioGroup > 1" />
            <TextField v-model="_payload.nbrOfCopies" label="Number of Copies" />
          </div>
        </div>

        <div class="flex flex-col spacep-y-2 pt-2">
          <div>Selected Label(s)</div>
          <div>
            <data-table :headers="headers" :items="items" :itemsPerPage="5" :isCheckbox="false" />
          </div>
        </div>
      </div>
    </template>
  </WModel>

  <ConfirmModal
    :value="`Printer is offline`"
    icon="Printer"
    color="danger"
    positive="Confirm"
    negative="Cancel"
    question="Do you want to turn on the printer?"
    :modalOpen="offlinePrinter"
    :modalClose="closeOfflinePrinter"
    :modalConfirm="confirmOfflinePrinter"
  />
</template>

<script lang="ts" setup>
import { watch, ref, toRefs, onBeforeMount, onMounted, computed, inject } from "vue";

import { ButtonType } from "@/components/button/ButtonType";
import axios from "axios";
import toast from "@/utils/toast";
import { useIP } from "./storeIp";

const storeIP = useIP();

interface Props {
  isOpen: boolean;
  title: any;
  col: string;
  backdrop: string;
  size: string;
  headers: any[];
  listLabel: string;
  name: string;
  payload: any;
  items: any[];
}

const emit = defineEmits<{
  (e: "update:payload", val: any): void;
  (e: "update:isOpen", val: any): void;
  (e: "close"): void;
  (e: "serverSidePrintLabel", val: any): void;
  (e: "mobilePrint", val: any): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  title: "",
  col: "2",
  size: "modal-xl",
  backdrop: "static",
  headers: () => [],
  items: () => [],
  isSubcomponent: false,
});

const { isOpen, backdrop, size, headers, items, payload, listLabel, name } = toRefs(props);

const printerHub = inject("printerHub") as any;
const webserial = inject("webserial") as any;

const isLoading = ref<boolean>(false);

const _payload = computed({
  get() {
    return payload.value;
  },
  set(val) {
    emit("update:payload", val);
  },
});

const _isOpen = computed({
  get() {
    return isOpen.value;
  },
  set(val) {
    emit("update:isOpen", val);
  },
});

const printRadioGroup = ref(0);

const _printerGroupTitle = computed(() => {
  if (printRadioGroup.value === 0) {
    return "Mobile Print";
  } else if (printRadioGroup.value === 1) {
    return "Web Print";
  } else if (printRadioGroup.value === 2) {
    return "Internal Print";
  } else {
    return "Print from web";
  }
});

const _printerGroupLabel = computed(() => {
  if (printRadioGroup.value === 0) {
    return "Mobile Print";
  } else if (printRadioGroup.value === 1) {
    return "Web Print";
  } else if (printRadioGroup.value === 2) {
    return "Local IP : " + localIp.value;
  } else {
    return "Public IP : " + publicIp.value;
  }
});

watch(
  () => [printRadioGroup.value, _isOpen.value],
  async ([val, openVal]) => {
    if (val === 2 && openVal) {
      let config = printerHub.getConfig();
      var lastValue = storeIP.getIp() ? storeIP.getIp() : "";
      if (config.host) {
        var host = config.host;
        var ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (ipRegex.test(host)) {
          var split = host.split(/\.(?=[^\.]+$)/);
          _payload.value.ip = split[0] + "." + lastValue;
        } else {
          _payload.value.ip = host + lastValue;
        }
        _payload.value.port = config.port;
        localIp.value = config.host;
        toast.success("Internal print configuration selected");
      } else {
        _payload.value.ip = "192.0.0.0";
        toast.error("Local IP is not conneced, please check your configuration");
      }
    }

    if (val === 3 && openVal) {
      await getPublicIP();
      _payload.value.port = 8100;
      _payload.value.ip = publicIp.value;
    }
  },
  { deep: true }
);

onMounted(() => {
  printRadioGroup.value = 0;
});

watch(
  () => items.value,
  (val) => {
    if (listLabel) {
      _payload.value[listLabel.value] = val;
    }
  }
);

const publicIp = ref<string>("");
const localIp = ref<string>("");

const getPublicIP = async () => {
  isLoading.value = true;
  await axios
    .get("https://api.ipify.org/")
    .then((response) => {
      if (response.status === 200) {
        publicIp.value = response?.data;
      } else {
        publicIp.value = "";
        toast.error("Download Failed");
      }
    })
    .catch((error) => {
      publicIp.value = "";
      toast.error(toast.statusMessage(error?.response?.status ? error.response.status : 500));
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const offlinePrinter = ref(false);

const confirmClientPrint = async () => {
  printerHub.connect({
    host: _payload.value.ip,
    port: _payload.value.port,
    timeout: 3000,
  });

  let lastValues = _payload.value.ip.split(".")[3];
  if (_payload.value) {
    storeIP.storeIp(lastValues);
  }

  items.value.forEach(async (x: any) => {
    let data = `^XA^LS0,^LT8^FT53,192^BQN,2,8
          ^FH\^FDLA,${x[name.value]}^FS
          ^FT82,198^CFA,30^FD${x[name.value]}^FS
          ^PQ${_payload.value.nbrOfCopies},0,1,Y^XZ`;
    console.log("Internal Print Data : ", data);
    await printerHub.write(data);
  });
  toast.success("Internal Print is started successfully");
  close();
};

var currentPrinter: any;

const webPrint = async () => {
  currentPrinter = webserial?.getStatus();
  if (currentPrinter?.value) {
    items.value.forEach(async (x: any) => {
      let data = `^XA^LS0,^LT8^FT53,192^BQN,2,8
          ^FH\^FDLA,${x[name.value]}^FS
          ^FT82,198^CFA,30^FD${x[name.value]}^FS
          ^PQ${_payload.value.nbrOfCopies},0,1,Y^XZ`;
      console.log("Web Print Data : ", data);
      await webserial.print(data);
    });
    toast.success("Web Print is started successfully");
    close();
  } else {
    offlinePrinter.value = true;
  }
};

const closeOfflinePrinter = () => {
  offlinePrinter.value = false;
};

const confirmOfflinePrinter = async () => {
  await webserial.startConnection();
  await webPrint();
  closeOfflinePrinter();
};

const close = () => {
  emit("close");
};

const mobilePrinting = () => {
  emit("mobilePrint", _payload.value);
};
const next = () => {
  if (printRadioGroup.value === 0) {
    mobilePrinting();
  } else if (printRadioGroup.value === 1) {
    webPrint();
  } else if (printRadioGroup.value === 2) {
    confirmClientPrint();
  } else {
    emit("serverSidePrintLabel", _payload.value);
  }
};
</script>
