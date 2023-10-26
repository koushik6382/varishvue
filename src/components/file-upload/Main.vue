<template>
  <div class="mt-1 mb-1 mr-2 w-full flex flex-col justify-center items-center space-x-2 bg-transparent rounded-md overflow-auto">
    <Tippy
      tag="a"
      href="javascript:;"
      class="tooltip"
      :content="content"
      :options="{
        zIndex: 99999,
      }"
    >
      <div class="flex space-x-1.5 items-center w-full py-3">
        <div class="px-2 py-1 flex space-x-2 items-center rounded-md outline-dashed outline-2 outline-offset-2 outline-success dark:outline-slate-400" @click="openUploader">
          <div>
            <Icon :name="icon?.name" size="6" :color="icon?.color" :darkColor="icon?.darkColor" />
          </div>
          <div class="whitespace-nowrap">
            {{ label }}
          </div>

          <div v-if="_modelValue && !_isEdit" class="w-0.5 h-8 bg-primary dark:bg-slate-400"></div>

          <div v-if="_modelValue && !_isEdit" class="flex space-x-1 items-center">
          <div class="flex space-x-1 items-center">
            <div class="overflow-hidden truncate w-16">
              <span>{{ splitFileName(_modelValue.name)[0] }}</span>
            </div>
            <div class="rounded-lg bg-primary text-white px-2 py-1">
              <span>.{{ splitFileName(_modelValue.name)[1] }}</span>
            </div>
          </div>

          
        </div>
          <input :accept="acceptType" id="file-input-element" type="file" @change="handleFileUpload($event)" :key="fileInputKey" hidden />
        </div>
        <Icon v-if="_modelValue" name="X" size="6" color="pending" darkColor="pending" @click="clear" />
      </div>
    </Tippy>

    <div v-if="preview && _modelValue && !_isEdit" :class="`w-${img?.w ? img?.w : '40'} h-${img?.h ? img?.h : 'auto'} object-center object-fill`">
      <img :src="image ? image : ''" :alt="fileName" />
    </div>

    <div v-if="preview && _isEdit" :class="`w-${img?.w ? img?.w : '40'} h-${img?.h ? img?.h : 'auto'} object-center object-fill bg-white`">
      <img :src="_imgUrl ? `${baseurl}${_imgUrl}` : ''" :alt="fileName" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, toRefs, watch } from "vue";
import { injectStrict } from "@/utils/injectTyped";
import { AxiosKey } from "@/services/symbols";

const axios = injectStrict(AxiosKey);
const baseurl = axios.defaults?.baseURL!.replace("/api/", "/");

interface Props {
  modelValue: any | null;
  content: string;
  isEdit: any;
  icon: {
    name: string;
    color: string;
    darkColor: string;
  };
  label: string;
  acceptType: string;
  preview: boolean;
  img: {
    w?: string;
    h?: string;
  };
  imgUrl: any;
}

const emit = defineEmits<{
  (e: "update:modelValue", val: any): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  acceptType: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
  preview: false,
  isEdit: false,
  imgUrl: "",
});

const { modelValue, content, icon, label, acceptType, imgUrl, isEdit } = toRefs(props);

const fileInputKey = ref<number>(0);
//const file = ref<any | null>();
const image = ref<any | null>();

const _modelValue = computed({
  get() {
    return modelValue.value;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const _imgUrl = computed(() => {
  return typeof imgUrl?.value === "function" ? imgUrl.value() : imgUrl.value;
});

const _isEdit = computed(() => {
  return typeof isEdit?.value === "function" ? isEdit.value() : isEdit.value;
});

const openUploader = () => {
  const inputElement: HTMLElement = document.getElementById("file-input-element")!;
  inputElement.click();
};
const handleFileUpload = async (e: any) => {
  _modelValue.value = await e.target.files[0];
  (await e.target.files[0]) ? (image.value = URL.createObjectURL(await e.target.files[0])) : (image.value = "");
};

const fileName = computed(() => _modelValue.value?.name);
// const fileExtension = computed(() =>
//   fileName.value?.substr(fileName.value?.lastIndexOf(".") + 1)
// );
// const fileMimeType = computed(() => file.value?.type);

const clear = () => {
  _modelValue.value = null;
  fileInputKey.value++;
  image.value = null;
};

const splitFileName = (str: string) => {
  let data = str.split(/\.(?=[^\.]+$)/);
  return data;
};
</script>
