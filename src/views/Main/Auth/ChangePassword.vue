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
          <a href="" class="-intro-x flex items-center pt-5">
            <img
              v-if="authStore.activeUser()?.softClientLogo !== null"
              alt="softClient"
              class="logo__image w-62 h-16 rounded-xl bg-white object-fill object-center px-4 py-2"
              :src="`${baseurl}${authStore.activeUser()?.softClientLogo}`"
            />
            <!-- <img
              v-else
              :alt="authStore.activeUser()?.licensee?.companyName"
              class="logo__image w-62 h-16 rounded-xl bg-white object-fill object-center px-4 py-2"
              :src="`${baseurl}${authStore.activeUser()?.licensee?.logo}`"
            /> -->
          </a>
          <div class="my-auto">
            <img alt="Midone Tailwind HTML Admin Template" class="-intro-x w-1/2 -mt-16" src="@/assets/images/reset-pass.png" />
            <div class="-intro-x text-white font-medium text-4xl leading-tight mt-10">Change Your Password</div>
            <div class="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">myWarehouse - your inventory solution</div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0 p-4">
          <div
            class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto"
          >
            <h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">Change Password</h2>
            <div class="intro-x mt-2 text-slate-400 xl:hidden text-center">Manage all your warehouse operations in one place</div>
            <div class="intro-x mt-8">
              <Fields :attributes="_attributes" :itemIndex="-1" />
            </div>
            <div class="intro-x mt-5 xl:mt-8 text-center xl:text-left">
              <button class="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top" @click="change">Change</button>
              <button
                class="btn btn-outline-secondary py-3 px-4 w-full xl:w-32 mt-3 xl:mt-0 align-top"
                @click="
                  () => {
                    router.go(-1);
                  }
                "
              >
                Go Back
              </button>
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

import DarkModeSwitcher from "../../../layouts/components/dark-mode-switcher/Main.vue";
import MainColorSwitcher from "../../../layouts/components/main-color-switcher/Main.vue";
import dom from "@left4code/tw-starter/dist/js/dom";
import { injectStrict } from "@/utils/injectTyped";
import { AxiosKey } from "@/services/symbols";
import type { Option } from "@/components/data-table/Types";
import toast from "@/utils/toast";
import { useAuthUser } from "@/stores/Auth/authUser";
import router from "@/router";
import { URLS } from "@/utils/urls";
import { Input } from "@/components/form/dataform/InputField";
import AssignUtil from "@/utils/objectAssignUtil";
import { ChangeUserPassword } from "@/services/AuthService/authService";
import ThemeOption from "@/layouts/components/theme/Main.vue";
import Footer from "@/views/components/Footer/Main.vue"

const axios = injectStrict(AxiosKey);
const openTheme = ref(false)
onMounted(() => {
  dom("body").removeClass("main").removeClass("error-page").addClass("login");
});

const emit = defineEmits<{
  (e: "update:attributes", val: any): void;
}>();

const isLoading = ref<boolean>(false);
const baseurl = axios.defaults?.baseURL!.replace("/api/", "/");

interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  conformPassword: string;
}

const payload = ref<ChangePassword>({
  currentPassword: "",
  newPassword: "",
  conformPassword: "",
});

const payloadDefault = ref<ChangePassword>({
  currentPassword: "",
  newPassword: "",
  conformPassword: "",
});

const _attributes = computed({
  get() {
    return attributes.value;
  },
  set(val) {
    emit("update:attributes", val);
  },
});

const attributes = ref<any[]>([
  {
    key: "currentPassword",
    modelValue: "",
    fieldType: Input.PASSWORD,
    label: "Current Password",
    tag: "Required",
    rule: (val: any) => {
      return val === "" ? "Current Password is Required" : val.length < 6 ? `minimum length is 6` : val.length > 8 ? `maximum length is 8` : true;
    },
    showEdit: false,
  },
  {
    key: "newPassword",
    modelValue: "",
    fieldType: Input.PASSWORD,
    label: "New Password",
    tag: "Required",
    rule: (val: any) => {
      return val === "" ? "New Password is Required" : val.length < 6 ? `minimum length is 6` : val.length > 8 ? `maximum length is 8` : true;
    },
    showEdit: false,
    condition: () => {
      return true;
    },
    subFields: [
      {
        key: "conformPassword",
        modelValue: "",
        fieldType: Input.PASSWORD,
        label: "Confirm Password",
        tag: "Required",
        rule: (val: any) => {
          let password = attributes.value?.find((x: any) => x.key === "newPassword")?.modelValue;
          return val === "" ? "Confirm Password is required" : password === "" ? "Try to fill password first" : password !== val ? "Password does not match" : true;
        },
        showEdit: false,
      },
    ],
  },
]);

const authStore = useAuthUser();
const change = async () => {
  let rules: any[] = [];

  _attributes.value.forEach((e: any) => {
    if (e?.rule!) {
      rules.push({
        modelValue: e.modelValue,
        rule: e?.rule,
        key: e.key,
      });
    }

    if (e?.subFields?.length > 0 && e?.condition(e.modelValue)) {
      e?.subFields?.map((s: any) => {
        if (s?.rule!) {
          return rules.push({
            modelValue: s.modelValue,
            rule: s?.rule,
            key: s.key,
          });
        }
      });
    }
  });

  let isFilled = rules.every((e: any) => {
    let error = e.rule(e.modelValue);
    if (error !== true) {
      toast.error(error);
    }
    return error !== true ? false : true;
  });

  if (isFilled) {
    isLoading.value = true;
    AssignUtil.Set(payload.value, _attributes.value);
    let result = await ChangeUserPassword(payload.value);
    if (result?.isSuccess) {
      isLoading.value = result?.loading;
    } else {
      isLoading.value = false;
    }
    setDefault();
  }
};

const setDefault = () => {
  payload.value = Object.assign({}, payloadDefault.value);
};
</script>
@/stores/Auth/authUser@/services/AuthService/authService