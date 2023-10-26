import { defineStore } from "pinia";;
import toast from "@/utils/toast";
import axios from '../../services/http-common'
import type Signin from "../../Model/Auth/auth"
import { ref } from "vue";
import StorageUtil from "@/utils/storageUtil";
import { decode } from "@/utils/jwtDecode";
import { useStatus } from "./status";
import { useDarkModeStore } from "@/stores/dark-mode";
import { useColorSchemeStore } from "@/stores/color-scheme";

import { SuperUser } from "@/utils/const";
import router from "@/router";

import * as CryptoJS from 'crypto-js';
import { AccessToken, Authenticate, Login } from "@/services/AuthService/authService";


interface StoreUser {
  user: string,
  firstName: string | null,
  lastName: string | null,
  token: string,
  permissions: any[],
  refreshToken: string,
  role: string,
}

export const useAuthUser = defineStore("AuthUser", () => {

  var defaultUser = {
    user: "",
    firstName: "",
    lastName: "",
    token: "",
    permissions: [],
    refreshToken: "",
    role: "",
    licensee : "",
    licenseeList : [],
    warehouse: null,
    warehouseList : [],
    softClientLogo: null
  } as StoreUser | null


  const user = ref(StorageUtil.Get<StoreUser>("StoreUser", defaultUser!));
  const baseUrl = ref(StorageUtil.Get<string>("StoreBaseUrl", ""));

  const user_api = axios.defaults?.baseURL!.replace("/api/", "/users-api/")

  const authenticate = () => {
    return new Promise(async (resolve: any, reject: any) => {
      let result = await Authenticate();
      if(result?.isSuccess){
        resolve(result?.data?.data)
      }
      // axios
      //   .get(user_api+"Authentications/Authenticate")
      //   .then((response) => {
      //     resolve(response.data)
      //   })
      //   .catch((error) => {
      //     reject(error)
      //   });
    });
  }

  const setDefaults = () => {
    user.value = Object.assign({}, defaultUser);
  }
  const clearUserData = () => {
    setDefaults()
    StorageUtil.Set<StoreUser>("StoreUser", user.value);
    localStorage.clear();
  };

  const login = (credentials: Signin) => {
    setDefaults()
    return new Promise(async (resolve: any, reject: any) => {

      let result = await Login(credentials)
      if(result?.isSuccess){
        user.value = result?.data;
        var encodetoken = result?.data?.token;
        var jwtDecode = decode(encodetoken);
        var userRole = jwtDecode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        user.value.role = userRole;

        StorageUtil.Set<StoreUser>("StoreUser", user.value);
            // const storeStatus = useStatus();
            // storeStatus.getAllStatus();
            resolve(result);
      }
      else{
        resolve(result);
        setDefaults()
      }

      // axios
      //   .post(user_api+"Authentications/Login", credentials)
      //   .then(async (response) => {
      //     if (response.data.success) {
      //       user.value = response.data.data;
      //       var encodetoken = response.data.data.token;
      //       var jwtDecode = decode(encodetoken);
      //       var userRole = jwtDecode["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      //       user.value.role = userRole;
          
      //       StorageUtil.Set<StoreUser>("StoreUser", user.value);
      //       const storeStatus = useStatus();
      //       storeStatus.getAllStatus();
      //       resolve(response.data);
      //     } else {
      //       resolve(response.data);
      //       setDefaults()
      //       toast.error(response.data.message)
      //     }
      //   })
      //   .catch((error) => {
      //     setDefaults()
      //     reject(error);
      //     toast.error(
      //       toast.statusMessage(
      //         error?.response?.status ? error.response.status : 500
      //       )
      //     );
      //   });
    });
  }

  const getAccessToken = () => {
    return new Promise(async (resolve: any, reject: any) => {
      if (user.value.refreshToken) {

        let result = await AccessToken({ token: user.value.refreshToken })
        if(result?.isSuccess){
          user.value.user = result?.data.user;
          user.value.token = result?.data.token;
          user.value.permissions = result?.data.permissions;
          user.value.refreshToken = result?.data.refreshToken;
          resolve({isSuccess : true, response:result?.data});
          StorageUtil.Set<StoreUser>("StoreUser", user.value);
        }
        else{
          resolve({isSuccess : false, response:result?.data});
          setDefaults()
          toast.error("something went wrong")
        }

        // axios
        //   .post(user_api+"Authentications/RefreshToken", { token: user.value.refreshToken })
        //   .then(async (response) => {
        //     if (response.status === 200) {
        //       user.value.user = response.data.user;
        //       user.value.token = response.data.token;
        //       user.value.permissions = response.data.permissions;
        //       user.value.refreshToken = response.data.refreshToken;
        //       resolve({isSuccess : true, response:response});
        //       StorageUtil.Set<StoreUser>("StoreUser", user.value);
        //     }
        //     else {
        //       resolve();
        //       setDefaults()
        //       toast.error("something went wrong")
        //     }
        //   })
        //   .catch((error) => {
        //     setDefaults()
        //     reject({isSuccess : false, response:error});
        //     toast.error(
        //       toast.statusMessage(
        //         error?.response?.status ? error.response.status : 500
        //       )
        //     );
        //   });
      } else {
        toast.error("Unauthorized")
      }
    });
  }

  const logout = () => {
    return new Promise((resolve: any, reject: any) => {

      try {
        clearUserData()
        resolve(true);
        logoutCleanData();
        toast.success("Successfully LoggedOut")
      } catch (error) {
        console.log('logout error', error);
        logoutCleanData();
        resolve(false);
      }
    });
  }

  const logoutCleanData = () => {
    const darkModeStore = useDarkModeStore();
    const colorSchemeStore = useColorSchemeStore();
    router.push('/login')
    darkModeStore.setDarkMode(false)
    colorSchemeStore.setColorScheme("default")
  }

  const setBaseUrl = (url: string) => {
    baseUrl.value = url;
    StorageUtil.Set<string>("StoreBaseUrl", url);
  }

  const getBaseUrl = () => {
    return baseUrl.value
  }

  const activeUser = () => {
    return user.value
  }

  const getPermission = (val: any) => {
    const mergedPermissions = [user.value.role, ...user.value.permissions];
    if (typeof val === "string") {
      return mergedPermissions.includes(val);
    }
    else {
      var hasPermission = val.map((x: any) => {
        if (mergedPermissions.includes(x)) {
          return true
        }
        else {
          return false
        }
      })?.some((access: any) => access === true);
      return hasPermission;
    }

  }

  const token = () => {
    return user?.value?.token
  }
  return {
    user,
    getPermission,
    login,
    getAccessToken,
    logout,
    activeUser,
    token,
    setBaseUrl,
    getBaseUrl,
  };
 
});
