<template>
  <div class="px-4">
    <div class="table-wrapper mt-8" v-loading="loading">
      <el-table
        :data="programs"
        class="whiteStripe"
        row-class-name="noHover"
        style="width: 100%"
        height="90vh"
      >
        <el-table-column
          prop="program"
          label="Program"
          min-width="300"
          align="left"
          fixed="left"
        />
        <el-table-column
          prop="school"
          label="School"
          min-width="250"
          align="left"
        />
        <el-table-column
          label="Actions"
          min-width="120"
          align="center"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              class="!px-2"
              @click="router.push(`/finance/programs/${row.program_id}`)"
            >
              <View class="h-5 w-5" color="#0D0D0D" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useFinanceStore } from "@/stores";
import { View } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
const financeStore = useFinanceStore();
const loading = ref(false);
const programs = computed(() => financeStore.programs);
const router = useRouter();
onMounted(() => {
  fetchList();
});

const fetchList = () => {
  financeStore.fetchPaymentProgramList();
};
</script>
