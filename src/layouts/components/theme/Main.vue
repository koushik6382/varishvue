<template>

  <div
    :class="_isOpen ? 'bg-slate-100 dark:bg-darkmode-200 cursor-pointer shadow-md fixed right-0 bottom-8 box border rounded-full w-auto h-12 flex items-center justify-center z-50 mb-2 mr-3' 
    :
    'bg-slate-100 dark:bg-darkmode-200 cursor-pointer shadow-md fixed right-0 bottom-8 box border rounded-full w-12 h-12 flex items-center justify-center z-50 mb-2 mr-3'
    " 
    @mouseover="()=> { _isOpen = true}"
    @mouseleave="()=> { _isOpen = false}"
    >
    <div class="flex flex-row-reverse items-center justify-center">
      <div :class="_isOpen ? 'mx-2 transform hover:rotate-180 transition duration-300': 'mx-0 transform hover:rotate-0 transition duration-300'">
        <Icon name="Palette" size="8" color="primary" darkColor="white" />
      </div>
      
    <div v-show="_isOpen" class="flex flex-row-reverse space-x-1">
        <DarkModeSwitcher v-if="dark" />
        <MainColorSwitcher v-if="colorSwitch" />
        <LayoutSwitcher v-if="layoutSwitch" />
    </div>
    </div>
        
  </div>

</template>

<script lang="ts" setup>
import { watch, ref, toRefs, onBeforeMount, computed } from "vue";

import DarkModeSwitcher from "../dark-mode-switcher/Main.vue"
import MainColorSwitcher from "../main-color-switcher/Main.vue"
import LayoutSwitcher from "../layout-switcher/Main.vue"

interface Props {
  dark?: boolean;
  colorSwitch?: boolean;
  isOpen: boolean;
  layoutSwitch?:boolean
}

const emit = defineEmits<{
  (e: "update:isOpen", val: boolean): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  dark: true,
  colorSwitch: true,
  layoutSwitch: true,
});

const { dark, colorSwitch,isOpen,layoutSwitch } = toRefs(props);

const _isOpen = computed({
  get() {
    return isOpen.value;
  },
  set(val) {
    emit("update:isOpen", val);
  },
});


</script>
