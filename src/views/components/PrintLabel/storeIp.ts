import { defineStore } from "pinia";;
import { ref } from "vue";
import StorageUtil from "@/utils/storageUtil";


export const useIP = defineStore("StoreIP", () => {

  const ipAddress = ref(StorageUtil.Get<string>("localIp", ""));

  const storeIp = (ip: string) => {
    ipAddress.value = ip;
    StorageUtil.Set<string>(`localIp`, ip);
  }

  const getIp = () => {
    return ipAddress.value
  }


  return { storeIp, getIp };
});
