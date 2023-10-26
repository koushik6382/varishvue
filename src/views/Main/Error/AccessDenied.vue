<template>
  <div>
    <ThemeOption 
 v-model:isOpen="openTheme"
 :layoutSwitch="false"
 />
    <div class="container bg-primary dark:bg-darkmode-700">
      <!-- BEGIN: Error Page -->
      <div class="error-page flex flex-col lg:flex-row items-center justify-center h-screen text-center lg:text-left">
        <div class="-intro-x lg:mr-20">
          <img alt="" class="h-48 lg:h-auto" src="@/assets/images/access-denied-new.png" />
        </div>
        <div class="text-white mt-10 lg:mt-0">
          <div class="intro-x text-8xl font-medium">We are sorry....</div>
          <div class="intro-x text-xl lg:text-3xl font-medium mt-5">The page you are trying to access has restricted access.</div>
          <div class="intro-x text-lg mt-3 mb-4">please contact the administrator.</div>
          <btn color="success" size="lg" :type="ButtonType.NORMAL_BTN" :icon="{ visible: true, name: 'ArrowLeftCircle', size: 6, color: 'white' }" @click="redirectToPreveious"
            >Back</btn
          >

          <btn color="success" size="lg" :type="ButtonType.NORMAL_BTN" :icon="{ visible: true, name: 'Home', size: 6, color: 'white' }" @click="redirectToHome">Home</btn>

          <btn color="success" size="lg" :type="ButtonType.NORMAL_BTN" :icon="{ visible: true, name: 'LogOut', size: 6, color: 'white' }" @click="logout">Log Out</btn>
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
import { injectStrict } from "@/utils/injectTyped";
import { AxiosKey } from "@/services/symbols";
import router from "@/router";
import { useAuthUser } from "@/stores/Auth/authUser";
import { ButtonType } from "@/components/button/ButtonType";
import ThemeOption from "@/layouts/components/theme/Main.vue";
const openTheme = ref(false)
const axios = injectStrict(AxiosKey);
const authStore = useAuthUser();

const redirectToPreveious = () => {
  router.go(-1);
};

const redirectToHome = () => {
  router.push("/");
};

const logout = () => {
  authStore.logout();
};

onMounted(() => {
  dom("body").removeClass("main").removeClass("login").addClass("error-page");
});
</script>
@/stores/Auth/authUser