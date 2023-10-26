<template>
  <component :is="getField(props.fieldType)" v-bind="props" v-model="_value"
  @load="props?.load"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Input } from "./InputField";

interface Props {
  modelValue: any;
  label?: string;
  placeholder: string;
  tag: string;
  rule: any;
  disabled: boolean;
  icon: any;
  fieldType: Input;
  load: any;
  updatedItem : any

  //autocomplete
  items?: any[];
  itemText?: string;
  itemValue?: string;
  itemsPerPage?: number;
  header?: any[];
  searchDelay : number;
  resultObj? : boolean;
  infoEnable?:boolean;

  //file upload
  content?: string;
  acceptType?: string;
  preview?: boolean
  img?: {
    w: string
    h: string
  },
  imgUrl? : string
}

const emit = defineEmits<{
  (e: "update:modelValue", val: any): void;
}>();

const props = defineProps<Props>();

const _value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const getField = (type: Input) => {
  switch (type) {
    case Input.TEXT:
      return "TextField";
    case Input.PASSWORD:
      return "PasswordField";
    case Input.SELECT:
      return "Autocomplete";
    case Input.RADIO_GROUP:
      return "RadioGroup";
    case Input.CHECK_BOX_GROUP:
      return "CheckboxGroup";
    case Input.TOGGLE_SWITCH:
      return "ToggleSwitch";
    case Input.DATE_PICKER:
      return "DatePicker";
    case Input.PHONE:
      return "PhoneNoField";
    case Input.FILE_INPUT:
      return "FileUpload";
    case Input.TEXT_ADDER:
      return "TextAdder";
    case Input.GROUP:
      return "";
    default:
      return "TextField";
  }
};
</script>
