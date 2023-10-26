<template>
  <div :class="`flex flex-col justify-center items-center mt-${margin} justify-self-${align}`">
    <label class="form-check form-switch">
      <input class="form-check-input" type="checkbox" id="booleanSwitch" v-model="_modelValue" :value="value" :disabled="disabled" />
      <div :class="getLabelClasses()" v-if="label || tag">
        <span v-if="label">{{ label }}</span>
        <span :class="getTagClasses()" v-html="tag" v-if="tag" />
      </div>
      <div class="text-red-600 pt-1" v-if="error !== true">{{ error }}</div>
    </label>
  </div>
</template>

<script setup lang="ts">
import { watch, reactive, watchEffect, computed, onMounted, ref, toRefs } from "vue";
interface Props {
  label: string;
  modelValue: boolean;
  rule: any;
  tag: string;
  value: any;
  disabled?: boolean;
  align: string;
  margin: string;
}

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  align: "start",
  margin: "0",
});

const { modelValue, label, rule, tag, value } = toRefs(props);

const _modelValue = computed({
  get: () => {
    return modelValue.value || value.value;
  },
  set: (val) => {
    emit("update:modelValue", val);
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

const getTagClasses = () => {
  return ["sm:ml-auto px-2 pt-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md"];
};
const getLabelClasses = () => {
  return ["form-label", "mt-3", "ml-2", tag.value ? "flex flex-col w-full sm:flex-row" : ""];
};
</script>
