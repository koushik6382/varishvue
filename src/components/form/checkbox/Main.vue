<template>
    <label :class="['form-check', (checkboxGroup?.dir === 'row' ? 'mr-2' : '')]">
        <input class="form-check-input" type="checkbox" :value="_value" v-model="_modelValue" />
        <template v-if="label">
            <span class="select-none form-check-label" v-html="label" />
        </template>
    </label>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import type { CheckboxGroup } from './Types';

interface Props {
    label: string
    modelValue?: boolean
    value?: any
}

const emit = defineEmits<{
    (e: 'update:modelValue', val: any): void
}>();

const { modelValue, label, value } = defineProps<Props>();

const checkboxGroup = inject('checkbox-group', undefined) as CheckboxGroup | undefined;

const _value = computed(() => {
    return value === undefined ? label : value
})

const _modelValue = computed({
    get: () => {
        return checkboxGroup ? checkboxGroup?.get()?.includes(_value.value) : modelValue;
    },
    set: (val) => {
        checkboxGroup ? checkboxGroup.set({ value: _value.value, checked: val })
            : emit("update:modelValue", val);
    },
});
</script>
