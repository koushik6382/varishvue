<template>

  <div
    class="shadow-md fixed bottom-0 border w-full h-8 flex items-center justify-center z-50 bg-slate-200 dark:bg-darkmode-800"
  >
    
    <div class="text-gray-700 dark:text-white text-center p-4 text-xs lg:text-sm">
      © {{ currentYear }} Copyright:
      <a class="text-blue-900 dark:text-pending" href="https://www.softclient.com.au/"
        >www.softclient.com.au</a
      >
      all rights reserved.
    </div>
    <div class="text-gray-700 dark:text-white text-center p-4 text-xs lg:text-sm">
      <div>
        Version B.E. <span class="font-bold"> {{ bVersion }} </span> - F.E.
        <span class="font-bold"> {{ fVersion }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import axios from "../../../services/http-common"
import { version } from "../../../../package.json";
import { Version } from '@/services/AuthService/authService';

const bVersion = ref<string>("00.00.00.00")
const fVersion = version
const currentYear = new Date().getFullYear()

onMounted(async () => {
  let result = await Version();
  if(result.isSuccess){
    bVersion.value = result?.data?.data?.version
  }
    // axios.get("Version").then((response) => {
    //   if (response.data && response.data.version) {
    //         bVersion.value = response.data.version;
    //   }
    // });
})
</script>