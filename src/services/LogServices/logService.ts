import axios from '../http-common'
import toast from "@/utils/toast";
import type { Option } from "@/components/data-table/Types";
import { useAxios } from "@/utils/axiosUtil";

const { loading, data, isToast, isSuccess, Post, Get, Put, Delete, LoadPost, GetByStatus, GetByDownload } = useAxios();

export const Load = async (options: Option) => {
    await LoadPost("Logs/Search", options)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}


export const LoadAll = async (size: number) => {
    await Post("Logs/Search", {
        pageNumber: 1,
        pageSize: size,
    })
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}


