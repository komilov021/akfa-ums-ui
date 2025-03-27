<template>
  <div
    class="grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-3 md:gap-6 px-5 sm:px-0"
  >
    <div class="miniCard" @click="dropdown1.ref?.click()">
      <div class="py-2 px-4">
        <p
          class="font-semibold tracking-tight leading-none sm:text-[16.24px] text-xs md:text-36"
        >
          Number of students
          <span class="lowercase">
            {{ activeSchool1 == "All" ? "" : activeSchool1 }}
          </span>
        </p>
        <p
          class="text-[#C8C7C7] tracking-tight leading-none sm:text-[12.57px] text-[11px] md:mt-0"
        >
          current semester
        </p>
        <h1
          class="text-2xl md:text-[53px] sm:text-[40px] my-auto font-bold mt-3 md:mt-7"
        >
          {{ $n(props.studentsMetrics?.count_total || 0) }}
        </h1>
      </div>
      <div>
        <div class="h-[1px] mt-8 bg-[#EAECF0] space" />
        <div class="flex justify-end px-3 py-2">
          <el-dropdown trigger="click">
            <el-button class="stat-btn" ref="dropdown1"
              >Choose school</el-button
            >
            <template #dropdown>
              <el-dropdown-menu class="h-48 md:h-full">
                <el-dropdown-item
                  @click="
                    $emit('updateStudent', school.value),
                      (activeSchool1 = school.label)
                  "
                  v-for="(school, i) in [
                    { label: 'All', value: null },
                    ...schools,
                  ]"
                  :key="i"
                  ><span class="md:text-[14px] text-[12px] leading-0">{{
                    school.label
                  }}</span></el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <div class="miniCard" @click="dropdown4.ref?.click()">
      <div class="py-2 px-4">
        <p
          class="font-semibold tracking-tight leading-none sm:text-[16.24px] text-xs md:text-36"
        >
          Number of teacher
          <span class="lowercase">
            {{ activeSchool3 == "All" ? "" : activeSchool3 }}
          </span>
        </p>
        <p
          class="text-[#C8C7C7] tracking-tight leading-none sm:text-[12.34px] text-[11px]"
        >
          current semester {{ teacherType ? "/ " + teacherType : "/ All" }}
        </p>
        <div class="flex items-center gap-2 mt-3 md:mt-7">
          <h1 class="text-2xl md:text-[53px] sm:text-[40px] my-auto font-bold">
            {{ selectedTeacherData || 0 }}
          </h1>
        </div>
      </div>
      <div>
        <div class="h-[1px] mt-8 bg-[#EAECF0] space" />
        <div class="flex gap-1 sm:gap-2 justify-end px-1 sm:px-3 py-2">
          <el-dropdown trigger="click">
            <el-button class="stat-btn">Teacher type</el-button>
            <template #dropdown>
              <el-dropdown-menu class="h-48 md:h-full">
                <el-dropdown-item
                  v-for="(item, index) in teacherFilterData"
                  :key="index"
                  @click="selectTeacherFilter(item)"
                >
                  <span class="md:text-[14px] text-[12px] leading-0">{{
                    item.label
                  }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown trigger="click">
            <el-button class="stat-btn">Choose school</el-button>
            <template #dropdown>
              <el-dropdown-menu class="h-48 md:h-full">
                <el-dropdown-item
                  @click="
                    $emit('updateTeacher', school.value),
                      (activeSchool3 = school.label)
                  "
                  v-for="(school, i) in [
                    { label: 'All', value: null },
                    ...schools,
                  ]"
                  :key="i"
                  ><span class="md:text-[14px] text-[12px] leading-0">{{
                    school.label
                  }}</span></el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="miniCard">
      <div class="py-2 px-4">
        <p
          class="font-semibold tracking-tight leading-none sm:text-[16.24px] text-xs md:text-36"
        >
          Student per teacher ratio
        </p>
        <div class="flex items-center relative top-[2px]">
          <h1
            class="text-[#C8C7C7] tracking-tight leading-none sm:text-[12.57px] text-[11px] md:mt-0"
          >
            <!-- {{ selectedTeacherData || 0 }} -->
            {{ activeSchool4 ? activeSchool4 : "All" }}
          </h1>
        </div>
        <h1
          v-if="teacherPerStudentRadio"
          class="text-2xl md:text-[53px] sm:text-[40px] my-auto font-bold mt-3.5 md:mt-6"
        >
          {{ $n(teacherPerStudentRadio?.student_per_teacher_ratio || 0) }}
          <!-- 14.2 -->
          <span class="text-xl md:text-[33px] sm:text-[20px]">/1</span>
        </h1>
      </div>
      <div>
        <div class="h-[1px] mt-8 bg-[#EAECF0] space" />
        <div class="flex justify-end px-3 py-2">
          <el-dropdown trigger="click">
            <el-button class="stat-btn" ref="dropdown5"
              >Choose school</el-button
            >
            <template #dropdown>
              <el-dropdown-menu class="h-48 md:h-full">
                <el-dropdown-item
                  @click="
                    $emit('updateStudentPerTeacher', school.value),
                      (activeSchool4 = school.label)
                  "
                  v-for="(school, i) in [
                    { label: 'All', value: null },
                    ...schools,
                  ]"
                  :key="i"
                  ><span class="md:text-[14px] text-[12px] leading-0">{{
                    school.label
                  }}</span></el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="miniCard">
      <div class="py-2 px-4">
        <p
          class="font-semibold tracking-tight leading-none sm:text-[16.24px] text-xs md:text-36"
        >
          Student per staff ratio
        </p>
        <div class="flex items-center relative top-[2px]">
          <h1
            class="text-[#C8C7C7] tracking-tight leading-none sm:text-[12.57px] text-[11px] md:mt-0"
          >
            <!-- {{ selectedTeacherData || 0 }} -->
            {{ activeSchool5 ? activeSchool5 : "All" }}
          </h1>
        </div>
        <h1
          v-if="staffPerStudentRadio"
          class="text-2xl md:text-[53px] sm:text-[40px] my-auto font-bold mt-3.5 md:mt-6"
        >
          {{ $n(staffPerStudentRadio?.staff_per_student || 0) }}
          <span class="text-xl md:text-[33px] sm:text-[20px]">/1</span>
        </h1>
      </div>
      <div>
        <div class="h-[1px] mt-8 bg-[#EAECF0] space" />
        <div class="flex justify-end px-3 py-2">
          <el-dropdown trigger="click">
            <el-button class="stat-btn" ref="dropdown6"
              >Choose school</el-button
            >
            <template #dropdown>
              <el-dropdown-menu class="h-48 md:h-full">
                <el-dropdown-item
                  @click="
                    $emit('updateStudentPerStaffRadio', school.value),
                      (activeSchool5 = school.label)
                  "
                  v-for="(school, i) in [
                    { label: 'All', value: null },
                    ...schools,
                  ]"
                  :key="i"
                  ><span class="md:text-[14px] text-[12px] leading-0">{{
                    school.label
                  }}</span></el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div
      class="miniCard grid grid-cols-subgrid md:col-span-1 col-span-2 sticky md:relative"
      @click="dropdown2.ref?.click()"
    >
      <div class="py-2 px-4 text-[#000]">
        <p
          class="font-semibold leading-none sm:text-[16.24px] text-xs md:text-36"
        >
          Average GPA
          <span class="lowercase">
            {{ activeSchool2 == "All" ? "" : activeSchool2 }}
          </span>
        </p>
        <p
          class="text-[#C8C7C7] tracking-tight leading-none sm:text-[12.34px] text-[11px] lg:mb-0"
        >
          last semester
        </p>
        <h1
          class="text-2xl md:text-[53px] sm:text-[40px] my-auto font-bold mt-3 md:mt-7"
        >
          {{ $n(props.gpaMetrics?.average_gpa || 0) }}
        </h1>
      </div>
      <div>
        <div class="h-[1px] mt-8 bg-[#EAECF0] space" />
        <div class="flex justify-end px-3 py-2">
          <el-dropdown trigger="click">
            <el-button class="stat-btn" ref="dropdown2"
              >Choose school</el-button
            >
            <template #dropdown>
              <el-dropdown-menu class="h-48 md:h-full">
                <el-dropdown-item
                  @click="
                    $emit('updateGpa', school.value),
                      (activeSchool2 = school.label)
                  "
                  v-for="(school, i) in [
                    { label: 'All', value: null },
                    ...schools,
                  ]"
                  :key="i"
                  ><span class="md:text-[14px] text-[12px] leading-0">{{
                    school.label
                  }}</span></el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IStrategicMetrics } from "@/models/backend";
import { useSchoolStore } from "@/stores";
import { computed, onMounted, reactive, ref, watch } from "vue";
const schoolStore = useSchoolStore();
const schools = computed(() => schoolStore.getSchoolsSelct);
const emit = defineEmits([
  "updateStudent",
  "updateTeacher",
  "update",
  "updateGpa",
  "updateStudentPerTeacher",
  "updateStudentPerStaffRadio",
]);
const dropdown1 = ref<any>();
const dropdown2 = ref<any>();
const dropdown3 = ref<any>();
const dropdown4 = ref<any>();
const dropdown5 = ref<any>();
const dropdown6 = ref<any>();

const school_id = ref();
const teacherFilterData = ref();
const props = defineProps<{
  teacherPerStudent: string;
  teachersMetrics: {
    total: number;
    full_time: number;
    one_quater: number;
    part_time: number;
    three_quater: number;
  };
  teacherPerStudentRadio: {
    student_per_teacher_ratio: number;
  };
  staffPerStudentRadio: {
    staff_per_student: number;
  };
  gpaMetrics: {
    average_gpa: number;
  };
  studentsMetrics: {
    count_total: number;
  };
  isActive: boolean;
}>();

const activeSchool1 = ref("");
const activeSchool2 = ref("");
const activeSchool3 = ref("");
const activeSchool4 = ref("");
const activeSchool5 = ref("");
const selectedTeacherData = ref<number | null>(props.teachersMetrics?.total);
const teacherType = ref<string | null>();
const teachertypeReplace: any = reactive({
  All: "all",
  "Full time": 1,
  "One quarter": 0.25,
  "Part time": 0.5,
  "Three quarters": 0.75,
});

const selectTeacherFilter = (filter: {
  label: string;
  value: number | null;
}) => {
  selectedTeacherData.value = filter.value || 0;
  teacherType.value = filter.label;
  // emit("updateTeacher", filter.label);
};
const updateStudent = () => {
  emit("updateGpa", {
    school_id: school_id.value,
    is_active_student: active.value,
  });
};
const active = ref(props.isActive);
watch(props, (newValue: any) => {
  teacherFilterData.value = [
    {
      label: "All",
      value: props.teachersMetrics?.total,
    },
    {
      label: "Full time",
      value: props.teachersMetrics?.full_time,
    },
    {
      label: "One quater",
      value: props.teachersMetrics?.one_quater,
    },
    {
      label: "Part time",
      value: props.teachersMetrics?.part_time,
    },
    {
      label: "Three quater",
      value: props.teachersMetrics?.three_quater,
    },
  ];
  selectedTeacherData.value = teacherFilterData.value[0].value;
});
</script>
<style lang="scss" scoped>
@media (max-width: 540px) {
  .miniCard {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 143px !important;
  }
}
</style>
