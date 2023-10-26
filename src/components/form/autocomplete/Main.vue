<template>
  <label>
    <div :class="getLabelClasses()" v-if="label || tag">
      <span v-if="label">{{ label }}</span>
      <span :class="getTagClasses()" v-html="tag" v-if="tag" />
    </div>
    <div class="w-full input-group items-center space-x-1">
      <div
        class="w-full"
        :class="
          error === ''
            ? CLASS.OUTLINE_NONE
            : error !== true
            ? CLASS.OUTLINE_DANGER
            : CLASS.OUTLINE_SUCCESS
        "
      >
        <TomSelect
          v-model="_modelValue"
          class="w-full"
          :placeholder="_placeholder"
          :multiple="multiple"
          :options="{
            valueField: 'value',
            labelField: 'text',
            searchField: 'text',
            sortField: [{ field: '$order' }, { field: '$score' }],
            maxOptions: 50,
            onInitialize,
            ...(_serverSideRendering && {
              onDropdownScroll,
              onType,
              loadThrottle: 1500,
              load: onSearch,
            }),
          }"
        />
      </div>
      <Icon
        v-if="_modelValue && multiple === false"
        name="XCircle"
        size="6"
        :color="COLOR.SUCCESS"
        @click="clear()"
      />
    </div>
    <div class="text-red-600 pt-1" v-if="error !== true">{{ error }}</div>
    <div class="grid grid-cols-2 gap-4 w-full" v-if="header.length > 0">
        <div v-for="(item, index) in filterData">
                <div>{{ item.title }} : {{ item.value }}</div>
        </div>
    </div>
  </label>
</template>

<script lang="ts" setup>
import type { LoadOption, Props } from "./Types";
import TomSelect from "./tom-select/Main.vue";
import {
  watch,
  reactive,
  watchEffect,
  computed,
  onMounted,
  ref,
  toRefs,
  withDefaults,
} from "vue";
import { CLASS, COLOR } from "@/utils/const";

const emit = defineEmits<{
  (e: "update:modelValue", val: any): void;
  (e: "load", val: LoadOption): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  itemText: "text",
  items: () => [],
  header: () => [],
  itemValue: "",
  itemsPerPage: 10,
  multiple: false,
  label: "",
});

const {
  modelValue,
  label,
  placeholder,
  items,
  itemText,
  itemValue,
  itemsPerPage,
  multiple,
  header,
  rule,
  tag,
} = toRefs(props);

const _modelValue = computed({
  get() {
     if(modelValue.value === 0 ||  modelValue.value === undefined || modelValue.value === null){
      return modelValue.value = "";
    }
    else{
      return modelValue.value;
    }
  },
  set(val) {
      emit("update:modelValue", val);
      setValue(val)
  },
});

const filterData = ref<any[]>([]);

const setValue = (val: any)=>{
    if(val && header.value.length > 0){
        filterData.value = [];
        let obj = JSON.parse(val);
        header.value.forEach((x: any)=> {
            for (const [key, value] of Object.entries(obj)) {
                if(key === x.value){
                    let findObj : any = {
                        title: x.title, 
                        value : value
                    }
                    filterData.value.push(findObj);
                }
            }
        })
    }
}

const error = ref<boolean | string>("");

onMounted(() => {
  if (rule.value) {
    error.value = "";
  }
});

watch(
  () => _modelValue.value,
  (val, oldval) => {
    if (rule.value) {
      error.value = rule.value(val);
    }
  },
  { deep: true }
);

const _placeholder = computed(() => {
  return placeholder?.value === undefined ? label.value : placeholder.value;
});

const _serverSideRendering = computed(
  () => !(items.value && items.value.length > 0)
);

const options = {
  page: 0,
  itemsPerPage: itemsPerPage.value,
  totalItems: 0,
  search: "",
};

const onInitialize = (context: any) => {
  if (!_serverSideRendering.value) {
    if (itemValue.value === "" || header.value.length > 0) {
      context.addOptions(
        items?.value.map((x) => ({ text: x[itemText.value], value: JSON.stringify(x) })) || [],
        false
      );
    } else {
      context.addOptions(
        items?.value.map((x) => ({
          text: x[itemText.value],
          value: x[itemValue.value],
        })) || [],
        false
      );
    }
    context.refreshOptions(false);
  } else {
    emit("load", {
      page: ++options.page,
      itemsPerPage: options.itemsPerPage,
      search: options.search,
      callback: (items: any[], totalItems: number) => {
        if (itemValue.value === "" || header.value.length > 0) {
          context.addOptions(
            items?.map((x: any) => ({ text: x[itemText.value], value: JSON.stringify(x) })) ||
              [],
            false
          );
        } else {
          context.addOptions(
            items?.map((x: any) => ({
              text: x[itemText.value],
              value: x[itemValue.value],
            })) || [],
            false
          );
        }

        context.refreshOptions(false);
      },
    });
  }
};

const onDropdownScroll = (context: any) => {
  context.loading_more.show();
  const scrollTop = context.dropdown_content.scrollTop;

  emit("load", {
    page: ++options.page,
    itemsPerPage: options.itemsPerPage,
    search: options.search,
    callback: (items: any[], totalItems: number) => {
      context.loading_more.hide();
      if (itemValue.value === "" || header.value.length > 0) {
        context.addOptions(
          items?.map((x) => ({ text: x[itemText.value], value: JSON.stringify(x) })) || [],
          false
        );
      } else {
        context.addOptions(
          items?.map((x) => ({
            text: x[itemText.value],
            value: x[itemValue.value],
          })) || [],
          false
        );
      }

      context.refreshOptions(false);
      context.dropdown_content.scrollTop = scrollTop;
    },
  });
};

const onType = (context: any, query: string) => {
  context.clearOptions();
  options.page = 0;
  options.search = query || "";
};

const onSearch = (context: any, query: string, callback: any) => {
  emit("load", {
    page: ++options.page,
    itemsPerPage: options.itemsPerPage,
    search: options.search,
    callback: (items: any[], totalItems: number) => {
      callback(
        itemValue.value === "" || header.value.length > 0 ? 
        items?.map((x) => ({
          text: x[itemText.value],
          value: JSON.stringify(x),
        })) || [] : 
        items?.map((x) => ({
          text: x[itemText.value],
          value: x[itemValue.value],
        })) || []
      );
    },
  });
};

const clear = () => {
  if (multiple.value === false) {
    typeof _modelValue.value === "string"
      ? emit("update:modelValue", "")
      : typeof _modelValue.value === "number"
      ? emit("update:modelValue", 0)
      : emit("update:modelValue", {});
  }

  if(header.value.length > 0){
    filterData.value = [];
  }

  options.page = 0;

};

const getTagClasses = () => {
  return [
    "sm:ml-auto px-2 pt-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md",
  ];
};
const getLabelClasses = () => {
  return ["form-label", "mt-3", tag ? "flex flex-col w-full sm:flex-row" : ""];
};
</script>
