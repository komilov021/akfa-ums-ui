<template>
  <svg
    width="9"
    height="10"
    viewBox="0 0 9 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="classes"
  >
    <rect width="9" height="10" fill="#F5F5F5" />
    <g id="General" clip-path="url(#clip0_23_878)">
      <rect
        width="1920"
        height="1402"
        transform="translate(-1196 -1056)"
        fill="#F8F8F8"
      />
      <g id="card">
        <g clip-path="url(#clip1_23_878)">
          <rect
            x="-169"
            y="-330"
            width="567"
            height="355"
            rx="20"
            fill="white"
          />
          <g id="card-body">
            <g id="ic:twotone-graphic-eq">
              <rect
                x="-4"
                y="-3.5"
                width="17"
                height="17"
                rx="8.5"
                fill="#D3D3D3"
              />
              <path
                id="Vector"
                d="M2 7.7H3V2.3H2V7.7ZM4 9.5H5V0.5H4V9.5ZM0 5.9H1V4.1H0V5.9ZM6 7.7H7V2.3H6V7.7ZM8 4.1V5.9H9V4.1H8Z"
                fill="black"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
    <defs>
      <clipPath id="clip0_23_878">
        <rect
          width="1920"
          height="1402"
          fill="white"
          transform="translate(-1196 -1056)"
        />
      </clipPath>
      <clipPath id="clip1_23_878">
        <rect x="-169" y="-330" width="567" height="355" rx="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
</template>

<script lang="ts">
export default {
  name: "DiamondIcon",

  props: {
    classes: {
      type: String,
      default: "",
    },
  },
};
</script>
