<template>
  <div class="fixed top-0 left-0 right-0 w-screen h-screen flex flex-col justify-center items-center backdrop-brightness-50 z-[2147483647]" v-if="_isLoading">
    <LoadingIcon icon="ball-triangle" color="white" class="w-12 h-12" />
    <div class="text-center text-white text-xl font-semibold mt-2">loading....</div>
  </div>
</template>

<script lang="ts" setup>
import toast from "@/utils/toast";
import { computed, toRefs, watch } from "vue";

interface Props {
  isLoading: boolean;
}

const emit = defineEmits<{
  (e: "update:isLoading", val: boolean): void;
}>();

const props = defineProps<Props>();
const { isLoading } = toRefs(props);

const _isLoading = computed({
  get() {
    return isLoading.value;
  },
  set(val) {
    emit("update:isLoading", val);
  },
});

// watch(
//   () => _isLoading.value,
//   (val) => {
//     if (val) {
//       setTimeout(() => {
//         _isLoading.value = false;
//         toast.error("Request timed out");
//       }, 120000);
//     }
//   }
// );
</script>
