<template>
  <button :disabled="!access" class="bg-transparent">
    <Tippy
      tag="a"
      href="javascript:;"
      class="tooltip flex justify-center items-center"
      :content="!access ? 'No access' : name"
      :options="{
        zIndex: 99999,
      }"
    >
      <div :class="`bg-${bg} rounded-${rounded} p-${padding}`">
        <Icon :name="icon" :size="size" :color="color" :darkColor="darkColor" />
      </div>
    </Tippy>
  </button>
</template>

<script lang="ts" setup>
import { toRefs, watch } from "vue";

interface Props {
  name?: string;
  icon?: string;
  color?: string;
  darkColor?: string;
  size?: string;
  access?: boolean;
  bg?: string;
  padding?: string;
  rounded?:string
}

const props = withDefaults(defineProps<Props>(), {
  name: "text",
  icon: "Info",
  color: "primary",
  darkColor: "white",
  size: "4",
  access: true,
  bg: "inherit",
  padding: "2",
  rounded:'lg'
});

const { name, icon, color, size, access } = toRefs(props);
</script>
