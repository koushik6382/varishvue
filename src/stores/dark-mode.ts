import { defineStore } from "pinia";
import { ref } from "vue";
import StorageUtil from "@/utils/storageUtil";

export const useDarkModeStore = defineStore("darkMode",()=> {

  const darkModeValue = ref(StorageUtil.Get<boolean>("darkMode", true))

  const darkMode = () =>{
    if (darkModeValue.value === null) {
      StorageUtil.Set<boolean>("darkMode", false);
    }

    return darkModeValue.value;
  }

  const setDarkMode = (darkMode : boolean)=> {
    darkModeValue.value = darkMode;
    StorageUtil.Set<boolean>("darkMode", darkMode);
  }

  return { darkModeValue, darkMode, setDarkMode };

});
