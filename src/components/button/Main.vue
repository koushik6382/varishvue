<template>
    <button :class="getNormalBtnClasses" @click="click" v-if="type === ButtonType.NORMAL_BTN" :disabled="!access">
        <Icon :name="icon?.name" :size="icon?.size" :color="icon?.color" :darkColor="icon?.darkColor" v-if="icon?.visible" class="mr-2" />
        <slot />
    </button>

    <button :class="getBtnClasses" @click="click" v-if="type === ButtonType.LOADING_BTN"  :disabled="!access">
        <Icon :name="icon?.name" :size="icon?.size" :color="icon?.color" :darkColor="icon?.darkColor" v-if="icon?.visible && !_loading" class="mr-2" />
        <LoadingIcon icon="oval" color="white" class="w-4 h-4 mr-2" v-if="_loading" />
        <slot />
    </button>

</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch } from 'vue';
import { ButtonType } from './ButtonType';

interface Props {
    color?: string,
    size?: string,
    type?: number,
    rounded?: boolean,
    elevated?: boolean,
    outline?: boolean,
    soft?: boolean,
    loading?: boolean,
    loadingText?: string,
    textColor? : string,
    icon? : {
        visible : boolean,
        name : string,
        size : number,
        color : string,
        darkColor : string,
    },
    access? : boolean,
}

const emit = defineEmits<{
    (e: 'update:loading', val: any): void
    (e: 'click', val: any): void
}>()

const props = withDefaults(defineProps<Props>(), {
    color : 'primary',
    type : ButtonType.NORMAL_BTN,
    size : "md",
    rounded : false,
    outline : false,
    elevated : false,
    soft : false,
    textColor : 'white',
    loading : false,
    access : true,
    loadingText : "Loading..."
});

const { 
    color, 
    size,
    type,
    rounded,
    outline,
    elevated,
    soft,
    textColor,
    icon,
    loading,
    access,
    loadingText
 } = toRefs(props);

const getNormalBtnClasses = computed(() => [
    'btn',
    colorClass.value.join('-'),
    ...(rounded.value ? ['btn-rounded'] : []),
    ...(size?.value ? [`btn-${size.value}`] : []),
    'mb-2 mr-1',
    `text-${textColor.value}`,
    'no_print'
]);

const getBtnClasses = computed(() => [
    'btn',
    colorClass.value.join('-'),
    ...(rounded.value ? ['btn-rounded'] : []),
    ...(size?.value ? [`btn-${size.value}`] : []),
    'mb-2 mr-1',
    `text-${textColor.value}`,
    'no_print'
]);

const colorClass = computed(() => [
    'btn',
    ...(outline.value ? ['outline'] : elevated.value ? ['elevated'] : []),
    color.value,
    ...(soft.value ? ['soft'] : []),
]);

let internalLoading = ref(loading.value);

let _loading = computed({
    get() {
        return internalLoading.value;
    },
    set(val) {
        internalLoading.value = val;
        emit('update:loading', val)
    }
})

watch(() => loading.value, (val) => {
    internalLoading.value = val;
})

const click = () => {
    _loading.value = true;
    emit('click', {
        stopLoading() {
            _loading.value = false
        }
    });
}

</script>
