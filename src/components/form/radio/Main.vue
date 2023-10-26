<template>
  <label :class="['form-check', radioGroup?.dir === 'row' ? 'mr-2' : 'mt-0']">
    <input class="form-check-input" type="radio" :value="_value" v-model="_modelValue" />
    <span class="select-none form-check-label" v-html="label" />
  </label>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue";
import type { RadioGroup } from "./Types";

interface Props {
  label: string;
  modelValue?: any;
  value?: any;
}

const emit = defineEmits<{
  (e: "update:modelValue", val: any): void;
}>();

const { modelValue, label, value } = defineProps<Props>();

const radioGroup = inject("radio-group", undefined) as RadioGroup | undefined;

const _value = computed(() => {
  return value === undefined ? label : value;
});

const _modelValue = computed({
  get: () => {
    return radioGroup ? radioGroup?.get() : modelValue;
  },
  set: (val) => {
    radioGroup ? radioGroup.set(val) : emit("update:modelValue", val);
  },
});
</script>
