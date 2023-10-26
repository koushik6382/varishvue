<template>
  <!-- BEGIN: Layout Switcher-->
  <!-- shadow-md fixed bottom-0 right-0 bottom-8 z-50 mb-2 mr-[536px] -->
  <div
    class="bg-slate-100 dark:bg-darkmode-200 dark-mode-switcher cursor-pointer box border rounded-full h-12 flex items-center justify-center">

    <div class="flex mx-6">
      <div class="form-check mr-3">
        <input id="side-menu" class="form-check-input" type="radio" name="layout" value="side-menu" v-model="layout" />
        <label for="side-menu" class="form-check-label text-slate-600 dark:text-slate-200 select-none">Side
          Menu</label>
      </div>
      <div class="form-check mr-3">
        <input id="top-menu" class="form-check-input" type="radio" name="layout" value="top-menu" v-model="layout" />
        <label for="top-menu" class="form-check-label text-slate-600 dark:text-slate-200 select-none">Top
          Menu</label>
      </div>
      <div class="form-check mr-3">
        <input id="simple-menu" class="form-check-input" type="radio" name="layout" value="simple-menu"
          v-model="layout" />
        <label for="simple-menu" class="form-check-label text-slate-600 dark:text-slate-200 select-none">Simple
          Menu</label>
      </div>
    </div>
  </div>
  <!-- END: Layout Switcher-->
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMenuStore } from "@/stores/menu";
import dom from "@left4code/tw-starter/dist/js/dom";

const menuStore = useMenuStore();
const layout = computed({
  get() {
    return menuStore.layout;
  }, set(val) {
    menuStore.setLayout(val);
  }
});
</script>
