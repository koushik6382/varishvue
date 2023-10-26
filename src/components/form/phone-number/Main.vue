<template>
  <label>
    <div :class="getLabelClasses()" v-if="label || tag">
      <span v-if="label">{{ label }}</span>
      <span :class="getTagClasses()" v-html="tag" v-if="tag" />
    </div>

    <div class="input-group">
      <div class="input-group-text" v-if="$slots.pre || pre">
        <slot name="pre" />
        <span v-html="pre" v-if="pre" />
      </div>
      <div class="input-group-text" v-if="icon && icon.front === true">
        <Icon :name="icon.name" size="4" color="black" />
      </div>

      <div class="flex w-full">
        <input type="hidden" :value="_combineModelValue" />
        <Autocomplete
          v-if="isCountryCode"
          v-model="countryCodeField"
          label=""
          item-text="dial_code"
          item-value="dial_code"
          :items="_countryCode"
          tag=""
          style="width: auto"
          :multiple="false"
        />
        <input :type="type" :class="getInputClasses()"  :isClear="false" :placeholder="_placeholder" :disabled="disabled" v-model="phoneNumberField" :rule="rule" style="height: 37px" />
      </div>

      <div class="input-group-text" v-if="icon && icon.back === true">
        <Icon :name="icon.name" size="4" color="black" />
      </div>
      <div class="input-group-text" v-if="$slots.post || post">
        <slot name="post" />
        <span v-html="post" v-if="post" />
      </div>
    </div>
    <div class="text-red-600 pt-1 text-left" v-if="error !== true">
      {{ error }}
    </div>
    <div class="form-help" v-html="helperText" v-if="helperText" />
    <div :class="getMessageClasses()" v-html="message" v-if="message" />
  </label>
</template>

<script setup lang="ts">
import { CLASS, REGEX } from "@/utils/const";
import { watch, reactive, watchEffect, computed, onMounted, toRefs, inject, ref, onBeforeMount } from "vue";
import CountyCode from "@/assets/json/country_codes.json";
import type { Option } from "@/components/data-table/Types";

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
  isEdit: any;
  isCountryCode: boolean;
  defCountryCode: string;
  icon: {
    name: string;
    front: boolean;
    back: boolean;
  };
}

const emit = defineEmits<{
  (e: "update:modelValue", val: any): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  label: "",
  type: "text",
  helperText: "",
  size: "",
  rounded: false,
  disabled: false,
  state: "",
  message: "",
  tag: "",
  isCountryCode: true,
  isEdit: false,
  defCountryCode: "+61", //"+679",
});

const { modelValue, label, placeholder, type, helperText, size, rounded, disabled, state, message, tag, pre, post, rule, isEdit, isCountryCode, defCountryCode } = toRefs(props);

const _countryCode = ref<any[]>(CountyCode);
const countryCodeField = ref<string>(defCountryCode.value);
const phoneNumberField = ref<string>("");
const internalError = ref<boolean | string>("false");

onBeforeMount(() => {
  if (_isEdit.value === true) {
    countryCodeField.value = _modelValue?.value.substring(0, _modelValue?.value.length - 11);
    phoneNumberField.value = _modelValue?.value.substring(_modelValue?.value.length - 10);
  }
});

const _modelValue = computed({
  get() {
    return modelValue.value;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const _isEdit = computed(() => {
  return typeof isEdit?.value === "function" ? isEdit.value() : isEdit.value;
});
const _combineModelValue = computed(() => {
  return (_modelValue.value = isCountryCode.value
    ? phoneNumberField.value
      ? countryCodeField.value + " " + phoneNumberField.value
      : ""
    : phoneNumberField.value
    ? phoneNumberField.value
    : "");
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

const getLabelClasses = () => {
  return ["form-label", "mt-3", tag.value ? "flex flex-col w-full sm:flex-row" : ""];
};

const getTagClasses = () => {
  return ["sm:ml-auto px-2 pt-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md"];
};

const getInputClasses = () => {
  return [
    "form-control rounded-none",
    getSizeClass(size.value),
    rounded.value ? "form-control-rounded" : "",
    state.value ? `border-${getStateClass(state.value)}` : "",
    error.value === "" ? CLASS.OUTLINE_NONE : error.value !== true ? CLASS.OUTLINE_DANGER : CLASS.OUTLINE_SUCCESS,
  ];
};

const getMessageClasses = () => {
  return [state.value ? `mt-2 text-${getStateClass(state.value)}` : ""];
};

const getSizeClass = (size: string) => {
  switch (size) {
    case "sm":
      return "form-control-sm";
    case "lg":
      return "form-control-lg";
    default:
      return "";
  }
};

const getStateClass = (state: string) => {
  switch (state) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "error":
      return "danger";
    default:
      return "";
  }
};
</script>
