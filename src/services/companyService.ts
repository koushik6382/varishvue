import axios from './http-common'
import toast from "@/utils/toast";
import type { Option } from "@/components/data-table/Types";
import { useAxios } from "@/utils/axiosUtil";
import type { CreateProduct } from '@/Model/Product/Product';
import type { CreateCompanyDto } from '@/Model/Company/Company';


const { loading, data, isToast, isSuccess, Post, Get, Put, Delete, LoadPost, GetByStatus, GetByDownload,PostByStatus } = useAxios();

export const FindCompanyById = async (id: number) => {
    await Get(`Company/`+ id)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

// Define the function
export const LoadWithoutPagination = async () => {
    await Get(`Company`);
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    };
};

// Call the function
LoadWithoutPagination()
  .then(result => {
    console.log("Result:", result);
  })
  .catch(error => {
    console.error("Error:", error);
  });


export const Load = async (options: Option) => {
    await LoadPost(`Company/Paginated`, options)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}


export const LoadAll = async (size: number) => {
    await Post(`Company/Paginated`, {
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
    await LoadPost("Company/ArchivedPagination", options)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const Archive = async (id: number) => {
    await Delete("Company/Archive/"+id)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const Restore = async (id: number) => {
    await Get("Company/UnArchive/"+id)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const Remove = async (id: number) => {
    await Delete("Company/" + id)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const RemoveAll = async () => {
    await Delete("Company")
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const Save = async (payload: CreateCompanyDto) => {
    await Post("Company", payload)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

export const Edit = async (id: number, payload: CreateCompanyDto) => {
    await Put("Company/" + id, payload)
    return {
        loading: loading.value,
        data: data.value,
        isSuccess: isSuccess.value
    }
}

// export const UploadFile = async (payload: any, config: any) => {
//     await PostByStatus(`Products/Upload/Csv`, payload, config)
//     return {
//         loading: loading.value,
//         data: data.value,
//         isSuccess: isSuccess.value
//     }
// }

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
