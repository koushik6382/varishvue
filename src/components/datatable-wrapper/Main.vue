<template>
  <!-- <Loading
    v-model:active="loading"
    color="#164e63"
    loader="bars"
    :width="100"
    :height="100"
  /> -->
  <!-- <data-table v-bind="$props" v-model:options="_options"> -->
  <!-- formatting values -->
  <!-- <template v-for="(h, i) in _formattingHeaders" v-slot:[h.value]="{ item }" :key="i">
      <div>{{ format(h.type, item[h.value]) }}</div>
    </template> -->
  <!-- formatting values-->

  <!-- switch option -->
  <!-- <template v-for="(h, i) in headers.filter((x) => x.type === 'switch')" v-slot:[h.value]="{ item }" :key="i">
      <div class="ml-3 form-switch">
        <input type="checkbox" v-model="item[h.value]" class="form-check-input" @change="switchClick(h.value, item)"
          :disabled="h.disabled" />
      </div>
    </template> -->
  <!-- switch option -->

  <!-- more customizing slots -->
  <!-- <template v-for="name in Object.keys($slots)" v-slot:[name]="{ item }">
      <slot :name="name" v-bind:item="item" />
    </template> -->
  <!-- more customizing slots -->
  <!-- </data-table> -->
</template>
<script>
// import Loading from "vue-loading-overlay";
// import "vue-loading-overlay/dist/css/index.css";
// import DataTable from "./data-table.vue";

// import Props from './data-table.vue'

export default {
  name: "DataTableWrapper",
  inheritAttrs: false,
  components: {

  },
  props: {
    headers: {
      type: Array,
      default: [],
    },
    items: {
      type: Array,
      default: [],
    },
    itemsPerPageOptions: {
      type: Array,
      default: [5, 10, 25, 50],
    },
    serverItemsLength: {
      type: Number,
      default: 0,
    },
    options: {
      type: Object,
      default: {
        page: 1,
        itemsPerPage: 10,
      },
    },
    search: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    _formattingHeaders() {
      let options = ["date", "time", "datetime", "currency"];
      return (
        this.headers.filter((x) => !!x.type && options.includes(x.type)) || []
      );
    },
    _options: {
      get() {
        return this.options;
      },
      set(val) {
        this.$emit("update:options", val);
      },
    },
  },
  methods: {
    format(type, val) {
      switch (type) {
        case "date":
          return this.$format.date.format(val);
        case "time":
          return this.$format.time.format(val);
        case "datetime":
          return this.$format.datetime.format(val);
        case "currency":
          return this.$format.currency.format(val);
        default:
          return val;
      }
    },
    switchClick(field, item) {
      this.$emit(field.toLowerCase() + "-click", item);
    },
  },
};
</script>
