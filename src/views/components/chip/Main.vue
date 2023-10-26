<template>
  <div class="rounded-full text-white text-center px-2 py-1 whitespace-nowrap" :style="`background-color:${color}`">
    {{ name }}
  </div>
</template>

<script lang="ts" setup>
import { watch, ref, toRefs, onBeforeMount } from "vue";

interface Props {
  name: string | any;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  name: "",
  color: "#fff",
});

const { name, color } = toRefs(props);
</script>
