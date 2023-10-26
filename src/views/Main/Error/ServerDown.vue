<template>
    <div>
      <ThemeOption 
 v-model:isOpen="openTheme"
 :layoutSwitch="false"
 />
      <div class="container bg-primary dark:bg-darkmode-700">
        <!-- BEGIN: Error Page -->
        <div
          class="error-page flex flex-col lg:flex-row items-center justify-center h-screen text-center lg:text-left"
        >
          <div class="-intro-x lg:mr-20">
            <img
              alt=""
              class="h-48 lg:h-auto"
              src="@/assets/images/error.png"
            />
          </div>
          <div class="text-black dark:text-white mt-10 lg:mt-0">
            <div class="intro-x text-8xl font-medium">500</div>
            <div class="intro-x text-xl lg:text-3xl font-medium mt-5">
              We are sorry...
            </div>
            <div class="intro-x text-lg mt-3">
              We having some trouble complieting your request at the moment. Please try again shortly, and if it persists let us know.
            </div>
          
            <button
              class="intro-x btn py-3 px-4 text-white border-white dark:border-white dark:text-white mt-10"
              @click="()=> { router.go(-1)}"
            >
              Back to Home
            </button>
          </div>
        </div>
        <!-- END: Error Page -->
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import DarkModeSwitcher from "@/layouts/components/dark-mode-switcher/Main.vue";
  import MainColorSwitcher from "@/layouts/components//main-color-switcher/Main.vue";
  import dom from "@left4code/tw-starter/dist/js/dom";
  import ThemeOption from "@/layouts/components/theme/Main.vue";
  import router from '@/router';
  const openTheme = ref(false)
  onMounted(() => {
    dom("body").removeClass("main").removeClass("login").addClass("error-page");
  });
  </script>
  