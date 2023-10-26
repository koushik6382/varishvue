import { defineStore } from "pinia";
import { useAuthUser } from "@/stores/Auth/authUser";
import { ref } from "vue";
import StorageUtil from "@/utils/storageUtil";
import { SuperUser,Admin } from "@/utils/const";

export const useMenuStore = defineStore("Menu", () => {
  const authStore = useAuthUser();
  const layout = ref(StorageUtil.Get<string>("layout", "side-menu")); // side-menu, top-menu, simple-menu
  const menu = [
    
    {
      icon: "ClipboardCheckIcon",
      title: "Items",
      showMenu: authStore.getPermission([SuperUser,Admin, true]),
      pageName: "Items",
    },
    {
      icon: "UsersIcon",
      title: "Users",
      showMenu: authStore.getPermission([SuperUser,Admin, true]),
      subMenu: [
        {
          icon: "UsersIcon",
          pageName: "Users",
          title: "User",
          showSubMenu: authStore.getPermission([SuperUser,Admin, true]),
        },
        {
          icon: "KeyIcon",
          pageName: "UserPermission",
          title: "User Permission",
          showSubMenu: authStore.getPermission([SuperUser, true]),
        },
      ],
    },
  ];

  const setLayout = (layout: string) => {
    StorageUtil.Set<string>("layout", layout);
    layout = layout;
    location.reload();
  };
  return { menu, layout, setLayout };
});
