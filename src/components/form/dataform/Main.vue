<template>
  <MoveableModal :show="_isOpen" @hidden="_isOpen = false" :backdrop="backdrop" :size="size" :title="titleChange" @close="close">
    <ModalBody class="flex flex-col w-full p-4">
      <div :class="`grid  ${style.cols} ${style.gap}`">
        <Fields v-model:attributes="_attributes" :itemIndex="formAccess.itemIndex" />
      </div>

      <slot name="component" />
    </ModalBody>
    <ModalFooter class="flex space-x-3 justify-end">
      <input ref="fieldpress" type="text" class="opacity-0" @keydown.enter="save()" />
      <btn color="dark" size="md" @click="close" :type="ButtonType.NORMAL_BTN" v-if="formAccess ? formAccess?.cancel?.visible : true">
        {{ formAccess ? formAccess?.cancel?.name : "Cancel" }}
      </btn>
      <btn color="primary" size="md" @click="save" :type="ButtonType.NORMAL_BTN" v-if="buttonChange?.visible">
        {{ buttonChange?.name }}
      </btn>
    </ModalFooter>
  </MoveableModal>
</template>

<script lang="ts" setup>
import { watch, computed, toRefs, watchEffect, ref, onMounted, nextTick, onBeforeMount } from "vue";
import type FormAccess from "@/components/form/dataform/FromAccess";
import { ButtonType } from "@/components/button/ButtonType";
import AssignUtil from "@/utils/objectAssignUtil";
import toast from "@/utils/toast";

const fieldpress = ref();
setTimeout(() => {
  fieldpress.value.focus();
}, 1000);

interface Props {
  isOpen?: boolean;
  attributes?: any;
  style?: any;
  formAccess: FormAccess;
  backdrop?: string;
  size?: string;
  editItem?: any;
  payload?: any;
  defPayload?: any;
}

const emit = defineEmits<{
  (e: "save", val: any): void;
  (e: "close"): void;
  (e: "update:attributes", val: any): void;
  (e: "update:payload", val: any): void;
  (e: "update:defPayload", val: any): void;
  (e: "update:editItem", val: any): void;
  (e: "update:isOpen", val: any): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  size: "modal-xl",
  backdrop: "static",
  style: {
    cols: "grid-cols-2",
    gap: "gap-2",
  },
});

const { attributes, style, formAccess, isOpen, backdrop, size, payload, defPayload, editItem } = toRefs(props);

const _attributes = computed({
  get() {
    return attributes.value;
  },
  set(val) {
    emit("update:attributes", val);
  },
});

const _isOpen = computed({
  get() {
    return isOpen.value;
  },
  set(val) {
    emit("update:isOpen", val);
  },
});

const buttonChange = computed(() => {
  if (formAccess?.value?.itemIndex === -1) {
    return formAccess !== null
      ? formAccess?.value?.save
      : {
          name: "Save",
          visible: true,
        };
  } else {
    return formAccess !== null
      ? formAccess?.value?.edit
      : {
          name: "Edit",
          visible: true,
        };
  }
});

const titleChange = computed(() => {
  if (formAccess?.value.itemIndex === -1) {
    return formAccess?.value !== null ? (typeof formAccess?.value?.createTitle === "function" ? formAccess?.value?.createTitle() : formAccess?.value?.createTitle) : "Create";
  } else {
    return formAccess?.value !== null ? (typeof formAccess?.value?.editTitle === "function" ? formAccess?.value?.editTitle() : formAccess?.value?.editTitle) : "Edit";
  }
});

const _payload = computed({
  get() {
    return payload.value;
  },
  set(val) {
    emit("update:payload", val);
  },
});

const _defPayload = computed({
  get() {
    return defPayload.value;
  },
  set(val) {
    emit("update:defPayload", val);
  },
});

const _editItem = computed({
  get() {
    return editItem.value;
  },
  set(val) {
    emit("update:editItem", val);
  },
});

const save = async () => {
  let rules: any[] = [];

  _attributes.value.forEach((e: any) => {
    if (e?.rule!) {
      if (formAccess?.value.itemIndex === -1) {
        rules.push({
          modelValue: e.modelValue,
          rule: e?.rule,
          key: e.key,
          showEdit: e.showEdit,
        });
      } else {
        if (e.showEdit) {
          rules.push({
            modelValue: e.modelValue,
            rule: e?.rule,
            key: e.key,
            showEdit: e.showEdit,
          });
        }
      }
    }

    if (e?.subFields?.length > 0 && e?.condition(e.modelValue)) {
      e?.subFields?.map((s: any) => {
        if (s?.rule!) {
          if (formAccess?.value.itemIndex === -1) {
            return rules.push({
              modelValue: s.modelValue,
              rule: s?.rule,
              key: s.key,
              showEdit: e.showEdit,
            });
          } else {
            if (e.showEdit) {
              return rules.push({
                modelValue: s.modelValue,
                rule: s?.rule,
                key: s.key,
                showEdit: e.showEdit,
              });
            }
          }
        }
      });
    }
  });

  console.log("rules", rules, formAccess?.value.itemIndex);
  let isFilled = rules.every((e: any) => {
    let error = e.rule(e.modelValue);
    if (error !== true) {
      toast.error(error);
    }
    return error !== true ? false : true;
  });

  if (isFilled) {
    AssignUtil.Set(_payload.value, _attributes.value);
    emit("save", _payload.value);
    setDefault();
  }
  // else{
  //     toast.warning("Fill all the required fields");
  // }
};

const close = () => {
  setDefault();
  emit("close");
};

const setDefault = async () => {
  AssignUtil.Assign(_defPayload.value, _attributes.value);
  _payload.value = Object.assign({}, _defPayload.value);
};

watchEffect(async () => {
  if (formAccess.value.itemIndex > -1) {
    AssignUtil.Assign(_editItem.value, _attributes.value);
  }
});
</script>
