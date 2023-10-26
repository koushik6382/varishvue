<template>
  <div>
 <ThemeOption 
 v-model:isOpen="openTheme"
 :layoutSwitch="false"
 />
    <Loading v-model:isLoading="isLoading" />
    <div class="container sm:px-10">
      <div class="block xl:grid grid-cols-2 gap-4">
        <!-- BEGIN: Login Info -->
        <div class="hidden xl:flex flex-col min-h-screen">
          <div class="my-auto">
            <img alt="trubrands logo" class="-intro-x w-1/2 -mt-16" src="@/assets/images/trubrandslogo.png" />

            <div class="flex">
              <div class="justify-self-start"></div>
            </div>
            <div class="-intro-x text-white font-medium text-4xl leading-tight mt-4">
              myReceivals <br />
              your Inventory Management Solution
            </div>
            <div class="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">Manage all your warehouse operations in one place</div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0 p-4">
          <div
            class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto"
          >
            <a href="" class="-intro-x flex items-center pb-8 justify-center xl:justify-end">
              <img alt="trubrands logo" class="logo__image w-64 h-36 rounded-xl bg-white object-fill object-center px-0 py-2" src="@/assets/images/trubrandslogo.png" />
            </a>
            <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">Sign In</h2>
            <div class="intro-x mt-2 text-slate-400 xl:hidden text-center">A few more clicks to sign in to your account. Manage all your e-commerce accounts in one place</div>
            <div class="intro-x mt-8">
              <TextField v-if="!isLogin" v-model:modelValue="payload.username" label="Username" tag="Required" :rule="rule.username" :disabled="false" />
              <PasswordField v-if="!isLogin" v-model:modelValue="payload.password" label="Password" tag="Required" :rule="rule.password" :disabled="false" />

              <autocomplete v-if="isLogin" label="Licensee" v-model="selectloadLicensee" item-text="companyName" item-value="companyName" :resultObj="true" :items="licensees" />
            </div>
            <!-- <div class="intro-x flex text-slate-600 dark:text-slate-500 text-xs sm:text-sm mt-4">
              <div class="flex items-center mr-auto">
                <input id="remember-me" type="checkbox" v-model="isRememberMe" class="form-check-input border mr-2" />
                <label class="cursor-pointer select-none" for="remember-me">Remember me</label>
              </div>
              <a class="text-info" href="">Forgot Password?</a>
              <div class="text-blue-600 shadow-2xl"></div>
            </div> -->
            <div class="intro-x mt-2 xl:mt-4 text-center xl:text-left">
              <button v-if="!isLogin" class="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top" @click="login">Login</button>
              <!-- <button v-if="isLogin" class="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top" @click="nextStep">Login</button> -->
              <!-- <button class="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top">Register</button> -->
            </div>

            <div class="intro-x mt-5 xl:mt-10 text-slate-600 dark:text-slate-500 text-center xl:text-left">
              By signing in, you agree to our
              <a class="text-primary dark:text-slate-200" href="">Terms and Conditions</a>
              &
              <a class="text-primary dark:text-slate-200" href="">Privacy Policy</a>
            </div>
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
  <Footer />
</template>

<script lang="ts" setup>
import { watch, reactive, watchEffect, computed, onMounted, provide, ref, inject, toRefs } from "vue";

import type Auth from "@/Model/Auth/auth";
import dom from "@left4code/tw-starter/dist/js/dom";
import { injectStrict } from "@/utils/injectTyped";
import { AxiosKey } from "@/services/symbols";
import type { Option } from "@/components/data-table/Types";
import toast from "@/utils/toast";
import { useAuthUser } from "@/stores/Auth/authUser";
import router from "@/router";
import { URLS } from "@/utils/urls";
import ThemeOption from "@/layouts/components/theme/Main.vue";
import Footer from "@/views/components/Footer/Main.vue"

const axios = injectStrict(AxiosKey);
const signalRConnection = inject("signalrhub") as SignalR;
onMounted(() => {
  dom("body").removeClass("main").removeClass("error-page").addClass("login");
});
const isLoading = ref<boolean>(false);

const openTheme = ref<boolean>(false);
const payload = ref<Auth>({
  username: "",
  password: "",
  // username: "Nick",
  // password: "Nick@123",
});

const payloadDefault = ref<Auth>({
  username: "",
  password: "",
});

const selectloadLicensee = ref<any>("");
const licensees = ref<any>();
const isLogin = ref<boolean>(false);

const rule = ref<any>({
  username: (val: any) => {
    return val === "" ? "User name is Required" : true;
  },
  password: (val: any) => {
    return val === "" ? "Password is Required" : true;
  },
});

const authStore = useAuthUser();

const login = async () => {
  isLoading.value = true;
  await authStore
    .login(payload.value)
    .then(async (response: any) => {
      if (response?.isSuccess) {
        toast.success(
          `Welcome ${authStore?.activeUser()?.firstName ? authStore?.activeUser()?.firstName : ``} ${
            authStore?.activeUser()?.firstName ? authStore?.activeUser()?.lastName : ``
          } \n You are Logged In as ${authStore?.activeUser()?.user}`
        );
       

        router.push(`${URLS.DEFAULT}`);
        // if (authStore?.activeUser()?.role === "SuperUser") {
        //   //licensees.value = authStore?.activeUser()?.licenseeList;
        //   isLogin.value = true;
        // } else {

        //   if (loginBefore() === true) {
        //     toast.success(
        //       `Welcome ${authStore?.activeUser()?.firstName ? authStore?.activeUser()?.firstName : ``} ${
        //         authStore?.activeUser()?.firstName ? authStore?.activeUser()?.lastName : ``
        //       } \n You are Logged In as ${authStore?.activeUser()?.user}`
        //     );
        //     router.push(`${URLS.DEFAULT}`);
        //     isLogin.value = false;
        //   }
        // }
      }
    })
    .catch((error) => {
      toast.error(toast.statusMessage(error?.response?.status ? error.response.status : 500));
    })
    .finally(() => {
      isLoading.value = false;
    });
};

// const loginBefore = () => {
//   var isDone = false;
//   if (authStore?.activeUser()?.sectionList?.length <= 0) {
//     toast.error("There is no Storage Section found, please contact the administrator");
//     isDone = false;
//   } else if (authStore?.activeUser()?.typeList?.length <= 0) {
//     toast.error("There is no Storage Type found, please contact the administrator");
//     isDone = false;
//   } else if (authStore?.activeUser()?.blocktypeList?.length <= 0) {
//     toast.error("There is no Storage BlockType found, please contact the administrator");
//     isDone = false;
//   } else {
//     isDone = true;
//   }
//   return isDone;
// };

// const nextStep = () => {
//   if (authStore?.activeUser()?.licensee) {
//     if (loginBefore() === true) {
//       toast.success(
//         `Welcome ${authStore?.activeUser()?.firstName ? authStore?.activeUser()?.firstName : ``} ${
//           authStore?.activeUser()?.firstName ? authStore?.activeUser()?.lastName : ``
//         } \n You are Logged In as ${authStore?.activeUser()?.user}`
//       );
//       router.push(`${URLS.DEFAULT}`);
//     }
//   } else {
//     toast.error("Please select a licensee");
//   }
// };

// watch(
//   () => selectloadLicensee.value,
//   (val) => {
//     if (val) {
//       authStore.updatelicensee(val);
//       if (authStore?.activeUser()?.licensee) {
//         let base_url: string = "https://" + authStore?.activeUser()?.licensee.domain + "/api/";
//         authStore.setBaseUrl(base_url);
//         axios.defaults.baseURL = base_url;
//       }
//     }
//   },
//   { deep: true }
// );
</script>
@/stores/Auth/authUser