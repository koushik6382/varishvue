<template>
  <div :class="access ? 'cursor-pointer' : 'cursor-not-allowed'">
    <div class="btn flex flex-col justify-center items-center space-x-2 btn-primary rounded-md mb-2 mr-1" :class="access ? 'pointer-events-auto' : 'pointer-events-none'">
      <div class="flex space-x-1.5 items-center w-full px-2">
        <div class="flex space-x-2 items-center rounded-md bg-primary" @click="openUploader">
          <div>
            <Icon :name="icon?.name" size="6" :color="icon?.color" :darkColor="icon?.darkColor" />
          </div>
          <div class="whitespace-nowrap font-medium text-white">
            {{ label }}
          </div>

          <input :accept="acceptType" id="file-input-element" type="file" @change="handleFileUpload($event)" :key="fileInputKey" hidden />
        </div>
        <div v-if="_modelValue" class="flex space-x-1 items-center">
          <div class="flex space-x-1 items-center">
            <div class="overflow-hidden truncate w-16">
              <span>{{ splitFileName(_modelValue.name)[0] }}</span>
            </div>
            <div class="rounded-lg bg-white text-black px-2">
              <span>.{{ splitFileName(_modelValue.name)[1] }}</span>
            </div>
          </div>

          <icon-button v-if="_modelValue" @click="upload(_modelValue)" name="Upload" icon="CheckCircle" color="white" darkColor="white" size="6" padding="0" :access="true" />
          <icon-button v-if="_modelValue" @click="clear" name="Clear" icon="XCircle" color="danger" darkColor="danger" size="6" padding="0" :access="true" />
        </div>
      </div>
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
  icon: {
    name: string;
    color: string;
    darkColor: string;
  };
  label: string;
  acceptType: string;
  access: boolean;
}

const emit = defineEmits<{
  (e: "upload", val: any): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  acceptType: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
  access: true,
});

const { icon, label, acceptType } = toRefs(props);

const _modelValue = ref<any>(null);

const fileInputKey = ref<number>(0);
//const file = ref<any | null>();
const image = ref<any | null>();

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

const upload = (val: any) => {
  emit("upload", val);
};
</script>
