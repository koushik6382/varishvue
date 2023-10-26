import { ref } from 'vue';
import axios from '../services/http-common'
import toast from "@/utils/toast";
import type { Option, OptionWithDate } from '@/components/data-table/Types';

const axiosInstance = axios;

export const useAxios = () => {
    const loading = ref<boolean>(false)
    const data = ref<any>({});
    const isToast = ref<boolean>(true)
    const isSuccess = ref<boolean>(false)

    const Get = async (url: string) => {
        loading.value = true
        await axiosInstance.get(url).then((response) => {
            if (response.data.success) {
                data.value = response?.data?.data
                isToast.value === true ? toast.success(response?.data?.message) : null
                isSuccess.value = true
            } else {
                data.value = null
                toast.error(response?.data?.message)
                isSuccess.value = false
            }
        }).catch((error) => {
            data.value = null
            toast.error(
                toast.statusMessage(
                    error?.response?.status ? error.response.status : 500
                )
            );
            isSuccess.value = false
        }).finally(() => {
            loading.value = false
        })
    }

    const GetByStatus = async (url: string) => {
        loading.value = true
        await axiosInstance.get(url).then((response) => {
            if (response.status === 200) {
                data.value = response?.data?.data
                isSuccess.value = true
                //  isToast.value === true ? toast.success(response?.data?.message) : null
            } else {
                data.value = null
                toast.error(response.data.message)
                isSuccess.value = false
            }
        }).catch((error) => {
            data.value = null
            toast.error(
                toast.statusMessage(
                    error?.response?.status ? error.response.status : 500
                )
            );
            isSuccess.value = false
        }).finally(() => {
            loading.value = false
        })
    }

    const GetByDownload = async (url: string) => {
        loading.value = true
        await axiosInstance.get(url).then((response) => {
            if (response.status === 200) {
                data.value = response
                isToast.value === true ? toast.success("Download Successfully") : null
                isSuccess.value = true
            } else {
                data.value = null
                toast.error("Download Failed")
                isSuccess.value = false
            }
        }).catch((error) => {
            data.value = null
            toast.error(
                toast.statusMessage(
                    error?.response?.status ? error.response.status : 500
                )
            );
            isSuccess.value = false
        }).finally(() => {
            loading.value = false
        })
    }

    const Post = async (url: string, payload?: any, config?: any) => {
        loading.value = true
        await axiosInstance.post(url, payload, config).then((response) => {
            if (response.data.success) {
                data.value = response?.data?.data
                isToast.value === true ? toast.success(response?.data?.message) : null
                isSuccess.value = true
            } else {
                data.value = null
                toast.error(response.data.message)
                isSuccess.value = false
            }
        }).catch((error) => {
            console.log('error', error);
            data.value = null
            toast.error(
                toast.statusMessage(
                    error?.response?.status ? error.response.status : 500
                )
            );
            isSuccess.value = false
        }).finally(() => {
            loading.value = false
        })
    }

    const PostByStatus = async (url: string, payload?: any, config?: any) => {
        loading.value = true
        await axiosInstance.post(url, payload, config).then((response) => {
            if (response.status === 200) {
                data.value = response?.data
                isSuccess.value = true
            } else {
                data.value = null
                isSuccess.value = false
            }
        }).catch((error) => {
            console.log('error', error);
            data.value = null
            toast.error(
                toast.statusMessage(
                    error?.response?.status ? error.response.status : 500
                )
            );
            isSuccess.value = false
        }).finally(() => {
            loading.value = false
        })
    }

    const LoadPost = async (url: string, options: Option) => {
        loading.value = true
        await axiosInstance.post(url, {
            pageNumber: options.page || 1,
            pageSize: options.itemsPerPage || 10,
            search: options.search || "",
        }).then((response) => {
            if (response?.data?.success) {
                data.value = response?.data?.data;
                isToast.value === true ? toast.success(response?.data?.message) : null
                options.callback(response?.data?.data?.items, response?.data?.data?.totalCount);
                isSuccess.value = true
            } else {
                data.value = []
                toast.error(response?.data?.message)
                isSuccess.value = false
            }
        }).catch((error) => {
            data.value = []
            toast.error(
                toast.statusMessage(
                    error?.response?.status ? error.response.status : 500
                )
            );
            isSuccess.value = false
        }).finally(() => {
            loading.value = false
        })
    }

    const LoadPostWithDate = async (url: string, options: OptionWithDate) => {
        loading.value = true
        await axiosInstance.post(url, {
            pageNumber: options.page,
            pageSize: options.itemsPerPage,
            search: options.search,
            fromDate: options.fromDate,
            toDate: options.toDate
        }).then((response) => {
            if (response?.data?.success) {
                data.value = response?.data?.data;
                isToast.value === true ? toast.success(response?.data?.message) : null
                options.callback(response?.data?.data?.items, response?.data?.data?.totalCount);
                isSuccess.value = true
            } else {
                data.value = []
                toast.error(response?.data?.message)
                isSuccess.value = false
            }
        }).catch((error) => {
            data.value = []
            toast.error(
                toast.statusMessage(
                    error?.response?.status ? error.response.status : 500
                )
            );
            isSuccess.value = false
        }).finally(() => {
            loading.value = false
        })
    }

    const Put = async (url: string, payload: any, config?: any) => {
        loading.value = true;
        await axiosInstance.put(url, payload, config).then((response) => {
            if (response.data.success) {
                data.value = response.data.data
                isToast.value === true ? toast.success(response?.data?.message) : null
                isSuccess.value = true
            } else {
                data.value = null
                toast.error(response.data.message)
                isSuccess.value = false
            }
        }).catch((error) => {
            data.value = null
            toast.error(
                toast.statusMessage(
                    error?.response?.status ? error.response.status : 500
                )
            );
            isSuccess.value = false
        }).finally(() => {
            loading.value = false
        })
    }

    const Delete = async (url: string) => {

        await axiosInstance.delete(url).then((response) => {
            if (response.data.success) {
                data.value = response.data.data
                isToast.value === true ? toast.success(response?.data?.message) : null
                isSuccess.value = true
            } else {
                data.value = null
                toast.error(response.data.message)
                isSuccess.value = false
            }
        }).catch((error) => {
            data.value = null
            toast.error(
                toast.statusMessage(
                    error?.response?.status ? error.response.status : 500
                )
            );
            isSuccess.value = false
        }).finally(() => {
            loading.value = false
        })
    }


    return { loading, data, isToast, isSuccess,PostByStatus, Get, GetByStatus, GetByDownload, Post, Delete, Put, LoadPost, LoadPostWithDate }
}