<template>
 
  <Dropdown>
    <DropdownToggle :class="type === ExportType.BUTTON ? 'ml-2 mr-2 btn px-2 box bg-primary dark:bg-primary text-white text-xs' : ''">
      
      <div v-if="type === ExportType.BUTTON">
      <Tippy tag="a" href="javascript:;" class="tooltip" :content="name" :options="{ zIndex: 99999}">
        <div class="flex space-x-2 items-center justify-center" >
        <Icon class="text-white ml-2 hover:text-yellow-200 lg:w-6 lg:h-6 w-4 h-4" name="Download" />
        <div class="text-base font-normal">Export</div>
        </div>
      </Tippy>
      </div>
      <div v-else>
        <icon-button :name="name" icon="Download" color="black" darkColor="white" size="6" :access="true" />
      </div>
    </DropdownToggle>

    <DropdownMenu class="w-40">
      <DropdownContent>
        <DropdownItem v-if="selected > 0" @click="printSelected">
          <Icon class="lg:w-6 lg:h-6 w-4 h-4 ml-2 mr-2 text-primary" name="Printer" />

          Print Selected {{ selected }} (PDF)
        </DropdownItem>

        <DropdownItem v-if="selected > 0" @click="downloadPdfSelected">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="lg:w-6 lg:h-6 w-4 h-4 text-red-600 mr-2" viewBox="0 0 16 16">
            <path
              d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm2.525.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"
            />
            <path
              fill-rule="evenodd"
              d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"
            />
          </svg>
          Download Selected {{ selected }} (PDF)
        </DropdownItem>

        <DropdownItem v-if="selected > 0 && isCsv" @click="downloadCsvSelected">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="lg:w-6 lg:h-6 w-4 h-4 text-green-600 mr-2" viewBox="0 0 24 24">
            <path
              d="M23 1.5q.41 0 .7.3.3.29.3.7v19q0 .41-.3.7-.29.3-.7.3H7q-.41 0-.7-.3-.3-.29-.3-.7V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h5V2.5q0-.41.3-.7.29-.3.7-.3zM6 13.28l1.42 2.66h2.14l-2.38-3.87 2.34-3.8H7.46l-1.3 2.4-.05.08-.04.09-.64-1.28-.66-1.29H2.59l2.27 3.82-2.48 3.85h2.16zM14.25 21v-3H7.5v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3H7.5v3zm8.25 15v-3h-6.75v3zm0-4.5v-3.75h-6.75v3.75zm0-5.25V7.5h-6.75v3.75zm0-5.25V3h-6.75v3Z"
            />
          </svg>

          Download Selected {{ selected }} (CSV)
        </DropdownItem>

        <DropdownItem @click="printCurrentPage">
          <Icon class="lg:w-6 lg:h-6 w-6 h-6 mr-2 text-primary" name="Printer" />

          Print Page {{ page }} (PDF)
        </DropdownItem>

        <!-- <DropdownItem @click="printAllPages">
            <PrinterIcon class="lg:w-6 lg:h-6 w-6 h-6 mr-2 text-primary" />

            
            Print All (PDF)
          </DropdownItem> -->
        <DropdownItem v-if="isCsv" @click="downloadAllCsv">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="lg:w-6 lg:h-6 w-4 h-4 text-green-600 mr-2" viewBox="0 0 24 24">
            <path
              d="M23 1.5q.41 0 .7.3.3.29.3.7v19q0 .41-.3.7-.29.3-.7.3H7q-.41 0-.7-.3-.3-.29-.3-.7V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h5V2.5q0-.41.3-.7.29-.3.7-.3zM6 13.28l1.42 2.66h2.14l-2.38-3.87 2.34-3.8H7.46l-1.3 2.4-.05.08-.04.09-.64-1.28-.66-1.29H2.59l2.27 3.82-2.48 3.85h2.16zM14.25 21v-3H7.5v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3H7.5v3zm8.25 15v-3h-6.75v3zm0-4.5v-3.75h-6.75v3.75zm0-5.25V7.5h-6.75v3.75zm0-5.25V3h-6.75v3Z"
            />
          </svg>

          Download All (CSV)
        </DropdownItem>

        <DropdownItem @click="downloadAllPdf">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="lg:w-6 lg:h-6 w-4 h-4 text-red-600 mr-2" viewBox="0 0 16 16">
            <path
              d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm2.525.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"
            />
            <path
              fill-rule="evenodd"
              d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"
            />
          </svg>
          Download All (PDF)
        </DropdownItem>
      </DropdownContent>
    </DropdownMenu>
  </Dropdown>
  <!-- </Tippy> -->
</template>

<script lang="ts" setup>
import { ExportType } from './ExportType';

interface Props {
  type: ExportType,
  page?: number;
  selected: number;
  isCsv?: boolean;
  name?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: ExportType.BUTTON,
  isCsv: true,
  name:"Export"
});

const emit = defineEmits<{
  (e: "printSelected"): void;
  (e: "downloadPdfSelected"): void;
  (e: "downloadCsvSelected"): void;
  (e: "printCurrentPage"): void;
  (e: "downloadAllCsv"): void;
  (e: "downloadAllPdf"): void;
}>();

const printSelected = () => {
  emit("printSelected");
};

const downloadPdfSelected = () => {
  emit("downloadPdfSelected");
};

const downloadCsvSelected = () => {
  emit("downloadCsvSelected");
};

const printCurrentPage = () => {
  emit("printCurrentPage");
};

const downloadAllCsv = () => {
  emit("downloadAllCsv");
};

const downloadAllPdf = () => {
  emit("downloadAllPdf");
};
</script>
