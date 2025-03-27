<template>
  <div
    v-if="props.arg?.display == 'block'"
    class="flex overflow-hidden relative flex-col items-start justify-center text-xs font-medium text-gray-500 aspect-[1.965] w-full h-full px-2"
    :style="multiBackground()"
  >
    <el-tooltip class="box-item" effect="dark" placement="top-start">
      <template #content>
        <h2
          class="relative z-0 self-stretch text-[10px] text-[#fff] truncate inline-block text-blank"
        >
          {{ props.arg?.title }}
        </h2>
      </template>
      <div class="flex items-center">
        <h2
          class="relative z-0 self-stretch text-[10px] text-zinc-900 truncate inline-block text-blank"
        >
          {{ props.arg?.title }}
        </h2>
      </div>
    </el-tooltip>
    <!-- v-if="props.arg?.extendedProps.others.teachers?.length && minutes > 60" -->
    <div class="flex relative z-0 gap-1 justify-center items-center">
      <svg
        class="object-contain w-2 h-2 my-auto"
        viewBox="0 0 10 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.00008 5.69294C4.44097 5.69294 3.89441 5.53089 3.42953 5.22727C2.96464 4.92365 2.60231 4.4921 2.38834 3.9872C2.17438 3.4823 2.1184 2.92672 2.22748 2.39072C2.33655 1.85472 2.60579 1.36237 3.00114 0.975937C3.3965 0.589503 3.90021 0.326338 4.44858 0.219721C4.99694 0.113103 5.56534 0.167823 6.0819 0.37696C6.59845 0.586097 7.03996 0.940258 7.35058 1.39466C7.66121 1.84906 7.827 2.38328 7.827 2.92978C7.82617 3.66237 7.52807 4.36472 6.9981 4.88273C6.46813 5.40075 5.74957 5.69213 5.00008 5.69294ZM5.00008 1.3947C4.68946 1.3947 4.38582 1.48473 4.12755 1.65341C3.86928 1.82208 3.66798 2.06183 3.54912 2.34233C3.43025 2.62283 3.39915 2.93149 3.45975 3.22927C3.52034 3.52704 3.66992 3.80057 3.88956 4.01526C4.1092 4.22994 4.38904 4.37614 4.69369 4.43538C4.99834 4.49461 5.31412 4.46421 5.60109 4.34802C5.88806 4.23183 6.13334 4.03508 6.30591 3.78263C6.47848 3.53019 6.57059 3.2334 6.57059 2.92978C6.57059 2.52265 6.40513 2.1322 6.1106 1.84431C5.81607 1.55643 5.41661 1.3947 5.00008 1.3947Z"
          fill="#6B7280"
        />
        <path
          d="M8.45521 11.8333H1.54495C1.37834 11.8333 1.21856 11.7686 1.10075 11.6534C0.982934 11.5383 0.916748 11.3821 0.916748 11.2193V9.37715C0.917746 8.56319 1.24899 7.78285 1.83783 7.20729C2.42668 6.63173 3.22503 6.30795 4.05777 6.30698H5.94239C6.77513 6.30795 7.57349 6.63173 8.16233 7.20729C8.75117 7.78285 9.08242 8.56319 9.08341 9.37715V11.2193C9.08341 11.3821 9.01723 11.5383 8.89942 11.6534C8.78161 11.7686 8.62182 11.8333 8.45521 11.8333ZM2.17316 10.6052H7.827V9.37715C7.827 8.8886 7.62845 8.42005 7.27501 8.07459C6.92158 7.72913 6.44222 7.53505 5.94239 7.53505H4.05777C3.55794 7.53505 3.07858 7.72913 2.72515 8.07459C2.37171 8.42005 2.17316 8.8886 2.17316 9.37715V10.6052Z"
          fill="#6B7280"
        />
      </svg>
      <el-tooltip class="box-item" effect="dark" placement="top-start">
        <template #content>
          <div class="flex">
            <span
              v-for="(teacher, i) in props.arg?.extendedProps.others.teachers"
              :key="i"
            >
              {{
                teacher.first_name +
                " " +
                teacher.last_name +
                `${
                  i == props.arg?.extendedProps.others.teachers.length - 1
                    ? " "
                    : ", "
                }`
              }}
            </span>
          </div>
        </template>
        <div class="flex items-center">
          <span
            v-for="(
              teacher, i
            ) in props.arg?.extendedProps.others.teachers.slice(0, 1)"
            :key="i"
            class="mr-1"
          >
            {{
              teacher.first_name +
              " " +
              teacher.last_name +
              `${
                i === 1 ||
                i ===
                  props.arg?.extendedProps.others.teachers.slice(0, 2).length -
                    1
                  ? " "
                  : ", "
              }`
            }}
          </span>
          <!-- Add ellipsis if there are more than 2 teachers -->
          <span
            v-if="props.arg?.extendedProps.others.teachers.length > 1"
            class="ml-1"
            >...</span
          >
        </div>
      </el-tooltip>
    </div>
    <div
      class="flex relative z-0 gap-1 items-center"
      v-if="props.arg?.extendedProps.others.groups?.length && minutes > 40"
    >
      <svg
        viewBox="0 0 12 12"
        fill="none"
        class="object-contain w-2 h-2 my-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.33341 1.3947C8.05402 1.39695 7.77732 1.45249 7.51675 1.55864C7.65527 1.95599 7.73247 2.37412 7.74541 2.79715C7.92301 2.68456 8.1261 2.62432 8.33341 2.62277C8.53245 2.62203 8.72836 2.67492 8.9025 2.77638C9.07664 2.87785 9.22322 3.02452 9.32831 3.20246C9.43339 3.38039 9.49348 3.58367 9.50286 3.79295C9.51224 4.00223 9.4706 4.21056 9.3819 4.39811C9.2932 4.58567 9.16039 4.74623 8.9961 4.8645C8.83181 4.98278 8.64151 5.05484 8.44329 5.07384C8.24507 5.09284 8.04553 5.05814 7.86365 4.97305C7.68176 4.88795 7.52359 4.75529 7.40416 4.58768C7.23652 4.97238 7.01186 5.3266 6.73858 5.63707C7.01577 5.91244 7.35283 6.11215 7.72029 6.21873C8.08774 6.3253 8.4744 6.3355 8.84647 6.24843C9.21853 6.16137 9.56467 5.97968 9.85462 5.71927C10.1446 5.45885 10.3695 5.12764 10.5097 4.75457C10.65 4.38151 10.7013 3.97797 10.6591 3.57922C10.617 3.18047 10.4827 2.79866 10.268 2.46717C10.0532 2.13569 9.76465 1.86461 9.42741 1.67765C9.09017 1.4907 8.71456 1.39355 8.33341 1.3947Z"
          fill="#6B7280"
        />
        <path
          d="M8.91675 6.92101H8.17941C8.42913 7.29584 8.61998 7.71049 8.74466 8.14908H8.91675C9.38088 8.14908 9.826 8.34316 10.1542 8.68862C10.4824 9.03408 10.6667 9.50263 10.6667 9.99119V10.6052H8.91675V11.2193C8.91486 11.4289 8.87855 11.6367 8.80941 11.8333H11.2501C11.4048 11.8333 11.5532 11.7686 11.6626 11.6534C11.772 11.5383 11.8334 11.3821 11.8334 11.2193V9.99119C11.8325 9.17723 11.5249 8.39688 10.9781 7.82132C10.4313 7.24576 9.69001 6.92199 8.91675 6.92101Z"
          fill="#6B7280"
        />
        <path
          d="M3.95841 5.69294C3.43924 5.69294 2.93172 5.53089 2.50004 5.22727C2.06836 4.92365 1.73191 4.4921 1.53323 3.9872C1.33455 3.4823 1.28257 2.92672 1.38385 2.39072C1.48514 1.85472 1.73515 1.36237 2.10226 0.975937C2.46937 0.589503 2.9371 0.326338 3.4463 0.219721C3.9555 0.113103 4.4833 0.167823 4.96296 0.37696C5.44261 0.586097 5.85258 0.940258 6.14102 1.39466C6.42946 1.84906 6.58341 2.38328 6.58341 2.92978C6.58264 3.66237 6.30583 4.36472 5.81372 4.88273C5.3216 5.40075 4.65437 5.69213 3.95841 5.69294ZM3.95841 1.3947C3.66998 1.3947 3.38803 1.48473 3.14821 1.65341C2.90839 1.82208 2.72147 2.06183 2.61109 2.34233C2.50071 2.62283 2.47183 2.93149 2.5281 3.22927C2.58437 3.52704 2.72327 3.80057 2.92722 4.01526C3.13117 4.22994 3.39102 4.37614 3.67391 4.43538C3.9568 4.49461 4.25002 4.46421 4.51649 4.34802C4.78297 4.23183 5.01073 4.03508 5.17097 3.78263C5.33122 3.53019 5.41675 3.2334 5.41675 2.92978C5.41675 2.52265 5.2631 2.1322 4.98961 1.84431C4.71612 1.55643 4.34519 1.3947 3.95841 1.3947Z"
          fill="#6B7280"
        />
        <path
          d="M7.16675 11.8333H0.750081C0.595372 11.8333 0.446999 11.7686 0.337602 11.6534C0.228206 11.5383 0.166748 11.3821 0.166748 11.2193V9.37715C0.167674 8.56319 0.475263 7.78285 1.02204 7.20729C1.56882 6.63173 2.31015 6.30795 3.08341 6.30698H4.83341C5.60668 6.30795 6.34801 6.63173 6.89479 7.20729C7.44157 7.78285 7.74916 8.56319 7.75008 9.37715V11.2193C7.75008 11.3821 7.68862 11.5383 7.57923 11.6534C7.46983 11.7686 7.32146 11.8333 7.16675 11.8333ZM1.33341 10.6052H6.58341V9.37715C6.58341 8.8886 6.39904 8.42005 6.07085 8.07459C5.74266 7.72913 5.29754 7.53505 4.83341 7.53505H3.08341C2.61929 7.53505 2.17417 7.72913 1.84598 8.07459C1.51779 8.42005 1.33341 8.8886 1.33341 9.37715V10.6052Z"
          fill="#6B7280"
        />
      </svg>
      <el-tooltip class="box-item" effect="dark" placement="top-start">
        <template #content>
          <div class="flex">
            <span
              v-for="(group, i) in props.arg?.extendedProps.others.groups"
              :key="i"
            >
              {{
                group.short_name +
                `${
                  i == props.arg?.extendedProps.others.groups.length - 1
                    ? " "
                    : ", "
                }`
              }}
            </span>
          </div>
        </template>
        <div class="flex">
          <span
            v-for="(group, i) in props.arg?.extendedProps.others.groups.slice(
              0,
              2
            )"
            :key="i"
            class="mr-1"
          >
            {{
              group.short_name +
              `${
                i === 1 ||
                i ===
                  props.arg?.extendedProps.others.groups.slice(0, 2).length - 1
                  ? " "
                  : ", "
              }`
            }}
          </span>
          <span
            v-if="props.arg?.extendedProps.others.groups?.length > 2"
            class="ml-1"
            >...</span
          >
        </div>
      </el-tooltip>
    </div>
    <div class="flex relative gap-1 justify-center items-center">
      <svg
        class="object-contain w-2 h-2 my-auto"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.00008 11.8333C4.84636 11.8333 3.71854 11.4912 2.75926 10.8502C1.79997 10.2092 1.0523 9.29818 0.610787 8.23228C0.169276 7.16638 0.0537561 5.99349 0.278837 4.86194C0.503917 3.73038 1.05949 2.69098 1.87529 1.87517C2.6911 1.05937 3.7305 0.503795 4.86206 0.278714C5.99361 0.053634 7.1665 0.169153 8.2324 0.610665C9.29831 1.05218 10.2093 1.79985 10.8503 2.75914C11.4913 3.71842 11.8334 4.84624 11.8334 5.99996C11.8317 7.54654 11.2166 9.02928 10.123 10.1229C9.0294 11.2165 7.54666 11.8316 6.00008 11.8333ZM6.00008 1.3333C5.0771 1.3333 4.17485 1.60699 3.40742 2.11977C2.63999 2.63255 2.04186 3.36138 1.68865 4.21411C1.33544 5.06683 1.24302 6.00514 1.42309 6.91038C1.60315 7.81563 2.04761 8.64715 2.70025 9.29979C3.3529 9.95244 4.18442 10.3969 5.08966 10.577C5.99491 10.757 6.93322 10.6646 7.78594 10.3114C8.63866 9.95819 9.36749 9.36005 9.88027 8.59262C10.3931 7.82519 10.6667 6.92294 10.6667 5.99996C10.6654 4.76271 10.1732 3.57653 9.29838 2.70166C8.42351 1.8268 7.23733 1.33468 6.00008 1.3333Z"
          fill="#6B7280"
        />
        <path
          d="M6.00008 6.58329C5.84537 6.58329 5.697 6.52184 5.5876 6.41244C5.47821 6.30304 5.41675 6.15467 5.41675 5.99996V3.66663C5.41675 3.51192 5.47821 3.36355 5.5876 3.25415C5.697 3.14475 5.84537 3.0833 6.00008 3.0833C6.15479 3.0833 6.30317 3.14475 6.41256 3.25415C6.52196 3.36355 6.58342 3.51192 6.58342 3.66663V5.99996C6.58342 6.15467 6.52196 6.30304 6.41256 6.41244C6.30317 6.52184 6.15479 6.58329 6.00008 6.58329Z"
          fill="#6B7280"
        />
        <path
          d="M7.9105 8.49371C7.7558 8.49368 7.60745 8.4322 7.49808 8.32279L5.5876 6.41244C5.48135 6.30242 5.42261 6.15501 5.42394 6.00206C5.42527 5.84911 5.48662 5.70281 5.59477 5.59465C5.70293 5.4865 5.84924 5.42515 6.00218 5.42382C6.15513 5.42249 6.30248 5.48129 6.4125 5.58755L8.32292 7.49796C8.40447 7.57954 8.46001 7.68347 8.48251 7.79661C8.505 7.90975 8.49345 8.02702 8.44931 8.13359C8.40517 8.24017 8.33042 8.33126 8.23452 8.39536C8.13861 8.45946 8.02585 8.49369 7.9105 8.49371Z"
          fill="#6B7280"
        />
      </svg>

      <span class="my-auto">
        {{
          dayjs($props.arg?.extendedProps.others?.start).format("HH:mm") +
          "-" +
          dayjs($props.arg?.extendedProps.others?.end).format("HH:mm")
        }}
      </span>
    </div>
  </div>
  <div class="p-5" v-else>
    <div class="min-h-screen cursor-pointer" @click="viewHoliday">
      <h2 class="text-base text-zinc-900" style="line-height: 30px !important">
        {{ props.arg?.title }}
      </h2>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { dayjs } from "element-plus";
import { computed } from "vue";
export interface Props {
  arg: {
    title: string;
    start: string;
    end: string;
    resourceId: string;
    backgroundColor: string;
    display: string;
    extendedProps: any;
  } | null;
}
const props = withDefaults(defineProps<Props>(), {
  arg: null,
});
const calculateTimeDifference = (startDate: Date, endDate: Date): number => {
  const differenceInMs = endDate.getTime() - startDate.getTime();
  const differenceInMinutes = Math.floor(differenceInMs / (1000 * 60));

  return differenceInMinutes;
};
const minutes = computed(() =>
  calculateTimeDifference(
    new Date(props.arg?.extendedProps.others?.start),
    new Date(props.arg?.extendedProps.others?.end)
  )
);
const viewHoliday = () => {
  console.log("holiday week");
};
const multiBackground = (): string => {
  const colors: string[] = props.arg?.extendedProps.others?.colors?.map(
    (x: any) => x.hex_code
  );
  const opacity = 0.15;
  const rgbaColors = colors?.map((color) => {
    if (color.startsWith("#")) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  });

  if (rgbaColors?.length == 1) {
    return `background-color:  ${rgbaColors[0]};`;
  } else if (rgbaColors?.length == 2) {
    return `
      background: -webkit-linear-gradient(140deg, ${rgbaColors[0]} 50%, ${rgbaColors[1]} 50%);
      background: -o-linear-gradient(140deg, ${rgbaColors[0]} 50%, ${rgbaColors[1]} 50%);
      background: -moz-linear-gradient(140deg, ${rgbaColors[0]} 50%, ${rgbaColors[1]} 50%);
      background: linear-gradient(140deg, ${rgbaColors[0]} 50%, ${rgbaColors[1]} 50%);
    `;
  } else if (rgbaColors?.length == 3) {
    return `
      background: -o-linear-gradient(140deg, ${rgbaColors[0]} 33%, rgba(0, 0, 0, 0) 33%),
                  -o-linear-gradient(140deg, ${rgbaColors[1]} 66%, ${rgbaColors[2]} 66%);
      background: -moz-linear-gradient(140deg, ${rgbaColors[0]} 33%, rgba(0, 0, 0, 0) 33%),
                  -moz-linear-gradient(140deg, ${rgbaColors[1]} 66%, ${rgbaColors[2]} 66%);
      background: linear-gradient(140deg, ${rgbaColors[0]} 33%, rgba(0, 0, 0, 0) 33%),
                  linear-gradient(140deg, ${rgbaColors[1]} 66%, ${rgbaColors[2]} 66%);
    `;
  } else if (rgbaColors?.length == 4) {
    return `
      background: -o-linear-gradient(140deg, ${rgbaColors[0]} 25%, rgba(0, 0, 0, 0) 25%),
                  -o-linear-gradient(140deg, ${rgbaColors[1]} 50%, rgba(0, 0, 0, 0) 50%),
                  -o-linear-gradient(140deg, ${rgbaColors[2]} 75%, rgba(0, 0, 0, 0) 75%),
                  -o-linear-gradient(140deg, ${rgbaColors[3]} 100%, ${rgbaColors[3]} 100%);
      background: -moz-linear-gradient(140deg, ${rgbaColors[0]} 25%, rgba(0, 0, 0, 0) 25%),
                  -moz-linear-gradient(140deg, ${rgbaColors[1]} 50%, rgba(0, 0, 0, 0) 50%),
                  -moz-linear-gradient(140deg, ${rgbaColors[2]} 75%, rgba(0, 0, 0, 0) 75%),
                  -moz-linear-gradient(140deg, ${rgbaColors[3]} 100%, ${rgbaColors[3]} 100%);
      background: linear-gradient(140deg, ${rgbaColors[0]} 25%, rgba(0, 0, 0, 0) 25%),
                  linear-gradient(140deg, ${rgbaColors[1]} 50%, rgba(0, 0, 0, 0) 50%),
                  linear-gradient(140deg, ${rgbaColors[2]} 75%, rgba(0, 0, 0, 0) 75%),
                  linear-gradient(140deg, ${rgbaColors[3]} 100%, ${rgbaColors[3]} 100%);
    `;
  } else {
    return "background: rgba(253, 253, 234, 1);";
  }
};
</script>
<style lang="scss" scoped>
span {
  font-size: 8px;
  line-height: 12px;
}
</style>
