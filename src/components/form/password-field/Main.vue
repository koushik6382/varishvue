<template>
  <TextField
    v-bind="props"
    v-model="_modelValue"
    @event="showPassword()"
    :isClear="false"
    :type="visibility"
    :icon="{
      name: show ? 'Eye' : 'EyeOff',
      front: false,
      back: true,
    }"
  />
</template>

<script setup lang="ts">
import {
  watch,
  reactive,
  watchEffect,
  computed,
  onMounted,
  ref,
  toRefs,
} from "vue";
import { COLOR, CLASS } from "@/utils/const";

interface Props {
  modelValue: any;
  label?: string;
  placeholder?: string;
  type?: string;
  helperText?: string;
  size?: string;
  rounded?: boolean;
  disabled?: boolean;
  state?: string;
  message?: string;
  tag?: string;
  pre?: string;
  post?: string;
  rule: any;
  icon: {
    name: string;
    color: string;
    darkColor: string;
    front: boolean;
    back: boolean;
  };
}

const emit = defineEmits<{
  (e: "update:modelValue", val: any): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  label: "",
  type: "password",
  helperText: "",
  size: "",
  rounded: false,
  disabled: false,
  state: "",
  message: "",
  tag: "",
});

const {
  modelValue,
  label,
  placeholder,
  type,
  helperText,
  size,
  rounded,
  disabled,
  state,
  message,
  tag,
  pre,
  post,
  rule,
} = toRefs(props);

var visibility = ref<string>("password");
var show = ref<boolean>(false);

const _modelValue = computed({
  get() {
    return modelValue.value;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const showPassword = () => {
  show.value = !show.value;

  if (show.value) {
    visibility.value = "text";
  } else {
    visibility.value = "password";
  }
};

const error = ref<boolean | string>("");

onMounted(() => {
  if (rule) {
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
</script>
