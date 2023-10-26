<template>
  <div class="flex flex-col space-y-1 w-full relative">
    <div class=" inline-block w-full h-8 flex-1"
     :style="disabled ? 'pointer-events: none; cursor: not-allowed;' : 'cursor: pointer;'"
    :id="'outside-click-'+componentId"
     >
      <div class="relative w-full" @click="openDropdownToggle()">
        <div v-if="!multiple" class="flex items-end">
          <TextField
            class="w-full"
            :label="label"
            :tag="tag"
            v-model="modelText"
            :placeholder="_placeholder"
            :isAutocomplete="true"
            @clearSelected="clearSelected"
            :rule="rule"
            :isClear="false"
            :disabled="false"
            :loading="loading"
            :readonly="true"
          >
            <template v-slot:autocompleteLoading>
              <LoadingIcon icon="oval" color="white" class="w-6 h-6 text-pending !cursor-default" />
            </template>

            <template v-slot:autocompleteIcons>
              <Icon name="ChevronUp" size="4" :color="'white'" :darkColor="'white'" v-show="openToggle" @click="openDropdownToggle()"/>
              <Icon name="ChevronDown" size="4" :color="'white'" :darkColor="'white'" v-show="!openToggle" @click="openDropdownToggle()"  />
            </template>

          </TextField>

          <!-- <div class="p-[7px] input-group-text flex items-center justify-center !bg-primary rounded-r cursor-pointer hover:!bg-primary/75" v-if="!loading && _modelValue" @click="clearAutocomplete">
    <Icon name="X" size="6" :color="'white'" :darkColor="'white'"  />
  </div> -->
        </div>

        <MultipleSelect
          v-else
          v-model:modelText="modelText"
          :label="label"
          :placeholder="_placeholder"
          :tag="tag"
          :rule="rule"
          :disabled="disabled"
          :itemText="itemText"
          :isObject="resultObj"
          @removeSelected="removeSelected($event)"
          :loading="loading"
        >
        <template v-slot:autocompleteLoading>
              <LoadingIcon icon="oval" color="white" class="w-6 h-6 text-pending !cursor-default" />
            </template>

            <template v-slot:autocompleteIcons>
              <Icon name="ChevronUp" size="4" :color="'white'" :darkColor="'white'" v-show="openToggle" />
              <Icon name="ChevronDown" size="4" :color="'white'" :darkColor="'white'" v-show="!openToggle"  />
            </template>
        </MultipleSelect>
      </div>

      <div class="dropdown-menu w-full !px-1 show absolute top-20" data-popper-placement="bottom-end" v-show="openToggle">
        <ul class="dropdown-content">
          <li>
            <h6 class="dropdown-header">
              <div class="flex justify-between items-center space-x-1">
                <TextField class="w-full" v-model="search" placeholder="Search...." :isClear="false" />
                <Icon v-if="search" :name="'X'" size="6" color="pending" @click="clean" />
              </div>
            </h6>
          </li>
          <ul
            class="dropdown-content"
            :style="`max-height: ${itemsPerPage * 20}px; overflow: scroll;padding:0px; margin: 0px;`"
            @scroll="handleScroll"
            v-if="_items && _items?.length > 0 && !header?.length"
          >
            <li>
              <a class="dropdown-item cursor-pointer" v-for="(item, i) in _items" :key="i" @click="select(item)">{{ item[itemText] }}</a>
            </li>
          </ul>

          <ul
            class="dropdown-content"
            :style="`max-height: ${itemsPerPage * 20}px; overflow: scroll`"
            @scroll="handleScroll"
            v-if="_items && _items.length > 0 && header.length > 0"
          >
            <table class="table table-hover">
              <thead class="sticky -top-2 bg-slate-200 dark:bg-primary text-black dark:text-white z-50">
                <tr>
                  <th class="whitespace-nowrap uppercase" v-for="(head, i) in header" :key="i">
                    {{ head.text }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in _items" :key="i" :class="`intro-x cursor-pointer bg-${item?.tableColor ? item?.tableColor : 'inherit'}`" @click="select(item)">
                  <td v-for="(head, index) in header" :key="index">
                    {{ head.format ? head.format(item[head.value]) : item[head.value] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </ul>

          <ul class="dropdown-content text-center" v-if="(!_items || _items.length <= 0) && !isSearch && !loading">
            <div>No data</div>
          </ul>

          <ul class="dropdown-content text-center" v-if="(!_items || _items.length <= 0) && isSearch && !loading">
            <div>No filter data</div>
          </ul>

          <ul class="dropdown-content w-10 h-10 flex justify-center items-center space-x-1" v-if="loading">
            <LoadingIcon icon="puff" color="white" class="w-7 h-7" />
            <div>Loading...</div>
          </ul>
        </ul>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 w-full bg-slate-200 dark:bg-darkmode-200 rounded-md" v-if="header.length > 0 && infoEnable">
      <div v-for="(item, index) in _headerData" class="p-0.5">
        <div>
          {{ item.text }} :
          {{ item.format ? item.format(item.value) : item.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch, reactive, watchEffect, computed, onMounted, ref, toRefs, withDefaults, onBeforeMount, nextTick } from "vue";
import type { LoadOption, Props } from "./Types";
import MultipleSelect from "./MultipleSelect.vue";
import { uuid } from "@/utils/uuid";


const emit = defineEmits<{
  (e: "update:modelValue", val: any): void;
  (e: "load", val: LoadOption): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  itemText: "text",
  items: () => [],
  header: () => [],
  itemValue: "value",
  itemsPerPage: 10,
  multiple: false,
  label: "",
  resultObj: false,
  searchDelay: 1000,
  infoEnable: false,
  disabled: false,
  updatedItem: null,
});

const { modelValue, label, placeholder, items, itemText, itemValue, itemsPerPage, multiple, header, rule, tag, resultObj, searchDelay, infoEnable, disabled, updatedItem } =
  toRefs(props);

const show = ref<boolean>(false);
const search = ref<any>();
const isSearch = ref<boolean>(false);
const selected = ref<boolean>();
const serverItems = ref<any[]>([]);
const loading = ref<boolean>(false);
const loadTimer = ref<any>();
const searchTimer = ref<any>();

const modelText = ref<any>();

const openToggle = ref<boolean>(false);

const isServerSideRendering = ref<boolean>();

// const _icon = {
//   name: "ChevronUp",
//       color: "white",
//       darkColor: "white",
//       front: false,
//       back: true,
// }

// const componentId = Math.random().toString(36).substring(2,7);
const componentId = uuid().toString();

const _icon = computed(() => {
  if (openToggle.value) {
    return {
      name: "ChevronUp",
      color: "white",
      darkColor: "white",
      front: false,
      back: true,
    };
  } else {
    return {
      name: "ChevronDown",
      color: "white",
      darkColor: "white",
      front: false,
      back: true,
    };
  }
});

const options = {
  page: 0,
  itemsPerPage: itemsPerPage.value,
  totalItems: 0,
  search: "",
};

const _modelValue = computed({
  get() {
    return modelValue.value;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const _headerData = ref<any[]>([]);

const setValue = (obj: any) => {
  if (obj && header.value.length > 0) {
    _headerData.value = [];

    header.value.forEach((x: any) => {
      for (const [key, value] of Object.entries(obj)) {
        if (key === x.value) {
          let findObj: any = {
            text: x.text,
            value: value,
            format: x.format,
          };
          _headerData.value.push(findObj);
        }
      }
    });
  }
};

const clean = () => {
  search.value = "";
  options.page = 0;
  isSearch.value = false;
};
const clearSelected = () => {
  _modelValue.value = "";
};
const _placeholder = computed(() => {
  return loading.value ? "Loading..." : placeholder?.value === undefined ? label.value : placeholder.value;
});

const _serverSideRendering = computed(() => {
  return !(items.value && items.value.length > 0);
});

const _items = computed(() => {
  if (_serverSideRendering.value) {
    isServerSideRendering.value = true;
    return serverItems.value || [];
  } else {
    isServerSideRendering.value = false;
    if (itemText.value === "text" && itemValue.value === "value") {
      let cusList = items.value.map((m: any) => {
        return { text: m, value: m };
      });
      return (
        (!selected.value && search.value?.trim()?.length > 0
          ? cusList.filter((x: any) => x[itemText.value]?.toString()?.toLowerCase()?.includes(search.value?.toString()?.toLowerCase()))
          : cusList) || []
      );
    } else {
      return (
        (!selected.value && search.value?.trim()?.length > 0
          ? items.value.filter((x) => x[itemText.value]?.toString()?.toLowerCase()?.includes(search.value?.toString()?.toLowerCase()))
          : items.value) || []
      );
    }
  }
});

const openDropdownToggle = () => {
  openToggle.value = !openToggle.value;
};

watch(
  () => openToggle.value,
  (val) => {
    if(val){
      const specifiedElement = document.getElementById('outside-click-'+componentId) as HTMLDivElement; 
      window.addEventListener('click', event => {
      const isClickInside = specifiedElement.contains(event.target as any)
      if (!isClickInside) {
        openToggle.value = false
        if(search.value){
          search.value = ""
          isSearch.value = false;
        }
        
      }
    
})
    }
    //   if (val) {
    //   const event = new MouseEvent("click", {
    //   view: window,
    //   bubbles: true,
    //   cancelable: true,
    // });
    //   let idKey = "manualdropdownopen"
    //   let isClickedElement  = document.getElementById(idKey) as HTMLElement
    //   isClickedElement.dispatchEvent(event);
    //   }
    //   else{
    //     openToggle.value = false
    //   }
  }
);

watch(
  () => openToggle.value,
  (val) => {
    if (!val) {
      setText();
    }
  },
  { deep: true }
);

watch(
  () => _modelValue.value,
  (val) => {
    if (val) {
      setText();
    } else {
      setText();
      _headerData.value = [];
    }
  },
  { deep: true }
);

watch(
  () => search.value,
  (val) => {
    selected.value = false;
    if (_serverSideRendering.value) {
      clearTimeout(searchTimer.value);
      searchTimer.value = setTimeout(() => {
        if (val) {
          isSearch.value = true;
          options.page = 0;
          options.search = val;
          serverItems.value = [];
          loadMore();
        } else {
          isSearch.value = false;
          options.page = 0;
          options.search = val;
          serverItems.value = [];
          loadMore();
        }
      }, searchDelay.value);
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => _items.value,
  (val) => {
    if (val?.length > 0 && updatedItem.value) {
      if (!resultObj.value) {
        let findItem = val?.find((x) => x[itemValue.value] === _modelValue.value[itemValue.value])?.[itemText.value];
        if (!findItem) {
          _items.value.push(updatedItem.value);
          setText();
        }
      } else {
        let findItem = val?.find((x: any) => x[itemValue.value] === _modelValue.value[itemValue.value]);
        if (!findItem) {
          _items.value.push(updatedItem.value);
          setText();
        }
      }
    }

    if (val.length === 1 && !isSearch.value) {
      if (resultObj.value) {
        _modelValue.value = val[0];
      } else {
        _modelValue.value = val[0][itemText.value];
      }
    }
  }
);

onMounted(() => {
  if (isServerSideRendering) {
    loadMore();
  }
  setText();
});

const _list = ref<any[]>([]);
const select = (item: any) => {
  if (multiple.value) {
    if (resultObj.value !== true) {
      _list.value.push(item[itemValue.value]);
      _modelValue.value = _list.value;
    } else {
      _list.value.push(item);
      _modelValue.value = _list.value;
    }
  } else {
    if (resultObj.value !== true) {
      _modelValue.value = item[itemValue.value];
    } else {
      _modelValue.value = item;
    }

    if (header.value.length > 0) {
      setValue(item);
    }
  }

  openToggle.value = !openToggle.value;
};

const getText = (val: any) => {
  if (resultObj.value !== true) {
    return _items.value.find((x) => x[itemValue.value] === val)?.[itemText.value];
  } else {
    return _items.value?.find((x) => x[itemValue.value] === val[itemValue.value])?.[itemText.value];
  }
};

const setText = () => {
  if (multiple.value) {
    modelText.value =
      _modelValue?.value.length > 0
        ? _modelValue?.value.map((x: any) => {
            return x;
          })
        : [];
  } else {
    var val = getText(_modelValue.value);
    modelText.value = val;

    if (val) {
      setTimeout(() => {
        selected.value = true;
      }, 100);
    }
  }
};

const removeSelected = (index: number) => {
  _list?.value.splice(index, 1);
};

const handleScroll = (e: any) => {
  let el = e.target;
  if (el.offsetHeight + el.scrollTop >= el.scrollHeight) {
    loadMore();
  }
};

const loadMore = () => {
  if (!((options.page - 1) * itemsPerPage.value <= options.totalItems)) {
    return;
  }

  if (options.page == 0) {
    serverItems.value = [];
  }

  loading.value = true;

  clearTimeout(loadTimer.value);
  loadTimer.value = setTimeout(() => {
    var oldItems = serverItems.value.length <= 0 ? [] : serverItems.value;
    emit("load", {
      page: ++options.page,
      itemsPerPage: options.itemsPerPage,
      search: options.search,
      callback: (items: any[], tItems: number) => {
        serverItems.value = [...oldItems, ...items] || [];
        options.totalItems = tItems || 0;
        loading.value = false;
        setText();
      },
    });
  }, 1500);

  if (!isServerSideRendering.value) {
    loading.value = false;
  }
};
</script>
