<script lang="ts" setup>
import { watch, onMounted, ref, computed, toRefs, withDefaults,nextTick, onBeforeMount } from "vue";
import type { Props, Option, OptionWithDate } from "./Types";
import Pagination from "./pagination/Main.vue";
import { red } from "tailwindcss/colors";
import { pad } from "crypto-js";

const emit = defineEmits<{
  (e: "update:itemsPerPage", val: number): void;
  (e: "update:checkItem", val: any[]): void;
  (e: "load", options: Option): void;
  (e: "loadDate", options: OptionWithDate): void;
  (e: "expandEvent", val: any): void;
  (e: "closeExpandEvent", val: any): void;
  (e: "update:serverItems", val: any[]): void;
  (e: "update:serverItemsTotal", val: number): void;
  (e: "update:fromDate", val: string): void;
  (e: "update:toDate", val: string): void;
  (e: "update:status", val: string): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  headers: () => [],
  items: () => [],
  search: "",
  itemsPerPage: 10,
  itemsPerPageOptions: () => [5, 10, 25, 50],
  searchDelay: 1500,
  scroll: false,
  checkItem: () => [],
  isExpanded: false,
  isCheckbox: true,
  condition: () => {
    return true;
  },
  isDateOption: false,
  fromDate: "",
  toDate: "",
  status: 0,
  padding: "!py-0"
});

const {
  isDateOption,
  fromDate,
  toDate,
  condition,
  headers,
  items,
  search,
  itemsPerPage,
  itemsPerPageOptions,
  searchDelay,
  scroll,
  checkItem,
  isExpanded,
  serverItems,
  serverItemsTotal,
  isCheckbox,
  status,
  padding
} = toRefs(props);

const _serverSideRendering = computed(() => {
  return !(items.value && items.value.length > 0);
});

let _page = ref<number>(1);

let _scrollPage = ref<number>(1);

const _activeScroll = ref<boolean>(false);
const isClicked = ref<boolean>(false);

const itemsPerPageDef = ref<number>(itemsPerPage.value);

const _status = computed({
  get() {
    return status.value;
  },
  set(val) {
    emit("update:status", val);
  },
});

const _fromDate = computed({
  get() {
    return fromDate.value;
  },
  set(val) {
    emit("update:fromDate", val);
  },
});

const _toDate = computed({
  get() {
    return toDate.value;
  },
  set(val) {
    emit("update:toDate", val);
  },
});

let _itemsPerPage = computed({
  get() {
    return itemsPerPageDef.value;
  },
  set(val) {
    itemsPerPageDef.value = val;
    emit("update:itemsPerPage", val);
  },
});

 const innerServerSideItems = ref<any[]>([]);
const _serverSideItems = computed({
  get() {
    return serverItems.value || innerServerSideItems.value;
  },
  set(val) {
    innerServerSideItems.value = val;
    emit("update:serverItems", val);
  },
});

const innerServerSideTotalItems = ref<number>(0);
const _serverSideTotalItems = computed({
  get() {
    return serverItemsTotal.value || innerServerSideTotalItems.value;
  },
  set(val) {
    innerServerSideTotalItems.value = val;
    emit("update:serverItemsTotal", val);
  },
});

const load = (callback?: any) => {
  if (!isDateOption.value) {
    const options = {
      page: _activeScroll.value && !isClicked.value ? _scrollPage.value : _page.value,
      itemsPerPage: _itemsPerPage.value,
      search: search.value,
      callback: (items: any[], totalItems: number) => {
        if(_activeScroll.value && !isClicked.value){
          _serverSideItems.value = [...JSON.parse(JSON.stringify(_serverSideItems.value)),...items]
        }else{
          _serverSideItems.value = items;
        }
        _serverSideTotalItems.value = totalItems;
        callback && callback();
      },
      
    };

    emit("load", options);
  } 
  else {
    const options = {
      page: _activeScroll.value && !isClicked.value ? _scrollPage.value : _page.value,
      itemsPerPage: _itemsPerPage.value,
      search: search.value,
      fromDate: fromDate.value,
      toDate: toDate.value,
      callback: (items: any[], totalItems: number) => {
        if(_activeScroll.value && !isClicked.value){
          _serverSideItems.value = [...JSON.parse(JSON.stringify(_serverSideItems.value)),...items]
        }else{
          _serverSideItems.value = items;
        }
        _serverSideTotalItems.value = totalItems;
        callback && callback();
      },
    };

    emit("loadDate", options);
  }
};

onMounted(() => {
  if (_serverSideRendering.value) {
    load();
  }
});

let searchTimer: NodeJS.Timeout;
let isSearching: boolean = false;
watch(
  () => [search.value, _page.value, _itemsPerPage.value],
  ([newSearch, newPage, newItemsPerPage], [oldSearch, oldPage, oldItemsPerPage]) => {
    if (newSearch !== oldSearch) {
      isSearching = true;
      if(_activeScroll.value && !isClicked.value){
        _serverSideItems.value = []
       //_serverSideItems.value = []
        _scrollPage.value = 1
      }else{
        _page.value = 1;
      }
      
    }

    clearTimeout(searchTimer);
    searchTimer = setTimeout(
      () => {
        load(() => {
          isSearching = false;
        });
      },
      isSearching ? searchDelay.value : 100
    );
  }
);

watch(
  () => _fromDate.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      if(_activeScroll.value && !isClicked.value){
        _serverSideItems.value = []
        _scrollPage.value = 1
      }else{
        _page.value = 1;
      }
    }

    load();
  }
);

watch(
  () => _toDate.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      if(_activeScroll.value && !isClicked.value){
        _serverSideItems.value = []
        _scrollPage.value = 1
      }else{
        _page.value = 1;
      }
    }
    load();
  }
);

watch(
  () => _status.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      if(_activeScroll.value && !isClicked.value){
        _serverSideItems.value = []
        _scrollPage.value = 1
      }else{
        _page.value = 1;
      }
    }
    load();
  }
);

const _filteredItems = computed(() => {
  return search.value && search?.value.trim().length > 0 ? filter([...items.value], search.value) : items.value;
});

const _items = computed(() => {
  if(_activeScroll.value && !isClicked.value){
    return _serverSideRendering.value ? _serverSideItems.value : _filteredItems.value;
  }else{
    return _serverSideRendering.value ? _serverSideItems.value : paginate([..._filteredItems.value], _page.value, _itemsPerPage.value);
  }
});

const _totalItems = computed(() => {
  return _serverSideRendering.value ? _serverSideTotalItems.value : _filteredItems.value?.length || 0;
});

const _totalPages = computed(() => {
  return Math.ceil(_totalItems.value / _itemsPerPage.value) || 1;
});

const _info = computed(() => {
  let start = _totalItems.value > 0 ? (_page.value - 1) * _itemsPerPage.value + 1 : 0;
  let end = _page.value * _itemsPerPage.value < _totalItems.value ? _page.value * _itemsPerPage.value : _totalItems.value;

  return `Showing ${start} to ${end} of ${_totalItems.value} entries`;
});

const filter = (values: readonly any[], query: string) => {
  return query?.trim()?.length > 0 ? values?.filter((x: any) => JSON.stringify(x)?.toLowerCase()?.includes(query?.trim()?.toLowerCase())) || [] : values || [];
};

const paginate = (values: any, page: number, itemsPerPage: number) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return values?.slice(start, end) || [];
};

const getObjValue = (obj: any, header: any) => {
  var key: string = header.value;
  var format: any = header.format;
  return (
    key?.split(".")?.reduce((pre, curr) => {
      return pre ? (format ? format(obj[curr]) : typeof obj[curr] === "number" && obj[curr] === 0 ? "0" : obj[curr]) : "";
    }, obj) || ""
  );
};

const tabelScroll = ref();

const handleScroll = (el: any) => {
  isClicked.value = false;
    //console.log('el',el);
    // let totalScroll = el.target.offsetHeight + el.target.scrollTop
    // console.log('ini',el.target.offsetHeight, el.target.scrollTop,totalScroll,el.target.scrollHeight);
    if (Math.round(el.target.offsetHeight + el.target.scrollTop) >= el.target.scrollHeight) {
      if (_totalPages.value > _scrollPage.value) {
        _activeScroll.value = true
        _scrollPage.value++;
        tabelScroll.value.scroll(0, el.target.scrollTop);
        load() 
        //tabelScroll.value.scroll(0, el.target.scrollTop);
        //  console.log('el',totalScroll,el.target.scrollHeight,_totalPages.value,_scrollPage.value);
      }
    }
  
};


watch(()=> isClicked.value,(val)=>{
  if(val){
    _activeScroll.value = false
    innerServerSideItems.value = []
    //_serverSideItems.value = []
    tabelScroll.value.scroll(0, 0);
    _scrollPage.value = _page.value
    nextTick(()=>{
      isClicked.value = false
    })
  }
})

// watch(()=> _scrollPage.value,(val)=>{
//   console.log('scroll load',val);
//   load()
// })

// watch(()=> _page.value,(val)=>{
//   if(val){
//     _scrollPage.value = _page.value
//     console.log(' isClicked true',_scrollPage.value,_page.value);
//   }
// })

// watch(()=> _items.value,(val)=>{
//   console.log('_items',val,_scrollPage.value,_page.value,isClicked.value,_activeScroll.value);
// })

const isSelected = ref<boolean>(false);
const _checkItem = computed({
  get() {
    return checkItem.value;
  },
  set(val) {
    emit("update:checkItem", val);
  },
});

const conditionListLength = () => {
  let list = _items.value.filter((x: any) => {
    return condition.value(x);
  });

  return list ? list.length : 0;
};

const selectAll = () => {
  isSelected.value = true;
  if (typeof condition.value === "function") {
    _items.value.forEach((x: any) => {
      if (condition.value(x)) {
        _checkItem.value.push(x);
      }
    });
  } else {
    _checkItem.value = _items.value;
  }
};

const unSelectAll = () => {
  isSelected.value = false;
  _checkItem.value = [];
};

// watch(
//   () => _checkItem.value,
//   (val) => {
//     console.log("_checkItem.value", _checkItem.value);
//   },
//   { deep: true }
// );
const sub = ref<any[]>([]);
const index = ref<number>(-1);
const openSubRow = (item: any, idx: number) => {
  closeSubRow(sub.value,index.value)
  sub.value = item;
  index.value = idx;
  emit("expandEvent", { item: sub.value, index: index.value });
  return sub.value;
};

const closeSubRow = (item: any, idx: number) => {
  emit("closeExpandEvent",{ item: item, index: idx });
  index.value = -1;
};

defineExpose({
  load,
});

</script>

<template>
  <div :style="scroll ? 'height :56vh' : '' " :class="scroll ? 'col-span-12 overflow-auto w-full intro-y my-4' : 'col-span-12 overflow-auto intro-y my-4'" ref="tabelScroll" @scroll="handleScroll">
    <table class="table table-auto table-report">
      <thead :class="scroll ? 'sticky top-0 z-50 bg-slate-100 dark:bg-darkmode-700' : 'bg-slate-100 dark:bg-darkmode-700'">
        <tr>
          <th v-if="isExpanded" class="!px-2 !py-0"></th>
          <th
            class="uppercase whitespace-nowrap !px-2 !py-0"
            v-for="(header, i) in headers"
            :key="i"
            :class="header.value === 'action' ? 'sticky right-0 z-50 bg-slate-100 dark:bg-darkmode-700' : ''"
          >
            {{ header.text }}
          </th>
          <th v-if="_items.length > 0 && isCheckbox" class="cursor-pointer !px-2 !py-0">
            <div class="flex items-center justify-center">
              <icon-button
              v-if="typeof condition === 'function' ? _checkItem.length === conditionListLength() : _checkItem.length === _items.length"
              @click="unSelectAll"
              name="Unselect All"
              icon="CheckSquare"
              size="6"
              :access="true"
            />

            <icon-button v-else @click="selectAll" name="Select All" icon="Square" size="6" :access="true" />
            </div>
           
          </th>
        </tr>
      </thead>
      <tbody v-if="_items.length > 0">
        <template v-for="(item, i) in _items" :key="i">
          <tr class="intro-x">
            <td v-if="isExpanded" :class="`!px-2 ${padding}`">
              <Icon name="ChevronDown" size="6" color="black" darkColor="white" v-if="i > -1 && !(index === i)" @click="openSubRow(item, i)" />
              <Icon name="ChevronUp" size="6" color="black" darkColor="white" v-if="index === i" @click="closeSubRow(item,i)" />
            </td>

            <template v-for="(header, index) in headers" :key="index">
              <td v-if="$slots[header.value]" :class="header.value === 'action' ? `sticky right-0 z-50 bg-slate-100 dark:bg-darkmode-700 !px-2 ${padding}` : ''">
                <slot :name="header.value" v-bind:item="item" />
              </td>

              <!-- <td v-html="getObjValue(item, header.value)" v-else></td> -->
              <td v-html="getObjValue(item, header)" v-else :class="`!px-2 ${padding}`"></td>
            </template>

            <template v-if="isCheckbox">
              <td v-if="typeof condition === 'function' ? condition(item) : true" :class="`!px-2 ${padding}`">
                <div class="flex items-center justify-center">
                  <checkbox label="" :value="item" v-model="_checkItem" />
                </div>
                
              </td>
              <td v-else :class="`!px-2 ${padding}`"></td>
            </template>
          </tr>

          <tr v-if="i === index && isExpanded">
            <td :colspan="1000" :class="`!px-2 ${padding}`">
              <slot name="expanded" v-bind:subItem="sub" />
            </td>
          </tr>
        </template>
      </tbody>
      <tbody v-else>
        <tr class="intro-x">
          <td :colspan="1000" class="text-center" v-if="isSearching">Loading....</td>
          <td :colspan="1000" class="text-center" v-else>No Data</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-row sm:flex-nowrap">
    <pagination v-model="_page" v-model:isClicked="isClicked" :total-pages="_totalPages" v-if="_totalPages > 1" />
    <div class="hidden mx-auto md:block text-slate-500">
      {{ _info }}
    </div>
    <select class="w-20 mt-3 form-select box sm:mt-0" v-model="_itemsPerPage">
      <option :value="val" v-for="(val, i) in itemsPerPageOptions" :key="i">
        {{ val }}
      </option>
    </select>
  </div>
</template>
