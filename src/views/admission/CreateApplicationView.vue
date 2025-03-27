<template>
  <div class="flex justify-between items-center mb-4">
    <el-button text @click="router.back()" class="text-primary">
      <Back class="h-4 w-4 text-blue-500" /><span class="text-blue-500 ml-2"
        >Back</span
      >
    </el-button>
  </div>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-position="top"
    require-asterisk-position="right"
    v-loading="loading"
  >
    <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
      <el-form-item
        :label="$t('dashboard.department')"
        prop="program_id"
        id="program_id"
      >
        <el-select
          v-model="ruleForm.program_id"
          :placeholder="$t('dashboard.department')"
          filterable
          size="large"
          class="w-full"
        >
          <el-option
            v-for="region of guideStore.getTuitions"
            class="capitalize"
            :key="region.value"
            @click="langUpdate(region.lang, region.has_scholarship)"
            :label="$t(`${region.label}`)"
            :value="region.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('dashboard.lang_edu')" prop="lang" id="lang">
        <el-select
          v-model="ruleForm.lang"
          :placeholder="$t('dashboard.lang')"
          filterable
          size="large"
          class="w-full uppercase"
        >
          <el-option
            v-for="region of language"
            :key="region"
            :label="region"
            :value="region"
            class="uppercase"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="E-mail Address" prop="email">
        <el-input
          v-model.trim="ruleForm.email"
          type="text"
          autocomplete="off"
          size="large"
          placeholder="E-mail Address"
        />
      </el-form-item>
    </div>
    <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
      <el-form-item :label="$t('dashboard.phone')" prop="phone" id="phone">
        <el-input
          v-model="ruleForm.phone"
          v-mask="'998 ## ###-##-##'"
          autocomplete="off"
          placeholder="+998"
          size="large"
        />
      </el-form-item>
      <el-form-item :label="$t('dashboard.region')" prop="city_id" id="city_id">
        <el-select
          v-model="ruleForm.city_id"
          :placeholder="$t('dashboard.select_region')"
          filterable
          size="large"
          class="w-full"
        >
          <el-option
            v-for="region of guideStore.getRegions"
            :key="region.value"
            :label="
              region.label[`${$i18n.locale}` as any]
                ? region.label[`${$i18n.locale}` as any]
                : region.label.en
            "
            :value="region.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
          v-model.trim="ruleForm.password"
          type="text"
          autocomplete="off"
          size="large"
        />
      </el-form-item>
      <el-form-item
        :label="$t('dashboard.name_graduation')"
        prop="graduation_place"
        id="graduation_place"
      >
        <el-input
          v-model="ruleForm.graduation_place"
          :placeholder="$t('dashboard.white_graduation')"
          size="large"
        />
      </el-form-item>
      <el-form-item :label="$t('dashboard.street')" prop="address" id="address">
        <el-input
          v-model="ruleForm.address"
          autocomplete="off"
          :placeholder="$t('dashboard.white_address')"
          size="large"
        />
      </el-form-item>
      <el-form-item
        :label="$t('dashboard.graduation')"
        prop="graduation_id"
        id="graduation_id"
      >
        <el-select
          v-model="ruleForm.graduation_id"
          :placeholder="$t('dashboard.select_graduation')"
          size="large"
          class="w-full"
        >
          <el-option label="School" value="SCHOOL" />
          <el-option label="Lyceum" value="LYCEUM" />
        </el-select>
      </el-form-item>
    </div>
    <div class="app-divider my-2 md:my-4"></div>
    <h1 class="title mb-3">{{ $t("dashboard.passport") }}</h1>
    <div
      class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2"
      :class="{ 'lg:!grid-cols-5': store.getUser?.country?.code !== 'UZ' }"
    >
      <el-form-item
        :label="$t('dashboard.first_name')"
        prop="first_name"
        id="first_name"
      >
        <el-input
          v-model="ruleForm.first_name"
          type="text"
          autocomplete="off"
          :placeholder="$t('dashboard.write_first')"
          size="large"
        />
      </el-form-item>
      <el-form-item
        :label="$t('dashboard.last_name')"
        prop="last_name"
        id="last_name"
      >
        <el-input
          v-model="ruleForm.last_name"
          autocomplete="off"
          :placeholder="$t('dashboard.write_last')"
          size="large"
        />
      </el-form-item>
      <el-form-item
        :label="$t('dashboard.passport_seria')"
        prop="passport_serial"
        id="passport_serial"
      >
        <el-input
          v-model="ruleForm.passport_serial"
          autocomplete="off"
          :placeholder="$t('dashboard.passport_title')"
          size="large"
        />
      </el-form-item>
      <el-form-item
        :label="$t('dashboard.passport_number')"
        prop="passport_number"
        id="passport_number"
      >
        <el-input
          v-model="ruleForm.passport_number"
          autocomplete="off"
          :placeholder="$t('shared.text')"
          size="large"
        />
      </el-form-item>
      <el-form-item
        :label="$t('dashboard.birth_date')"
        prop="birth_date"
        id="birth_date"
      >
        <el-date-picker
          v-model="ruleForm.birth_date"
          :placeholder="$t('dashboard.select_date')"
          size="large"
          class="!w-full"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('dashboard.gender')" prop="gender" id="gender">
        <el-select
          v-model="ruleForm.gender"
          size="large"
          :placeholder="$t('dashboard.select_gender')"
          class="w-full"
        >
          <el-option :label="$t('dashboard.male')" value="male" />
          <el-option :label="$t('dashboard.female')" value="female" />
        </el-select>
      </el-form-item>
    </div>
    <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
      <el-form-item
        :label="$t('dashboard.passport_photo')"
        prop="passport"
        id="passport"
      >
        <AppUpload
          accept="image/*"
          @upload="
            (file) => {
              (ruleForm.passport = file),
                ruleFormRef?.clearValidate('passport');
            }
          "
          @remove="() => (ruleForm.passport = null)"
        />
      </el-form-item>
      <el-form-item :label="$t('dashboard.photo')" prop="photo" id="photo">
        <AppUpload
          accept="image/*"
          @upload="
            (file) => {
              (ruleForm.photo = file), ruleFormRef?.clearValidate('photo');
            }
          "
          @remove="() => (ruleForm.photo = null)"
        />
      </el-form-item>
      <el-form-item
        :label="$t('dashboard.diploma')"
        prop="diploma"
        id="diploma"
      >
        <AppUpload
          accept="image/*"
          @upload="
            (file) => {
              (ruleForm.diploma = file), ruleFormRef?.clearValidate('diploma');
            }
          "
          @remove="() => (ruleForm.diploma = null)"
        />
      </el-form-item>
      <el-form-item
        :label="$t('dashboard.english')"
        v-if="showEng"
        prop="proficiency_certificate"
      >
        <el-select
          v-model="ruleForm.proficiency_certificate"
          size="large"
          class="w-full"
        >
          <el-option label="IELTS" value="ielts" />
          <el-option label="TOEFL" value="toefl" />
          <el-option label="SAT" value="sat" />
          <el-option label="IEPTE" value="iepte" />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('dashboard.english')"
        prop="certificate"
        v-if="showEng"
      >
        <AppUpload
          accept="image/*"
          @upload="
            (file) => {
              (ruleForm.certificate = file),
                ruleFormRef?.clearValidate('certificate');
            }
          "
          @remove="() => (ruleForm.certificate = null)"
        />
      </el-form-item>
      <el-form-item
        :label="$t('dashboard.certify')"
        prop="certificate_number"
        v-if="showEng"
      >
        <el-input
          v-model="ruleForm.certificate_number"
          autocomplete="off"
          placeholder="Write the number of your document"
          size="large"
        />
      </el-form-item>
      <el-form-item prop="take_internal_exam" v-if="showEng">
        <el-checkbox
          class="!whitespace-normal"
          v-model="ruleForm.take_internal_exam"
          size="large"
        >
          {{ $t("dashboard.no_certify") }}</el-checkbox
        >
      </el-form-item>
    </div>
    <div class="app-divider my-2 md:my-4" />
    <h1 class="title mb-3">{{ $t("dashboard.exam_type") }}</h1>
    <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
      <el-form-item
        :label="$t('dashboard.exam_date')"
        prop="exam_date_id"
        id="exam_date_id"
      >
        <el-select
          v-model="ruleForm.exam_date_id"
          :placeholder="$t('dashboard.select_exam')"
          size="large"
          class="w-full"
        >
          <el-option
            v-for="date of guideStore.getExamDates"
            :key="date.value"
            :label="date.label"
            :value="date.value"
          />
        </el-select>
      </el-form-item>
      <div></div>
      <div></div>
      <el-form-item
        v-show="has_scholarship"
        prop="is_scholarship"
        id="is_scholarship"
      >
        <template #label>
          <div class="flex items-center space-x-2">
            <span>Scholarship</span>
            <el-popover
              placement="top-start"
              :width="300"
              trigger="hover"
              content="Do you want to participate in the scholarship
    exam? I agree that If I can not meet the
    scholarship exam requirements, then I will not
    be able to attend it."
            >
              <template #reference>
                <el-icon>
                  <InfoFilled />
                </el-icon>
              </template>
            </el-popover>
          </div>
        </template>

        <el-radio-group v-model="ruleForm.is_scholarship">
          <el-radio :label="true">Yes</el-radio>
          <el-radio :label="false">No</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="is_accept">
        <el-checkbox v-model="ruleForm.is_accept" size="large">{{
          $t("dashboard.allow")
        }}</el-checkbox>
      </el-form-item>
    </div>
  </el-form>
  <div class="flex pt-4">
    <el-button
      :disabled="!ruleForm.is_accept"
      type="primary"
      size="large"
      @click="submitForm(ruleFormRef)"
    >
      {{ $t("dashboard.submit") }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { InfoFilled } from "@element-plus/icons-vue";
import { useGuideStore, useApplicationStore } from "@/stores";
import { useUsersStore } from "@/stores/user";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { ref, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import {
  passportNumberPattern,
  passportSeriesPattern,
  phonePattern,
} from "@/utils/regex";
import { convertPhone } from "@/utils/mappers";
import { format } from "date-fns";
import { useRouter } from "vue-router";
import AppUpload from "@/components/common/AppUpload.vue";
import sha1 from "sha1";
const router = useRouter();
const store = useUsersStore();
const guideStore = useGuideStore();
const applicationStore = useApplicationStore();
const language: any = ref([]);
const has_scholarship = ref(false);
const i18n = useI18n();
const showEng = ref(true);
const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive({
  city_id: null as any,
  graduation_place: "",
  address: "",
  graduation_id: null as any,
  phone: "",
  take_internal_exam: false,
  is_accept: false,
  is_scholarship: false,
  certificate_number: null as any,
  proficiency_certificate: null as any,
  exam_date_id: "",
  program_id: "",
  passport_number: "",
  passport_serial: "",
  gender: "",
  birth_date: "",
  first_name: "",
  last_name: "",
  passport: "" as any,
  photo: "" as any,
  diploma: "" as any,
  email: "",
  certificate: "" as any,
  password: "11111111",
  lang: "",
});

const rules = reactive<FormRules>({
  city_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
  graduation_place: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
  address: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
  phone: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
    {
      type: "string",
      required: true,
      pattern: phonePattern,
      message: i18n.t("validation.pattern"),
      trigger: ["blur", "change"],
    },
  ],
  gender: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],

  // certificate_number: [
  //   {
  //     required: true,
  //     message: i18n.t("validation.fillField"),
  //     trigger: "blur",
  //   },
  // ],
  first_name: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
  last_name: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
  passport_number: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
    {
      min: store.getUser?.country?.code === "UZ" ? 7 : 1,
      message: i18n.t("validation.minimumLength", {
        value: store.getUser?.country?.code === "UZ" ? 7 : 1,
      }),
      trigger: ["blur", "change"],
    },
    {
      max: store.getUser?.country?.code === "UZ" ? 10 : 20,
      message: i18n.t("validation.maximumLength", {
        value: store.getUser?.country?.code === "UZ" ? 10 : 20,
      }),
      trigger: ["blur", "change"],
    },
    {
      type: "string",
      required: true,
      pattern:
        store.getUser?.country?.code === "UZ" ? passportNumberPattern : "",
      message: i18n.t("validation.pattern"),
      trigger: ["blur", "change"],
    },
  ],
  passport_serial: [
    {
      max: 10,
      message: i18n.t("validation.maximumLength", { value: 10 }),
      trigger: ["blur", "change"],
    },
    // {
    //   required: true,
    //   message: i18n.t("validation.fillField"),
    //   trigger: ['blur', 'change'],
    // },
    // {
    //   type: "string",
    //   required: true,
    //   pattern: passportSeriesPattern,
    //   message: i18n.t("validation.pattern"),
    //   trigger: ['blur', 'change'],
    // },
  ],
  email: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "blur",
    },
    {
      type: "email",
      message: i18n.t("validation.inputEmail"),
      trigger: ["blur", "change"],
    },
  ],
  password: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
    {
      min: 8,
      message: i18n.t("validation.minimumLength", { value: 8 }),
      trigger: "blur",
    },
  ],
  birth_date: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
  exam_date_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
  program_id: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
  lang: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: ["blur", "change"],
    },
  ],
  passport: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "submit",
    },
  ],
  photo: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "submit",
    },
  ],
  diploma: [
    {
      required: true,
      message: i18n.t("validation.fillField"),
      trigger: "submit",
    },
  ],
  //   certificate: [
  //     {
  //       required: true,
  //       message: i18n.t("validation.fillField"),
  //       trigger: "submit",
  //     },
  //   ],
});

const props = defineProps<{
  application?: any;
}>();

onMounted(async () => {
  if (!guideStore.getExamDates.length) {
    guideStore.fetchExamDates();
  }
  if (!guideStore.getRegions.length) {
    let obj = {};
    if (store.getUser?.country?.code !== "UZ") {
      obj = { type: "province" };
    }
    guideStore.fetchRegions(obj);
  }
  if (!guideStore.getTuitions.length) {
    guideStore.fetchTuitions();
  }
});
const loading = ref(false);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    console.log(valid, fields);

    if (valid) {
      try {
        loading.value = true;
        const data = {
          ...ruleForm,
          phone: convertPhone(ruleForm.phone),
          birth_date: format(new Date(ruleForm.birth_date), "yyyy-MM-dd"),
          password: sha1(ruleForm.password),
        } as any;

        if (!ruleForm.certificate) {
          delete data.certificate;
        }
        await applicationStore.addApplication(data);
        router.back();
        loading.value = false;
        ElMessage({
          message: "Successfully created",
          type: "success",
        });
        applicationStore.getApplication();
      } catch (error: any) {
        loading.value = false;
        ElMessage({
          message: error?.message || "Error",
          type: "error",
        });
        console.log("error", error.message);
      }
    } else {
      const arrayFields = Object.keys(fields as any);
      goDown(arrayFields[0]);
      ElMessage({
        message: "The form is invalid, Please check it correctly",
        type: "warning",
      });
    }
  });
};
const langUpdate = (lang: any, scholarship: any) => {
  has_scholarship.value = scholarship;
  ruleForm.lang = "";
  console.log(lang.filter((x: any) => x == "en").length);
  language.value = lang;
  if (lang.filter((x: any) => x == "en").length == 1) {
    showEng.value = true;
  } else {
    showEng.value = false;
  }
  if (lang.length == 1) {
    ruleForm.lang = lang[0];
  }
};
const goDown = (target: string) => {
  console.log("target", target);
  document.getElementById(target)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
};
</script>

<style scoped>
.title {
  font-weight: 700;
  font-size: 18px;
  line-height: 25px;
  color: #1f1f1f;
}
</style>
<style>
[data-v-onboarding-wrapper] [data-popper-arrow]::before {
  content: "";
  background: var(--v-onboarding-step-arrow-background, white);
  top: 0;
  left: 0;
  transition: transform 0.2s ease-out, visibility 0.2s ease-out;
  visibility: visible;
  transform: translateX(0px) rotate(45deg);
  transform-origin: center;
  width: var(--v-onboarding-step-arrow-size, 10px);
  height: var(--v-onboarding-step-arrow-size, 10px);
  position: absolute;
  z-index: -1;
}

[data-v-onboarding-wrapper]
  [data-popper-placement^="top"]
  > [data-popper-arrow] {
  bottom: 5px;
}

[data-v-onboarding-wrapper]
  [data-popper-placement^="right"]
  > [data-popper-arrow] {
  left: -4px;
}

[data-v-onboarding-wrapper]
  [data-popper-placement^="bottom"]
  > [data-popper-arrow] {
  top: -4px;
}

[data-v-onboarding-wrapper]
  [data-popper-placement^="left"]
  > [data-popper-arrow] {
  right: -4px;
}
</style>
