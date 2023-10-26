<template>
  <MoveableModal :show="isOpen" :isMove="isMove" @hidden="isOpen = false" :backdrop="backdrop" :size="size" :title="title" @close="close">
    <ModalBody>
      <slot name="component" />
    </ModalBody>
    <ModalFooter class="flex space-x-3 justify-end no_print">
      <btn color="primary" size="md" :access="_posDisabled ? true : false" @click="next" v-if="pos">
        {{ pos }}
      </btn>
      <btn color="dark" size="md" :outline="true" :access="_negDisabled ? true : false" text-color="slate-500" @click="close" v-if="neg">
        {{ neg }}
      </btn>
    </ModalFooter>
  </MoveableModal>
</template>

<script lang="ts" setup>
import { watch, ref, toRefs, onBeforeMount, computed } from "vue";

interface Props {
  isOpen: boolean;
  title: any;
  backdrop: string;
  size: string;
  neg: string;
  pos: string;
  posDisabled: boolean;
  negDisabled: boolean;
  isMove?: boolean;
}

const emit = defineEmits<{
  (e: "update:posDisabled", val: boolean): void;
  (e: "update:negDisabled", val: boolean): void;
  (e: "close"): void;
  (e: "next", val: any): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  backdrop: "static",
  isOpen: false,
  title: "",
  size: "modal-xl",
  pos: "",
  neg: "Close",
  isMove:false
});

const { isOpen, backdrop, size, pos, neg, posDisabled, negDisabled } = toRefs(props);

const _posDisabled = computed({
  get() {
    return posDisabled.value;
  },
  set(val) {
    emit("update:posDisabled", val);
  },
});

const _negDisabled = computed({
  get() {
    return negDisabled.value;
  },
  set(val) {
    emit("update:negDisabled", val);
  },
});

const close = () => {
  emit("close");
};

const next = () => {
  emit("next", null);
};
</script>
