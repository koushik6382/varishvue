<template>
  <Loading v-model:isLoading="isLoading" />

  <DataForm
    v-if="open"
    :isOpen="open"
    :formAccess="formAccess"
    v-model:editItem="editedItem"
    v-model:payload="payload"
    v-model:defPayload="payloadDefault"
    v-model:attributes="attributes"
    :style="formStyle"
    @save="save"
    @close="close"
  />

  <DataForm
    v-if="resetPasswordOpen"
    :isOpen="resetPasswordOpen"
    :formAccess="reserPasswordFormAcess"
    v-model:payload="resetPasswordPayload"
    v-model:defPayload="resetPasswordDefaultPayload"
    v-model:attributes="resetPasswordAttributes"
    size="modal-lg"
    :style="resetPasswordFormStyle"
    @save="resetPassword($event)"
    @close="closeResetPassword"
  />

  <div class="p-4">
    <div class="flex justify-between items-center">
      <div class="flex">
        <btn :icon="{ visible: true, name: 'Plus', size: 6, color: 'white' }" :access="AccessUtil(policyName, PermissionName.CREATE)" @click="openForm"> Add New User </btn>
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
    >
      <template v-slot:firstName="{ item }">
        <div v-if="item.firstName" class="whitespace-nowrap">{{ item.firstName }} {{ item.lastName ? item.lastName : "" }}</div>
      </template>

      <template v-slot:licenseeCode="{ item }">
        <div v-if="item.licenseeCode" class="whitespace-nowrap">
          {{ item.firstName }}
        </div>
      </template>

      <template v-slot:lockoutEnabled="{ item }">
        <!-- <ToggleSwitch v-model="item.lockoutEnabled"  @click="active(item)" label="" tag="" /> -->
        <div class="form-switch ml-3">
          <input
            @click="active(item)"
            id="booleanSwitch"
            type="checkbox"
            v-model="item.lockoutEnabled"
            :true-value="false"
            :false-value="true"
            class="form-check-input"
            :disabled="!AccessUtil(policyName, PermissionName.MODIFY)"
          />
        </div>
      </template>

      <template v-slot:action="{ item }">
        <div class="flex justify-start items-center space-x-1">
          <icon-button @click="edit(item)" name="Edit" icon="Edit" color="success" darkColor="success" size="6" :access="AccessUtil(policyName, PermissionName.MODIFY)" />
          <icon-button @click="remove(item)" name="Delete" icon="Trash2" color="danger" darkColor="danger" size="6" :access="AccessUtil(policyName, PermissionName.DELETE)" />

          <icon-button @click="getToken(item)" name="Change Password" icon="Key" color="pending" darkColor="pending" size="6" :access="AccessUtil(policyName, PermissionName.MODIFY)"/>
        </div>
      </template>
    </data-table>
  </div>

  <ConfirmModal
    v-if="openConRemove"
    :value="`User : ${editedItem?.userName}`"
    icon="Trash2"
    color="danger"
    positive="Confirm"
    negative="Cancel"
    question="Do you want to delete this account?"
    :modalOpen="openConRemove"
    :modalClose="closeConRemove"
    :modalConfirm="confirmRemove"
  />

  <ConfirmModal
    v-if="openConActive"
    :value="`User : ${editedItem?.userName}`"
    :icon="editedItem?.lockoutEnabled === true ? 'ToggleLeft' : 'ToggleRight'"
    :color="editedItem?.lockoutEnabled === true ? 'danger' : 'success'"
    :positive="editedItem?.lockoutEnabled === true ? 'Deactive' : 'Active'"
    negative="Cancel"
    :question="'Do you want to ' + (editedItem?.lockoutEnabled === true ? `deactive` : `active`) + ' this account?'"
    :modalOpen="openConActive"
    :modalClose="activeUndone"
    :modalConfirm="confirmActive"
  />
</template>

<script lang="ts" setup>
import { watch, reactive, watchEffect, computed, onMounted, provide, ref, inject, toRefs, onBeforeMount } from "vue";

import { injectStrict } from "@/utils/injectTyped";
import { AxiosKey } from "@/services/symbols";
import toast from "@/utils/toast";
import { useAuthUser } from "@/stores/Auth/authUser";
import type { CreateUser, EditUser, GetUser, UserResetPassword } from "@/Model/Auth/User";
import type FormAccess from "@/components/form/dataform/FromAccess";
import type { Option } from "@/components/data-table/Types";
import { AccessUtil } from "@/utils/permissionHelper";
import { Input } from "@/components/form/dataform/InputField";
import { REGEX } from "@/utils/const";
import { PermissionName } from "@/utils/permissionName";
import { LoadAll, ActivateUser, DeactivateUser, GenToken, LoadRoles, Load, Edit, Remove, Save, ChangePassword } from "@/services/AuthService/userService";
import exportFile from "@/views/components/export/index";
const axios = injectStrict(AxiosKey);

const isLoading = ref<boolean>(false);
const policyName = "Users";
const checkItem = ref<any[]>([]);
const pagination = ref<any>();
const allItems = ref<any>([]);
const headers = [
  { text: "Full name", value: "firstName" },
  { text: "User Name", value: "userName" },
  { text: "Email", value: "email" },
  { text: "Phone No", value: "phoneNumber" },
  { text: "Roles", value: "roles" },
  { text: "Licensee Code", value: "passcode" },
  {
    text: "Active/Deactive",
    value: "lockoutEnabled",
    format: (val: boolean) => {
      return val ? "Yes" : "No";
    },
  },
  { text: "Action", value: "action" },
];

const columns = () => {
  return headers.filter((x: any) => {
    return x.value !== "action";
  });
};

const formStyle = ref({
  cols: "grid-cols-2",
  gap: "gap-2",
});

const search = ref("");
const items = ref<any>([]);
const totalItems = ref(0);
const open = ref<boolean>(false);
const editedItem = ref<GetUser | null>();
const openConRemove = ref<boolean>(false);
const openConActive = ref<boolean>(false);
const authStore = useAuthUser();
const formAccess = ref<FormAccess>({
  save: { name: "Save", visible: true },
  edit: { name: "Save", visible: true },
  cancel: { name: "Cancel", visible: true },
  itemIndex: -1,
  createTitle: "Create User",
  editTitle: () => {
    return "Edit User : " + editedItem?.value?.userName;
  },
});

const payload = ref<CreateUser>({
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  conformPassword: "",
  phoneNumber: "",
  role: "",
});

const payloadDefault = ref<CreateUser>({
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  conformPassword: "",
  phoneNumber: "",
  role: "",
});

onBeforeMount(() => {
  loadRole();
});
const roleList = ref<any[]>([]);
const loadRole = async () => {
  isLoading.value = true;
  let result = await LoadRoles();
  if (result?.isSuccess) {
    roleList.value = result?.data;
  }
  isLoading.value = result?.loading;
};

const attributes = ref<any[]>([
  {
    key: "firstName",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "First Name",
    tag: "Required",
    rule: (val: any) => {
      return val === "" ? "First Name is Required" : !REGEX.NAME.test(val) ? "First Name is not valid" : val.length < 2 ? `minimum length is 2` : true;
    },
    showEdit: true,
  },
  {
    key: "lastName",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "Last Name",
    tag: "",
    showEdit: true,
  },
  {
    key: "username",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "User Name",
    tag: "Required",
    rule: (val: any) => {
      return val === "" ? "User Name is Required" : true;
    },
    showEdit: true,
    // condition: (val: any) => {
    //   return val ? true : false;
    // },
    // subFields: [
    //   {
    //     key: "firstName",
    //     modelValue: "",
    //     fieldType: Input.TEXT,
    //     label: "First Name",
    //     tag: "Required",
    //     rule: (val: any) => {
    //       return val === ""
    //         ? "First Name is Required"
    //         : !REGEX.NAME.test(val)
    //         ? "First Name is not valid"
    //         : val.length < 2
    //         ? `minimum length is 2`
    //         : true;
    //     },
    //     showEdit: true,
    //   },
    //   {
    //     key: "lastName",
    //     modelValue: "",
    //     fieldType: Input.TEXT,
    //     label: "Last Name",
    //     tag: "",
    //     showEdit: true,
    //   },
    // ],
  },
  {
    key: "email",
    modelValue: "",
    fieldType: Input.TEXT,
    label: "Email",
    tag: "Required",
    rule: (val: any) => {
      return val === "" ? "Email is Required" : !REGEX.EMAIL.test(val) ? "Email is not valid" : true;
    },
    showEdit: true,
  },
  {
    key: "phoneNumber",
    modelValue: "",
    fieldType: Input.PHONE,
    label: "Phone Number",
    isEdit: () => {
      return formAccess.value.itemIndex === -1 ? false : true;
    },
    tag: "",
    showEdit: true,
    rule: (val: any) => {
      let digits = val.split(/(?<=^\S+)\s/)[1] === undefined ? "" : val.split(/(?<=^\S+)\s/)[1];
      return digits === "" ? true : !REGEX.PHONENO.test(digits) ? `Phone number is not a valid` : true;
    },
  },
  {
    key: "role",
    modelValue: "",
    fieldType: Input.SELECT,
    label: "User Role",
    multiple: false,
    itemText: "name",
    itemValue: "name",
    items: roleList,
    tag: "Required",
    rule: (val: any) => {
      return val === "" ? "User role is required" : true;
    },
    showEdit: true,
  },
  {
    key: "password",
    modelValue: "",
    fieldType: Input.PASSWORD,
    label: "Password",
    tag: "Required",
    rule: (val: any) => {
      return val === "" ? "Password is Required" : val.length < 8 ? `minimum length is 8` : val.length > 12 ? `maximum length is 12` : true;
    },
    showEdit: false,
    condition: () => {
      return true;
    },
    subFields: [
      {
        key: "conformPassword",
        modelValue: "",
        fieldType: Input.PASSWORD,
        label: "Confirm Password",
        tag: "Required",
        rule: (val: any) => {
          let password = attributes.value?.find((x: any) => x.key === "password")?.modelValue;
          return val === "" ? "Confirm Password is required" : password === "" ? "Try to fill password first" : password !== val ? "Password does not match" : true;
        },
        showEdit: false,
      },
    ],
  },
]);

const resetPasswordOpen = ref<boolean>(false);

const resetPasswordFormStyle = ref({
  cols: "grid-cols-1",
  gap: "gap-2",
});

const resetPasswordPayload = ref<UserResetPassword>({
  userName: "",
  token: "",
  newPassword: "",
  conformPassword: "",
});

const resetPasswordDefaultPayload = ref<UserResetPassword>({
  userName: "",
  token: "",
  newPassword: "",
  conformPassword: "",
});

const resetPasswordAttributes = ref<any[]>([
  {
    key: "newPassword",
    modelValue: "",
    fieldType: Input.PASSWORD,
    label: "New Password",
    tag: "Required",
    rule: (val: any) => {
      return val === "" ? "Password is Required" : val.length < 6 ? `minimum length is 6` : val.length > 8 ? `maximum length is 8` : true;
    },
    showEdit: false,
    condition: () => {
      return true;
    },
    subFields: [
      {
        key: "conformPassword",
        modelValue: "",
        fieldType: Input.PASSWORD,
        label: "Confirm Password",
        tag: "Required",
        rule: (val: any) => {
          let password = resetPasswordAttributes.value?.find((x: any) => x.key === "newPassword")?.modelValue;
          return val === "" ? "Confirm Password is required" : password === "" ? "Try to fill password first" : password !== val ? "Password does not match" : true;
        },
        showEdit: false,
      },
    ],
  },
]);

const reserPasswordFormAcess = ref<FormAccess>({
  save: { name: "Change", visible: true },
  edit: { name: "", visible: true },
  cancel: { name: "Cancel", visible: true },
  itemIndex: -1,
  createTitle: "Change Password",
  editTitle: "",
});

const closeConRemove = () => {
  editedItem.value = null;
  openConRemove.value = false;
};

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
    allItems.value = result?.data?.items;
  }
  isLoading.value = result?.loading;
};

const active = (item: GetUser) => {
  formAccess.value.itemIndex = items.value.indexOf(item);
  editedItem.value = item;
  openConActive.value = true;
};

const confirmActive = async () => {
  if (!editedItem.value?.lockoutEnabled) {
    isLoading.value = true;
    let result = await ActivateUser(editedItem.value?.id!);
    if (result?.isSuccess) {
      items.value.splice(formAccess.value.itemIndex, 1, result?.data);
    }
    isLoading.value = result?.loading;
  } else {
    isLoading.value = true;
    let result = await DeactivateUser(editedItem.value?.id!);
    if (result?.isSuccess) {
      items.value.splice(formAccess.value.itemIndex, 1, result?.data);
    }
    isLoading.value = result?.loading;
  }
  activeDone();
};

const activeUndone = () => {
  editedItem.value!.lockoutEnabled = !editedItem.value?.lockoutEnabled;
  items.value.splice(formAccess.value.itemIndex, 1, editedItem.value);
  editedItem.value = null;
  formAccess.value.itemIndex = -1;
  openConActive.value = false;
};

const activeDone = () => {
  items.value.splice(formAccess.value.itemIndex, 1, editedItem.value);
  editedItem.value = null;
  formAccess.value.itemIndex = -1;
  openConActive.value = false;
};

const openForm = () => {
  open.value = true;
  formAccess.value.itemIndex = -1;
};

const edit = async (item: GetUser) => {
  editedItem.value = item;
  editedItem.value.username = item.userName;
  editedItem.value.role = item.roles;
  formAccess.value.itemIndex = items.value.indexOf(item);
  open.value = true;
};

const save = async (item: any) => {
  if (item !== null) {
    isLoading.value = true;
    if (formAccess.value.itemIndex === -1) {
      let result = await Save(item as CreateUser);
      if (result?.isSuccess) {
        items.value.unshift(result?.data);
        totalItems.value++;
      }
      isLoading.value = result?.loading;
    } else {
      let result = await Edit(editedItem?.value!.id, item as EditUser);
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
  editedItem.value = null;
  formAccess.value.itemIndex = -1;
};

const getToken = async (item: GetUser) => {
  isLoading.value = true;
  let result = await GenToken({
    userName: item?.userName,
  });
  if (result?.isSuccess) {
    resetPasswordPayload.value.token = result?.data.data;
    resetPasswordPayload.value.userName = item.userName;
    resetPasswordOpen.value = true;
  }

  isLoading.value = result?.loading;
};

const resetPassword = async (item: UserResetPassword) => {
  isLoading.value = true;
  let result = await ChangePassword(item);
  if (result?.isSuccess) {
    closeResetPassword();
  }
  isLoading.value = result?.loading;
};

const closeResetPassword = () => {
  resetPasswordOpen.value = false;
};

const remove = (user: GetUser) => {
  formAccess.value.itemIndex = items.value.indexOf(user);
  editedItem.value = user;
  openConRemove.value = true;
};

const confirmRemove = async () => {
  isLoading.value = true;
  let result = await Remove(editedItem.value?.id!);
  if (result?.isSuccess) {
    items.value.splice(formAccess.value.itemIndex, 1);
    totalItems.value--;
    closeConRemove();
  }
  isLoading.value = result?.loading;
};

const printSelected = () => {
  exportFile.printPdf(columns(), checkItem.value, false, "");
};

const downloadPdfSelected = () => {
  exportFile.downloadPdf(columns(), checkItem.value, false, "", "Customer Order");
};

const downloadCsvSelected = () => {
  exportFile.downloadCsv(columns(), checkItem.value, "Customer Order");
};

const printCurrentPage = () => {
  exportFile.printPdf(columns(), items.value, false, "");
};

const downloadAllCsv = async () => {
  await loadAllData();
  exportFile.downloadCsv(columns(), allItems.value, "Customer Order");
};

const downloadAllPdf = async () => {
  await loadAllData();
  exportFile.downloadPdf(columns(), allItems.value, false, "", "Customer Order");
};
</script>
