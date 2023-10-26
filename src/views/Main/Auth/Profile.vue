<template>
  <Loading v-model:isLoading="isLoading" />
  <Info v-if="_isOpen" :isOpen="_isOpen" :title="`${authStore?.activeUser()?.user}`" :infoItem="infoItem" :headers="profileHeader" col="1" size="modal-lg" @close="closeInfo">
    <!-- <template v-slot:isDiscount="{ item }">
      {{ item.value ? "Yes" : "No" }}
    </template> -->
  </Info>
</template>

<script lang="ts" setup>
import { useAuthUser } from "@/stores/Auth/authUser";
import { computed, onBeforeMount, ref, toRefs } from "vue";
import { injectStrict } from "@/utils/injectTyped";
import { AxiosKey } from "@/services/symbols";
import toast from "@/utils/toast";
import { GetUser } from "@/services/AuthService/authService";

interface Props {
  isOpen?: boolean;
}

const emit = defineEmits<{
  (e: "update:isOpen", val: boolean): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
});

const { isOpen } = toRefs(props);

// interface Profile {
//     firstName : string;
//     lastName : string;
//     userName : string;
//     email : string;
// }

interface Profile {
  firstName: string | null;
  lastName: string | null;
  userName: string | null;
}

const _isOpen = computed({
  get() {
    return isOpen.value;
  },
  set(val) {
    emit("update:isOpen", val);
  },
});

const axios = injectStrict(AxiosKey);
const authStore = useAuthUser();
const isLoading = ref<boolean>(false);
const infoItem = ref<Profile>({
  firstName: authStore.activeUser()?.firstName || null,
  lastName: authStore.activeUser()?.lastName || null,
  userName: authStore.activeUser()?.user || null,
});
// const profileHeader = [
//   { text: "First Name", value: "firstName" },
//   { text: "Last Name", value: "lastName" },
//   { text: "User Name", value: "userName" },
//    { text: "Email", value: "email" },
// ];

const profileHeader = [
  {
    groupTag: "basic",
    groupName: "Detail of User",
    cols: "3",
    group: [
      { text: "First Name", value: "firstName" },
      { text: "Last Name", value: "lastName" },
      { text: "User Name", value: "userName" },
    ],
  },
];

const closeInfo = () => {
  _isOpen.value = false;
};

// onBeforeMount(() => {
//     loadUserInfo();
// })

const loadUserInfo = async () => {
  isLoading.value = true;
  let result = await GetUser();
  if (result?.isSuccess) {
    infoItem.value = result?.data;
    isLoading.value = result?.loading;
  } else {
    isLoading.value = false;
  }
};
</script>
@/stores/Auth/authUser@/services/AuthService/authService