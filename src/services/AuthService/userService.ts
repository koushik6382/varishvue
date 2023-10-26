import axios from '../http-common'
import toast from "@/utils/toast";
import type { Option } from "@/components/data-table/Types";
import { useAxios } from "@/utils/axiosUtil";
import type { CreateUser, EditUser, GetUser, UserResetPassword } from '@/Model/Auth/User';

const { loading, data, isSuccess, Post, Get, GetByStatus, Put, Delete, LoadPost } = useAxios();

const user_api = axios.defaults?.baseURL!.replace("/api/", "/users-api/")

export const Load = async (options: Option) => {
    await LoadPost(user_api + "Users/Paginated", options)

    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const LoadAll = async (size: number) => {
    await Post(user_api + "Users/Paginated/", {
        pageNumber: 1,
        pageSize: size,
    })
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const ActivateUser = async (id: string) => {
    await Get(user_api + "Users/" + id + "/Activate")
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const DeactivateUser = async (id: string) => {
    await Get(user_api + "Users/" + id + "/Deactivate")
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const Remove = async (id: string) => {
    await Delete(user_api + "Users/" + id)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const LoadDepartments = async (warehouseId: number, options: Option) => {
    await LoadPost("Departments/" + warehouseId + "/Paginated", options)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const LoadRoles = async () => {
    await GetByStatus(user_api + "Roles")
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const Save = async (payload: CreateUser) => {
    await Post(user_api + "Users", payload)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const Edit = async (id: string, payload: EditUser) => {
    await Put(user_api + "Users/" + id, payload)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const ChangePassword = async (payload: UserResetPassword) => {
    await Post(user_api + "Authentications/ResetPassword", payload)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const GenToken = async (payload: any) => {
    await Post(user_api + "Authentications/ResetPasswordRequest", payload)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}