<template>
  <component
    :is="lIcon || 'Info'"
    style="stroke-width: 2"
    class="lucide"
    :class="[`text-${color} w-${size} h-${size}`, darkColor ? `dark:text-${darkColor}` : '']"
    v-if="provider === 'lucide'"
  />
</template>
<script setup lang="ts">
import { computed, toRefs } from "vue";
import LucideIcons from "../../utils/lucide-icons";
import type { SVGProps } from "lucide-vue-next";

interface Props {
  name: any;
  size?: string;
  color?: string;
  darkColor?: string;
  provider?: string;
}

const props = withDefaults(defineProps<Props>(), {
  name: "info",
  size: "12",
  color: "primary",
  darkColor: "white",
  provider: "lucide",
});

const { name, color, darkColor, provider, size } = toRefs(props);

const lIcon = computed(() => {
  return LucideIcons[name.value as keyof SVGProps];
});
</script>
