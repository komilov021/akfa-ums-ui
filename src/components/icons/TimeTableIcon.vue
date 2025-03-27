<template>
  <svg
    :class="classes"
    width="57"
    height="57"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.8 4V9.19999M22.2 4V9.19999M5.29999 14.4C5.29999 14.4 27.9999 14.4 28.7 14.4M12 19H12.013M17.2 19H17.213M22.4 19H22.413M12 24.2H12.013M17.2 24.2H17.213M22.4 24.2H22.413M7.89998 6.60003H26.1C27.5359 6.60003 28.7 7.76409 28.7 9.20003V27.4C28.7 28.8359 27.5359 30 26.1 30H7.89998C6.46405 30 5.29999 28.8359 5.29999 27.4V9.20003C5.29999 7.76409 6.46405 6.60003 7.89998 6.60003Z"
      stroke="black"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: "TimeTableIcon",

  props: {
    classes: {
      type: String,
      default: "",
    },
  },
};
</script>
