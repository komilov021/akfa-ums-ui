<template>
  <div class="semestr-arrow">
    <Splide :options="settings" @splide:move="changed">
      <SplideSlide v-for="item in semestrs" :key="item.id">
        <div class="splide__item">{{ item.year }} {{ item.name }}</div>
      </SplideSlide>
    </Splide>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useAcademicStore, useStatisticsStore } from "../../../../stores";
import { Splide, SplideSlide } from "@splidejs/vue-splide";

import "@splidejs/vue-splide/css";

const emit = defineEmits(["onChange"]);

const academicStore = useAcademicStore();
const statisticsStore = useStatisticsStore();

const changed = (event: any, newIndex: number) => {
  emit("onChange", semestrs.value[newIndex].row_number);
};
const fromSemestr = computed(() =>
  academicStore.semestrs.findIndex(
    (item) => item.row_number === statisticsStore.filter.semestrs?.from
  )
);
const toSemestr = computed(() =>
  academicStore.semestrs.findIndex(
    (item) => item.row_number === statisticsStore.filter.semestrs?.to
  )
);

const semestrs = computed(() =>
  academicStore.semestrs.slice(fromSemestr.value, toSemestr.value + 1)
);

const settings = {
  perPage: 1,
  gap: "10px",
  pagination: false,
  start: toSemestr.value,
} as any;
</script>

<style lang="scss">
.semestr-arrow {
  .splide {
    left: -1.2rem;
    &__arrow {
      background-color: transparent;
      border-radius: 50%;
    }

    &__item {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }

    &__item--active {
      border: none;
      background-color: #6941c6;
      color: #fff;
    }
  }
}
</style>
