<template>
  <Loading v-model:isLoading="isLoading" />
  <Profile v-model:isOpen="openProfile" />
  <!-- BEGIN: Top Bar -->
  <div
    class="top-bar-boxed h-[70px] md:h-[65px] z-[51] border-b border-white/[0.08] mt-12 md:mt-0 -mx-3 sm:-mx-8 md:-mx-0 px-3 md:border-b-0 relative md:fixed md:inset-x-0 md:top-0 sm:px-8 md:px-10 md:pt-10 md:bg-gradient-to-b md:from-slate-100 md:to-transparent dark:md:from-darkmode-700"
  >
    <div class="h-full flex items-center">
      <!-- BEGIN: Logo -->
      <a href="" class="logo -intro-x hidden md:flex xl:w-[180px] block">
        <img alt="trubrands logo" class="logo__image w-44 h-12 rounded-xl bg-white object-fill object-center px-1.5 py-0.5" src="@/assets/images/trubrandslogo.png" />
        <!-- <img
          v-else
          :alt="authStore.activeUser()?.licensee?.companyName"
          class="logo__image w-44 h-12 rounded-xl bg-white object-fill object-center px-4 py-2"
          :src="`${baseurl}${authStore.activeUser()?.licensee?.logo}`"
        /> -->
      </a>
      <!-- END: Logo -->
      <!-- BEGIN: Breadcrumb -->
      <nav aria-label="breadcrumb" class="-intro-x h-[45px] mr-auto">
        <ol class="breadcrumb breadcrumb-light">
          <li class="breadcrumb-item text-xl">{{ _menuTitle }}</li>
        </ol>
      </nav>
      <!-- END: Breadcrumb -->
      <!-- BEGIN: Search -->
      <div class="intro-x relative mr-3 sm:mr-6 flex space-x-2">
        <!-- <div class="search hidden sm:block">
          <input
            type="text"
            class="search__input form-control border-transparent"
            placeholder="Search..."
            @focus="showSearchDropdown"
            @blur="hideSearchDropdown"
          />
          <SearchIcon class="search__icon dark:text-slate-500" />
        </div>
        <a class="notification notification--light sm:hidden" href="">
          <SearchIcon class="notification__icon dark:text-slate-500" />
        </a>
        <div class="search-result" :class="{ show: searchDropdown }">
          <div class="search-result__content">
            <div class="search-result__content__title">Pages</div>
            <div class="mb-5">
              <a href="" class="flex items-center">
                <div
                  class="w-8 h-8 bg-success/20 dark:bg-success/10 text-success flex items-center justify-center rounded-full"
                >
                  <InboxIcon class="w-4 h-4" />
                </div>
                <div class="ml-3">Mail Settings</div>
              </a>
              <a href="" class="flex items-center mt-2">
                <div
                  class="w-8 h-8 bg-pending/10 text-pending flex items-center justify-center rounded-full"
                >
                  <UsersIcon class="w-4 h-4" />
                </div>
                <div class="ml-3">Users & Permissions</div>
              </a>
              <a href="" class="flex items-center mt-2">
                <div
                  class="w-8 h-8 bg-primary/10 dark:bg-primary/20 text-primary/80 flex items-center justify-center rounded-full"
                >
                  <CreditCardIcon class="w-4 h-4" />
                </div>
                <div class="ml-3">Transactions Report</div>
              </a>
            </div>
            <div class="search-result__content__title">Users</div>
            <div class="mb-5">
              <a
                v-for="(faker, fakerKey) in $_.take($f(), 4)"
                :key="fakerKey"
                href
                class="flex items-center mt-2"
              >
                <div class="w-8 h-8 image-fit">
                  <img
                    alt="Enigma Tailwind HTML Admin Template"
                    class="rounded-full"
                    :src="faker.photos[0]"
                  />
                </div>
                <div class="ml-3">{{ faker.users[0].name }}</div>
                <div
                  class="ml-auto w-48 truncate text-slate-500 text-xs text-right"
                >
                  {{ faker.users[0].email }}
                </div>
              </a>
            </div>
            <div class="search-result__content__title">Products</div>
            <a
              v-for="(faker, fakerKey) in $_.take($f(), 4)"
              :key="fakerKey"
              href
              class="flex items-center mt-2"
            >
              <div class="w-8 h-8 image-fit">
                <img
                  alt="Enigma Tailwind HTML Admin Template"
                  class="rounded-full"
                  :src="faker.images[0]"
                />
              </div>
              <div class="ml-3">{{ faker.products[0].name }}</div>
              <div
                class="ml-auto w-48 truncate text-slate-500 text-xs text-right"
              >
                {{ faker.products[0].category }}
              </div>
            </a>
          </div>
        </div> -->

        <!-- <Switcher
          v-if="authStore.activeUser().role === SuperUser"
          v-model:list="licenseeList"
          :storedData="storedLicensee"
          switchName="Licensee"
          value="companyName"
          @change="switchLicensee($event)"
        />

        <Switcher v-model:list="storedWarehouseList" :storedData="storedWaregouse" switchName="Warehouse" value="abbreviation" @change="switchWarehouse($event)" /> -->
      </div>

      <div class="intro-x mr-4 sm:mr-6 flex items-center spaxe-x-2">
        <!-- <div>
          <icon-button v-if="currentGlobe" name="Connected" icon="Globe" color="green-600" darkColor="green-600" size="6" :access="true" />
          <icon-button v-else @click="reconectSocket()" name="No Connection" icon="Globe" color="danger" darkColor="danger" size="6" :access="true" />
        </div> -->

        <!-- <div>
          <icon-button v-if="currentPrinter" @click="destroy()" name="Online" icon="Printer" color="green-600" darkColor="green-600" size="6" :access="true" />
          <icon-button v-else @click="reconect()" name="Offline" icon="Printer" color="danger" darkColor="danger" size="6" :access="true" />
        </div> -->
      </div>

      <WModel v-if="openPrinter" :isOpen="openPrinter" :title="`Select Device`" size="modal-sm" :posDisabled="true" :negDisabled="true" @close="closePrinter">
        <template v-slot:component>
          <div class="flex space-x-2 items-center w-full justify-center">
            <div>{{ _printerTxt }}</div>
            <toggleSwitch label="" v-model="isPort" />
          </div>
        </template>
      </WModel>

      <!-- END: Search -->
      <!-- BEGIN: Notifications -->
      <!-- <Dropdown class="intro-x mr-4 sm:mr-6">
        <DropdownToggle tag="div" role="button" class="notification notification--bullet cursor-pointer">
          <BellIcon class="notification__icon dark:text-slate-500" />
        </DropdownToggle>
        <DropdownMenu class="notification-content pt-2">
          <DropdownContent tag="div" class="notification-content__box">
            <div class="notification-content__title">Notifications</div>
            <div v-for="(faker, fakerKey) in $_.take($f(), 5)" :key="fakerKey" class="cursor-pointer relative flex items-center" :class="{ 'mt-5': fakerKey }">
              <div class="w-12 h-12 flex-none image-fit mr-1">
                <img alt="Enigma Tailwind HTML Admin Template" class="rounded-full" :src="faker.photos[0]" />
                <div class="w-3 h-3 bg-success absolute right-0 bottom-0 rounded-full border-2 border-white"></div>
              </div>
              <div class="ml-2 overflow-hidden">
                <div class="flex items-center">
                  <a href="javascript:;" class="font-medium truncate mr-5">{{ faker.users[0].name }}</a>
                  <div class="text-xs text-slate-400 ml-auto whitespace-nowrap">
                    {{ faker.times[0] }}
                  </div>
                </div>
                <div class="w-full truncate text-slate-500 mt-0.5">
                  {{ faker.news[0].shortContent }}
                </div>
              </div>
            </div>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown> -->
      <!-- END: Notifications -->
      <!-- BEGIN: Account Menu -->
      <Dropdown class="intro-x w-8 h-8">
        <DropdownToggle tag="div" role="button" class="w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110">
          <img alt="user" src="@/assets/images/user-bw.png" />
        </DropdownToggle>
        <DropdownMenu class="w-56">
          <DropdownContent class="bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
            <DropdownHeader tag="div" class="!font-normal">
              <div class="font-medium">
                {{ authStore.activeUser()?.user }}
              </div>
              <div class="text-xs text-white/60 mt-0.5 dark:text-slate-500">
                {{ authStore.activeUser()?.role }}
              </div>
            </DropdownHeader>
            <DropdownDivider class="border-white/[0.08]" />
            <DropdownItem class="dropdown-item hover:bg-white/5" @click="logs()" v-if="authStore.getPermission('Permissions.Navigations.Logs.Logs')">
              <ListIcon class="w-4 h-4 mr-2" /> Logs</DropdownItem
            >
            <DropdownItem class="dropdown-item hover:bg-white/5" @click="csvlogs()" v-if="authStore.getPermission('Permissions.Navigations.Logs.Csv')">
              <SheetIcon class="w-4 h-4 mr-2" /> CSV Logs</DropdownItem
            >
            <!-- <DropdownItem class="dropdown-item hover:bg-white/5" @click="errorLogs()" v-if="authStore.getPermission('Permissions.Navigations.Logs.ErrorLogs')">
              <AlertTriangleIcon class="w-4 h-4 mr-2" /> Error Logs</DropdownItem
            > -->
            <DropdownItem class="dropdown-item hover:bg-white/5" @click="profile()" v-if="authStore.getPermission('Permissions.Settings.Profile')">
              <UserIcon class="w-4 h-4 mr-2" /> Profile</DropdownItem
            >
            <!-- <DropdownItem class="dropdown-item hover:bg-white/5" @click="licensee()" v-if="authStore.getPermission('Permissions.Settings.Licensee')">
              <AwardIcon class="w-4 h-4 mr-2" /> Licensee</DropdownItem
            >
            <DropdownItem class="dropdown-item hover:bg-white/5" @click="cleanWarehouse()" v-if="authStore.activeUser()?.role === SuperUser">
              <PackageXIcon class="w-4 h-4 mr-2" /> Clear Wareahouse</DropdownItem
            > -->
            <DropdownItem class="dropdown-item hover:bg-white/5" @click="changePassword()" v-if="authStore.getPermission('Permissions.Settings.ChangePassword')">
              <LockIcon class="w-4 h-4 mr-2" /> Change Password</DropdownItem
            >
            <DropdownItem class="dropdown-item hover:bg-white/5" v-if="authStore.getPermission('Permissions.Settings.Help')">
              <HelpCircleIcon class="w-4 h-4 mr-2" /> Help</DropdownItem
            >
            <DropdownDivider class="border-white/[0.08]" />
            <DropdownItem class="dropdown-item hover:bg-white/5" @click="logout()"> <ToggleRightIcon class="w-4 h-4 mr-2" /> Logout</DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
      <!-- END: Account Menu -->
    </div>
  </div>
  <!-- END: Top Bar -->

  <ConfirmModal
    v-if="openLogout"
    value="Application SignOff"
    icon="LogOut"
    color="danger"
    positive="Logout"
    negative="Cancel"
    question="Are you sure you wish to logout this session?"
    :modalOpen="openLogout"
    :modalClose="
      () => {
        openLogout = false;
      }
    "
    :modalConfirm="confirmLogout"
  />

  <!-- <ConfirmModal
    v-if="openClearWarehouse"
    :value="`Warehouse : ${authStore.activeUser()?.warehouse?.abbreviation}`"
    icon="PackageX"
    color="pending"
    positive="Remove"
    negative="Cancel"
    question="Do you want to clear this warehouse?"
    :modalOpen="openClearWarehouse"
    :modalClose="closeCleanWarehouse"
    :modalConfirm="confirmClearWarehouse"
  >
    <template v-slot:component>
      <div class="flex space-x-2 items-center justify-center pt-3">
        <toggleSwitch label="" v-model="isRemoveWarehouse" />
        <div>{{ _text }}</div>
      </div>
    </template>
  </ConfirmModal> -->
</template>

<script lang="ts" setup>
import { useAuthUser } from "@/stores/Auth/authUser";
import { computed, inject, onBeforeMount, onMounted, onUpdated, provide, ref, watch, watchEffect } from "vue";
import Switcher from "./Switcher.vue";
import { injectStrict } from "@/utils/injectTyped";
import { AxiosKey } from "@/services/symbols";
import toast from "@/utils/toast";
import { useMenuStore } from "@/stores/menu";
import router from "@/router";
import Profile from "@/views/Main/Auth/Profile.vue";
import { HubConnectionState } from "@microsoft/signalr";

const isLoading = ref<boolean>(false);
const axios = injectStrict(AxiosKey);
const authStore = useAuthUser();
const menuStore = useMenuStore();

// const signalRConnection = ref<any>(inject("signalRHub"));
//const signalRConnection = inject("signalrhub") as SignalR;
//const printerHub = inject("printerHub") as any;

const webserial = inject("webserial") as any;

// onMounted(() => {
//   isPort.value = false;
//   if (signalRConnection.status === HubConnectionState.Disconnected) {
//     signalRConnection.startConnection();
//   }
//   signalRConnection?.emitter.on("status", onSignalRConnectionChanged);
//   currentPrinter = webserial?.getStatus();
// });

// const currentGlobe = ref<boolean>(false);
// const onSignalRConnectionChanged = (isConnected: any) => {
//   if (isConnected === HubConnectionState.Connected) {
//     currentGlobe.value = true;
//   } else {
//     currentGlobe.value = false;
//   }
// };

// watch(
//   () => signalRConnection?.status,
//   (val) => {
//     console.log("sr", val);
//     onSignalRConnectionChanged(val);
//   }
// );

// const reconectSocket = async () => {
//   signalRConnection.startConnection();
//   console.log("start", currentGlobe.value, signalRConnection.status);
// };

const closeSocket = async () => {
  // signalRConnection.connection().connection.stop();
  // console.log("close", signalRConnection.connection().connection);
};

var currentPrinter: boolean;

const isPort = ref<boolean>(false);

const openPrinter = ref<boolean>(false);
const closePrinter = () => {
  openPrinter.value = false;
};

watch(
  () => isPort.value,
  async (val) => {
    webserial?.setPort(val);
    await webserial.startConnection();
    if (openPrinter.value) {
      openPrinter.value = false;
    }
    console.log("Log : connected");
  }
);

const _printerTxt = computed(() => {
  return isPort.value ? "Connect Port" : "Connect USB";
});

const reconect = async () => {
  openPrinter.value = true;
};

const destroy = async () => {
  await webserial.destroy();
  console.log("Log : destroy");
};
const manualMenu = [
  {
    title: "Licensee",
    pageName: "Licensee",
  },
];

const _menuTitle = computed(() => {
  let menus: any[] = [];
  menuStore?.menu.map((m: any) => {
    if (m?.subMenu) {
      return m.subMenu.map((x: any) => {
        return menus.push(x);
      });
    } else {
      return menus.push(m);
    }
  });
  manualMenu.map((m: any) => menus.push(m));
  return menus.find((x: any) => x.pageName === router?.currentRoute?.value?.name)?.title || "Menu";
});

const baseurl = axios.defaults?.baseURL!.replace("/api/", "/");

const openProfile = ref<boolean>(false);
const searchDropdown = ref(false);
const showSearchDropdown = () => {
  searchDropdown.value = true;
};
const hideSearchDropdown = () => {
  searchDropdown.value = false;
};

const openLogout = ref<boolean>(false);
const confirmLogout = () => {
  openLogout.value = false;
  authStore.logout();
};

const logout = () => {
  openLogout.value = true;
};

const changePassword = () => {
  router.push("/change-password");
};

const profile = () => {
  openProfile.value = true;
};

const logs = () => {
  router.push("/main/logs");
};

const csvlogs = () => {
  router.push("/main/csv-logs");
};

const errorLogs = () => {
  router.push("/main/error-logs");
};

const licensee = () => {
  router.push("/main/licensee");
};

// const storedWaregouse = computed(() => {
//   return authStore.activeUser()?.warehouse !== null ? authStore.activeUser()?.warehouse?.abbreviation : "";
// });

// const storedWarehouseList = authStore.activeUser()?.warehouseList;

// const _page = ref<number>(1);
// const hasNextPage = ref<boolean>(false);
// const hasPrePage = ref<boolean>(false);

// const updatePage = (increase : boolean) =>{
//   if(increase){
//    return _page.value = _page.value + 1;
//   }
//   else{
//   return _page.value = _page.value <= 1 ? 1 : _page.value - 1;
//   }
// }

// const switchWarehouse = async (item: any) => {
//   isLoading.value = true;
//   var selectedId = item.warehouseId;
//   var storeId = authStore.activeUser().warehouse.warehouseId;
//   if (selectedId != storeId) {
//     authStore.updateWarehouse(item);
//     await authStore.updateSection(item.abbreviation);
//     await authStore.updateType(item.abbreviation);
//     await authStore.updateBlockType(item.warehouseId);
//     location.reload();
//     isLoading.value = false;
//   } else {
//     isLoading.value = false;
//     toast.warning("Select different warehouse to Switch");
//   }
// };

// const loadWarehouse = async() =>{
//       await axios.post("Warehouses/Paginated", {pageNumber:_page.value, pageSize:10})
//       .then((response) => {
//         if (response.data.success) {
//           warehouseList.value = response.data.data.items;
//           hasNextPage.value = response.data.data.hasNextPage
//           hasPrePage.value = response.data.data.hasPreviousPage
//         } else {
//           toast.error(response.data.message);
//         }
//       })
//       .catch((error) => {
//         toast.error(
//           toast.statusMessage(
//             error?.response?.status ? error.response.status : 500
//           )
//         );
//       })
// }

// watch(()=> _page.value, (val)=> {
//       loadWarehouse();
// }, {deep: true})

// const storedLicensee = computed(() => {
//   return authStore.activeUser().licensee !== null ? authStore.activeUser().licensee.companyName : "";
// });

// const licenseeList = ref<any[]>(authStore.activeUser().licenseeList);

// const _pageLicensee = ref<number>(1);
// const hasNextLPage = ref<boolean>(false);
// const hasPreLPage = ref<boolean>(false);

// const updateLPage = (increase : boolean) =>{
//   if(increase){
//    return _pageLicensee.value = _pageLicensee.value + 1;
//   }
//   else{
//   return _pageLicensee.value = _pageLicensee.value <= 1 ? 1 : _pageLicensee.value - 1;
//   }
// }

// const switchLicensee = async (item: any) => {
//   isLoading.value = true;
//   var selectedId = item.licenseeId;
//   var storeId = authStore.activeUser().licensee?.licenseeId;
//   if (selectedId != storeId) {
//     authStore.updatelicensee(item);
//     let base_url: string = "https://" + authStore?.activeUser()?.licensee.domain + "/api/";
//     authStore.setBaseUrl(base_url);
//     axios.defaults.baseURL = base_url;
//     await authStore.loadWarehouses(true);
//     location.reload();
//     isLoading.value = false;
//   } else {
//     isLoading.value = false;
//     toast.warning("Select different licensee to Switch");
//   }
// };

// const loadLicensee = async() =>{
//       await axios.post("Licensees/Paginated", {pageNumber:_pageLicensee.value, pageSize:10})
//       .then((response) => {
//         if (response.data.success) {
//           licenseeList.value = response.data.data.items;
//           hasNextLPage.value = response.data.data.hasNextPage
//           hasPreLPage.value = response.data.data.hasPreviousPage
//         } else {
//           toast.error(response.data.message);
//         }
//       })
//       .catch((error) => {
//         toast.error(
//           toast.statusMessage(
//             error?.response?.status ? error.response.status : 500
//           )
//         );
//       })
// }

// watch(()=> _pageLicensee.value, (val)=> {
//       loadLicensee();
// }, {deep: true})

// onBeforeMount(() => {
//   loadWarehouse();
//   loadLicensee();
// })
const openClearWarehouse = ref<boolean>(false);
const isRemoveWarehouse = ref<boolean>(false);

const _text = computed(() => {
  return isRemoveWarehouse.value ? "With removing the warehouse" : "Without removing the warehouse";
});
const cleanWarehouse = () => {
  openClearWarehouse.value = true;
};
// const confirmClearWarehouse = async () => {
//   if (isRemoveWarehouse.value) {
//     isLoading.value = true;
//     let result = await ClearWarehouseDataAndDeleteWarehouse(authStore.activeUser()?.warehouse?.warehouseId);
//     if (result?.isSuccess) {
//       authStore.removeWarehouse(authStore.activeUser()?.warehouse);
//       location.reload();
//     }
//     isLoading.value = result?.loading;
//   } else {
//     isLoading.value = true;
//     let result = await ClearWarehouseData(authStore.activeUser()?.warehouse?.warehouseId);
//     if (result?.isSuccess) {
//       location.reload();
//     }
//     isLoading.value = result?.loading;
//   }
//   cleanWarehouse();
// };

const closeCleanWarehouse = () => {
  openClearWarehouse.value = false;
};
</script>
