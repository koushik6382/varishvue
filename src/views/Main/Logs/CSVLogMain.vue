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

        <btn
        :icon="{ visible: true, name: 'Archive', size: 6, color: 'white' }"
        :access="AccessUtil(policyName, PermissionName.DELETE)"
        @click="
          () => {
            openClearCsv = true;
          }
        "
      >
        Clear CSV
      </btn>
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
    </data-table>
  </div>

 

  <ConfirmModal v-if="openClearCsv" :value="`Clear All CSV log`" icon="Trash2" color="danger"
    positive="Confirm" negative="Cancel" question="Do you want to clear all CSV log?" :modalOpen="openClearCsv"
    :modalClose="closeClearCsv" :modalConfirm="confirmClearCsv" />
  
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
import { ClearCSV, Load, LoadAll } from "@/services/LogServices/csvLogService";
import { UtcToLocalDateTime, currency, nowDate } from "@/utils/formatters";
import NoImage from "@/assets/images/NoImagePlaceholder.svg";
import type { GetCSVLog } from "@/Model/Log/CSVLog";
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

const openClearCsv = ref<boolean>(false);

onMounted(() => {
  CheckCsvErrorTypes()
})

const errorType = ref<any[]>([]);
const CheckCsvErrorTypes = async () => {
  await statusStore.LoadCsvErrorTypes();
  return errorType.value = statusStore.CsvErrorTypes;
}

const headers = [
  { text: "CSV NAME", value: "csvName" },
  { text: "LINE#", value: "lineNumber" },
  { text: "DESCRIPTION", value: "csvLine" },
  { text: "ERROR TYPE", value: "errorType",format: (val: any) => {return findErrorType(val);} },
  { text: "CREATED BY", value: "createdBy" },
  { text: "CREATED AT", value: "createdAt",format: (val: any) => {return UtcToLocalDateTime(val);} },
];

const columns = () => {
  return headers;
};

const findErrorType = (val : number) =>{
  return errorType.value.find((x: any)=> x.number === val)?.displayName
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
  exportFile.downloadPdf(columns(), checkItem.value, false,"", "CSVLogs");
};

const downloadCsvSelected = () => {
  exportFile.downloadCsv(columns(), checkItem.value, "CSVLogs");
};

const printCurrentPage = () => {
  exportFile.printPdf(columns(), items.value, false,"");
};

const downloadAllCsv = async () => {
  await loadAllData();
  exportFile.downloadCsv(columns(), allitems.value, "CSVLogs");
};

const downloadAllPdf = async () => {
  await loadAllData();
  exportFile.downloadPdf(columns(), allitems.value, false,"", "CSVLogs");
};

const confirmClearCsv = async () => {
  isLoading.value = true;
  let result = await ClearCSV();
  if (result?.isSuccess) {
    setTimeout(() => {
        location.reload();
        isLoading.value = result?.loading;
      }, 1500);
    closeClearCsv();
  }
  else{
    isLoading.value = result?.loading;
  }
  
};

const closeClearCsv = () => {
  openClearCsv.value = false;
};

</script>@/services/LogServices/csvLogService