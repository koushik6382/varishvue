<template>
    <component :is="layout" />
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent } from 'vue';
import { useMenuStore } from '../../stores/menu';

const menuStore = useMenuStore();

const layout = computed(() => {
    switch (menuStore.layout) {
        case `simple-menu`:
            return defineAsyncComponent(() => import('../simple-menu/Main.vue'));
        case `top-menu`:
            return defineAsyncComponent(() => import('../top-menu/Main.vue'));
        default:
            return defineAsyncComponent(() => import('../side-menu/Main.vue'));
    }
})
</script>