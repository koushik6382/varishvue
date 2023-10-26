<template>
  <!-- BEGIN: Main Color Switcher-->
  <!-- fixed right-0 bottom-8 shadow-md z-50 mb-2 mr-64-->
  <div
    class="bg-slate-100 dark:bg-darkmode-200 box border rounded-full h-12 px-5 flex  items-center justify-center ">
    <div class="mr-4 hidden sm:block text-slate-600 dark:text-slate-200">
      Color Scheme
    </div>
    <a @click="switchColorScheme('default')"
      class="block w-8 h-8 cursor-pointer bg-cyan-900 rounded-full border-4 mr-1 hover:border-slate-200" :class="{
        'border-slate-300 dark:border-darkmode-800/80':
          colorScheme == 'default',
        'border-white dark:border-darkmode-600': colorScheme != 'default',
      }"></a>
    <a @click="switchColorScheme('theme-1')"
      class="block w-8 h-8 cursor-pointer bg-blue-800 rounded-full border-4 mr-1 hover:border-slate-200" :class="{
          'border-slate-300 dark:border-darkmode-800/80':
            colorScheme == 'theme-1',
          'border-white dark:border-darkmode-600': colorScheme != 'theme-1',
        }"></a>
    <a @click="switchColorScheme('theme-2')"
      class="block w-8 h-8 cursor-pointer bg-blue-900 rounded-full border-4 mr-1 hover:border-slate-200" :class="{
          'border-slate-300 dark:border-darkmode-800/80':
            colorScheme == 'theme-2',
          'border-white dark:border-darkmode-600': colorScheme != 'theme-2',
        }"></a>
    <a @click="switchColorScheme('theme-3')"
      class="block w-8 h-8 cursor-pointer bg-emerald-900 rounded-full border-4 mr-1 hover:border-slate-200" :class="{
          'border-slate-300 dark:border-darkmode-800/80':
            colorScheme == 'theme-3',
          'border-white dark:border-darkmode-600': colorScheme != 'theme-3',
        }"></a>
    <a @click="switchColorScheme('theme-4')"
      class="block w-8 h-8 cursor-pointer bg-indigo-900 rounded-full border-4 hover:border-slate-200" :class="{
          'border-slate-300 dark:border-darkmode-800/80':
            colorScheme == 'theme-4',
          'border-white dark:border-darkmode-600': colorScheme != 'theme-4',
        }"></a>
  </div>
  <!-- END: Main Color Switcher-->
</template>

<script setup>
import { computed,onMounted } from "vue";
import { useDarkModeStore } from "@/stores/dark-mode";
import { useColorSchemeStore } from "@/stores/color-scheme";
import dom from "@left4code/tw-starter/dist/js/dom";

const darkModeStore = useDarkModeStore();
const darkMode = computed(() => darkModeStore.darkMode());
const colorSchemeStore = useColorSchemeStore();
const colorScheme = computed(() => colorSchemeStore.colorScheme);

const setColorSchemeClass = () => {
  dom("html")
    .attr("class", colorScheme.value)
    .addClass(darkMode.value ? "dark" : "");
};

const switchColorScheme = (colorScheme) => {
  colorSchemeStore.setColorScheme(colorScheme);
  setColorSchemeClass();
};

onMounted(() => {
  setColorSchemeClass();
})

</script>
