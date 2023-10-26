<template>
  <Loading v-model:isLoading="isLoading" />

  <div class="flex w-full">
    <div class="nav-boxed-tabs flex flex-col overflow-scroll w-1/4 h-[470px]">
      <div v-for="(item, i) in _policyNames" :key="i" class="w-full py-2 flex">
        <div
          @click="selectPolicy(item)"
          class="flex btn w-full mr-2 justify-start space-x-2 bg-slate-200 dark:bg-darkmode-400"
          :class="_selectedPolicyName === item ? 'bg-success dark:bg-primary' : 'bg-slate-200 dark:bg-darkmode-400'"
        >
          <Icon name="List" size="5" color="black" darkColor="white" />
          <div class="text-left break-words">{{ letterSpace(item) }}</div>
        </div>
      </div>
    </div>
    <div class="border bg-slate-200 dark:bg-darkmode-400 overflow-scroll w-3/4 h-[470px]">
      <div class="leading-relaxed relative w-full px-5 flex flex-col space-y-2 flex-1 bg-slate-200 dark:bg-darkmode-400">
        <div class="mb-5 border-2 shadow-md py-2 w-full font-semibold text-center bg-success dark:bg-primary" v-if="_selectedRoleName == '' || _selectedRoleName == null">
          Select Role
        </div>

        <div class="sticky top-0 z-50">
          <AllPermission v-model:items="permissionItems" v-model:roleId="roleId" v-model:roleName="_selectedRoleName" @updatePermissions="refreshPermission($event)" v-model:active="boolCheck" />
        </div>
      
        <div class="w-full grid grid-cols-3 gap-4">
          <div v-for="(item, i) in groupPermissionItems" :key="i" :class="item?.key ? 'col-span-full' : ''">
            <PermissionCard :item="item" :roleId="roleId" :roleName="_selectedRoleName"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, reactive, watchEffect, computed, onMounted, provide, ref, inject, toRefs, onBeforeMount } from "vue";

import { injectStrict } from "@/utils/injectTyped";
import { AxiosKey } from "@/services/symbols";
import toast from "@/utils/toast";
import { useAuthUser } from "@/stores/Auth/authUser";
import PermissionCard from "./PermissionCard.vue";
import AllPermission from "./AllPermission.vue";
import { GetRolePermissions } from "@/services/AuthService/permissionService";

const axios = injectStrict(AxiosKey);
const isLoading = ref<boolean>(false);
const authStore = useAuthUser();
const user_api = axios.defaults?.baseURL!.replace("/api/", "/users-api/");

interface Props {
  policyNames: any;
  selectedRoleName: string;
  selectedPolicyName: string;
}

const emit = defineEmits<{
  (e: "update:selectedPolicyName", val: any): void;
  (e: "update:selectedRoleName", val: any): void;
  (e: "update:policyNames", val: any): void;
  (e: "close"): void;
}>();

const props = defineProps<Props>();
const { policyNames, selectedRoleName, selectedPolicyName } = toRefs(props);

const _selectedPolicyName = computed({
  get() {
    return selectedPolicyName.value;
  },
  set(val) {
    emit("update:selectedPolicyName", val);
  },
});

const _selectedRoleName = computed({
  get() {
    return selectedRoleName.value;
  },
  set(val) {
    emit("update:selectedRoleName", val);
  },
});

const _policyNames = computed({
  get() {
    return policyNames.value;
  },
  set(val) {
    emit("update:policyNames", val);
  },
});

const letterSpace = (val: string) => {
  val = val.replace(/([a-z])([A-Z])/g, "$1 $2");
  val = val.replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
  return val;
};

const permissionItems = ref<any[]>([]);
const roleId = ref<any>();
const boolCheck = ref<boolean>();

const selectPolicy = async (item: any) => {
  _selectedPolicyName.value = await item;
  // if (_selectedRoleName.value != "" && _selectedRoleName.value != null) {
  //   getRolesPermissions(_selectedRoleName.value, item);
  // }
};

watch(
  () => [_selectedRoleName.value, _selectedPolicyName.value],
  ([val, pval]) => {
    if (pval !== "" && (val === "" || val === null)) {
      toast.warning("Please select a role");
    }

    if (val !== "" && val !== null) {
      getRolesPermissions(val, pval);
    } else {
      permissionItems.value = [];
    }
  }
);

const  splitLastOccurrence = (str : string, substring : any) =>{
  const lastIndex = str.lastIndexOf(substring);
  const before = str.slice(0, lastIndex);
  const after = str.slice(lastIndex + 1);
  return [before, after];
}

const groupPermissionItems = ref<any[]>([])

const getRolesPermissions = async (roleName: any, policyName: any) => {
  permissionItems.value = [];
  isLoading.value = true;

  let result = await GetRolePermissions(roleName, policyName);
  if (result?.isSuccess) {
    roleId.value = result?.data.roleId;
    permissionItems.value = result?.data.roleClaims;

    var permissionString = permissionItems.value[0].value;

     
    var splitPermission = permissionString.substring(0, permissionString.lastIndexOf("."));

    var currentStoredPermission = authStore
      .activeUser()
      ?.permissions.filter((f) => f.includes(`${splitPermission}.`))
      .map((x) => {
        return x;
      });

    var intersection = currentStoredPermission.map((m) => {
      return permissionItems.value.filter((f) => {
        return f.value === m;
      });
    });

    var finalArray = intersection.map((m) => m[0]);

    permissionItems.value = finalArray.filter((v)=> {
  return v !== undefined;
});

    let groupByValue = permissionItems.value.reduce((group, arr) => {
    const { value } = arr;
    const [before, after] = splitLastOccurrence(value, '.');
    group[before] = group[before] ?? [];
    group[before].push(arr);
    return group;
    },{})


    groupPermissionItems.value = []
    for(const [key, value] of Object.entries(groupByValue)) {
      const [before, after] = splitLastOccurrence(key, '.');
      groupPermissionItems.value.push({
        key: after,
        value : value
      });
    }
  
    var permission_result = permissionItems.value.filter((x) => x?.selected == false);
    if (permission_result.length <= 0) {
      boolCheck.value = true;
    } else {
      boolCheck.value = false;
    }
    isLoading.value = result?.loading;
  } else {
    isLoading.value = result?.loading;
  }
};

const refreshPermission = (activate : boolean) =>{
  permissionItems.value.forEach((e:any)=>{
    if(e){
      e.selected = activate;
    } 
    })
}

</script>
