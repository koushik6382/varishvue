<template>
  <MoveableModal :show="isOpen" @hidden="isOpen = false" :backdrop="backdrop" :size="size" :title="title" @close="close" v-if="isOpen">
    <ModalBody class="p-4">
      <TextField
        v-model="search"
        label=""
        placeholder="Search....."
        :icon="{
          name: 'Search',
          front: true,
          back: false,
        }"
      />
      <data-table :headers="headers" :search="search" @load="loadArchive" v-model:server-items="_items" v-model:server-items-total="_totalItems" class="overflow-auto w-full">
        <template v-slot:action="{ item }">
          <div class="flex justify-start items-center space-x-1">
            <icon-button
              @click="restore(item)"
              name="Restore"
              icon="RotateCcw"
              color="success"
              darkColor="success"
              size="6"
              :access="_policyName ? AccessUtil(_policyName, PermissionName.RESTORE) : true"
            />
            <icon-button
              @click="remove(item)"
              name="Delete"
              icon="Trash2"
              color="danger"
              darkColor="danger"
              size="6"
              :access="_policyName ? AccessUtil(_policyName, PermissionName.DELETE) : true"
            />
          </div>
        </template>
      </data-table>
    </ModalBody>
  </MoveableModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRefs, watchEffect } from "vue";
import { AccessUtil } from "@/utils/permissionHelper";
import { PermissionName } from "@/utils/permissionName";

interface Props {
  isOpen?: boolean;
  headers?: any[];
  title: string;
  search?: string;
  backdrop?: string;
  size?: string;
  items?: any[];
  totalItems: number;
  loadArchive: any;
  policyName: string;
}

const emit = defineEmits<{
  (e: "restore", val: any): void;
  (e: "remove", val: any): void;
  (e: "close"): void;
  (e: "update:isLoading", val: boolean): void;
  (e: "update:items", val: any[]): void;
  (e: "update:totalItems", val: number): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  items: () => [],
  header: () => [],
  title: "",
  size: "modal-xl",
  backdrop: "static",
  policyName: "",
  totalItems: 0,
});
const { isOpen, headers, search, backdrop, size, items, title, loadArchive, policyName, totalItems } = toRefs(props);

const _items = computed({
  get() {
    return items.value;
  },
  set(val) {
    emit("update:items", val);
  },
});

const _totalItems = computed({
  get() {
    return totalItems.value;
  },
  set(val) {
    emit("update:totalItems", val);
  },
});

const _policyName = computed(() => {
  return policyName.value;
});
const close = () => {
  emit("close");
};

const restore = (item: any) => {
  emit("restore", item);
};

const remove = (item: any) => {
  emit("remove", item);
};
</script>
