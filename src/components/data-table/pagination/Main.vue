<script lang="ts" setup>
import { computed, toRefs, watch } from "vue";
interface Props {
    modelValue: number;
    totalPages: number;
    totalVisible?: number;
    isClicked : boolean;
}

const emit = defineEmits<{
    (e: 'update:modelValue', val: number): void
    (e: 'update:isClicked', val: boolean): void
}>()

const props = withDefaults(defineProps<Props>(), {
    modelValue : 1,
    totalPages : 1,
    totalVisible : 7,
    isClicked : false,
});
const {
    modelValue,
    totalPages,
    totalVisible,
    isClicked,
} = toRefs(props);

let currentPage = computed({
    get() {
        return modelValue.value;
    },
    set(val) {
        emit('update:modelValue', val)
    }
})

const _isClicked = computed({
    get() {
        return isClicked.value;
    },
    set(val) {
        emit('update:isClicked', val)
    }
})

const visiblePages = computed(() => {
    let startPage = 1;
    let endPage = totalPages.value;

    if (totalPages.value > totalVisible.value) {
        const half = Math.floor(totalVisible.value / 2);
        if (currentPage.value <= half) {
            endPage = totalVisible.value;
        } else if (currentPage.value + half >= totalPages.value) {
            startPage = totalPages.value - totalVisible.value + 1;
        } else {
            startPage = currentPage.value - half;
            endPage = currentPage.value + half;
        }
    }

    const pages = [];

    if (startPage > 1) {
        pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (endPage < totalPages.value) {
        pages.push("...");
    }

    return pages;
});

const hasFirstPage = computed(() => currentPage.value > 1);
const hasLastPage = computed(() => currentPage.value < totalPages.value);
const hasNextPage = computed(() => currentPage.value < totalPages.value);
const hasPreviousPage = computed(() => currentPage.value > 1);

const gotoFirstPage = () => {
    currentPage.value = 1;
    _isClicked.value = true;
}

const gotoLastPage = () => {
    currentPage.value = totalPages.value;
    _isClicked.value = true;
}

const gotoPage = (pageNumber: number) => {
    if(currentPage.value !== pageNumber){
        currentPage.value = pageNumber;
        _isClicked.value = true;
    }
}

const gotoNextPage = () => {
    currentPage.value++;
    _isClicked.value = true;
}

const gotoPreviousPage = () => {
    currentPage.value--;
    _isClicked.value = true;
}
</script>

<template>
    <nav class="w-full sm:w-auto sm:mr-auto">
        <ul class="pagination">
            <li :class="{ 'page-item': true, 'select-none pointer-events-none': !hasFirstPage }" @click="gotoFirstPage">
                <a class="page-link">
                    <ChevronsLeftIcon class="w-4 h-4" />
                </a>
            </li>
            <li :class="{ 'page-item': true, 'select-none pointer-events-none': !hasPreviousPage }"
                @click="gotoPreviousPage">
                <a class="page-link">
                    <ChevronLeftIcon class="w-4 h-4" />
                </a>
            </li>
            <li :class="['page-item', 'select-none', page == currentPage ? 'active'
                    : page == '...' ? 'pointer-events-none' : '']" @click="gotoPage(page as number)"
                v-for="(page, i) in visiblePages" :key="i">
                <a class="page-link">{{ page }}</a>
            </li>
            <li :class="{ 'page-item': true, 'select-none pointer-events-none': !hasNextPage }" @click="gotoNextPage">
                <a class="page-link">
                    <ChevronRightIcon class="w-4 h-4" />
                </a>
            </li>
            <li :class="{ 'page-item': true, 'select-none pointer-events-none': !hasLastPage }" @click="gotoLastPage">
                <a class="page-link">
                    <ChevronsRightIcon class="w-4 h-4" />
                </a>
            </li>
        </ul>
    </nav>
</template>    