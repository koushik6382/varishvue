import axios from '../http-common'
import toast from "@/utils/toast";
import type { Option } from "@/components/data-table/Types";
import { useAxios } from "@/utils/axiosUtil";
import type { RolePermission } from '@/Model/Auth/RolePermission';

const { loading, data, isSuccess, isToast, Post, Get, GetByDownload, GetByStatus, Put, Delete, LoadPost } = useAxios();

const user_api = axios.defaults?.baseURL!.replace("/api/", "/users-api/")

export const GetRolePermissions = async (roleName: any, policyName: any) => {
    await Get(user_api + "Roles/" + roleName + "/Permissions/" + policyName)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}


export const EditRolePermission = async (roleName: string, payload: RolePermission) => {
    isToast.value = false;
    await Put(user_api + "Roles/" + roleName + "/Permissions", payload)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const LoadRoles = async () => {
    isToast.value = false
    await GetByStatus(user_api + "Roles")
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const LoadPolicyNames = async () => {
    isToast.value = false
    await GetByDownload(user_api + "Policies")
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

