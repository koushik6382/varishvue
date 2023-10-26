<template>
  <label>
    <div :class="getLabelClasses()" v-if="label || tag">
      <span v-if="label">{{ label }}</span>
      <span :class="getTagClasses()" v-html="tag" v-if="tag" />
    </div>

    <div v-if="previousValue" class="pb-2.5">
      {{ previousLabel ? `${previousLabel}` : '' }} {{ previousValue ? ` : ${previousValue}` : '' }}
    </div>

    <div class="input-group">
      <div class="input-group-text" v-if="$slots.pre || pre">
        <slot name="pre" />
        <span v-html="pre" v-if="pre" />
      </div>
      <div class="input-group-text flex items-center justify-center !bg-primary" v-if="icon && icon?.front === true">
        <Icon :name="icon?.name" size="4" :color="icon?.color || 'white'" :darkColor="icon?.darkColor || 'white'" />
      </div>
      <div class="flex w-full relative">
        <input  :type="type" :class="getInputClasses()" :readonly="readonly" :placeholder="_placeholder" :disabled="disabled" v-model="_modelValue" 
        />
        <div v-if="suggestions?.length > 0 && isSuggestActive" class="absolute w-full bg-slate-200 dark:bg-darkmode-400 top-10 z-60 flex flex-col items-start space-y-0.5">
          <div v-for="(item,i) in filterSuggest" class="text-black dark:text-white w-full btn hover:bg-slate-400 dark:hover:bg-darkmode-200" @click="selectSuggest(item)">{{ item }}</div>
        </div>
        <div class="input-group-text flex items-center justify-center !bg-primary rounded-r cursor-pointer hover:!bg-primary/75" v-if="suggestions?.length > 0" @click="showAllSuggest">
        <Icon :name="!isSuggestActive ? 'ChevronUp' : 'ChevronDown'" size="4" :color="'white'" :darkColor="'white'"  />
      </div >
        <div class="input-group-text flex items-center justify-center !bg-primary rounded-r cursor-pointer hover:!bg-primary/75" v-if="isClear && _modelValue" @click="clear">
        <Icon name="X" size="4" :color="'white'" :darkColor="'white'"  />
      </div>

      <div class="input-group-text flex items-center justify-center !bg-primary rounded-r cursor-pointer hover:!bg-primary/75" v-if="isAutocomplete && _modelValue" @click="clearSelected">
        <Icon name="X" size="4" :color="'white'" :darkColor="'white'"  />
      </div>
      </div>
      <div class="input-group-text  flex items-center justify-center !bg-primary" v-if="icon && icon?.back === true && !isAutocomplete">
        <Icon :name="icon?.name" size="4" :color="icon?.color || 'white'" :darkColor="icon?.darkColor || 'white'" @click="event" v-if="!loading" />
        <slot name="loadingBar" v-else />
      </div>

      <div class="input-group-text  flex items-center justify-center !bg-primary !cursor-pointer" v-if="isAutocomplete">
        <slot name="autocompleteIcons"  v-if="!loading" />
        <slot name="autocompleteLoading" v-else />
      </div>
      <div class="input-group-text" v-if="$slots.post || post">
        <slot name="post" />
        <span v-html="post" v-if="post" />
      </div>
    </div>
    <div :class="error ? 'text-red-600 pt-1 text-left' : 'text-red-600 pt-0 text-left'" v-if="error !== true">{{ error }}</div>
    <div class="form-help" v-html="helperText" v-if="helperText" />
    <div :class="getMessageClasses()" v-html="message" v-if="message" />
  </label>
</template>

<script setup lang="ts">
import { CLASS, REGEX } from "@/utils/const";
import { watch, reactive, watchEffect, computed, onMounted, toRefs, inject, ref } from "vue";
interface Props {
  modelValue: any;
  label?: string;
  placeholder?: string;
  type?: string;
  helperText?: string;
  size?: string;
  rounded?: boolean;
  disabled?: boolean;
  state?: string;
  message?: string;
  tag?: string;
  pre?: string;
  post?: string;
  rule: any;
  isClear?: boolean,
  icon: {
    name: string;
    color: string;
    darkColor: string;
    front: boolean;
    back: boolean;
  };
  loading?: boolean;
  suggestions?: any[];
  previousValue?: any;
  previousLabel?: string;
  readonly?: boolean;
  isAutocomplete?: boolean;
}

const emit = defineEmits<{
  (e: "update:modelValue", val: any): void;
  (e: "event"): void;
  (e: "clearSelected"): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  label: "",
  type: "text",
  helperText: "",
  size: "",
  rounded: false,
  disabled: false,
  state: "",
  message: "",
  tag: "",
  loading: false,
  isClear: true,
  suggestions: ()=>[],
  previousValue: "",
  previousLabel: "",
  readonly: false,
  isAutocomplete: false
});

const { isAutocomplete,readonly,modelValue,previousValue,previousLabel, suggestions,label, placeholder, type, helperText, size, rounded, disabled, state, message, tag, pre, post, rule } = toRefs(props);

const _modelValue = computed({
  get() {
    return modelValue.value;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

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

const isSuggestActive = ref<boolean>(false)

// const isShowAllSuggest =ref<boolean>(false)
const showAllSuggest = () =>{
  isSuggestActive.value = !isSuggestActive.value
  if(isSuggestActive.value){
      filterSuggest.value = suggestions.value
    }
}

const selectSuggest = (item : any) =>{
  _modelValue.value = item
  isSuggestActive.value = false
}

const filterSuggest =ref<any[]>([])

watch(
  () => _modelValue.value,
  (val, oldval) => {
    if(val){
      isSuggestActive.value = true
    }
    else{
      isSuggestActive.value = false
    }

    filterSuggest.value = suggestions?.value.filter((x:any)=> {
      let str = x.toString();
      let str_val = val.toString();
      if(str === str_val){
        isSuggestActive.value = false
      }
      return str.toLowerCase().includes(str_val.trim()?.toLowerCase())
    })

    if(!filterSuggest.value){
      filterSuggest.value = suggestions.value
    }
  },
  { deep: true }
);

const clear = () =>{
  _modelValue.value = ""
}
const clearSelected = () => {
  emit("clearSelected");
};
const event = () => {
  emit("event");
};
const _placeholder = computed(() => {
  return placeholder?.value === undefined ? label.value : placeholder.value;
});

const getLabelClasses = () => {
  return ["form-label flex", "mt-3", tag.value ? "flex flex-col w-full sm:flex-row" : ""];
};

const getTagClasses = () => {
  return ["sm:ml-auto px-2 pt-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md"];
};

const getInputClasses = () => {
  return [
    "form-control",
    readonly.value && isAutocomplete.value ? '!cursor-default !bg-white dark:!bg-darkmode-800' : '',
    // disabled.value && isAutocomplete.value ? "!cursor-default" : "",
    getSizeClass(size.value),
    rounded.value ? "form-control-rounded" : "",
    state.value ? `border-${getStateClass(state.value)}` : "",
    error.value === "" ? CLASS.OUTLINE_NONE : error.value !== true ? CLASS.OUTLINE_DANGER : CLASS.OUTLINE_SUCCESS,
  ];
};

const getMessageClasses = () => {
  return [state.value ? `mt-2 text-${getStateClass(state.value)}` : ""];
};

const getSizeClass = (size: string) => {
  switch (size) {
    case "sm":
      return "form-control-sm";
    case "lg":
      return "form-control-lg";
    default:
      return "";
  }
};

const getStateClass = (state: string) => {
  switch (state) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "error":
      return "danger";
    default:
      return "";
  }
};
</script>
