<template>
  <template v-for="(attribute, index) in _attributes" :key="index">
    <component
      :is="'Field'"
      v-model="_attributes[index].modelValue"
      v-bind="attribute"
      v-if="itemIndex === -1 ? true : attribute.showEdit"
      :class="setColSpan(attribute?.colSpan)"
    />

    <template
      v-if="
        attribute?.subFields?.length > 0
          ? attribute?.condition(attribute.modelValue)
          : false
      "
    >
      <div class="relative pt-2 col-span-full" v-if="groupTagList.includes(attribute.groupTag)">
        <h3 class="absolute -top-1 text-base left-4 bg-white dark:bg-darkmode-600 text-black dark:text-white">
          {{ attribute.groupName }}
        </h3>
        <div :class="`border rounded-md border-slate-600 dark:border-white border-solid p-4 h-full grid grid-cols-${attribute?.cols || '2'} gap-2`">
          <template
            v-for="(subAttribute, idx) in attribute.subFields"
            :key="idx"
          >
            <component
              :is="'Field'"
              v-model="subAttribute.modelValue"
              v-bind="subAttribute"
              v-if="itemIndex === -1 ? true : subAttribute.showEdit"
              :class="setColSpan(subAttribute?.colSpan)"
            />
          </template>
        </div>
      </div>

      <template v-else>
        <template v-for="(subAttribute, idx) in attribute.subFields" :key="idx">
          <component
            :is="'Field'"
            v-model="subAttribute.modelValue"
            v-bind="subAttribute"
            v-if="itemIndex === -1 ? true : subAttribute.showEdit"
            :class="setColSpan(subAttribute?.colSpan)"
          />
        </template>
      </template>
    </template>
  </template>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watchEffect } from "vue";
import { Input } from "./InputField";

interface Props {
  attributes: any;
  itemIndex: number;
}

const emit = defineEmits<{
  (e: "update:attributes", vals: any): void;
}>();

const props = defineProps<Props>();

const _attributes = computed({
  get() {
    return props.attributes;
  },
  set(val) {
    emit("update:attributes", val);
  },
});

const groupTagList = ref<any[]>([]);

const collectGroupTags = () => {
  _attributes?.value?.forEach((x: any) => {
    if (x.fieldType === Input.GROUP) {
      groupTagList.value.push(x.groupTag);
    }

    if(x && x?.subFields){
      if (x.subFieldType === Input.GROUP) {
      groupTagList.value.push(x.groupTag);
    }

    }
  });
};

onMounted(() => {
  collectGroupTags();
});

watchEffect(() => {
  if (props.itemIndex === -1) {
    _attributes.value.forEach((x: any) => {
      if (x?.subFields?.length > 0) {
        if (x.modelValue === "") {
          x.subFields.forEach((s: any) => (s.modelValue = ""));
        }
      }
    });
  }
});

const setColSpan = (col : string) => {
    return [(col ? `col-span-${col}` : 'col-span-1')]
}
</script>
