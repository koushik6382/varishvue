import axios from '../http-common'
import toast from "@/utils/toast";
import type { Option } from "@/components/data-table/Types";
import { useAxios } from "@/utils/axiosUtil";

const { loading, data, isToast, isSuccess, PostByStatus,Post, Get,GetByDownload, Put, Delete, LoadPost } = useAxios();

const user_api = axios.defaults?.baseURL!.replace("/api/", "/users-api/")

export const GetUser = async () => {
    await Get(user_api+"User")
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const ChangeUserPassword = async (payload: any) => {
    await Post(user_api+"User/ChangePassword", payload)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}


export const Login = async (payload: any) => {
    isToast.value = false
    await Post(user_api + "Authentications/Login", payload)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const AccessToken = async (payload: any) => {
    isToast.value = false
    await PostByStatus(user_api + "Authentications/RefreshToken", payload)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const Authenticate = async () => {
    isToast.value = false
    await GetByDownload(user_api + "Authentications/Authenticate")
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const Version = async () => {
    isToast.value = false
    await GetByDownload(user_api +"Version")
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}