<template>
  <Loading v-model:isLoading="isLoading" />

  <ArchiveModel
    v-if="openArchive"
    :isOpen="openArchive"
    title="Archive Item"
    :headers="archiveheaders()"
    v-model:items="archiveItems"
    v-model:totalItems="totalArchiveItems"
    :search="archiveSearch"
    :loadArchive="loadArchiveData"
    :policyName="policyName"
    @close="archiveClose"
    @restore="restore($event)"
    @remove="remove($event)"
  />

  <DataForm
    v-if="open"
    :isOpen="open"
    :formAccess="formAccess"
    v-model:editItem="editedItem"
    v-model:payload="itemPayload"
    v-model:defPayload="itemDefaultPayload"
    v-model:attributes="attributes"
    :style="formStyle"
    @save="save"
    @close="close"
  />

  <div class="p-4">
    <div class="flex items-center justify-between">
      <div class="flex">
        <btn
          :icon="{
            visible: true,
            name: 'Plus',
            size: 6,
            color: 'white',
            darkColor: 'white',
          }"
          :access="AccessUtil(policyName, PermissionName.CREATE)"
          @click="openForm"
        >
          Add New Item
        </btn>

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

        <FileUploadBtn
          ref="openUploader"
          content="Upload"
          label="Upload"
          :icon="{
            name: 'Upload',
            color: 'white',
            darkColor: 'white',
          }"
          @upload="serverUpload($event)"
          :access="AccessUtil(policyName, PermissionName.UPLOAD_CSV)"
        />

        <btn
          :icon="{ visible: true, name: 'Archive', size: 6, color: 'white' }"
          :access="AccessUtil(policyName, PermissionName.ARCHIVE)"
          @click="
            () => {
              openArchive = true;
            }
          "
        >
          Archive
        </btn>

        <btn
          v-if="authStore.activeUser()?.role === SuperUser"
          :icon="{ visible: true, name: 'Trash2', size: 6, color: 'white' }"
          :access="true"
          @click="
            () => {
              openConRemoveAll = true;
            }
          "
        >
          Delete All
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
    >

    <template v-slot:description="{ item }">
      <div v-if="item.description" class="flex truncate w-44">
          <span>
            <Tippy
              tag="a"
              href="javascript:;"
              class="tooltip flex justify-center items-center"
              :content="item.description"
              :options="{
                zIndex: 99999,
              }"
            >
            {{ item.description }}
            </Tippy>
          </span>
        </div>
      </template>

      <template v-slot:action="{ item }">
        <div class="flex items-center justify-start space-x-1">
          <icon-button @click="edit(item)" name="Edit" icon="Edit" color="success" darkColor="success" size="6" :access="AccessUtil(policyName, PermissionName.MODIFY)" />
          <icon-button @click="archive(item)" name="Archive" icon="Archive" darkColor="danger" color="danger" size="6" :access="AccessUtil(policyName, PermissionName.ARCHIVE)" />
        </div>
      </template>

      <!-- <template v-slot:productSizes="{ item }">
        <div v-if="item.productSizes.length > 0" class="flex truncate w-32 h-6">
          <span>
            <Tippy
              tag="a"
              href="javascript:;"
              class="tooltip flex justify-center items-center"
              :content="item.productSizes.map((size : GetProductSize) => size.name).join(', ')"
              :options="{
                zIndex: 99999,
              }"
            >
            {{ item.productSizes.map((size : GetProductSize) => size.name).join(', ') }}
            </Tippy>
          </span>
        </div>
      </template> -->
    </data-table>
  </div>

  <ConfirmModal
    v-if="openConArchive"
    :value="`Item : ${editedItem?.name}`"
    icon="Archive"
    color="danger"
    positive="Confirm"
    negative="Cancel"
    question="Do you want to archive this item?"
    :modalOpen="openConArchive"
    :modalClose="closeConArchive"
    :modalConfirm="confirmArchive"
  />

  <ConfirmModal
    v-if="openConRestore"
    :value="`Item : ${editedItem?.name}`"
    icon="RotateCcw"
    color="success"
    positive="Confirm"
    negative="Cancel"
    question="Do you want to restore this item?"
    :modalOpen="openConRestore"
    :modalClose="closeConRestore"
    :modalConfirm="confirmRestore"
  />

  <ConfirmModal
    v-if="openConRemove"
    :value="`Item : ${editedItem?.name}`"
    icon="Trash2"
    color="danger"
    positive="Confirm"
    negative="Cancel"
    question="Do you want to delete this item?"
    :modalOpen="openConRemove"
    :modalClose="closeConRemove"
    :modalConfirm="confirmRemove"
  />

  <ConfirmModal
    v-if="openConRemoveAll"
    value=""
    icon="Trash2"
    color="danger"
    positive="Confirm"
    negative="Cancel"
    question="Do you want to delete all items?"
    :modalOpen="openConRemoveAll"
    :modalClose="closeConRemoveAll"
    :modalConfirm="confirmRemoveAll"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, toRefs, watchEffect } from "vue";
import toast from "@/utils/toast";
import type { Option } from "@/components/data-table/Types";
import type FormAccess from "@/components/form/dataform/FromAccess";
import { useAuthUser } from "@/stores/Auth/authUser";
import { AccessUtil } from "@/utils/permissionHelper";
import { PermissionName } from "@/utils/permissionName";
import { Input } from "@/components/form/dataform/InputField";
import { REGEX, SuperUser } from "@/utils/const";
import exportFile from "@/views/components/export/index";
import type { GetProduct, CreateProduct } from "@/Model/Product/Product";
import { currency, nowDate } from "@/utils/formatters";
import { Edit, Load, LoadAll, LoadArchives, Remove, Restore, Archive, Save, UploadFile, RemoveAll, LoadWithoutPagination } from "@/services/productService";
import type { GetProductSize } from "@/Model/Product/ProductSize";

const authStore = useAuthUser();
const isLoading = ref<boolean>(false);
const policyName = "Item";
const checkItem = ref<any[]>([]);
const search = ref("");
const items = ref<any>([]);
const totalItems = ref(0);
const allitems = ref<any>([]);
const open = ref<boolean>(false);

const totalArchiveItems = ref(0);
const openArchive = ref<boolean>(false);
const archiveSearch = ref("");
const archiveItems = ref<any>([]);
const openConArchive = ref<boolean>(false);
const openConRestore = ref<boolean>(false);
const openConRemoveAll = ref<boolean>(false);

const headers = [
  { text: "Item", value: "name" },
  { text: "DESCRIPTION", value: "description" },
  { text: "DISPLAY NAME", value: "displayName" },
  { text: "SKU", value: "sku" },
  { text: "STYLE COLOUR", value: "styleColour" },
  { text: "CARTON BARCODE", value: "cartonBarcode" },
  { text: "CARTON QTY", value: "cartonQuantity" },
  { text: "PACK BARCODE", value: "packBarcode" },
  { text: "PACK QTY", value: "packQuantity" },
  { text: "UPC CODE", value: "upcCode" },
  { text: "UPC QTY", value: "upcQuantity" },
  // { text: "ITEM SIZES", value: "productSizes" },
  { text: "ACTION", value: "action" },
];

const archiveheaders = () => {
  return headers;
};

const columns = () => {
  return headers.filter((x: any) => {
    return x.value !== "action";
  });
};

const editedItem = ref<GetProduct | null>();

const formAccess = ref<FormAccess>({
  save: { name: "Save", visible: true },
  edit: { name: "Edit", visible: true },
  cancel: { name: "Cancel", visible: true },
  itemIndex: -1,
  createTitle: "Create Item",
  editTitle: () => {
    return "Edit Item : " + editedItem?.value?.name;
  },
});
const pagination = ref<any>();

const openConRemove = ref<boolean>(false);

const itemPayload = ref<CreateProduct>({
  name: "",
  description: "",
  displayName: "",
  styleColour: "",
  sku: "",
  cartonBarcode: "",
  cartonQuantity: 0,
  packBarcode: "",
  packQuantity: 0,
  upcCode: "",
  upcQuantity: 0,
  productSizes: [],
});

const itemDefaultPayload = ref<CreateProduct>({
  name: "",
  description: "",
  displayName: "",
  styleColour: "",
  sku: "",
  cartonBarcode: "",
  cartonQuantity: 0,
  packBarcode: "",
  packQuantity: 0,
  upcCode: "",
  upcQuantity: 0,
  productSizes: [],
});

const formStyle = ref({
  cols: "grid-cols-4",
  gap: "gap-2",
});

// const LoadLocationData = async (options: Option) => {
//   let result = await LoadLocation(options);
// };

// const LoadStatusData = async (options: Option) => {
//   let result = await LoadStatus(options);
// };

// const findLocation = async (id: number) => {
//   let result = await FindLocation(id);
//   if (result?.isSuccess) {
//     attributes.value.find((x) => x.key === "rfiD_LocationId").updatedItem = await result?.data;
//   } else {
//     attributes.value.find((x) => x.key === "rfiD_LocationId").updatedItem = null;
//   }
// };

// const findStatus = async (id: number) => {
//   let result = await FindStatus(id);
//   if (result?.isSuccess) {
//     attributes.value.find((x) => x.key === "rfiD_StatusId").updatedItem = await result?.data;
//   } else {
//     attributes.value.find((x) => x.key === "rfiD_StatusId").updatedItem = null;
//   }
// };
const productSizesList = ref<any[]>([]);
const attributes = ref<any[]>([
  {
    key: "name",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "Name",
    tag: "Required",
    rule: (val: any) => {
      return val === "" ? "Name is Required" : true;
    },
    showEdit: true,
  },
  {
    key: "displayName",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "Display Name",
    tag: "",
    showEdit: true,
  },
  {
    key: "description",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "Description",
    tag: "",
    showEdit: true,
    colSpan: "2",
  },
  {
    key: "sku",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "SKU",
    tag: "",
    showEdit: true,
  },
  {
    key: "styleColour",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "Style Colour",
    tag: "",
    showEdit: true,
  },

  {
    key: "cartonBarcode",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "Carton Barcode",
    tag: "",
    showEdit: true,
  },

  {
    key: "cartonQuantity",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "Carton Quantity",
    tag: "",
    showEdit: true,
  },

  {
    key: "packBarcode",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "Pack Barcode",
    tag: "",
    showEdit: true,
  },
  {
    key: "packQuantity",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "Pack Quantity",
    tag: "",
    showEdit: true,
  },
  {
    key: "upcCode",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "UPC Code",
    tag: "",
    showEdit: true,
  },
  {
    key: "upcQuantity",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "UPC Quantity",
    tag: "",
    showEdit: true,
  },
  {
    key: "productSizes",
    modelValue: [],
    fieldType: Input.TEXT_ADDER,
    label: "Product Sizes",
    tag: "",
    showEdit: false,
    colSpan: "full",
  },
  // {
  //   key: "rfiD_LocationId",
  //   modelValue: 0,
  //   fieldType: Input.SELECT,
  //   label: "RFID Location",
  //   multiple: false,
  //   itemText: "description",
  //   itemValue: "locationId",
  //   resultObj: false,
  //   infoEnable: false,
  //   updatedItem: null,
  //   load: LoadLocationData,
  //   rule: (val: any) => {
  //     return val <= 0 ? "RFID Location is Required" : true;
  //   },
  //   tag: "Required",
  //   showEdit: true,
  // },
  // {
  //   key: "rfiD_StatusId",
  //   modelValue: 0,
  //   fieldType: Input.SELECT,
  //   label: "RFID Status",
  //   multiple: false,
  //   itemText: "description",
  //   itemValue: "statusId",
  //   updatedItem: null,
  //   resultObj: false,
  //   infoEnable: false,
  //   load: LoadStatusData,
  //   rule: (val: any) => {
  //     return val <= 0 ? "RFID Status is Required" : true;
  //   },
  //   tag: "Required",
  //   showEdit: true,
  // },
]);

const loadData = async (options: Option) => {
  isLoading.value = true;
  let result = await Load(options);
  if (result?.isSuccess) {
    // items.value = result?.data?.items;
    pagination.value = result?.data;
  }
  // let result = await LoadWithoutPagination();
  // if (result?.isSuccess) {
  //   items.value = result?.data;
  //   pagination.value = result?.data;
  // }
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

const openForm = () => {
  formAccess.value.itemIndex = -1;
  open.value = true;
};

const edit = async (item: GetProduct) => {
  editedItem.value = item;
  formAccess.value.itemIndex = items.value.indexOf(item);
  // await findLocation(editedItem.value?.rfiD_LocationId)
  // await findStatus(editedItem.value?.rfiD_StatusId)
  open.value = true;
};

const save = async (item: any) => {
  if (item !== null) {
    isLoading.value = true;
    if (formAccess.value.itemIndex === -1) {
      let result = await Save(item as CreateProduct);
      if (result?.isSuccess) {
        items.value.unshift(result?.data);
        totalItems.value++;
      }
      isLoading.value = result?.loading;
    } else {
      delete item["productSizes"];
      let result = await Edit(editedItem?.value?.productId!, item as CreateProduct);
      if (result?.isSuccess) {
        items.value.splice(formAccess.value.itemIndex, 1, result?.data);
      }
      isLoading.value = result?.loading;
    }
  }
  close();
};

const close = () => {
  open.value = false;
  formAccess.value.itemIndex = -1;
  editedItem.value = null;
};

const loadArchiveData = async (options: Option) => {
  isLoading.value = true;
  let result = await LoadArchives(options);
  if (result?.isSuccess) {
    archiveItems.value = result?.data?.items;
  }
  isLoading.value = result?.loading;
};

const archive = async (item: GetProduct) => {
  editedItem.value = item;
  formAccess.value.itemIndex = items.value.indexOf(item);
  openConArchive.value = true;
};

const confirmArchive = async () => {
  isLoading.value = true;
  let result = await Archive(editedItem.value?.productId!);
  if (result?.isSuccess) {
    archiveItems.value.unshift(editedItem.value);
    items.value.splice(formAccess.value.itemIndex, 1);
    totalItems.value--;
    totalArchiveItems.value++;
    closeConArchive();
  }
  isLoading.value = result?.loading;
};

const closeConArchive = () => {
  openConArchive.value = false;
  editedItem.value = null;
};

const restore = (item: GetProduct) => {
  formAccess.value.itemIndex = archiveItems.value.indexOf(item);
  editedItem.value = item;
  openConRestore.value = true;
};

const confirmRestore = async () => {
  isLoading.value = true;
  let result = await Restore(editedItem.value?.productId!);
  if (result?.isSuccess) {
    items.value.unshift(editedItem.value);
    archiveItems.value.splice(formAccess.value.itemIndex, 1);
    totalItems.value++;
    totalArchiveItems.value--;
    closeConRestore();
  }
  isLoading.value = result?.loading;
};

const closeConRestore = () => {
  openConRestore.value = false;
  editedItem.value = null;
};

const remove = (item: GetProduct) => {
  formAccess.value.itemIndex = items.value.indexOf(item);
  editedItem.value = item;
  openConRemove.value = true;
};

const confirmRemove = async () => {
  isLoading.value = true;
  let result = await Remove(editedItem.value?.productId!);
  if (result?.isSuccess) {
    archiveItems.value.splice(formAccess.value.itemIndex, 1);
    totalArchiveItems.value--;
    closeConRemove();
  }
  isLoading.value = result?.loading;
};

const confirmRemoveAll = async () => {
  isLoading.value = true;
  let result = await RemoveAll();
  if (result?.isSuccess) {
    closeConRemoveAll();
    setTimeout(() => {
      location.reload();
      isLoading.value = result?.loading;
    }, 2000);
  } else {
    isLoading.value = result?.loading;
  }
};

const closeConRemoveAll = () => {
  openConRemoveAll.value = false;
};

const closeConRemove = () => {
  openConRemove.value = false;
  editedItem.value = null;
};

const archiveClose = () => {
  formAccess.value.itemIndex = -1;
  openArchive.value = false;
};

const serverUpload = async (event: any) => {
  var file = await event;
  var formData = new FormData();
  formData.append("File", file);
  formData.append("Name", file.name);
  if (file) {
    isLoading.value = true;
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    let result = await UploadFile(formData, config);

    if (result?.isSuccess) {
      setTimeout(() => {
        location.reload();
        isLoading.value = result?.loading;
      }, 1500);
    } else {
      isLoading.value = false;
    }
  }
};

const printSelected = () => {
  exportFile.printPdf(columns(), checkItem.value, false, "");
};

const downloadPdfSelected = () => {
  exportFile.downloadPdf(columns(), checkItem.value, false, "", "Item");
};

const downloadCsvSelected = () => {
  exportFile.downloadCsv(columns(), checkItem.value, "Item");
};

const printCurrentPage = () => {
  exportFile.printPdf(columns(), items.value, false, "");
};

const downloadAllCsv = async () => {
  await loadAllData();
  exportFile.downloadCsv(columns(), allitems.value, "Item");
};

const downloadAllPdf = async () => {
  await loadAllData();
  exportFile.downloadPdf(columns(), allitems.value, false, "", "Item");
};
</script>
