<template>
  <TransparentModal :show="show" :size="size" :backdrop="backdrop" :slideOver="slideOver" :refKey="refKey">
    <div ref="movable" class="absolute w-full bg-inherit rounded-lg">
      <div v-if="isMove" class="modal-header flex items-center justify-between cursor-move" @mousedown="dragMouseDown">
        <h2 class="font-medium text-base mr-auto">
          {{ title }}
        </h2>

        <div class="p-2 no_print">
          <XCircleIcon class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 !cursor-pointer" @click="close" />
        </div>
      </div>

      <div v-else class="modal-header flex items-center justify-between">
        <h2 class="font-medium text-base mr-auto">
          {{ title }}
        </h2>

        <div class="p-2 no_print">
          <XCircleIcon class="text-danger float-right lg:w-8 lg:h-8 md:w-7 md:h-7 w-6 h-6 !cursor-pointer" @click="close" />
        </div>
      </div>

      <slot />
    </div>
  </TransparentModal>
</template>
<script lang="ts" setup>
import { watch, reactive, watchEffect, computed, onMounted, provide, ref, inject, toRefs } from "vue";

interface Props {
  title: string;
  show: boolean;
  size: string;
  backdrop: string;
  slideOver: boolean;
  refKey: string;
  isMove?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isMove: false,
});

const emit = defineEmits<{
  // (e: "update:attribute", val: any): void;
  (e: "close"): void;
}>();

const { title, show, size, backdrop, slideOver, refKey } = toRefs(props);

const pointer1 = ref<number>(0);
const pointer2 = ref<number>(0);
const pointer3 = ref<number>(0);
const pointer4 = ref<number>(0);
const movable = ref<any>(null);

const close = () => {
  emit("close");
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

  // let elmt = this.$refs["movable-container"];
  let elmt = movable.value;
  elmt.style.top = elmt.offsetTop - pointer2.value + "px";
  elmt.style.left = elmt.offsetLeft - pointer1.value + "px";
};

const closeDragElement = () => {
  document.onmouseup = null;
  document.onmousemove = null;
};
</script>
