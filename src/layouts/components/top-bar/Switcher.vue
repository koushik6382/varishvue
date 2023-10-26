<template>
 <Dropdown class="intro-x mr-4 sm:mr-6" v-if="_list.length > 1">
        <DropdownToggle
          tag="div"
          role="button"
          class="flex text-white cursor-pointer"
        >
          <div class="flex -mr-4">
            <span class="text-md mr-2">Switch</span>
            <span class="text-lg font-semibold -mt-1">
              {{ storedData }}
            </span>
          </div>

          <ArrowLeftRightIcon class="w-16 dark:text-slate-500" />
        </DropdownToggle>
        <DropdownMenu class="notification-content pt-2">
          <DropdownContent tag="div" class="notification-content__box">
            <div class="notification-content__title">Switch {{ switchName }}</div>

            <div class="flex flex-col justify-center items-center space-y-2">
              <div class="grid grid-cols-3 gap-4 justify-center">
                <div
                  v-for="(item, i) in _list"
                  :key="i"
                  @click="change(item)"
                  class="text-center rounded-md p-2 cursor-pointer bg-primary text-white"
                >
                  {{ item[value] }}
                </div>
              </div>

              <!-- <div class="flex w-full justify-center items-center space-x-2">
               
                <icon-button
                v-if="_hasPrePage === true"
                @click="updatePage(false)"
                name="Back"
                icon="ArrowBigLeft"
                color="pending"
                size="6"
                />

                <icon-button
                v-if="_hasNextPage === true"
                @click="updatePage(true)"
                name="Next"
                icon="ArrowBigRight"
                color="pending"
                size="6"
                />
                
              </div> -->
            </div>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
</template>

<script lang="ts" setup>
import { computed, toRefs } from 'vue';

interface Props {
  storedData: any;
  list : any,
  switchName : string,
  value: any,
  hasNextPage : boolean,
  hasPrePage : boolean
  
}

const emit = defineEmits<{
  (e: "update:list", val: any): void;
  (e: "update:hasNextPage", val: boolean): void;
  (e: "update:hasPrePage", val: boolean): void;
  (e: "change", val: any): void;
  (e: "updatePage", val: boolean): void;
}>();

  const props = withDefaults(defineProps<Props>(), {
    hasNextPage: false,
    hasPrePage: false,
});
const { storedData, list,switchName,hasNextPage,hasPrePage,value } = toRefs(props);

const _list = computed({
  get() {
    return list.value
  },
  set(val) {
    emit("update:list", val);
  },
})

const _hasNextPage = computed({
  get() {
    return hasNextPage.value
  },
  set(val) {
    emit("update:hasNextPage", val);
  },
})

const _hasPrePage = computed({
  get() {
    return hasPrePage.value
  },
  set(val) {
    emit("update:hasPrePage", val);
  },
})

const change = (item : any) => {
  emit("change", item)
};

const updatePage = (increase : boolean) => {
    emit("updatePage", increase)
};
</script>