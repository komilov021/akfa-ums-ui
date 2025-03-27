<template>
  <div class="mx-auto mt-6 md:mt-6" v-loading="loading">
    <el-breadcrumb :separator-icon="ArrowRight" class="mb-6">
      <el-breadcrumb-item
        class="underline"
        :to="{ path: '/academic/reference/students' }"
        >Student catalogue</el-breadcrumb-item
      >
      <el-breadcrumb-item class="underline">Student</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <template v-if="visible">
          <div class="flex items-end">
            <AppUpload
              accept="image/*"
              upload_type="static"
              :reset="file_reset"
              list-type="text"
              class="w-[100px] h-[100px] md:w-[160px] md:h-[160px] overflow-hidden"
              @upload="submitFile"
            >
              <img
                class="w-[100px] h-[100px] rounded-full md:w-[160px] md:h-[160px] object-cover"
                :src="student?.avatar ? studentUrl : defaultImg"
                alt=""
              />
            </AppUpload>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="Edit"
              placement="top"
            >
              <AppUpload
                accept="image/*"
                upload_type="static"
                :reset="file_reset"
                list-type="text"
                class="w-10 h-10"
                @upload="submitFile"
              >
                <button>
                  <EditPen class="h-4 w-4" />
                </button>
              </AppUpload>
            </el-tooltip>
          </div>
        </template>
        <template v-else>
          <img
            class="w-[100px] h-[100px] rounded-full md:w-[160px] md:h-[160px] object-cover"
            :src="student?.avatar ? studentUrl : defaultImg"
            alt=""
          />
        </template>
        <div>
          <h1 class="text-main font-semibold text-3xl">
            {{ student?.first_name + " " + student?.last_name }}
          </h1>
          <p class="text-base text-tertiary-600">
            {{ student?.program?.name }}
          </p>
        </div>
      </div>
      <div>
        <!-- <el-button type="primary" size="large" @click="downloadOld"
          >Take a old transcript</el-button
        > -->
        <el-button
          type="primary"
          size="large"
          @dblclick="maSukaOne"
          @click="downloadWithDraw"
          >Withdrawal transcript</el-button
        >
        <el-button
          type="primary"
          size="large"
          @dblclick="maSukaOne"
          @click="download"
          >Take a transcript</el-button
        >
        <!-- <el-button type="primary" size="large" @click="maSukaOne"
          >Take this</el-button
        > -->
      </div>
    </div>
    <div class="mt-4">
      <el-tabs v-model="activeTab">
        <el-tab-pane
          v-for="item of tabItems"
          :key="item.value"
          :label="item.label"
          :name="item.value"
          :class="{
            'is-active': activeTab === 'payment' && item.value === 'payment',
          }"
        />
      </el-tabs>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-position="left"
        label-width="280"
        require-asterisk-position="right"
      >
        <div v-if="activeTab === 'general'">
          <div class="flex justify-between items-center mb-4">
            <div class="flex flex-col">
              <h1 class="text-text-900 font-semibold text-xl">General</h1>
              <p class="text-tertiary-600">Main information about student</p>
            </div>
            <div>
              <el-button
                type="primary"
                size="large"
                v-if="!visible2"
                @click="visible2 = true"
                >Edit</el-button
              >
              <div v-else>
                <el-button @click="visible2 = false">Cancel</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)"
                  >Save</el-button
                >
              </div>
            </div>
          </div>
          <div>
            <el-form-item label="Note status" prop="note_status">
              <el-select
                v-model="ruleForm.note_status"
                class="w-full"
                placeholder="Select"
                :disabled="!visible2"
                multiple
                collapse-tags
                :max-collapse-tags="3"
              >
                <el-option
                  v-for="item in noteStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="UID" prop="uid">
              <el-input
                type="number"
                autocomplete="off"
                v-model="ruleForm.uid"
                class="w-full"
                placeholder="220008"
                :disabled="!visible2"
              />
            </el-form-item>
            <el-form-item label="Phone number" prop="phone">
              <el-input
                type="text"
                autocomplete="off"
                v-model="ruleForm.phone"
                class="w-full"
                v-mask="'998 ## ###-##-##'"
                placeholder="+998"
                :disabled="!visible2"
              />
            </el-form-item>
            <el-form-item label="Birth date" prop="birth_date">
              <el-date-picker
                v-model="ruleForm.birth_date"
                type="date"
                autocomplete="off"
                class="!w-full"
                :placeholder="$t('shared.date')"
                :disabled="!visible2"
              />
            </el-form-item>
            <el-form-item label="Enrolled Year" prop="acceptance_year">
              <el-select
                v-model="ruleForm.acceptance_year"
                class="w-full"
                placeholder="Select"
                :disabled="!visible2"
              >
              </el-select>
            </el-form-item>
            <el-form-item label="Department" prop="program_id">
              <el-select
                v-model="ruleForm.program_id"
                class="w-full"
                placeholder="Select"
                :disabled="!visible2"
              >
                <el-option
                  v-for="item in guideStore.getProgramsSelct"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Level" prop="level">
              <el-input
                type="number"
                autocomplete="off"
                v-model.number="ruleForm.level"
                class="w-full"
                placeholder="1"
                :disabled="!visible2"
              />
            </el-form-item>
            <el-form-item label="Groups" prop="group">
              <el-select
                v-model="ruleForm.group_code"
                class="w-full"
                placeholder="Select"
                filterable
                :disabled="!visible2"
              >
                <el-option
                  v-for="item in studentGroups"
                  :key="item.group_code"
                  :label="item.group_code"
                  :value="item.group_code"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="flex items-center justify-between mt-10">
            <h4 class="text-[#101828] text-3xl font-semibold">
              Enrolled courses
            </h4>
            <el-button @click="openFormDialog">
              <Plus class="w-5 h-5 mr-2" color="#344054"></Plus>
              Add new course
            </el-button>
          </div>
          <div class="table-wrapper mt-5" v-loading="loading">
            <el-table
              :data="studentEnrolled"
              style="width: 100%"
              class="whiteStripe"
              row-class-name="cursor-pointer"
            >
              <el-table-column
                label="Semester"
                min-width="150"
                max-width="200"
                show-overflow-tooltip
                align="left"
              >
                <template #default="{ row }">
                  <span>{{ row?.semester }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="Program"
                min-width="150"
                max-width="200"
                show-overflow-tooltip
                align="left"
              >
                <p>{{ student.program?.name }}</p>
              </el-table-column>
              <el-table-column
                label="Code"
                min-width="150"
                max-width="200"
                align="left"
              >
                <template #default="{ row }">
                  <span>{{ row.code || "-" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Group type" min-width="150" align="left">
                <template #default="{ row }">
                  <span class="capitalize">{{ row.group_type || "-" }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="Level"
                prop="study_year"
                min-width="150"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="title"
                label="Course title"
                min-width="100"
                show-overflow-tooltip
                align="left"
              />
              <el-table-column
                label="Operations"
                width="320"
                align="center"
                prop="action"
              >
                <template #default="{ row }">
                  <div class="flex items-center justify-center">
                    <el-button @click="confirmDelete(row.course_enroll_id)">
                      <SvgIcon name="local-trash" class="mr-2" size="17" />
                      Delete
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div v-else-if="activeTab === 'detail'">
          <div class="flex justify-between items-center mb-4">
            <div class="flex flex-col">
              <h1 class="text-text-900 font-semibold text-xl">
                Detailed information
              </h1>
              <p class="text-tertiary-600">Other information about student</p>
            </div>
            <div>
              <el-button
                type="primary"
                size="large"
                v-if="!visible"
                @click="visible = true"
                >Edit</el-button
              >
              <div v-else>
                <el-button @click="visible = false">Cancel</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)"
                  >Save</el-button
                >
              </div>
            </div>
          </div>
          <div class="grid gap-2">
            <el-form-item label="First name" prop="pinfl">
              <el-input
                autocomplete="off"
                v-model="ruleForm.first_name"
                class="w-full"
                :disabled="!visible"
              />
            </el-form-item>
            <el-form-item label="Last name" prop="pinfl">
              <el-input
                autocomplete="off"
                v-model="ruleForm.last_name"
                class="w-full"
                :disabled="!visible"
              />
            </el-form-item>
            <el-form-item label="Personal number (PINFL)" prop="pinfl">
              <el-input
                type="number"
                autocomplete="off"
                v-model="ruleForm.pinfl"
                class="w-full"
                placeholder="30241045335510"
                :disabled="!visible"
              />
            </el-form-item>
            <el-form-item label="Gender" prop="gender">
              <el-select
                v-model="ruleForm.gender"
                class="w-full"
                placeholder="Select"
                :disabled="!visible"
              >
                <el-option
                  v-for="item in [
                    { value: 'male', label: 'MALE' },
                    { value: 'female', label: 'FEMALE' },
                  ]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Passport" prop="passport">
              <el-input
                type="text"
                autocomplete="off"
                v-model="ruleForm.passport"
                class="w-full"
                placeholder="AA1234567"
                :disabled="!visible"
              />
            </el-form-item>
            <el-form-item label="Residency" prop="country_id">
              <el-select
                v-model="ruleForm.country_id"
                :disabled="!visible"
                filterable
                class="w-full"
                placeholder="Select"
              >
                <el-option
                  v-for="item in studentsStore.getCountryList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div v-else-if="activeTab === 'additional'">
          <AdditionalInformationForm></AdditionalInformationForm>
        </div>
        <div v-else-if="activeTab === 'rpl'">
          <MainStudentRplTable :student_id="route.params.id" />
        </div>
        <div v-else-if="activeTab === 'grades'">
          <StudentGrades />
        </div>
        <div v-else-if="activeTab === 'attendance'">
          <StudentAttendance />
        </div>
        <div v-else-if="activeTab === 'payment'">
          <PaymentHistory></PaymentHistory>
        </div>
        <div v-else-if="activeTab === 'scholarship'">
          <ScholarshipTable />
        </div>
        <div v-else-if="activeTab === 'status'">
          <StudentStatusView />
        </div>
      </el-form>
    </div>
    <teleport to="#modal" v-if="showModal">
      <CourseForm
        :type="formType"
        :student="student"
        :programs="guideStore.tuitions"
        @on-submit="submitFormCourse($event)"
      />
    </teleport>
  </div>
  <el-dialog v-model="openModal" :width="450">
    <UpdateRequestDialog @on-submit="submitForm($event)" />
  </el-dialog>
</template>
<script setup lang="ts">
import { onMounted, computed, ref, reactive, watch } from "vue";
import {
  useGuideStore,
  useStudentsStore,
  useAcademicStore,
  useTranscriptStore,
  useFileStore,
  useAttendanceStore,
  useCourseEnrollmentStore,
  useFinanceStore,
  useGroupStore,
} from "@/stores";
import {
  ArrowRight,
  EditPen,
  Delete,
  Edit,
  DeleteFilled,
  UploadFilled,
  Download,
  Plus,
} from "@element-plus/icons-vue";
import { useModal } from "@/composables";
import CourseForm from "../students/components/CourseForm.vue";
import StudentAttendance from "./components/StudentAttendace.vue";
import MainStudentRplTable from "./components/MainStudentRplTable.vue";
import ScholarshipTable from "./components/ScholarshipTable.vue";
import defaultImg from "@/assets/images/avatar.png";
import AppUpload from "@/components/common/AppUpload.vue";
import UpdateRequestDialog from "@/components/common/UpdateRequestDialog.vue";
import AdditionalInfoDialog from "./additional/components/AdditionalInfoDialog.vue";
import AdditionalInformationForm from "./additional/AdditionalInformationForm.vue";
import PaymentHistory from "./Payment/PaymentHistory.vue";
import StudentGrades from "./grades/StudentGrades.vue";

import {
  ElMessage,
  FormInstance,
  FormRules,
  dayjs,
  ElMessageBox,
} from "element-plus";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ControlItem } from "@/models/frontend";
import { phonePattern } from "@/utils/regex";
import router from "@/router";
import { rule } from "postcss";
import StudentStatusView from "./components/StudentStatusView.vue";
import { saveFile } from "@/utils/common";

const i18n = useI18n();
const route = useRoute();
const modal = useModal();
const fileStore = useFileStore();
const groupStore = useGroupStore();
const guideStore = useGuideStore();
const examYearStore = useAcademicStore();
const studentsStore = useStudentsStore();
const ExamDatesStore = useAcademicStore();
const attendanceStore = useAttendanceStore();
const transcriptsStore = useTranscriptStore();
const enrollmentStore = useCourseEnrollmentStore();

const visible = ref(false);
const visible2 = ref(false);
const loading = ref(false);
const file_reset = ref(false);
const openModal = ref(false);
const showRequestModal = ref(false);
const activeTab = ref("general");
const formType = ref<"create" | "edit">("create");
const showModal = computed(() => modal.show.value);
const student = computed(() => studentsStore.currentStudent);
const studentUrl = computed(() => studentsStore.currentStudentUrl);
const studentGroups = computed(() => attendanceStore.studentGroups);
const studentEnrolled: any = computed(
  () => enrollmentStore.studentCourses?.courses
);
const getstudentparets = computed(() => studentsStore.getstudentparents);
const maleGander = computed(() =>
  getstudentparets.value?.some((item) => item.gender === "male")
);
const femaleGander = computed(() =>
  getstudentparets.value?.some((item) => item.gender === "female")
);
const tabItems: ControlItem[] = [
  {
    label: "General",
    value: "general",
  },
  {
    label: "Detailed information",
    value: "detail",
  },
  {
    label: "Additional information",
    value: "additional",
  },
  {
    label: "RPL",
    value: "rpl",
  },
  {
    label: "Grades",
    value: "grades",
  },
  {
    label: "Attendance",
    value: "attendance",
  },
  {
    label: "Payment history",
    value: "payment",
  },
  {
    label: "Scholarship",
    value: "scholarship",
  },
  {
    label: "Status",
    value: "status",
  },
];
const noteStatus: { value: string; label: string }[] = [
  {
    value: "external_transfer",
    label: "External Transfer",
  },
  {
    value: "internal_transfer",
    label: "Internal Transfer",
  },
  {
    value: "freshman",
    label: "Freshman",
  },
  {
    value: "foreign",
    label: "Foreign",
  },
  {
    value: "local",
    label: "Local",
  },
];

const paymentQuery = router.currentRoute.value.query.payment;

watch(
  () => paymentQuery,
  (query) => {
    if (query === "payment") {
      activeTab.value = "payment";
    }
  }
);

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  id: undefined,
  uid: "",
  program_id: "",
  first_name: "",
  last_name: "",
  email: "",
  level: 1,
  passport: "",
  pinfl: "",
  acceptance_year: 0,
  gender: "",
  birth_date: "",
  phone: "",
  study_year: 1 as number,
  group_code: "",
  semester: "",
  country_id: "",
  avatar: null,
  note_status: [] as string[],
});

const rules = reactive<FormRules>({
  uid: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
    {
      min: 2,
      message: i18n.t("validation.minimumLength", { value: 2 }),
      trigger: "blur",
    },
  ],
  first_name: [
    {
      required: true,
      min: 2,
      message: i18n.t("validation.minimumLength", { value: 2 }),
      trigger: "blur",
    },
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  last_name: [
    {
      required: true,
      min: 2,
      message: i18n.t("validation.minimumLength", { value: 2 }),
      trigger: "blur",
    },
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  email: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  passport: [
    {
      required: true,
      min: 8,
      message: i18n.t("validation.minimumLength", { value: 8 }),
      trigger: "blur",
    },
  ],

  pinfl: [
    {
      min: 14,
      message: i18n.t("validation.minimumLength", { value: 14 }),
      trigger: "blur",
    },
    {
      max: 14,
      message: i18n.t("validation.maximumLength", { value: 14 }),
      trigger: "blur",
    },
  ],
  program_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  birth_date: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
    {
      type: "string",
      required: true,
      pattern: phonePattern,
      message: i18n.t("validation.pattern"),
      trigger: ["blur"],
    },
  ],
  parent_full_name: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
  ],
  parent_passport: [
    {
      required: true,
      min: 8,
      message: i18n.t("validation.minimumLength", { value: 8 }),
      trigger: "blur",
    },
  ],
  parent_phone: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
    {
      type: "string",
      required: true,
      pattern: phonePattern,
      message: i18n.t("validation.pattern"),
      trigger: ["blur"],
    },
  ],
  parent_pinfl: [
    {
      required: true,
      min: 14,
      message: i18n.t("validation.minimumLength", { value: 14 }),
      trigger: "change",
    },
    {
      required: true,
      max: 14,
      message: i18n.t("validation.maximumLength", { value: 14 }),
      trigger: "change",
    },
  ],
  parent_gender: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
  residency: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
  note_status: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "change",
    },
  ],
});
const fetchStudent = async () => {
  await studentsStore.getStudentById(route.params.id as string);
};

const submitFile = (data: any) => {
  ElMessageBox.confirm("Are you sure to submit file ?. Continue?", "Warning", {
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    type: "warning",
    center: true,
  })
    .then(async () => {
      try {
        ruleForm.birth_date = dayjs(ruleForm.birth_date).format("YYYY-MM-DD");
        ruleForm.avatar = data;
        loading.value = true;
        await studentsStore.editStudent({
          ...ruleForm,
          // country_id: ruleForm?.country_id,
          phone: ruleForm.phone?.replace(/[^0-9]+/g, ""),
        });
        ElMessage({
          type: "success",
          message: "Profile photo updated !",
        });
        file_reset.value = true;
        fetchStudent();
        file_reset.value = false;
        visible.value = false;
        loading.value = false;
      } catch (error: any) {
        file_reset.value = true;
        loading.value = false;
        file_reset.value = false;
        console.log("error", error);
      }
    })
    .catch(() => {
      file_reset.value = true;
    });
};
onMounted(async () => {
  transcriptsStore.fetchListRpl(route.params.id as string);
  if (!groupStore.getSemestrs.length) {
    groupStore.fetchSemestrs();
  }
  if (!examYearStore.getSemestrsSelct.length) {
    examYearStore.fetchExamYears();
  }
  if (!guideStore.getProgramsSelct.length) {
    guideStore.fetchPrograms();
  }
  if (!studentGroups.value.length) {
    attendanceStore.fetchStudentGroups(undefined as any);
  }
  if (!ExamDatesStore.getSemestrsSelct.length) {
    ExamDatesStore.fetchSemestr();
  }
  if (!ExamDatesStore.getYearsSelct.length) {
    ExamDatesStore.fetchExamYears();
  }
  if (!guideStore.getProgramsSelct.length) {
    guideStore.fetchPrograms();
  }
  if (!studentsStore.country.length) {
    studentsStore.fetchCountryList();
  }
  await studentsStore.getStudentById(route.params.id as string);
  await studentsStore.tutionFeeStudents({
    student_id: route.params.id as string,
  });
  enrollmentStore.getStudentsEnrolledCourses(route.params.id as string);
  if (!guideStore.tuitions.length) {
    guideStore.fetchTuitions();
  }
  if (student.value) {
    Object.assign(ruleForm, student.value);
    ruleForm.program_id = student.value.program?.id || null;
    ruleForm.country_id = student.value.country?.id || null;
    ruleForm.note_status = Array.isArray(student.value.note_status)
      ? [...student.value.note_status]
      : [];
  }
  const childRoute = tabItems.find((item) => item.value === paymentQuery);
  if (childRoute) {
    activeTab.value = childRoute.value as string;
  }
  ruleForm.program_id = student?.value.program?.id
    ? student?.value.program?.id
    : null;
});

const download = async () => {
  try {
    loading.value = true;
    const transcript = (await transcriptsStore.generate(
      route.params.id as string
    )) as any;
    const data = await fileStore.downloadById(transcript?.pdf?.id);
    saveFile(data, transcript?.name || "FileName" + new Date() + ".pdf");
    loading.value = false;
  } catch (error: any) {
    console.log("error", error?.message);
    loading.value = false;
  }
};
const downloadWithDraw = async () => {
  try {
    loading.value = true;
    const transcript = (await transcriptsStore.withDrawTranscript(
      route.params.id as string
    )) as any;
    const data = await fileStore.downloadById(transcript?.pdf?.id);
    saveFile(
      data,
      `${transcript?.pdf.name}.pdf` || "FileName" + new Date() + ".pdf"
    );
    loading.value = false;
  } catch (error: any) {
    console.log("error", error?.message);
    loading.value = false;
  }
};
const downloadOld = async () => {
  try {
    loading.value = true;
    const transcript = (await transcriptsStore.generateOld(
      route.params.id as string
    )) as any;
    const data = await fileStore.downloadById(transcript?.pdf?.id);
    saveFile(data, "FileName" + new Date() + ".pdf");
    loading.value = false;
  } catch (error: any) {
    console.log("error", error?.message);
    loading.value = false;
  }
};
const maSukaOne = async () => {
  try {
    loading.value = true;
    const transcript = (await transcriptsStore.generateMaSuka({
      student_id: route.params.id as string,
      award_date: "2024-06-28",
    })) as any;
    const data = await fileStore.downloadById(transcript?.pdf?.id);
    saveFile(data, "FileName" + new Date() + ".pdf");
    loading.value = false;
  } catch (error: any) {
    console.log("error", error?.message);
    loading.value = false;
  }
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        loading.value = true;
        ruleForm.birth_date = dayjs(ruleForm.birth_date).format("YYYY-MM-DD");
        const form = {
          ...ruleForm,
          phone: ruleForm.phone?.replace(/[^0-9]+/g, ""),
        };
        await studentsStore.editStudent(form);
        ElMessage({
          message: i18n.t("shared.updated"),
          type: "success",
        });
        loading.value = false;
        visible.value = false;
        visible2.value = false;
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
const confirmDelete = (id: string) => {
  ElMessageBox.confirm(
    "This action cannot be undone. Continue?",
    i18n.t("shared.warning"),
    {
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      type: "warning",
      center: true,
    }
  )
    .then(async () => {
      try {
        loading.value = true;
        await enrollmentStore.removeStudentsEnrolledCourse(id);
        await enrollmentStore.getStudentsEnrolledCourses(
          route.params.id as string
        );
        loading.value = false;
        ElMessage({
          type: "success",
          message: i18n.t("shared.deleteCompleted"),
        });
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    })
    .catch(() => {});
};
const openFormDialog = () => {
  formType.value = "create";
  modal.setTitle("Add Course");
  modal.setWidth("60%");
  modal.showModal();
};
const submitFormCourse = async (data: any) => {
  try {
    loading.value = true;
    await enrollmentStore.addStudentsEnrolledCourse(data);
    ElMessage({
      message: i18n.t("shared.created"),
      type: "success",
    });
    await enrollmentStore.getStudentsEnrolledCourses(route.params.id as string);
    loading.value = false;
    modal.hideModal();
  } catch (error: any) {
    loading.value = false;
    console.log("error", error);
  }
};
</script>

<style scoped lang="scss"></style>
