<template>
  <Loading v-model:isLoading="isLoading" />

  <div class="p-4">
    <div class="flex justify-between items-center">
      <div v-if="authStore.activeUser()?.role === SuperUser">
        <Autocomplete v-model="selectRole" label="" placeholder="Select a Role" item-text="name" item-value="name" tag="" :items="allRoleList" :multiple="false" />
      </div>
      <div v-else>
        <Autocomplete v-model="selectRole" label="" placeholder="Select a Role" item-text="name" item-value="name" tag="" :items="userRoleList" :multiple="false" />
      </div>
    </div>
    <Permissions v-model:policy-names="policyNames"  v-model:selected-role-name="selectRole" v-model:selectedPolicyName="selectPolicy" />
  </div>
</template>

<script lang="ts" setup>
import { watch, reactive, watchEffect, computed, onMounted, provide, ref, inject, toRefs, onBeforeMount } from "vue";

import { injectStrict } from "@/utils/injectTyped";
import { AxiosKey } from "@/services/symbols";
import toast from "@/utils/toast";
import { useAuthUser } from "@/stores/Auth/authUser";
import Permissions from "./PermissionsContent.vue";
import { SuperUser } from "@/utils/const";
import { LoadPolicyNames, LoadRoles } from "@/services/AuthService/permissionService";

const axios = injectStrict(AxiosKey);
const isLoading = ref<boolean>(false);
const authStore = useAuthUser();

const allRoleList = ref<any[]>([]);
const userRoleList = ref<any[]>([]);
const selectRole = ref<string>("");
const selectPolicy = ref<string>("");

const user_api = axios.defaults?.baseURL!.replace("/api/", "/users-api/");

onBeforeMount(() => {
  loadAllRole();
  loadUserRole();
  loadPolicyName();
});

const loadUserRole = () => {
  var permissions: any[] = [];
  var splitArray: any[] = [];
  if (Array.isArray(authStore.activeUser()?.permissions) && authStore.activeUser()?.permissions.length > 0) {
    permissions = authStore.activeUser()?.permissions;
    permissions
      .filter((f) => f.includes("Permissions.RolePermissions."))
      .forEach((x) => {
        var splitData = x.split(".");
        splitArray.push(splitData[2]);
      });
    return (userRoleList.value = splitArray);
  } else {
    return [];
  }
};

const loadAllRole = async () => {
  let result = await LoadRoles();
  if (result?.isSuccess) {
    allRoleList.value = result?.data;
  } else {
    toast.error("Role not found");
  }
};

const policyNames = ref<any>();
const loadPolicyName = async () => {
  isLoading.value = true;

  // let result = await LoadPolicyNames();
  // if (result?.isSuccess) {
  //   if (authStore.activeUser()?.role === SuperUser) {
  //     policyNames.value = result?.data?.date;
  //   } else {
  //     if (Array.isArray(authStore.activeUser()?.permissions) && authStore.activeUser()?.permissions.length > 0) {
  //       let permissions = authStore.activeUser()?.permissions.map((x: any) => {
  //         return x.split(".")[1];
  //       });
  //       let uniqueList = Array.from(new Set(permissions));
  //       policyNames.value = result?.data?.date.filter((f: any) => uniqueList.includes(f));
  //     } else {
  //       policyNames.value = [];
  //     }

  //     if (policyNames.value.includes("RolePermissions")) {
  //       policyNames.value = policyNames.value.filter((item: any) => item !== "RolePermissions");
  //       policyNames.value.unshift("RolePermissions");
  //     }
  //   }

  //   isLoading.value = result?.loading;
  //   selectPolicy.value = policyNames.value[0];
  // } else {
  //   toast.error("Policies not found");
  // }

  await axios
    .get(user_api + "Policies")
    .then(async (response) => {
      if (response.status === 200) {
        if (authStore.activeUser()?.role === SuperUser) {
          policyNames.value = response.data;
        } else {
          if (Array.isArray(authStore.activeUser()?.permissions) && authStore.activeUser()?.permissions.length > 0) {
            let permissions = authStore.activeUser()?.permissions.map((x: any) => {
              return x.split(".")[1];
            });
            let uniqueList = Array.from(new Set(permissions));
            policyNames.value = response.data.filter((f: any) => uniqueList.includes(f));
          } else {
            policyNames.value = [];
          }

          if (policyNames.value.includes("RolePermissions")) {
            policyNames.value = policyNames.value.filter((item: any) => item !== "RolePermissions");
            policyNames.value.unshift("RolePermissions");
          }
        }

        policyNames.value.filter((v: any) =>{
          return v !== undefined;
        })
        
        const indexDefault = policyNames.value.indexOf("Default");
        const indexTenants = policyNames.value.indexOf("Tenants");
        if(indexDefault){
          policyNames.value.splice(indexDefault, 1);
        }
        if(indexTenants){
          policyNames.value.splice(indexTenants, 1);
        }
        isLoading.value = false;
        selectPolicy.value = await policyNames.value[0];
      } else {
        isLoading.value = false;
        toast.error("Policies not found");
      }
    })
    .catch((error) => {
      isLoading.value = false;
      toast.error(toast.statusMessage(error?.response?.status ? error.response.status : 500));
    });
};
</script>
