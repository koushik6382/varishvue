<template>
    <div class="mt-3">
        <div :class="getLabelClasses()" v-if="label || tag">
            <span v-if="label">{{ label }}</span>
            <span :class="getTagClasses()" v-html="tag" v-if="tag" />
        </div>
        <div class="flex flex-col mt-2 sm:flex-row" v-if="dir?.trim() === 'row'">
            <slot />
        </div>
        
        <slot v-else />
        <div class="text-red-600 pt-1" v-if="error !== true"> {{  error }} </div>
    </div>
</template>

<script lang="ts" setup>
import { provide, ref } from 'vue'
import type { CheckboxGroup } from './Types';
import { watch, reactive, watchEffect, computed, onMounted } from "vue";
interface Props {
    modelValue: any[]
    label?: string
    dir?: string,
    rule: any,
    tag: string
}

const emit = defineEmits<{
    (e: 'update:modelValue', val: any[]): void
}>();

const { modelValue, label, dir = 'row', rule, tag } = defineProps<Props>();

const checkboxGroup: CheckboxGroup = {
    dir,
    get() {
        return modelValue;
    },
    set(val) {
        let values = (modelValue && Array.isArray(modelValue)) ? [...modelValue] : [];
        values = val.checked ? [...values, ...[val.value]] : values.filter(x => x !== val.value);

        emit('update:modelValue', values);
    },
}

const error = ref<boolean | string>("");

onMounted(() => {
    if(rule){
        error.value = "";
    }
});

watch(()=>modelValue, (val, oldval)=> {
    if(rule){
    error.value = rule(val)
    }
},{deep:true})

const getTagClasses = () => {
    return ['sm:ml-auto px-2 pt-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md']
}
const getLabelClasses = () => {
    return ['form-label', 'mt-3', (tag ? 'flex flex-col w-full sm:flex-row' : '')]
}
provide('checkbox-group', checkboxGroup);
</script>
