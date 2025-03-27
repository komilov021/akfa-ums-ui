<template>
  <el-popover
    placement="bottom"
    title="Choose year and semester"
    :width="350"
    trigger="click"
    v-model:visible="isPopoverVisible"
  >
    <template #reference>
      <el-button class="stat-btn !rounded-md" circle>
        <Setting class="w-4 h-4" />
      </el-button>
    </template>
    <div class="px-8 flex flex-col space-y-2 semestr">
      <div class="space-y-2">
        <h1 class="relative -left-8 text-base">From</h1>
        <Splide :options="settings">
          <SplideSlide
            v-for="item in examDatesStore.getYearsSelct"
            :key="item.value"
            @click="fromYear = item.value"
          >
            <div
              class="splide__item"
              :class="{ 'splide__item--active': item.value == fromYear }"
            >
              {{ item.label }}
            </div>
          </SplideSlide>
        </Splide>
        <div class="flex items-center justify-center gap-2">
          <el-button
            link
            v-for="sem in fromSemestrs"
            :key="sem.id"
            :class="{
              '!text-primary': sem.row_number === semestrs.from_semester,
            }"
            @click="updateSemestrFrom(sem.row_number)"
            >{{ sem.name }}</el-button
          >
        </div>
      </div>
      <div class="space-y-2">
        <h1 class="relative -left-8 text-base">Till</h1>
        <Splide :options="settings">
          <SplideSlide
            v-for="item in examDatesStore.getYearsSelct"
            :key="item.value"
            @click="toYear = item.value"
          >
            <div
              class="splide__item"
              :class="{ 'splide__item--active': item.value == toYear }"
            >
              {{ item.label }}
            </div>
          </SplideSlide>
        </Splide>
        <div class="flex items-center justify-center gap-2">
          <el-button
            link
            v-for="sem in toSemestrs"
            :key="sem.id"
            :class="{
              '!text-primary':
                sem.row_number === statisticsStore.getFilters?.semestrs?.to,
            }"
            @click="updateSemestrTo(sem.row_number)"
            >{{ sem.name }}</el-button
          >
        </div>
      </div>
    </div>
    <el-button
      @click="
        $emit('onSubmit', semestrs);
        isPopoverVisible = !isPopoverVisible;
      "
      class="w-full mt-8"
      size="large"
      color="#F3F3F3"
      >Submit</el-button
    >
  </el-popover>
</template>

<script setup lang="ts">
import { Setting } from "@element-plus/icons-vue";
import { computed, onMounted, ref, reactive, watch } from "vue";
import { useAcademicStore, useStatisticsStore } from "../../../../stores";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";

defineEmits(["onSubmit"]);
const settings = {
  perPage: 3,
  gap: "10px",
  pagination: false,
} as any;

const props = defineProps<{
  semesters?: any;
}>();
const examDatesStore = useAcademicStore();
const statisticsStore = useStatisticsStore();
const isPopoverVisible = ref(false);

const semestrs = reactive<any>({
  from_semester: statisticsStore.getFilters.semestrs?.from,
  to_semester: statisticsStore.getFilters.semestrs?.to,
});

const fromSemestrs = computed(() =>
  examDatesStore.semestrs.filter((item) => item.year === fromYear.value)
);
const toSemestrs = computed(() =>
  examDatesStore.semestrs.filter((item) => item.year === toYear.value)
);

watch(
  () => props.semesters,
  (val) => {
    console.log("val", val);
    if (val) {
      Object.assign(semestrs, val);
    }
  }
);

onMounted(() => {
  if (props.semesters) {
    Object.assign(semestrs, props.semesters);
  }
  fromYear.value = fromSemestr.value?.year;
  toYear.value = toSemestr.value?.year;
});

const fromSemestr = computed(() =>
  examDatesStore.semestrs.find(
    (item) => item.row_number === statisticsStore.filter.semestrs?.from
  )
);
const toSemestr = computed(() =>
  examDatesStore.semestrs.find(
    (item) => item.row_number === statisticsStore.filter.semestrs?.to
  )
);
const fromYear = ref<any>();
const toYear = ref<any>();

const updateSemestrFrom = (from: number) => {
  semestrs.from_semester = from;
  statisticsStore.updateSemestr({
    ...statisticsStore.filter.semestrs,
    from,
  });
};
const updateSemestrTo = (to: number) => {
  semestrs.to_semester = to;
  statisticsStore.updateSemestr({
    ...statisticsStore.filter.semestrs,
    to,
  });
};
</script>
<style lang="scss">
.semestr {
  .splide__arrow--prev {
    left: -2rem;
  }

  .splide__arrow--next {
    right: -2rem;
  }

  .splide__arrow svg {
    fill: #6941c6;
  }

  .splide {
    &__arrow {
      background-color: #d9d9d9;
      border-radius: 50%;
    }

    &__item {
      display: flex;
      padding: 4px 8px;
      justify-content: center;
      align-items: center;
      border-radius: 50px;
      border: 2px solid #000;
      cursor: pointer;
      // margin-right: 4px;
    }

    &__item--active {
      border: none;
      padding: 6px 12px;
      background-color: #6941c6;
      color: #fff;
    }
  }
}
</style>
