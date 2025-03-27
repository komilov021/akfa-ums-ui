<template>
  <svg
    width="24"
    height="24"
    :class="classes"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.40039 2.4C2.40039 1.07452 3.47491 0 4.80039 0H14.4004L21.6004 7.2V21.6C21.6004 22.9255 20.5259 24 19.2004 24H4.80039C3.47491 24 2.40039 22.9255 2.40039 21.6V2.4Z"
      fill="#6941C6"
    />
    <path
      opacity="0.3"
      d="M14.4004 0L21.6004 7.2H16.8004C15.4749 7.2 14.4004 6.12548 14.4004 4.8V0Z"
      fill="white"
    />
    <g clip-path="url(#clip0_1585_19767)">
      <path
        d="M7.67969 14.878H16.3197M7.67969 14.878V12.958C7.67969 12.4279 8.10949 11.998 8.63969 11.998H10.5597M7.67969 14.878V16.798C7.67969 17.3282 8.10949 17.758 8.63969 17.758H10.5597M16.3197 14.878V16.798C16.3197 17.3282 15.8899 17.758 15.3597 17.758H10.5597M16.3197 14.878V12.958C16.3197 12.4279 15.8899 11.998 15.3597 11.998H10.5597M10.5597 11.998V17.758"
        stroke="white"
        stroke-width="0.9"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_1585_19767">
        <rect
          width="9.6"
          height="9.6"
          fill="white"
          transform="translate(7.19922 9.59961)"
        />
      </clipPath>
    </defs>
  </svg>
</template>

<script lang="ts">
export default {
  name: "ExelIcon",

  props: {
    classes: {
      type: String,
      default: "",
    },
  },
};
</script>
