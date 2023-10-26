<template>
  <Loading v-model:isLoading="isLoading" />

  <div class="p-4">
    <div class="flex items-center justify-between">
      <div class="flex">
        <Export
          @printSelected="printSelected"
          @downloadPdfSelected="downloadPdfSelected"
          @downloadCsvSelected="downloadCsvSelected"
          @printCurrentPage="printCurrentPage"
          @downloadAllCsv="downloadAllCsv"
          @downloadAllPdf="downloadAllPdf"
          :selected="checkItem?.length"
          :page="pagination?.pageNumber"
        />
      </div>
      <TextField v-model="search" class="w-96" label="" placeholder="Search....." :icon="{ name: 'Search', front: true, back: false }" />
    </div>

    <data-table
      :scroll="true"
      :headers="headers"
      :search="search"
      @load="loadData"
      v-model:checkItem="checkItem"
      v-model:server-items="items"
      v-model:server-items-total="totalItems"
      padding="!py-2"
    >
     <template v-slot:ac="{ item }">
        <div v-if="item.action">
          {{findActionType(item.action)}}
        </div>
      </template>
    </data-table>
  </div>

 

  
</template>

<script setup lang="ts">
import { ref, computed, watch, toRefs, watchEffect, onMounted } from "vue";
import toast from "@/utils/toast";
import type { Option } from "@/components/data-table/Types";
import type FormAccess from "@/components/form/dataform/FromAccess";
import { injectStrict } from "@/utils/injectTyped";
import { AxiosKey } from "@/services/symbols";
import { useAuthUser } from "@/stores/Auth/authUser";
import { AccessUtil } from "@/utils/permissionHelper";
import { PermissionName } from "@/utils/permissionName";
import { Input } from "@/components/form/dataform/InputField";
import { REGEX } from "@/utils/const";
import exportFile from "@/views/components/export/index";
import { Load, LoadAll } from "@/services/LogServices/logService";
import { UtcToLocalDateTime, currency, nowDate } from "@/utils/formatters";
import NoImage from "@/assets/images/NoImagePlaceholder.svg";
import type { GetLog } from "@/Model/Log/Log";
import { useStatus } from "@/stores/Auth/status";

const axios = injectStrict(AxiosKey);
const authStore = useAuthUser();
const isLoading = ref<boolean>(false);
const policyName = "Logs";
const checkItem = ref<any[]>([]);
const search = ref("");
const items = ref<any>([]);
const totalItems = ref(0);
const allitems = ref<any>([]);
const statusStore = useStatus();

onMounted(() => {
  CheckLogTypes()
})
const actionType = ref<any[]>([]);
const CheckLogTypes = async () => {
  await statusStore.LoadLogTypes();
  return actionType.value = statusStore.LogTypes;
}

const headers = [
  { text: "DESCRIPTION", value: "data" },
  { text: "CREATED BY", value: "createdBy" },
  { text: "CREATED AT", value: "createdAt",format: (val: any) => {return UtcToLocalDateTime(val);} },
  { text: "ACTION", value: "ac",format: (val: any) => {return findActionType(val);} },
  { text: "ACTION ON", value: "actionOn" },
];

const columns = () => {
  let newList = headers.filter((x: any) => {
    return x.value !== "ac";
  });
  newList = [...newList,...[{ text: "ACTION", value: "action",format: (val: any) => {return findActionType(val)} }]];
  return newList;
};

const findActionType = (val : number) =>{
  return actionType.value.find((x: any)=> x.number === val)?.displayName
}

const pagination = ref<any>();

const loadData = async (options: Option) => {
  isLoading.value = true;
  let result = await Load(options);
  if (result?.isSuccess) {
    // items.value = result?.data?.items;
    pagination.value = result?.data;
  }
  isLoading.value = result?.loading;
};

const loadAllData = async () => {
  isLoading.value = true;
  let result = await LoadAll(pagination?.value?.totalCount);
  if (result?.isSuccess) {
    allitems.value = result?.data?.items;
  }
  isLoading.value = result?.loading;
};

const printSelected = () => {
  exportFile.printPdf(columns(), checkItem.value, false, "");
};

const downloadPdfSelected = () => {
  exportFile.downloadPdf(columns(), checkItem.value, false,"", "Logs");
};

const downloadCsvSelected = () => {
  exportFile.downloadCsv(columns(), checkItem.value, "Logs");
};

const printCurrentPage = () => {
  exportFile.printPdf(columns(), items.value, false,"");
};

const downloadAllCsv = async () => {
  await loadAllData();
  exportFile.downloadCsv(columns(), allitems.value, "Logs");
};

const downloadAllPdf = async () => {
  await loadAllData();
  exportFile.downloadPdf(columns(), allitems.value, false,"", "Logs");
};

</script>
