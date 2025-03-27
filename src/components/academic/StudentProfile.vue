<template>
  <div v-if="student">
    <div class="flex items-center justify-between mb-3 md:mb-5">
      <h1 class="font-semibold text-2xl text-[#343434]">Student Profile</h1>
      <el-button
        v-loading="loading"
        type="primary"
        size="large"
        @click="download"
        >Take a transcript</el-button
      >
    </div>
    <div
      class="header-card py-5 px-6 flex flex-wrap items-center gap-4 md:gap-16"
    >
      <div class="flex items-center gap-2 md:gap-4">
        <div class="w-12 h-12 bg-[#131A34] rounded-md"></div>
        <div class="flex flex-col md:gap-1">
          <h2>{{ student.first_name }} {{ student.last_name }}</h2>
          <h2>{{ student.email }}</h2>
        </div>
      </div>
      <div class="flex flex-col">
        <h2 class="pb-0.5">ID</h2>
        <span class="pt-0.5">{{ student.uid }}</span>
      </div>
      <div class="flex flex-col">
        <h2 class="pb-0.5">Phone number:</h2>
        <span class="pt-0.5">{{ student.phone || "-" }}</span>
      </div>
      <div class="flex flex-col">
        <h2 class="pb-0.5">Departament</h2>
        <span class="pt-0.5">{{ student.program?.name || "-" }}</span>
      </div>
      <div class="flex flex-col">
        <h2 class="pb-0.5">Birth Date</h2>
        <span class="pt-0.5">{{
          student.birth_date
            ? dayjs(student.birth_date).format("YYYY-MM-DD")
            : "-"
        }}</span>
      </div>
    </div>
    <div class="detail-card mt-4 p-4 md:p-6">
      <div class="detail-card__header flex items-center justify-between">
        <div class="flex justify-between items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5013 7.49965C13.5013 7.30074 13.5803 7.10998 13.721 6.96932C13.8616 6.82867 14.0524 6.74965 14.2513 6.74965H23.2513C23.4502 6.74965 23.641 6.82867 23.7816 6.96932C23.9223 7.10998 24.0013 7.30074 24.0013 7.49965C24.0013 7.69857 23.9223 7.88933 23.7816 8.02998C23.641 8.17064 23.4502 8.24965 23.2513 8.24965H14.2513C14.0524 8.24965 13.8616 8.17064 13.721 8.02998C13.5803 7.88933 13.5013 7.69857 13.5013 7.49965ZM23.2513 11.2497H14.2513C14.0524 11.2497 13.8616 11.3287 13.721 11.4693C13.5803 11.61 13.5013 11.8007 13.5013 11.9997C13.5013 12.1986 13.5803 12.3893 13.721 12.53C13.8616 12.6706 14.0524 12.7497 14.2513 12.7497H23.2513C23.4502 12.7497 23.641 12.6706 23.7816 12.53C23.9223 12.3893 24.0013 12.1986 24.0013 11.9997C24.0013 11.8007 23.9223 11.61 23.7816 11.4693C23.641 11.3287 23.4502 11.2497 23.2513 11.2497ZM23.2513 15.7497H16.5013C16.3024 15.7497 16.1116 15.8287 15.971 15.9693C15.8303 16.11 15.7513 16.3007 15.7513 16.4997C15.7513 16.6986 15.8303 16.8893 15.971 17.03C16.1116 17.1706 16.3024 17.2497 16.5013 17.2497H23.2513C23.4502 17.2497 23.641 17.1706 23.7816 17.03C23.9223 16.8893 24.0013 16.6986 24.0013 16.4997C24.0013 16.3007 23.9223 16.11 23.7816 15.9693C23.641 15.8287 23.4502 15.7497 23.2513 15.7497ZM14.2279 17.8122C14.2524 17.9076 14.2579 18.0069 14.244 18.1044C14.2301 18.2019 14.1972 18.2958 14.147 18.3806C14.0969 18.4654 14.0305 18.5395 13.9517 18.5986C13.873 18.6578 13.7833 18.7008 13.6879 18.7253C13.6267 18.7418 13.5637 18.75 13.5004 18.7497C13.334 18.7497 13.1724 18.6945 13.0409 18.5927C12.9093 18.4909 12.8154 18.3482 12.7738 18.1872C12.1963 15.9428 9.92943 14.2497 7.50037 14.2497C5.07131 14.2497 2.80443 15.9418 2.22693 18.1872C2.1772 18.3799 2.05296 18.5449 1.88154 18.646C1.71012 18.7471 1.50556 18.7759 1.31287 18.7262C1.12017 18.6765 0.955122 18.5522 0.854028 18.3808C0.752935 18.2094 0.724078 18.0049 0.773806 17.8122C1.29787 15.7768 2.82131 14.1287 4.75443 13.3122C4.01009 12.7388 3.46386 11.9469 3.19235 11.0475C2.92085 10.148 2.93769 9.18611 3.2405 8.29671C3.54332 7.4073 4.11693 6.63498 4.88089 6.08806C5.64484 5.54115 6.56082 5.24707 7.50037 5.24707C8.43991 5.24707 9.35589 5.54115 10.1198 6.08806C10.8838 6.63498 11.4574 7.4073 11.7602 8.29671C12.0631 9.18611 12.0799 10.148 11.8084 11.0475C11.5369 11.9469 10.9907 12.7388 10.2463 13.3122C12.1804 14.1287 13.7038 15.7768 14.2279 17.8122ZM7.50131 12.7497C8.09465 12.7497 8.67467 12.5737 9.16802 12.2441C9.66136 11.9144 10.0459 11.4459 10.2729 10.8977C10.5 10.3495 10.5594 9.74633 10.4437 9.16438C10.3279 8.58244 10.0422 8.04789 9.62263 7.62833C9.20307 7.20878 8.66852 6.92305 8.08658 6.8073C7.50463 6.69154 6.90143 6.75095 6.35326 6.97802C5.80508 7.20508 5.33654 7.5896 5.0069 8.08294C4.67725 8.57629 4.50131 9.15631 4.50131 9.74965C4.50131 10.5453 4.81738 11.3084 5.37999 11.871C5.94259 12.4336 6.70566 12.7497 7.50131 12.7497Z"
              fill="#343330"
            /></svg
          >Detailed information
        </div>
        <el-button size="large" @click="onRouteEdit(student.id)"
          >Edit</el-button
        >
      </div>
      <div class="detail-card__body divide-y">
        <div class="grid grid-cols-2 md:grid-cols-5 py-[18px]">
          <div class="flex flex-col gap-1">
            <h2>Personal number (PINFL)</h2>
            <span>{{ student.pinfl || "-" }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <h2>Residence Country</h2>
            <span>-</span>
          </div>
          <div class="flex flex-col gap-1">
            <h2>Current Adress</h2>
            <span>-</span>
          </div>
          <div class="flex flex-col gap-1">
            <h2>Name of graduation Place</h2>
            <span>-</span>
          </div>
          <div class="flex flex-col gap-1">
            <h2>Religion</h2>
            <span>-</span>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-5 py-[18px]">
          <div class="flex flex-col gap-1">
            <h2>Graduate From</h2>
            <span>{{ student.pinfl || "-" }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <h2>Gender</h2>
            <span>{{ student?.gender || "-" }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <h2>Passport Serial and number</h2>
            <span>{{ student.passport || "-" }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <h2>Year of graduation</h2>
            <span>-</span>
          </div>
        </div>
        <div class="detail-card__header flex items-center gap-2 pt-[18px]">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.5013 7.49965C13.5013 7.30074 13.5803 7.10998 13.721 6.96932C13.8616 6.82867 14.0524 6.74965 14.2513 6.74965H23.2513C23.4502 6.74965 23.641 6.82867 23.7816 6.96932C23.9223 7.10998 24.0013 7.30074 24.0013 7.49965C24.0013 7.69857 23.9223 7.88933 23.7816 8.02998C23.641 8.17064 23.4502 8.24965 23.2513 8.24965H14.2513C14.0524 8.24965 13.8616 8.17064 13.721 8.02998C13.5803 7.88933 13.5013 7.69857 13.5013 7.49965ZM23.2513 11.2497H14.2513C14.0524 11.2497 13.8616 11.3287 13.721 11.4693C13.5803 11.61 13.5013 11.8007 13.5013 11.9997C13.5013 12.1986 13.5803 12.3893 13.721 12.53C13.8616 12.6706 14.0524 12.7497 14.2513 12.7497H23.2513C23.4502 12.7497 23.641 12.6706 23.7816 12.53C23.9223 12.3893 24.0013 12.1986 24.0013 11.9997C24.0013 11.8007 23.9223 11.61 23.7816 11.4693C23.641 11.3287 23.4502 11.2497 23.2513 11.2497ZM23.2513 15.7497H16.5013C16.3024 15.7497 16.1116 15.8287 15.971 15.9693C15.8303 16.11 15.7513 16.3007 15.7513 16.4997C15.7513 16.6986 15.8303 16.8893 15.971 17.03C16.1116 17.1706 16.3024 17.2497 16.5013 17.2497H23.2513C23.4502 17.2497 23.641 17.1706 23.7816 17.03C23.9223 16.8893 24.0013 16.6986 24.0013 16.4997C24.0013 16.3007 23.9223 16.11 23.7816 15.9693C23.641 15.8287 23.4502 15.7497 23.2513 15.7497ZM14.2279 17.8122C14.2524 17.9076 14.2579 18.0069 14.244 18.1044C14.2301 18.2019 14.1972 18.2958 14.147 18.3806C14.0969 18.4654 14.0305 18.5395 13.9517 18.5986C13.873 18.6578 13.7833 18.7008 13.6879 18.7253C13.6267 18.7418 13.5637 18.75 13.5004 18.7497C13.334 18.7497 13.1724 18.6945 13.0409 18.5927C12.9093 18.4909 12.8154 18.3482 12.7738 18.1872C12.1963 15.9428 9.92943 14.2497 7.50037 14.2497C5.07131 14.2497 2.80443 15.9418 2.22693 18.1872C2.1772 18.3799 2.05296 18.5449 1.88154 18.646C1.71012 18.7471 1.50556 18.7759 1.31287 18.7262C1.12017 18.6765 0.955122 18.5522 0.854028 18.3808C0.752935 18.2094 0.724078 18.0049 0.773806 17.8122C1.29787 15.7768 2.82131 14.1287 4.75443 13.3122C4.01009 12.7388 3.46386 11.9469 3.19235 11.0475C2.92085 10.148 2.93769 9.18611 3.2405 8.29671C3.54332 7.4073 4.11693 6.63498 4.88089 6.08806C5.64484 5.54115 6.56082 5.24707 7.50037 5.24707C8.43991 5.24707 9.35589 5.54115 10.1198 6.08806C10.8838 6.63498 11.4574 7.4073 11.7602 8.29671C12.0631 9.18611 12.0799 10.148 11.8084 11.0475C11.5369 11.9469 10.9907 12.7388 10.2463 13.3122C12.1804 14.1287 13.7038 15.7768 14.2279 17.8122ZM7.50131 12.7497C8.09465 12.7497 8.67467 12.5737 9.16802 12.2441C9.66136 11.9144 10.0459 11.4459 10.2729 10.8977C10.5 10.3495 10.5594 9.74633 10.4437 9.16438C10.3279 8.58244 10.0422 8.04789 9.62263 7.62833C9.20307 7.20878 8.66852 6.92305 8.08658 6.8073C7.50463 6.69154 6.90143 6.75095 6.35326 6.97802C5.80508 7.20508 5.33654 7.5896 5.0069 8.08294C4.67725 8.57629 4.50131 9.15631 4.50131 9.74965C4.50131 10.5453 4.81738 11.3084 5.37999 11.871C5.94259 12.4336 6.70566 12.7497 7.50131 12.7497Z"
              fill="#343330"
            /></svg
          >Family information
        </div>
        <div
          class="grid grid-cols-2 md:grid-cols-5 py-[18px] !border-t-0"
          v-if="student.parent_gender === 'male'"
        >
          <div class="flex flex-col gap-1">
            <h1>Father:</h1>
          </div>
          <div class="flex flex-col gap-1">
            <h2>Full name</h2>
            <span>{{
              student.parent_full_name ? student.parent_full_name : "-"
            }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <h2>Place of work</h2>
            <span>{{
              student.parent_work_address ? student.parent_work_address : "-"
            }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <h2>Personal Number (PNFL)</h2>
            <span>{{ student.parent_pinfl ? student.parent_pinfl : "-" }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <h2>Mobile Phone</h2>
            <span>{{ student.parent_phone ? student.parent_phone : "-" }}</span>
          </div>
        </div>
        <div
          class="grid grid-cols-2 md:grid-cols-5 py-[18px]"
          v-if="student.parent_gender === 'female'"
        >
          <div class="flex flex-col gap-1">
            <h1>Mother:</h1>
          </div>
          <div class="flex flex-col gap-1">
            <h2>Full name</h2>
            <span>{{
              student.parent_full_name ? student.parent_full_name : "-"
            }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <h2>Place of work</h2>
            <span>{{
              student.parent_work_address ? student.parent_work_address : "-"
            }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <h2>Personal Number (PNFL)</h2>
            <span>{{ student.parent_pinfl ? student.parent_pinfl : "-" }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <h2>Mobile Phone</h2>
            <span>{{ student.parent_phone ? student.parent_phone : "-" }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useFileStore, useTranscriptStore } from "@/stores";
import { dayjs } from "element-plus";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { saveFile } from "@/utils/common";

const router = useRouter();
const transcriptsStore = useTranscriptStore();
const fileStore = useFileStore();

const loading = ref(false);

const props = defineProps<{
  student: any;
}>();

const download = async () => {
  try {
    loading.value = true;

    const transcript = (await transcriptsStore.getTranscript(
      props.student?.id as string
    )) as any;
    const data = await fileStore.downloadById(transcript?.pdf?.id);
    saveFile(data, "FileName" + new Date() + ".pdf");
    loading.value = false;
  } catch (error: any) {
    console.log("error", error?.message);
    loading.value = false;
  }
};
const onRouteEdit = (id: string) => {
  router.push({
    name: "reference-student-edit",
    params: { id: id },
  });
};
</script>

<style lang="scss" scoped>
.header-card {
  border-radius: 16px;
  border: 1px solid #d8d8d8;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  h2 {
    color: #6c737f;
  }

  span {
    color: #000;
  }
}

.detail-card {
  border: 1px solid #d3d3d3;
  overflow: hidden;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 13.87px;

  &__header {
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  &__body {
    font-size: 10px;
    font-style: normal;
    font-weight: 500;

    h2 {
      color: #313e68;
    }

    span {
      color: #000;
    }

    h1 {
      color: #182857;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
    }
  }
}
</style>
