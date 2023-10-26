<template>
  <div v-if="_show" ref="movable" :style="`width:${width}px`" :class="`h-[${height}px] text-black dark:text-white bg-white dark:bg-darkmode-400 rounded-md absolute z-[100] cursor-move`">
    <div class="flex flex-col items-center h-full w-full">
      <div class="h-[8%] w-full flex items-center justify-between bg-slate-300 dark:bg-darkmode-200 !rounded-t-md p-1" @mousedown="dragMouseDown">
        <div class="text-black dark:text-white">{{ title }}</div>
        <Icon class="!cursor-pointer" name="X" size="8" color="danger" darkColor="red-400" @click="close()" />
      </div>

      <div :class="`w-full h-[92%] overflow-auto p-1`">
        <slot name="component" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { watch, reactive, watchEffect, computed, onMounted, provide, ref, inject, toRefs } from "vue";

interface Props {
  title?: string;
  show?: boolean;
  width?: string;
  height?: string;
}

const emit = defineEmits<{
  //(e: "update:attribute", val: any): void;
  (e: "close"): void;
  (e: "update:show", val: boolean): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: "",
  width: "350",
  height: "550"
});

const { title, show, width , height} = toRefs(props);

const _show = computed({
  get() {
    return show.value;
  },
  set(val) {
    emit("update:show", val);
  },
});

const pointer1 = ref<number>(0);
const pointer2 = ref<number>(0);
const pointer3 = ref<number>(0);
const pointer4 = ref<number>(0);
const movable = ref<any>(null);

const close = () => {
  emit("close");
  _show.value = false
};

const dragMouseDown = (e: any) => {
  e = e || window.event;
  e.preventDefault();

  pointer3.value = e.clientX;
  pointer4.value = e.clientY;

  document.onmouseup = closeDragElement;
  document.onmousemove = elementDrag;
};

const elementDrag = (e: any) => {
  e = e || window.event;
  e.preventDefault();

  pointer1.value = pointer3.value - e.clientX;
  pointer2.value = pointer4.value - e.clientY;
  pointer3.value = e.clientX;
  pointer4.value = e.clientY;
  
  let elmt = movable.value;
  elmt.style.top = (elmt.offsetTop - pointer2.value) + "px";
  elmt.style.left = (elmt.offsetLeft - pointer1.value) + "px";
};

const closeDragElement = () => {
  document.onmouseup = null;
  document.onmousemove = null;
};
</script>
