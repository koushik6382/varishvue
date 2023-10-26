<template>
  <div class="flex flex-col space-y-2 items-center justify-center w-full">
    <div class="flex space-x-2 items-end w-full">
      <TextField
      class="w-full"
        v-bind="props"
        v-model="textVal"
        @event="add()"
        :isClear="true"
        :icon="{
          name: 'PlusCircle',
          front: false,
          back: true,
        }"
      />
      <!-- <Icon v-if="_modelValue" :name="'X'" size="6" color="pending" @click="clear" /> -->
    </div>

    <div class="flex flex-col space-y-2 bg-slate-200 text-black dark:bg-darkmode-200 w-full text-white px-2 py-2 rounded-md" v-if="_modelValue.length > 0">
      <div class="flex items-center justify-between">
        <div>List of values</div>
        <div class="bg-danger text-white cursor-pointer px-1 py-1 rounded-md flex" @click="clear()">Clear All</div>
      </div>
      
      <div class="flex space-x-1.5 overflow-auto">
        <div v-for="(item, index) in _modelValue" class="flex space-x-1 items-center justify-center px-1 py-0.5 rounded-md bg-white dark:bg-pending">
        <div>{{ item }}</div>
        <div  @click="remove(index)" class="cursor-pointer"> <Icon :name="'X'" size="4" color="pending" /></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, reactive, watchEffect, computed, onMounted, ref, toRefs,nextTick } from "vue";

interface Props {
  modelValue: any[];
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
  icon: {
    name: string;
    color: string;
    darkColor: string;
    front: boolean;
    back: boolean;
  };
}

const emit = defineEmits<{
  (e: "update:modelValue", val: any): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  label: "",
  helperText: "",
  size: "",
  rounded: false,
  disabled: false,
  state: "",
  message: "",
  tag: ""
});

const { modelValue, label, placeholder, type, helperText, size, rounded, disabled, state, message, tag, pre, post, rule } = toRefs(props);

const textVal = ref<any>("")

const _modelValue = computed({
  get() {
    return modelValue.value;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const add = () => {
  _modelValue.value.unshift(textVal.value);
  nextTick(()=> textVal.value = "")
};

const remove = (index: number) => {
  _modelValue.value.splice(index, 1);
};

const clear = () => {
  _modelValue.value.splice(0,_modelValue.value.length);
  nextTick(()=> textVal.value = "")
};

const error = ref<boolean | string>("");

onMounted(() => {
  if (rule) {
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
</script>
