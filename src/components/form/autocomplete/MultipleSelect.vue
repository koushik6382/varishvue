<template>
  <div class="flex flex-col justify-start w-full">
    <div
      class="form-label mt-3 w-full flex sm:flex-row justify-between items-center space-x-2"
    >
      <span v-if="label">{{ label }}</span>
      <span
        class="sm:ml-auto px-2 pt-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md"
        v-if="tag"
      >
        {{ tag }}
      </span>
    </div>
    <div class="input-group">
      <div
        class="form-control form-control-sm border-success flex justify-start items-center space-x-2 overflow-auto "
        :class="[disabled ? 'cursor-not-allowed' : 'cursor-pointer',error === '' ? CLASS.OUTLINE_NONE : error !== true ? CLASS.OUTLINE_DANGER : CLASS.OUTLINE_SUCCESS]"
      >
        <div class="grid grid-cols-3 gap-2 items-start w-full h-9" v-if="_modelValue?.length > 0">
          <div
            v-for="(data, idx) in _modelValue"
            class="h-8 flex justify-between items-center space-x-1 bg-slate-100 dark:bg-darkmode-400 rounded-md px-2 py-1"
          >
            <div class="text-xs break-words" v-if="!isObject">{{ data }}</div>
            <div class="text-xs break-words" v-else>{{ data[itemText] }}</div>
            <div>
              <icon-button
                @click="removeSelected(idx)"
                name="Remove"
                icon="X"
                color="danger"
                size="4"
                class="z-60"
              />
            </div>
          </div>
        </div>
        <div v-else >
            <span class="text-gray-500 font-medium text-sm">{{ _placeholder }}</span>
        </div>
      </div>
      <div class="input-group-text flex items-center justify-center !bg-primary">
        <slot name="autocompleteIcons"  v-if="!loading" />
        <slot name="autocompleteLoading" v-else />
      </div>
    </div>
    <div class="text-red-600 pt-1 text-left" v-if="error !== true">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { CLASS, REGEX } from "@/utils/const";
import {
  watch,
  reactive,
  watchEffect,
  computed,
  onMounted,
  toRefs,
  inject,
  ref,
} from "vue";
interface Props {
  modelText: any;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  tag?: string;
  rule: any;
  loading? : boolean,
  isObject : boolean,
  itemText : any,
  // icon: {
  //   name: string;
  //   color: string;
  //   darkColor : string;
  //   front: boolean;
  //   back: boolean;
  // };
}

const emit = defineEmits<{
  (e: "update:modelText", val: any): void;
  (e: "removeSelected", idx: number): void;
}>();
const props = withDefaults(defineProps<Props>(), {
  modelText: [],
  label: "",
  disabled: false,
  tag: "",
  loading: false,
  itemText : 'text',
  isObject : false,
});

const { modelText, label, placeholder, disabled, tag, rule } = toRefs(props);

const _modelValue = computed({
  get() {
    return modelText.value;
  },
  set(val) {
    emit("update:modelText", val);
  },
});

const error = ref<boolean | string>("");

onMounted(() => {
  if (rule.value) {
    error.value = "";
  }
});

watch(
  () => _modelValue.value,
  (val, oldval) => {
    if (rule.value) {
      error.value = rule.value(val);
    }
  },
  { deep: true }
);

const _placeholder = computed(() => {
  return placeholder?.value === undefined ? label.value : placeholder.value;
});

const removeSelected = (index: number) => {
  emit("removeSelected", index);
};
</script>
