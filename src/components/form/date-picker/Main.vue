<template>
  <label>
    <div :class="getLabelClasses()" v-if="label || tag">
      <span v-if="label">{{ label }}</span>
      <span :class="getTagClasses()" v-html="tag" v-if="tag" />
    </div>
    <div class="flex">
      <lite-picker
        v-model="_modelValue"
        :options="options"
        class="form-control"
        :class="error === '' ? CLASS.OUTLINE_NONE : error !== true ? CLASS.OUTLINE_DANGER : CLASS.OUTLINE_SUCCESS"
      />
      <icon-button v-if="isClear && _modelValue" @click="clear()" name="Clear" icon="XCircle" color="danger" darkColor="danger" size="6" class="z-60" />
    </div>

    <div class="text-red-600 pt-1" v-if="error !== true">{{ error }}</div>
  </label>
</template>

<script setup lang="ts">
import LitePicker from "./litepicker/Main.vue";
import dayjs from "dayjs";
import { watch, reactive, watchEffect, computed, onMounted, ref, toRefs } from "vue";
import { CLASS } from "@/utils/const";

interface DateRange {
  start: string;
  end: string;
}

interface Props {
  modelValue: string | DateRange;
  label: string;
  range?: boolean;
  format?: string;
  visibleFormat?: string;
  rule: any;
  tag: string;
  autoApply: boolean;
  isClear: boolean;
}

const emit = defineEmits<{
  (e: "update:modelValue", val: string | DateRange): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  format: "YYYY-MM-DD",
  visibleFormat: "D MMM, YYYY",
  autoApply: true,
  isClear: false,
});

const { modelValue, isClear, autoApply, label, range, format, visibleFormat, rule, tag } = toRefs(props);

const options = {
  autoApply: autoApply.value,
  showWeekNumbers: true,
  dropdowns: {
    minYear: 1990,
    maxYear: null,
    months: true,
    years: true,
  },
  ...(range.value && {
    singleMode: false,
    numberOfColumns: 2,
    numberOfMonths: 2,
  }),
};

const _modelValue = computed({
  get() {
    if (range.value) {
      const { start = "", end = "" } = modelValue.value as DateRange;
      const formattedStartDate = dayjs(start).isValid() ? dayjs(start)?.format(visibleFormat.value) : "";
      const formattedEndDate = dayjs(end).isValid() ? dayjs(end)?.format(visibleFormat.value) : "";
      return formattedStartDate && formattedEndDate && `${formattedStartDate} - ${formattedEndDate}`;
    } else {
      const date = modelValue.value as string;
      const formattedDate = dayjs(date).isValid() ? dayjs(date)?.format(visibleFormat.value) : "";
      return formattedDate;
    }
  },
  set(val) {
    if (range.value) {
      const [start = "", end = ""] = val?.trim()?.split(" - ");
      const formattedStartDate = dayjs(start).isValid() ? dayjs(start)?.format(format.value) : "";
      const formattedEndDate = dayjs(end).isValid() ? dayjs(end)?.format(format.value) : "";
      emit("update:modelValue", { start: formattedStartDate, end: formattedEndDate });
    } else {
      const formattedDate = dayjs(val).isValid() ? dayjs(val)?.format(format.value) : "";
      emit("update:modelValue", formattedDate);
    }
  },
});

const clear = () => {
  _modelValue.value = "";
};

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

const getTagClasses = () => {
  return ["sm:ml-auto px-2 pt-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md"];
};
const getLabelClasses = () => {
  return ["form-label", "mt-3", tag.value ? "flex flex-col w-full sm:flex-row" : ""];
};
</script>

<style scoped></style>
