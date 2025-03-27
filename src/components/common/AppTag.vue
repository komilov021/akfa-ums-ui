<template>
  <div
    class="app-tag inline-block"
    :style="{
      color: colors[props.color],
      background: `${colors[props.color]}10`,
    }"
  >
    <slot>Tag</slot>
  </div>
</template>

<script setup lang="ts">
const colors = {
  blue: "#5DB8E4",
  purple: "#8758FF",
  meteor: "#D97706",
  orange: "#FF9900",
  red: "#FF4C4C",
  green: "#33C481",
  gray: "#282E36",
};

const props = defineProps<{
  color: keyof typeof colors;
}>();
</script>

<style scoped>
.app-tag {
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  text-align: center;
}
</style>
