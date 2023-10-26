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
      v-model:editItem="selectedCompany"
      v-model:payload="itemAllObjPayload"
      v-model:defPayload="itemAllObjDefaultPayload"
      v-model:attributes="attributes"
      size="modal-4xl"
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
            Add New Company
          </btn>
<!--   
          <Export
            @printSelected="printSelected"
            @downloadPdfSelected="downloadPdfSelected"
            @downloadCsvSelected="downloadCsvSelected"
            @printCurrentPage="printCurrentPage"
            @downloadAllCsv="downloadAllCsv"
            @downloadAllPdf="downloadAllPdf"
            :selected="checkItem?.length"
            :page="pagination?.pageNumber"
          /> -->
  
          <!-- <FileUploadBtn
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
          /> -->
  
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
            <icon-button @click="info(item)" name="Info" icon="Info" color="success" darkColor="info" size="6" :access="AccessUtil(policyName, PermissionName.VIEW)" />
            <icon-button @click="edit(item)" name="Edit" icon="Edit" color="success" darkColor="success" size="6" :access="AccessUtil(policyName, PermissionName.MODIFY)" />
            <icon-button @click="archive(item)" name="Archive" icon="Archive" darkColor="danger" color="danger" size="6" :access="AccessUtil(policyName, PermissionName.ARCHIVE)" />
          </div>
        </template>
<!--   
        <template v-slot:productSizes="{ item }">
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

    <Info v-if="openInfo" :isOpen="openInfo" :title="`Info of Company : ${selectedCompany?.name}`" :infoItem="{...selectedCompany, ...selectedCompany?.address}" :headers="infoHeader" col="3" @close="closeInfo">

    <!-- <template v-slot:addressLine1="{ item }">
      {{ item.addressLine1 = item.address.addressLine1 }}
    </template>

     -->



    <!-- <template v-slot:isIndividualPersonal="{ item }">
      {{ item.value ? "Yes" : "No" }}
    </template> -->
  </Info>
  
    <ConfirmModal
      v-if="openConArchive"
      :value="`Item : ${selectedCompany?.name}`"
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
      :value="`Item : ${selectedCompany?.name}`"
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
      :value="`Item : ${selectedCompany?.name}`"
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
 
  import type { Company, CreateCompanyAllDto, CreateCompanyDto } from "@/Model/Company/Company";
  import { companyInfoHeader } from "@/Model/Company/Company";
  import { currency, nowDate } from "@/utils/formatters";
 import { Edit, Load, LoadAll, LoadArchives, Remove, Restore, Archive, Save, RemoveAll, LoadWithoutPagination,FindCompanyById } from "@/services/companyService";
  import type { GetProductSize } from "@/Model/Product/ProductSize";
  import type { Address, CreateAddressDto } from "@/Model/Company/Address";

  const authStore = useAuthUser();
  const isLoading = ref<boolean>(false);
  const policyName = "Item";
  const checkItem = ref<any[]>([]);
  const search = ref("");
  const items = ref<any>([]);
  const totalItems = ref(0);
  const allitems = ref<any>([]);
  const open = ref<boolean>(false);

  const openInfo=ref(false);
  
  const totalArchiveItems = ref(0);
  const openArchive = ref<boolean>(false);
  const archiveSearch = ref("");
  const archiveItems = ref<any>([]);
  const openConArchive = ref<boolean>(false);
  const openConRestore = ref<boolean>(false);
  const openConRemoveAll = ref<boolean>(false);
  const infoHeader = ref(companyInfoHeader);
  const headers = [
    
    { text: "Company Name", value: "name" },
    { text: "Telephone No", value: "telephone" },
    { text: "Mobile No", value: "mobile" },
    { text: "Email", value: "email" },
    
    // { text: "ITEM SIZES", value: "productSizes" },
    { text: "ACTION", value: "action" },
  ];
  
  const archiveheaders = () => {
    return headers;
  };

  const info = (item: Company) => {
    // selectedCompany.value=item;
    const itemId = item.companyId;
    findCompanyById(itemId);
};

  const findCompanyById = async (itemId: number) => {
    isLoading.value = true;
    let result = await FindCompanyById(itemId); 
    if (result?.isSuccess) {
      console.log("findCompanyById",result)
      const companyDetails = result?.data; 
            
            selectedCompany.value = companyDetails;
            openInfo.value = true;
            console.log(selectedCompany.value)
    }
    
    // Handle other cases accordingly
    isLoading.value = result?.loading;
};
  
  const closeInfo=()=>{
    selectedCompany.value = null;
    openInfo.value=false;
  }
  const columns = () => {
    return headers.filter((x: any) => {
      return x.value !== "action";
    });
  };
  
  const selectedCompany = ref<Company | null>();
  
  const formAccess = ref<FormAccess>({
    save: { name: "Save", visible: true },
    edit: { name: "Edit", visible: true },
    cancel: { name: "Cancel", visible: true },
    itemIndex: -1,
    createTitle: "Create Company",
    editTitle: () => {
      return "Edit Item : " + selectedCompany?.value?.name;
    },
  });
  const pagination = ref<any>();
  
  const openConRemove = ref<boolean>(false);


  const createAddressDto = ref<CreateAddressDto>({
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    country: "",
    postcode: "",
    unitNumber: "",
    streetNumber: "",
    streetName: "",
    suburb: "",
    gps: "",
    latitude: null,
    longitude: null,
    docLocation: ""
  });

  const itemAllObjPayload = ref<CreateCompanyAllDto>({
    name: "",
    telephone:  "",
    mobile:  "",
    email:  "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    country: "",
    postcode: "",
    unitNumber: "",
    streetNumber: "",
    streetName: "",
    suburb: "",
    gps: "",
    latitude: null,
    longitude: null,
    docLocation: ""
  });

  const itemAllObjDefaultPayload = ref<CreateCompanyAllDto>({
    name: "",
    telephone:  "",
    mobile:  "",
    email:  "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    country: "",
    postcode: "",
    unitNumber: "",
    streetNumber: "",
    streetName: "",
    suburb: "",
    gps: "",
    latitude: null,
    longitude: null,
    docLocation: ""
  });

  const itemPayload = ref<CreateCompanyDto>({
    name: "",
    telephone:  "",
    mobile:  "",
    email:  "",
    address: createAddressDto.value,
  });
  
  const itemDefaultPayload = ref<CreateCompanyDto>({

    name: "",
    telephone:  "",
    mobile:  "",
    email:  "",
    address: createAddressDto.value,
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
      key: "telephone",
      modelValue: "",
      fieldType: Input.TEXT,
      label: "Telephone No",
      tag: "",
      showEdit: true,
    },
    {
      key: "mobile",
      modelValue: "",
      fieldType: Input.TEXT,
      label: "Mobile No",
      tag: "",
      showEdit: true,
     
    },
    {
      key: "email",
      modelValue: "",
      fieldType: Input.TEXT,
      label: "Email",
      tag: "",
      showEdit: true,
    },
    {
    key: "addressLine1",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "Address Line 1",
    tag: "Required",
    rule: (val: any) => {
      return val === "" ? "Address Line 1 is Required" : true;
    },
    showEdit: true,
  },
  {
    key: "city",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "City",
    tag: "Required",
    rule: (val: any) => {
      return val === "" ? "City is Required" : true;
    },
    showEdit: true,
  },
  {
    key: "country",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "Country",
    tag: "Required",
    rule: (val: any) => {
      return val === "" ? "Country is Required" : true;
    },
    showEdit: true,
  },
  {
      key: "postcode",
      modelValue: "",
      fieldType: Input.TEXT,
      label: "Post Code",
      tag: "",
      showEdit: true,
    },
    {
      key: "streetName",
      modelValue: "",
      fieldType: Input.TEXT,
      label: "Street Name",
      tag: "",
      showEdit: true,
    },
    {
      key: "streetNumber",
      modelValue: "",
      fieldType: Input.TEXT,
      label: "Street Number",
      tag: "",
      showEdit: true,
    },
    {
      key: "suburb",
      modelValue: "",
      fieldType: Input.TEXT,
      label: "Suburb",
      tag: "",
      showEdit: true,
    },
    {
      key: "gps",
      modelValue: "",
      fieldType: Input.TEXT,
      label: "GPS",
      tag: "",
      showEdit: true,
    },
    {
      key: "latitude",
      modelValue: "",
      fieldType: Input.TEXT,
      label: "Latitude",
      tag: "",
      showEdit: true,
    },
    {
      key: "longitude",
      modelValue: "",
      fieldType: Input.TEXT,
      label: "Longitude",
      tag: "",
      showEdit: true,
    },
    {
      key: "docLocation",
      modelValue: "",
      fieldType: Input.TEXT,
      label: "Doc Location",
      tag: "",
      showEdit: true,
    },
    {
      key: "unitNumber",
      modelValue: "",
      fieldType: Input.TEXT,
      label: "Unit Number",
      tag: "",
      showEdit: true,
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
    console.log("Company List ",result);
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
  
  const edit = async (item: Company) => {
    selectedCompany.value = item;
    formAccess.value.itemIndex = items.value.indexOf(item);
    // await findLocation(selectedCompany.value?.rfiD_LocationId)
    // await findStatus(selectedCompany.value?.rfiD_StatusId)
    open.value = true;
  };
  
  const save = async (item: CreateCompanyDto) => {
    console.log("Form data:", item);
    if (item !== null) {
     // isLoading.value = true;
      const {address,...rest} = item;

      if (formAccess.value.itemIndex === -1) {
        let result = await Save(item as CreateCompanyDto);
        if (result?.isSuccess) {
          items.value.unshift(result?.data);
          totalItems.value++;
        }
        isLoading.value = result?.loading;
      } else {
        
        let result = await Edit(selectedCompany?.value?.companyId!, item as CreateCompanyDto);
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
    selectedCompany.value = null;
  };
  
  const loadArchiveData = async (options: Option) => {
    isLoading.value = true;
    let result = await LoadArchives(options);
    if (result?.isSuccess) {
      archiveItems.value = result?.data?.items;
    }
    isLoading.value = result?.loading;
  };
  
  const archive = async (item: Company) => {
    selectedCompany.value = item;
    formAccess.value.itemIndex = items.value.indexOf(item);
    openConArchive.value = true;
  };
  
  const confirmArchive = async () => {
    isLoading.value = true;
    let result = await Archive(selectedCompany.value?.companyId!);
    if (result?.isSuccess) {
      archiveItems.value.unshift(selectedCompany.value);
      items.value.splice(formAccess.value.itemIndex, 1);
      totalItems.value--;
      totalArchiveItems.value++;
      closeConArchive();
    }
    isLoading.value = result?.loading;
  };
  
  const closeConArchive = () => {
    openConArchive.value = false;
    selectedCompany.value = null;
  };
  
  const restore = (item: Company) => {
    formAccess.value.itemIndex = archiveItems.value.indexOf(item);
    selectedCompany.value = item;
    openConRestore.value = true;
  };
  
  const confirmRestore = async () => {
    isLoading.value = true;
    let result = await Restore(selectedCompany.value?.companyId!);
    if (result?.isSuccess) {
      items.value.unshift(selectedCompany.value);
      archiveItems.value.splice(formAccess.value.itemIndex, 1);
      totalItems.value++;
      totalArchiveItems.value--;
      closeConRestore();
    }
    isLoading.value = result?.loading;
  };
  
  const closeConRestore = () => {
    openConRestore.value = false;
    selectedCompany.value = null;
  };
  
  const remove = (item: Company) => {
    formAccess.value.itemIndex = items.value.indexOf(item);
    selectedCompany.value = item;
    openConRemove.value = true;
  };
  
  const confirmRemove = async () => {
    isLoading.value = true;
    let result = await Remove(selectedCompany.value?.companyId!);
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
    selectedCompany.value = null;
  };
  
  const archiveClose = () => {
    formAccess.value.itemIndex = -1;
    openArchive.value = false;
  };
  
  // const serverUpload = async (event: any) => {
  //   var file = await event;
  //   var formData = new FormData();
  //   formData.append("File", file);
  //   formData.append("Name", file.name);
  //   if (file) {
  //     isLoading.value = true;
  //     const config = {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     };
  //     let result = await UploadFile(formData, config);
  
  //     if (result?.isSuccess) {
  //       setTimeout(() => {
  //         location.reload();
  //         isLoading.value = result?.loading;
  //       }, 1500);
  //     } else {
  //       isLoading.value = false;
  //     }
  //   }
  // };
  
  // const printSelected = () => {
  //   exportFile.printPdf(columns(), checkItem.value, false, "");
  // };
  
  // const downloadPdfSelected = () => {
  //   exportFile.downloadPdf(columns(), checkItem.value, false, "", "Item");
  // };
  
  // const downloadCsvSelected = () => {
  //   exportFile.downloadCsv(columns(), checkItem.value, "Item");
  // };
  
  // const printCurrentPage = () => {
  //   exportFile.printPdf(columns(), items.value, false, "");
  // };
  
  // const downloadAllCsv = async () => {
  //   await loadAllData();
  //   exportFile.downloadCsv(columns(), allitems.value, "Item");
  // };
  
  // const downloadAllPdf = async () => {
  //   await loadAllData();
  //   exportFile.downloadPdf(columns(), allitems.value, false, "", "Item");
  // };
  </script>
  