<template>
  <img
    src="@/assets/images/logo.png"
    alt="Unims Logo"
    :class="{
      'h-9': $props.size === 'small',
      'h-12': $props.size === 'large',
    }"
  />
</template>

<script lang="ts">
export default {
  name: "LogoIcon",

  props: {
    size: {
      type: String,
      default: "small",
    },
  },
};
</script>
