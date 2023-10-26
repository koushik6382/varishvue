<template>
  <Modal :show="_modalOpen" @hidden="_modalOpen = false" backdrop="static">
    <ModalBody class="p-1">
      <div class="p-8 text-center flex flex-col space-y-1 justify-center items-center">
        <!-- <component :is="icon" :class="`${color} w-16 h-16 mx-auto mt-1`" /> -->
        <Icon :name="icon" size="16" :color="color" :darkColor="color" />
        <div class="text-3xl mt-3">Are you sure?</div>
        <div class="text-xl font-bold mt-5 whitespace-normal">{{ value }}</div>
        <div class="text-slate-500 text-base mt-2">
          {{ question }}
        </div>
        <slot name="component" />
      </div>
    </ModalBody>
    <ModalFooter class="text-center">
      <btn :color="color" size="lg" text-color="slate-500" :outline="true" @click="modalClose" :type="ButtonType.NORMAL_BTN">
        {{ negative }}
      </btn>
      <btn :color="color" size="lg" @click="modalConfirm" :type="ButtonType.NORMAL_BTN">
        {{ positive }}
      </btn>
    </ModalFooter>
  </Modal>
</template>
<script lang="ts" setup>
import { watch, reactive, watchEffect, ref, computed, provide } from "vue";
import { ButtonType } from "../button/ButtonType";

interface Props {
  value: string;
  icon: string;
  color: string;
  positive: string;
  negative: string;
  question: string;
  modalOpen: boolean;
  modalConfirm: Function;
  modalClose: Function;
}

const { value, icon, color, positive, negative, question, modalOpen, modalClose } = defineProps<Props>();

const _modalOpen = computed(() => {
  return modalOpen;
});

watch(
  () => _modalOpen,
  (val) => {
    val || close();
  }
);

const close = () => {
  return modalClose;
};
// export default {
//   props: {
//     name: "",
//     icon: "",
//     color: "",
//     nameBtn: "",
//     question: "",
//     modalStatus: false,
//     modalConfirm: Function,
//     modalClose: Function,
//   },
//   computed: {
//     _modalStatus: {
//       get() {
//         return this.modalStatus;
//       },
//     },
//   },
//   watch: {
//     _modalStatus(val) {
//       val || this.modalClose();
//     },
//   },
//   created() {},

//   methods: {
//     modalClose() {
//       return this.modalClose();
//     },
//   },
// };
</script>
