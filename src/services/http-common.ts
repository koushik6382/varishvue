import { useAuthUser } from "@/stores/Auth/authUser";
import axios from "axios";
import type { AxiosInstance } from "axios";
import router from "@/router";
import { decode } from "@/utils/jwtDecode";
import { utcTimeDiff } from "@/utils/formatters";
import toast from "@/utils/toast";

var webUrl = window.location.href;
//var origin = new URL(webUrl).origin;
//var origin = "https://mywarehouse.myweb.net.au"
// var origin = `https://myreceivals.myweb.net.au`;
//var origin = "https://fibrecycle-mywarehouse.myweb.net.au"
var origin = `http://localhost:5267`;


var combineUrl = origin + "/api/";
const Url =
  localStorage.getItem("StoreBaseUrl") !== null
    ? JSON.parse(localStorage.getItem("StoreBaseUrl")!)
    : `${combineUrl}`;

// const baseUrl = `${origin}/api/`
// const user_url = `${origin}/users-api/`;

var _promise = null;
var _isRefreshing = false;

console.log("urls", Url, localStorage.getItem("StoreBaseUrl"));

const instance: AxiosInstance = axios.create({
  baseURL: Url,
  headers: {
    "Content-type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthUser();
    if (authStore.activeUser().token) {
      config.headers.Authorization = "Bearer " + authStore.activeUser().token;
    }
    return config;
  },
  (error) => {
    console.log("config error: ", error);
    Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("response error: ", error);
    const authStore = useAuthUser();
    const originalRequest = error.config;
    const status = error.response.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!_isRefreshing) {
        _promise = authStore.getAccessToken();
      }

      _promise!
        .then((response: any) => {
          console.log("_promise response", response);
          if (response.isSuccess) {
            originalRequest.headers["Authorization"] =
              "Bearer " + authStore.token();

            var jwtDecode = decode(authStore.token());
            var exp = jwtDecode["exp"];
            if (utcTimeDiff(exp) < 0) {
              router.push("/logout");
            }
            toast.success("Account refreshed successfully");
            return instance.request(originalRequest);
          } else {
            router.push("/logout");
          }
        })
        .catch((error) => {
          console.log("_promise error", error);
          router.push("/logout");
        });
    }

    if (status === 503) {
      router.push("/server-down");
    }

    return Promise.reject(error);
  }
);

export default instance;
