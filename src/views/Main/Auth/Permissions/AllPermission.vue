<template>
  <Loading v-model:isLoading="isLoading" />

  <div class="p-1 bg-slate-200 dark:bg-darkmode-400">
    <div class=" " v-if="_items.length > 0">
      <h2 class="text-lg font-medium mb-4">{{ _roleName ? _roleName+"'s Permissions" : "" }}</h2>

      <div class="flex justify-between items-center space-x-4 border-4 rounded-md border-primary p-4">
        <div class="flex justify-start items-start space-x-4">
          <Icon :name="IconIdentifier('All')" size="6" color="black" darkColor="white" />
          <div class="text-black dark:text-white font-semibold">
            <span> All Permissions -
              <span 
              :class="_active ? 'text-green-600': 'text-red-600'">
              {{ _active ? 'Activated': 'Deactivated' }}</span> </span>
          </div>
         
        </div>
        <ToggleSwitch v-model="_active" label="" tag="" @click="openPermission(!_active)" />
      </div>
    </div>
  </div>

  <ConfirmModal
    v-if="confirmModal"
    :value="_active ? 'Activate All Permissions' : 'Deactivate All Permissions'"
    :icon="_active ? 'ShieldCheck' : 'ShieldClose'"
    :color="_active ? 'success' : 'danger'"
    positive="Ok"
    negative="Cancel"
    :question="_active ? 'Do you really want to activate all this permission?' : 'Do you really want to deactivate all this permission?'"
    :modalOpen="confirmModal"
    :modalClose="closePermission"
    :modalConfirm="allPermissionConfirm"
  />
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
  items: any[];
  roleId: any;
  roleName: string;
  active: boolean;
}

const emit = defineEmits<{
  (e: "updatePermissions", val: any): void;
  (e: "update:items", val: any): void;
  (e: "update:roleId", val: any): void;
  (e: "update:roleName", val: any): void;
  (e: "update:active", val: boolean): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  active: false,
});
const { items, roleId, roleName, active } = toRefs(props);

const _items = computed({
  get() {
    return items.value;
  },
  set(val) {
    emit("update:items", val);
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

const _active = computed({
  get() {
    return active.value;
  },
  set(val) {
    emit("update:active", val);
  },
});

const confirmModal = ref<boolean>(false);
const activaBool = ref<boolean>(false);

const closePermission = () => {
  confirmModal.value = false;
  _active.value = !_active.value

};
const openPermission = (val: boolean) => {
  confirmModal.value = true;
  activaBool.value = val;
};
const allPermissionConfirm = async () => {
  isLoading.value = true;

  var list: any[] = [];
  _items.value.forEach((x: any) => {
    if (x) {
      list.push({
        type: x.type,
        value: x.value,
        selected: activaBool.value,
      });
    }
  });

  var payload: RolePermission = {
    roleId: _roleId.value,
    roleClaims: list,
  };

  let result = await EditRolePermission(_roleName.value, payload);
  if (result?.isSuccess) {
    toast.success(`All Permission ${activaBool.value ? 'activated' : 'deactivated'} sucessfully`);
    emit("updatePermissions", activaBool.value);
    confirmModal.value = false;
    isLoading.value = result?.loading;
  } else {
    isLoading.value = result?.loading;
  }
};
</script>
