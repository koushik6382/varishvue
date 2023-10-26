<template>
  <Loading v-model:isLoading="isLoading" />

  <div class="p-1" v-if="_item">
    <div v-if="_item?.key" class="grid grid-cols-3 gap-2">
      <div class="col-span-full text-black dark:text-white font-normal text-base">{{ _item?.key }}</div>

      <div v-for="(item,i) in _item?.value" :key="i" class="flex justify-between items-center space-x-2 border-2 border-primary p-3 rounded-md">
      <div class="flex justify-start items-start space-x-2">
        <Icon :name="IconIdentifier(item?.value)" size="6" color="black" darkColor="white" />
        <div class="flex flex-col items-start justify-center">
          <span class="font-semibold">{{ getSpace(getName(item?.value)) || "" }}</span>
        </div>
      </div>

      <ToggleSwitch v-model="item.selected" label="" tag="" @click="openPermission(!item.selected,item)" />
    </div>
    
    </div>

    <div v-else class="flex justify-between items-center space-x-2 border-2 border-primary p-3 rounded-md">
      <div class="flex justify-start items-start space-x-2">
        <Icon :name="IconIdentifier(_item?.value)" size="6" color="black" darkColor="white" />
        <div class="flex flex-col items-start justify-center">
          <span class="font-semibold">{{ permissionName }}</span>
        </div>
      </div>

      <ToggleSwitch v-model="_item.selected" label="" tag="" @click="openPermission(!_item.selected)" />
    </div>
  </div>

  <template v-if="_item?.key">
    <ConfirmModal
    v-if="confirmModal"
    :value="groupItem.selected ? `Activate : ${getName(groupItem?.value)}` : `Deactivate : ${getName(groupItem?.value)}`"
    :icon="groupItem.selected ? 'ShieldCheck' : 'ShieldClose'"
    :color="groupItem.selected ? 'success' : 'danger'"
    positive="Ok"
    negative="Cancel"
    :question="groupItem.selected ? `Do you really want to activate ${getName(groupItem?.value)} permission?` : `Do you really want to deactivate ${getName(groupItem?.value)} permission?`"
    :modalOpen="confirmModal"
    :modalClose="closePermission"
    :modalConfirm="permissionItemConfirm"
  />
  </template>
<template v-else>
  <ConfirmModal
    v-if="confirmModal"
    :value="_item.selected ? `Activate : ${getName(_item?.value)}` : `Deactivate : ${getName(_item?.value)}`"
    :icon="_item.selected ? 'ShieldCheck' : 'ShieldClose'"
    :color="_item.selected ? 'success' : 'danger'"
    positive="Ok"
    negative="Cancel"
    :question="_item.selected ? `Do you really want to activate ${getName(_item?.value)} permission?` : `Do you really want to deactivate ${getName(item?.value)} permission?`"
    :modalOpen="confirmModal"
    :modalClose="closePermission"
    :modalConfirm="permissionItemConfirm"
  />
</template>

 
</template>

<script lang="ts" setup>
import { watch, reactive, watchEffect, computed, onMounted, provide, ref, inject, toRefs, onBeforeMount } from "vue";

import { injectStrict } from "@/utils/injectTyped";
import { AxiosKey } from "@/services/symbols";
import toast from "@/utils/toast";
import { useAuthUser } from "@/stores/Auth/authUser";
import { IconIdentifier } from "@/Model/Auth/PermissionIcons";
import type { RolePermission } from "@/Model/Auth/RolePermission";
import { EditRolePermission } from "@/services/AuthService/permissionService";

const axios = injectStrict(AxiosKey);
const isLoading = ref<boolean>(false);
const authStore = useAuthUser();
const user_api = axios.defaults?.baseURL!.replace("/api/", "/users-api/");

interface Props {
  item: any;
  roleId: any;
  roleName: any;
}

const emit = defineEmits<{
  (e: "update:item", val: any): void;
  (e: "update:roleId", val: any): void;
  (e: "update:roleName", val: any): void;
}>();

const props = defineProps<Props>();
const { item, roleId, roleName } = toRefs(props);

const _item = computed({
  get() {
    return item.value;
  },
  set(val) {
    emit("update:item", val);
  },
});

const _roleId = computed({
  get() {
    return roleId.value;
  },
  set(val) {
    emit("update:roleId", val);
  },
});

const _roleName = computed({
  get() {
    return roleName.value;
  },
  set(val) {
    emit("update:roleName", val);
  },
});

const confirmModal = ref<boolean>(false);
const activaBool = ref<boolean>(false);
const groupItem = ref<any>({});
const getName = (value: any) => {
  const index = value.lastIndexOf(".");
  const name = value.slice(index + 1);
  return name;
};
const getSpace = (value: any) => {
  const name = value.replace(/([A-Z])/g, " $1").trim();
  return name;
};

const closePermission = () => {
  confirmModal.value = false;
  _item.value.selected = !activaBool.value;
  if(_item?.value?.key){
    groupItem.value.selected = !activaBool.value;
  }
};
const openPermission = (val: boolean,item?: any) => {
  if(_item?.value?.key){
    groupItem.value = item;
  }
  confirmModal.value = true;
  activaBool.value = val;

};

const permissionName = computed(()=>{
  return !_item?.value?.key ? _item?.value.value ? getSpace(getName(_item?.value.value)): "" : ""
})
const permissionItemConfirm = async () => {
  isLoading.value = true;
  confirmModal.value = false;

  if(_item?.value?.key){
    var payload: RolePermission = {
    roleId: _roleId.value,
    roleClaims: [
      {
        type: groupItem.value.type,
        value: groupItem.value.value,
        selected: activaBool.value,
      },
    ],
  };

  let result = await EditRolePermission(_roleName.value, payload);
  if (result?.isSuccess) {
    toast.success(`Permission ${_item?.value ? ' : '+permissionName.value : ""} ${_item.value.selected ? 'activated ' : 'deactivated '} successfully`);
    isLoading.value = result?.loading;
  } else {
    isLoading.value = result?.loading;
  }
  }
  else{
    var payload: RolePermission = {
    roleId: _roleId.value,
    roleClaims: [
      {
        type: _item.value.type,
        value: _item.value.value,
        selected: activaBool.value,
      },
    ],
  };

  let result = await EditRolePermission(_roleName.value, payload);
  if (result?.isSuccess) {
    toast.success(`Permission ${_item?.value ? ' : '+permissionName.value : ""} ${_item.value.selected ? 'activated ' : 'deactivated '} successfully`);
    isLoading.value = result?.loading;
  } else {
    isLoading.value = result?.loading;
  }
  }


};

</script>
