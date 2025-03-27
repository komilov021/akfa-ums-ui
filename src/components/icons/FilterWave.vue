<template>
  <svg
    :class="classes"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.53384 9.8421H15.3763M3.07324 4.9209H17.8369M7.99445 14.7633H12.9156"
      stroke="#344054"
      stroke-width="1.6404"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: "FilterWave",

  props: {
    classes: {
      type: String,
      default: "",
    },
  },
};
</script>
