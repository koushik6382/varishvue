<template>
  <MoveableModal :show="isOpen" @hidden="isOpen = false" :backdrop="backdrop" :size="size" :title="title" @close="close">
    <ModalBody class="p-4 flex flex-col space-y-2">
      <div :class="`grid grid-cols-${col} gap-2 w-full`">
        <div v-for="(header, i) in headers" :key="i" class="flex flex-col space-y-2 justify-start items-start mb-5 _text-color" :class="[header?.group ? 'col-span-full' : '']">
      
          <div class="relative pt-2 w-full" v-if="groupTagList.includes(header?.groupTag)">
            <h3 class="absolute -top-1 text-base left-4 bg-white dark:bg-darkmode-600 text-black dark:text-white">
              {{ header.groupName }}
            </h3>
            <div :class="`border rounded-md border-slate-600 dark:border-white border-solid p-4 h-full grid grid-cols-${header?.cols || '2'} gap-2`">
              <div
                v-for="(group, idx) in header.group"
                :key="idx"
                :class="`flex flex-col space-y-2 items-${group?.align || 'start'} items-start mb-5 _text-color col-span-${group?.col || '1'}`"
              >
                <div class="text-left uppercase rounded-lg _bg-sp px-2 py-1">
                  {{ group.text }}
                </div>
                <div v-if="$slots[group.value]" class="break-all">
                  <slot :name="group.value" v-bind:item="infoItem" />
                </div>
                <div v-else class="break-all">
                  <template v-if="infoItem[group.value]">
                    <span class="text-center text-black dark:text-white">{{ infoItem[group.value] }}</span></template
                  >
                  <template v-else><span class="text-center text-red-600">Nill</span></template>
                </div>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="text-left uppercase rounded-lg _bg-sp px-2 py-1">
              {{ header.text }}
            </div>
            <div v-if="$slots[header.value]" class="break-all">
              <slot :name="header.value" v-bind:item="infoItem" />
            </div>
            <div v-else class="break-all">
              <template v-if="infoItem[header.value]"
                ><span class="text-center text-black dark:text-white">{{ infoItem[header.value] }}</span></template
              >
              <template v-else><span class="text-center text-red-600">Nill</span></template>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full">
        <slot name="component" />
      </div>
    </ModalBody>
    <ModalFooter class="flex space-x-3 justify-end">
      <btn color="dark" size="md" :outline="true" text-color="slate-500" @click="close" :type="ButtonType.NORMAL_BTN"> Close </btn>
    </ModalFooter>
  </MoveableModal>
</template>

<script lang="ts" setup>
import { watch, ref, toRefs, onBeforeMount, onMounted } from "vue";

import { ButtonType } from "@/components/button/ButtonType";

interface Props {
  isOpen: boolean;
  title: any;
  col: string;
  infoItem: any;
  backdrop: string;
  size: string;
  headers: any[];
}

const emit = defineEmits<{
  (e: "close"): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  title: "",
  col: "2",
  size: "modal-xl",
  backdrop: "static",
  headers: () => [],
  isSubcomponent: false,
});

const { infoItem, isOpen, backdrop, size, headers } = toRefs(props);

const close = () => {
  emit("close");
};
const setColSpan = (col: string) => {
  return [col ? `col-span-${col}` : "col-span-1"];
};

const groupTagList = ref<any[]>([]);

const collectGroupTags = () => {
  headers?.value?.forEach((x: any) => {
    if (x?.group) {
      groupTagList.value.push(x.groupTag);
    }
  });
  
};

onMounted(() => {
  collectGroupTags();
});
</script>
