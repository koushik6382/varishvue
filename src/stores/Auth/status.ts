import { defineStore } from "pinia";;
import toast from "@/utils/toast";
import axios from '@/services/http-common'
import { ref } from "vue";
import StorageUtil from "@/utils/storageUtil";


export const useStatus = defineStore("Status", () => {

  const LogTypes = ref(StorageUtil.Get<any[]>("LogTypes", []));
  const CsvErrorTypes = ref(StorageUtil.Get<any[]>("CsvErrorTypes", []));

  interface StoreStatus {
    api: string,
    store: string,
  }

  const getAllStatus = async () => {
    var statusArray: StoreStatus[] = [
      {
        api: "Enums/LogTypes",
        store: "LogTypes",
      },
      {
        api: "Enums/CsvErrorTypes",
        store: "CsvErrorTypes",
      },
    ];

    try {
      for (var i: number = 0; i < statusArray.length; i++) {
        let response = await axios.get(`${statusArray[i].api}`);
        addingStatus(statusArray[i].store, response.data)
        StorageUtil.Set<any[]>(`${statusArray[i].store}`, response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const addingStatus = (type: string, response: any[]) => {
    switch (type) {
      case "LogTypes" : return LogTypes.value = response
      case "CsvErrorTypes" : return CsvErrorTypes.value = response
      default: return null
    }
  }

  const LoadCsvErrorTypes = async()=>{
    let response = await axios.get(`Enums/CsvErrorTypes`);
    CsvErrorTypes.value = response.data;
    StorageUtil.Set<any[]>(`CsvErrorTypes`, CsvErrorTypes.value);
  }

  const LoadLogTypes = async()=>{
    let response = await axios.get(`Enums/LogTypes`);
    LogTypes.value = response.data
    StorageUtil.Set<any[]>(`LogTypes`, LogTypes.value);
  }

  return { 
    getAllStatus,LoadLogTypes,LoadCsvErrorTypes,LogTypes,CsvErrorTypes
    }
});
