import axios from './http-common'
import toast from "@/utils/toast";
import type { Option } from "@/components/data-table/Types";
import { useAxios } from "@/utils/axiosUtil";
import type { CreateProduct } from '@/Model/Product/Product';


const { loading, data, isToast, isSuccess, Post, Get, Put, Delete, LoadPost, GetByStatus, GetByDownload,PostByStatus } = useAxios();

export const f = async (id: number) => {
    await Get(`Products/`+ id)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const LoadWithoutPagination = async () => {
    await Get(`Products`)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const Load = async (options: Option) => {
    await LoadPost(`Products/Paginated`, options)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}


export const LoadAll = async (size: number) => {
    await Post(`Products/Paginated`, {
        pageNumber: 1,
        pageSize: size,
    })
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const LoadArchives = async (options: Option) => {
    await LoadPost("Products/Archived", options)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const Archive = async (id: number) => {
    await Get("Products/"+id+"/Archive/")
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const Restore = async (id: number) => {
    await Get("Products/"+id+"/UnArchive/")
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const Remove = async (id: number) => {
    await Delete("Products/" + id)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const RemoveAll = async () => {
    await Delete("Products")
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const Save = async (payload: CreateProduct) => {
    await Post("Products", payload)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const Edit = async (id: number, payload: CreateProduct) => {
    await Put("Products/" + id, payload)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const UploadFile = async (payload: any, config: any) => {
    await PostByStatus(`Products/Upload/Csv`, payload, config)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

// export const LoadStatus = async (options: Option) => {
//     await LoadPost(`Status/Search`, options)
//     return {
//         loading: loading.value,
//         data: data.value,
//         isSuccess: isSuccess.value
//     }
// }

// export const FindStatus = async (id: number) => {
//     await Get(`Status/`+id)
//     return {
//         loading: loading.value,
//         data: data.value,
//         isSuccess: isSuccess.value
//     }
// }

// export const LoadProducts = async (options: Option) => {
//     await LoadPost(`Products/Paginated`, options)
//     return {
//         loading: loading.value,
//         data: data.value,
//         isSuccess: isSuccess.value
//     }
// }

// export const FindProducts = async (id: number) => {
//     await Get(`Products/`+id)
//     return {
//         loading: loading.value,
//         data: data.value,
//         isSuccess: isSuccess.value
//     }
// }
