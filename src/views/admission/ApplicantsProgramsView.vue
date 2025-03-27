<template>
  <div v-loading="loading">
    <div class="mb-8">
      <el-select
        v-model="program_id"
        placeholder="Program"
        @change="filterProgram"
        size="large"
        class="!w-64"
      >
        <el-option
          v-for="region of [
            { value: 'all', label: 'All' },
            ...guideStore.getTuitions,
          ]"
          :key="region.value"
          :label="region.label"
          :value="region.value"
        />
      </el-select>
    </div>
    <div class="mb-16">
      <el-table
        v-if="tableData.length"
        :data="tableData"
        :default-sort="defalutSort"
        border
        style="width: 100%"
        class="noHover"
        stripe
      >
        <el-table-column
          fixed
          prop="program"
          label="Programs"
          width="200"
          show-overflow-tooltip
        />
        <el-table-column
          prop="january"
          label="January"
          min-width="140"
          align="center"
        >
          <template #default="{ row }">
            <router-link
              :to="`/admission/applicants?date=${year}-01&program_id=${row.id}`"
              >{{ row.january }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="february"
          label="February"
          min-width="140"
          align="center"
        >
          <template #default="{ row }">
            <router-link
              :to="`/admission/applicants?date=${year}-02&program_id=${row.id}`"
              >{{ row.february }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="march"
          label="March"
          min-width="140"
          align="center"
        >
          <template #default="{ row }">
            <router-link
              :to="`/admission/applicants?date=${year}-03&program_id=${row.id}`"
              >{{ row.march }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="april"
          label="April"
          min-width="140"
          align="center"
        >
          <template #default="{ row }">
            <router-link
              :to="`/admission/applicants?date=${year}-04&program_id=${row.id}`"
              >{{ row.april }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="may" label="May" min-width="140" align="center">
          <template #default="{ row }">
            <router-link
              :to="`/admission/applicants?date=${year}-05&program_id=${row.id}`"
              >{{ row.may }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="june"
          label="June"
          min-width="140"
          align="center"
        >
          <template #default="{ row }">
            <router-link
              :to="`/admission/applicants?date=${year}-06&program_id=${row.id}`"
              >{{ row.june }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="july"
          label="July"
          min-width="140"
          align="center"
        >
          <template #default="{ row }">
            <router-link
              :to="`/admission/applicants?date=${year}-07&program_id=${row.id}`"
              >{{ row.july }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="august"
          label="August"
          min-width="140"
          align="center"
        >
          <template #default="{ row }">
            <router-link
              :to="`/admission/applicants?date=${year}-08&program_id=${row.id}`"
              >{{ row.august }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="september"
          label="September"
          min-width="140"
          align="center"
        >
          <template #default="{ row }">
            <router-link
              :to="`/admission/applicants?date=${year}-09&program_id=${row.id}`"
              >{{ row.september }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="october"
          label="October"
          min-width="140"
          align="center"
        >
          <template #default="{ row }">
            <router-link
              :to="`/admission/applicants?date=${year}-10&program_id=${row.id}`"
              >{{ row.october }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="november"
          label="November"
          min-width="120"
          align="center"
        >
          <template #default="{ row }">
            <router-link
              :to="`/admission/applicants?date=${year}-11&program_id=${row.id}`"
              >{{ row.november }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="december"
          label="December"
          min-width="120"
          align="center"
        >
          <template #default="{ row }">
            <router-link
              :to="`/admission/applicants?date=${year}-12&program_id=${row.id}`"
              >{{ row.december }}</router-link
            >
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          prop="total"
          sortable
          label="Total"
          min-width="120"
          align="center"
        />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApplicationStore, useGuideStore } from "@/stores";
import { ref, onMounted } from "vue";
const appStore = useApplicationStore();

const tableData: any = ref([...appStore.programsByMonth]);
const guideStore = useGuideStore();
const year = new Date().getFullYear();
const program_id = ref();
const loading = ref<boolean>(true);
const defalutSort: any = ref({ prop: "total", order: "descending" });

const filterProgram = () => {
  if (program_id.value === "all") {
    tableData.value = appStore.programsByMonth;
  } else {
    tableData.value = appStore.programsByMonth.filter(
      (x: any) => program_id.value == x.id
    );
  }
};
onMounted(async () => {
  if (!appStore.programsByMonth.length) {
    appStore.fetchProgramsByMonth().then(() => {
      tableData.value = appStore.programsByMonth;
    });
  }
  if (!guideStore.getTuitions.length) {
    guideStore.fetchTuitions();
  }
  loading.value = false;
});
</script>

<style scoped>
a:hover {
  color: brown;
  text-decoration: underline;
}
</style>
