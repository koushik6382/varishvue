<template>
  <div class="flex justify-between items-center bg-gray-200 dark:bg-inherit py-2 px-4 my-4">
    <div class="flex justify-center items-center space-x-2 h-10">
      <icon-button v-if="templateShow === true" @click="downloadTemplate()" name="Download Template" icon="Sheet" color="white" size="6" bg="primary" :access="true" />

      <div
        class="px-2 py-1 flex space-x-2 items-center rounded-md outline-dashed dark:bg-primary bg-inherit outline-2 outline-offset-1 outline-success dark:outline-slate-400 cursor-pointer"
        @click="openUploader"
      >
        <Icon class="lg:w-6 lg:h-6 w-4 h-4 ml-2 mr-2" color="black" darkColor="white" name="Upload" />
        <div class="whitespace-nowrap">
          {{ label }}
        </div>

        <div v-if="file" class="w-0.5 h-8 bg-primary dark:bg-slate-400"></div>
        <input
          type="file"
          id="csv-file-input-element"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          @change="handleFileUpload($event)"
          :key="fileInputKey"
          hidden
        />

        <div v-if="file" class="flex space-x-1 items-center">
          <div class="flex space-x-1 items-center">
            <div class="overflow-hidden truncate w-16">
              <span>{{ splitFileName(file.name)[0] }}</span>
            </div>
            <div class="rounded-lg bg-warning text-white px-2 py-1">
              <span>.{{ splitFileName(file.name)[1] }}</span>
            </div>
          </div>
        </div>
      </div>

      <icon-button v-if="file" @click="csvDownload()" name="Download" icon="Download" color="white" size="6" bg="primary" :access="true" />

      <icon-button v-if="file && isServerUpload" @click="csvUploadServer()" name="Upload To Server" icon="Server" color="white" size="6" bg="primary" :access="true" />

      <FileUpload
        v-if="isDirectUpload"
        v-model="uploadcsvfileD"
        content="Customize Upload"
        label="Customize Upload"
        :preview="false"
        :icon="{
          name: 'FilePlus',
          color: 'black',
          darkColor: 'white',
        }"
      />

      <icon-button v-if="file" @click="cleanCsv()" name="Clear CSV" icon="Trash2" color="white" size="6" bg="primary" :access="true" />
    </div>

    <div class="ml-4">
      <div class="flex justify-center items-center space-x-2 h-full" v-if="isDuplicate === true">
        <div class="w-3 h-3 rounded-full bg-danger"></div>
        <div class="text-base font-semibold">Duplicate Header found</div>
      </div>

      <div class="flex justify-center items-center space-x-2 h-full" v-if="isDuplicate === false">
        <div class="w-3 h-3 rounded-full bg-success"></div>
        <div class="text-base font-semibold">No duplicate Header</div>
      </div>
    </div>
  </div>

  <div class="intro-y col-span-12 overflow-auto" v-if="headerData.length > 0">
    <div class="py-2 flex justify-center items-center text-white space-x-2">
      <div v-for="(item, i) in matchingItem" :key="i">
        <div class="whitespace-nowrap rounded-full bg-success p-2" v-if="item.match === true">
          {{ item.name }}
        </div>

        <div class="whitespace-nowrap rounded-full bg-danger p-2" v-if="item.match === false">
          {{ item.name }}
        </div>
      </div>
    </div>
    <h2 class="font-medium text-lg mr-auto text-center pb-4">Uploaded Results</h2>
    <TextField v-model="search" label="" placeholder="Search....." :icon="{ name: 'Search', front: true, back: false }" />
    <table class="table table-bordered table-auto text-black dark:text-white">
      <thead>
        <tr class="uppercase whitespace-nowrap">
          <th
            class="whitespace-nowrap"
            v-for="(header, key) in headerData"
            :key="key"
            :style="[header.duplicate == true ? { border: `2px solid ${header.color}` } : { border: '' }]"
            :class="[header.match == false ? 'bg-red-200 dark:bg-red-300' : 'bg-transparent']"
          >
            <div class="flex justify-center items-center space-x-2">
              <div class="flex flex-col items-center justify-center space-y-1">
                <Tippy
                  tag="a"
                  href="javascript:;"
                  class="tooltip"
                  :content="
                    !header.match === false
                      ? 'This column header do not match with the headers on the server. Please rename the header'
                      : header.duplicate === true
                      ? 'Duplicate columns found. Remove duplicate or change column header'
                      : 'This column header matches with the headers'
                  "
                  :options="{
                    zIndex: 99999,
                  }"
                >
                  <div>{{ header.header }}</div>
                </Tippy>

                <div v-if="header.match === false || header.duplicate === true">
                  <div>
                    <div>
                      <div class="text-xs">Change</div>
                      <div class="flex justify-center items-center space-x-2">
                        <div class="w-56">
                          <Autocomplete v-if="!header.switch" v-model="header.formData" placeholder="SELECT" :items="matchList" />

                          <TextField v-else v-model="header.formData" placeholder="Change....." />
                        </div>

                        <icon-button
                          v-if="!header.switch"
                          @click="
                            () => {
                              header.switch = true;
                            }
                          "
                          :name="`Switch to Text Field`"
                          icon="ToggleRight"
                          color="pending"
                          darkColor="pending"
                          size="6"
                          :access="true"
                        />

                        <icon-button
                          v-else
                          @click="
                            () => {
                              header.switch = false;
                            }
                          "
                          :name="`Switch to Selection`"
                          icon="ToggleLeft"
                          color="pending"
                          darkColor="pending"
                          size="6"
                          :access="true"
                        />

                        <icon-button
                          @click="editHeader(header.header, header.formData, key)"
                          name="Change Header"
                          icon="CheckCircle"
                          color="success"
                          darkColor="success"
                          size="6"
                          :access="true"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <icon-button @click="deleteHeader(key, header.header)" name="Delete Columns" icon="Trash2" color="danger" darkColor="danger" size="6" :access="true" />
              </div>
            </div>
          </th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowKey) in _items" :key="rowKey" class="intro-x">
          <td v-for="(column, columnKey) in headerData" :key="columnKey" :class="[row[column.header] == '' ? 'bg-[#ffc001]' : 'bg-transparent']">
            <div v-if="row.isEdit === false">{{ row[column.header] }}</div>
            <div v-if="row.isEdit === true">
              <input id="vertical-form-1" v-model="row[column.header]" type="text" class="form-control w-auto" autocomplete="off" />
            </div>
          </td>

          <td class="table-report__action w-28">
            <div class="flex space-x-0.5">
              <icon-button
                v-if="row.isEdit === false"
                @click="editRecords({ item: row, index: rowKey })"
                name="Edit"
                icon="Edit"
                color="pending"
                darkColor="pending"
                size="6"
                :access="true"
              />
              <icon-button
                v-if="row.isEdit === true"
                @click="saveRecords({ item: row, index: rowKey })"
                name="Change"
                icon="Save"
                color="success"
                darkColor="success"
                size="6"
                :access="true"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-row sm:flex-nowrap">
      <Pagination v-model="_page" :total-pages="_totalPages" />
      <div class="hidden mx-auto md:block text-slate-500">
        {{ _info }}
      </div>
      <select class="w-20 mt-3 form-select box sm:mt-0" v-model="_itemsPerPage">
        <option :value="val" v-for="(val, i) in itemsPerPageOptions" :key="i">
          {{ val }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts" setup>
import toast from "@/utils/toast";
import Papa from "papaparse";
import { watch, onMounted, ref, computed, toRefs, withDefaults } from "vue";
import Pagination from "../data-table/pagination/Main.vue";
const emit = defineEmits<{
  // (e: "update:customizedUpload", val: any): void;
  (e: "downloadTemplate"): void;
  (e: "upload", file: any): void;
}>();

interface Props {
  exportName: string;
  list: any[];
  templateShow: boolean;
  label: string;
  isDirectUpload: boolean;
  isServerUpload: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  templateShow: true,
  label: "Upload CSV",
  isDirectUpload: true,
  isServerUpload: false,
  exportName: "csv",
});

const { exportName, list, templateShow, isDirectUpload, isServerUpload } = toRefs(props);

// const _customizedUpload = computed({
//   get() {
//     return customizedUpload.value;
//   },
//   set(val) {
//     emit("update:customizedUpload", val);
//   },
// });

let _page = ref<number>(1);

const file = ref<any>(null);
const content = ref<any>();
const parsed = ref<boolean>(false);
const headerData = ref<any[]>([]);
const rowData = ref<any[]>([]);
const formData = ref<string>("");
const isDuplicate = ref<boolean>(false);
const uploadcsvfile = ref<any>(null);
const uploadcsvfileD = ref<any>(null);
const matchList = ref<any[]>([]);
const matchingItem = ref<any[]>([]);
const fileInputKey = ref<number>(0);
const downloadFile = ref<number>(0);

const search = ref<string>("");
const itemsPerPageOptions = ref<number[]>([5, 10, 25, 50]);
const _itemsPerPage = ref<number>(5);

const _info = computed(() => {
  let start = _totalItems.value > 0 ? (_page.value - 1) * _itemsPerPage.value + 1 : 0;
  let end = _page.value * _itemsPerPage.value < _totalItems.value ? _page.value * _itemsPerPage.value : _totalItems.value;

  return `Showing ${start} to ${end} of ${_totalItems.value} entries`;
});

const openUploader = () => {
  const inputElement: HTMLElement = document.getElementById("csv-file-input-element")!;
  inputElement.click();
};

const handleFileUpload = (event: any) => {
  matchingItem.value = [];
  matchList.value = [];
  content.value = [];
  headerData.value = [];
  rowData.value = [];
  file.value = event.target.files[0];
  parseFile();
};
const parseFile = () => {
  Papa.parse(file.value, {
    // header: true,
    skipEmptyLines: true,
    complete: function (results: any) {
      content.value = results;

      let getDataArr: any[] = [];
      results.data.filter((x: any, i: number) => {
        if (x.length > 1) {
          if (x.filter((y: any) => y.length === 0).length < Math.round(list.value.length / 2)) {
            getDataArr.push(x);
          }
        }
      });

      let tempHeader = getDataArr[0];
      getDataArr.splice(0, 1);

      let matchArray = matchLists(list.value, tempHeader);
      matchList.value = notMatchLists(list.value, tempHeader);
      matchArray.forEach((e: any) => {
        var dt = {
          match: true,
          name: e,
        };
        matchingItem.value.push(dt);
      });

      matchList.value.forEach((e: any) => {
        var dt = {
          match: false,
          name: e,
        };
        matchingItem.value.push(dt);
      });

      let lowerCaseArry = tempHeader.map((m: any) => m.toUpperCase());

      lowerCaseArry.forEach((e: any) => {
        var dt = {
          duplicate: false,
          duplicateValue: "",
          match: false,
          header: e,
        };
        headerData.value.push(dt);
      });

      setDuplicate(lowerCaseArry);
      setMatching(matchArray);

      const result = [...new Set(getDataArr.map((a) => JSON.stringify(a)))].map((a) => JSON.parse(a));

      duplicateCheck(headerData.value);

      rowData.value = rowsToObjects(result, tempHeader).map((item: any) => {
        for (var key in item) {
          var upper = key.toUpperCase();

          if (upper !== key) {
            item[upper] = item[key];
            delete item[key];
          }
        }
        return item;
      });

      rowData.value.forEach((x) => {
        x.isEdit = false;
      });

      parsed.value = true;
      toast.success("File uploaded successfully");
    }.bind(this),
  });
};

const _totalItems = computed(() => {
  return _filteredItems.value?.length || 0;
});

const _totalPages = computed(() => {
  return Math.ceil(_totalItems.value / _itemsPerPage.value) || 1;
});

const filter = (values: readonly any[], query: string) => {
  return query?.trim()?.length > 0 ? values?.filter((x: any) => JSON.stringify(x)?.toLowerCase()?.includes(query?.trim()?.toLowerCase())) || [] : values || [];
};

const _filteredItems = computed(() => {
  return search.value && search?.value.trim().length > 0 ? filter([...rowData.value], search.value) : rowData.value;
});

const paginate = (values: any, page: number, itemsPerPage: number) => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return values?.slice(start, end) || [];
};

const _items = computed(() => {
  return paginate([..._filteredItems.value], _page.value, _itemsPerPage.value);
});

watch(
  () => uploadcsvfileD.value,
  (val) => {
    emit("upload", val);
  },
  { deep: true }
);

const matchLists = (list: any[], currentList: any[]) => {
  var newList = list.map((m) => m.toUpperCase());
  const output = newList.filter((obj) => {
    return currentList.map((m) => m.toUpperCase()).indexOf(obj) !== -1;
  });
  return output;
};

const notMatchLists = (list: any[], currentList: any[]) => {
  var newList = list.map((m) => m.toUpperCase());
  const output = newList.filter((obj) => {
    return currentList.map((m) => m.toUpperCase()).indexOf(obj) === -1;
  });
  return output;
};

const setMatching = (matchArray: any[]) => {
  for (var i = 0; i < headerData.value.length; i++) {
    if (matchArray.includes(headerData.value[i].header.toUpperCase()) === true) {
      headerData.value[i].match = true;
    } else {
      headerData.value[i].match = false;
    }
  }
};

const rowsToObjects = (rows: any, headers: any) => {
  return rows.map((r: any) => r.reduce((o: any, c: any, i: any) => Object.assign(o, { [headers[i]]: c }), {}));
};

const setDuplicate = (arr: any[]) => {
  for (var i = 0; i < headerData.value.length; i++) {
    let randomColor = "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0");

    if (tofindDuplicates(arr).includes(headerData.value[i].header.toUpperCase()) === true || headerData.value[i].header === "") {
      if (tofindDuplicates(arr).includes(headerData.value[i].header.toUpperCase()) === true) {
        headerData.value[i].duplicate = true;
        headerData.value[i].color = randomColor;

        let count = tofindDuplicates(arr).filter((x: any) => x.toUpperCase() === headerData.value[i].header.toUpperCase()).length;

        if (count < 2) {
          let idx = deleteDuplicateHeader(headerData.value[i].header.toUpperCase());
          headerData.value[idx].color = headerData.value[i].color;
        }
      }

      if (headerData.value[i].header === "") {
        headerData.value[i].duplicate = true;

        headerData.value[i].color = randomColor;
      }
    } else {
      headerData.value[i].duplicate = false;
      headerData.value[i].color = "#000000";
    }
  }
};

const tofindDuplicates = (arr: any[]) => {
  let newArr = arr.filter((item, index) => arr.indexOf(item) !== index);
  return newArr.map((m) => m.toUpperCase());
};

const duplicateCheck = (arr: any[]) => {
  var newArr: any[] = [];
  arr.forEach((x) => newArr.push(x.header));
  let arrcheck = tofindDuplicates(newArr);
  if (arrcheck.length > 0) {
    isDuplicate.value = true;
  } else {
    isDuplicate.value = false;
  }
  newArr = [];
  return isDuplicate.value;
};

const editHeader = (oldName: any, newn: any, index: any) => {
  if (newn == "") {
    if (newn == "") {
      toast.warning("Header Required");
    }
  } else {
    let newName = newn.toUpperCase();
    headerData.value.find((x) => {
      if (x.header === oldName) {
        headerData.value[index].header = newName;
      }
    });

    rowData.value.forEach((x) => {
      x[newName] = x[oldName];
      // delete x[oldName];
    });

    var newArr: any[] = [];
    headerData.value.forEach((x) => newArr.push(x.header));

    let matchArray = matchLists(list.value, newArr);
    matchList.value = notMatchLists(list.value, newArr);

    matchingItem.value = [];
    matchArray.forEach((e: any) => {
      var dt = {
        match: true,
        name: e,
      };
      matchingItem.value.push(dt);
    });

    matchList.value.forEach((e: any) => {
      var dt = {
        match: false,
        name: e,
      };
      matchingItem.value.push(dt);
    });

    setDuplicate(newArr);
    setMatching(matchArray);
    duplicateCheck(headerData.value);
    newArr = [];
    toast.success("Header name changed successfully");
  }
};

const editWOHeader = (oldName: any, newn: any, index: any) => {
  let newName = newn.toUpperCase();
  headerData.value.find((x: any) => {
    if (x.header === oldName) {
      headerData.value[index].header = newName;
    }
  });

  rowData.value.forEach((x) => {
    x[newName] = x[oldName];
    // delete x[oldName];
  });

  var newArr: any[] = [];
  headerData.value.forEach((x) => newArr.push(x.header));

  let matchArray = matchLists(list.value, newArr);
  matchList.value = notMatchLists(list.value, newArr);

  matchingItem.value = [];
  matchArray.forEach((e) => {
    var dt = {
      match: true,
      name: e,
    };
    matchingItem.value.push(dt);
  });

  matchList.value.forEach((e) => {
    var dt = {
      match: false,
      name: e,
    };
    matchingItem.value.push(dt);
  });

  setDuplicate(newArr);
  setMatching(matchArray);
  duplicateCheck(headerData.value);
  formData.value = "";
  newArr = [];
};

const deleteHeader = (index: any, header: any) => {
  let count = headerData.value.filter((x) => x.header === header).length;
  if (count < 2) {
    headerData.value.splice(index, 1);

    rowData.value.forEach((x) => {
      delete x[header];
    });

    var newArr: any[] = [];
    headerData.value.forEach((x) => newArr.push(x.header));
    setDuplicate(newArr);
    duplicateCheck(headerData.value);
    newArr = [];
    toast.success("Column removed successfully");
  } else {
    // failedToast(
    //   "Cannot delete column, Please change header name and try it"
    // );
    let newName = "DEL";
    editWOHeader(header, newName, index);
    headerData.value.splice(index, 1);
    rowData.value.forEach((x) => {
      delete x[newName];
    });

    var newArr = [];
    headerData.value.forEach((x) => newArr.push(x.header));
    setDuplicate(newArr);
    duplicateCheck(headerData.value);
    newArr = [];
    toast.success("Column removed successfully");
  }
};

const deleteDuplicateHeader = (header: any) => {
  return headerData.value.findIndex((f) => f.header === header);
};

const csvDownload = () => {
  downloadFile.value = 1;
  getCSVFile();
};

const csvUploadServer = () => {
  downloadFile.value = 2;
  getCSVFile();
  if (file.value !== null) {
    onFilePicked();
  }
};

const finalizeData = (row: any, header: any) => {
  return row.map((item: any) => {
    for (var key in item) {
      header.forEach((x: any) => {
        if (x.toLowerCase() === key.toLowerCase()) {
          item[x] = item[key];
          if (x !== key) {
            delete item[key];
          }
        }
      });
    }
    return item;
  });
};

const getCSVFile = () => {
  if (headerData.value.length <= 0) {
    toast.error("No data uploaded");
  } else {
    var generateDate = new Date().toJSON().slice(0, 10);
    var csvTitle = exportName.value + "_" + generateDate;
    let _rowData = JSON.parse(JSON.stringify(rowData.value));
    if (downloadFile.value === 1) {
      var csv = Papa.unparse(finalizeData(_rowData, list.value));
      var csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      var csvURL = window.URL.createObjectURL(csvData);

      var testLink = document.createElement("a");
      testLink.href = csvURL;
      testLink.setAttribute("download", `${csvTitle}.csv`);
      testLink.click();
      toast.success("File downloading is started");
    }
    if (downloadFile.value === 2) {
      getUploadfiles(finalizeData(_rowData, list.value));
    }
    downloadFile.value = 0;
  }
};

const getUploadfiles = (array: any) => {
  var csv = Papa.unparse(array);
  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  var fileblob = new File([blob], `fileupload.csv`, {
    lastModified: new Date().getTime(),
    type: "text/csv",
  });
  file.value = fileblob;
};

const onFilePicked = async () => {
  uploadcsvfile.value = file.value;
  emit("upload", file.value);
};

const cleanCsv = () => {
  content.value = [];
  headerData.value = [];
  rowData.value = [];
  file.value = "";
  fileInputKey.value++;
  matchList.value = [];
  matchingItem.value = [];
  toast.success("File cleared successfully");
};

const downloadTemplate = async () => {
  emit("downloadTemplate");
};

const editRecords = (obj: any) => {
  rowData.value[obj.index].isEdit = true;
};
const saveRecords = (obj: any) => {
  rowData.value.forEach((x, i) => {
    if (i === obj.index) {
      x.isEdit = false;
      x = Object.assign({}, obj.item);
    }
  });
};

const splitFileName = (str: string) => {
  let data = str.split(/\.(?=[^\.]+$)/);
  return data;
};

defineExpose({
  csvUploadServer,
});
</script>
<style scoped>
input::file-selector-button {
  font-weight: bold;
  color: white;
  padding: 0.5em;
  border: thin solid white;
  border-radius: 3px;
  background: none;
}
</style>
