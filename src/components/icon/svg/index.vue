<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div v-if="isUrl" :style="urlIconStyle" class="url-svg svg-icon icon" />
  <svg v-else class="svg-icon icon" :style="iconStyle" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script setup lang="ts">
import { computed, CSSProperties } from "vue";
import { isExternal } from "@/utils/common";
interface Props {
  name: string;
  size: string;
  color: string;
  stroke?: string;
}

const props = withDefaults(defineProps<Props>(), {
  name: "",
  size: "18px",
  color: "#000000",
  // stroke: "#fff",
});

const s = `${props.size.replace("px", "")}px`;
const iconName = computed(() => `#${props.name}`);
const iconStyle = computed((): CSSProperties => {
  return {
    color: props.color,
    fontSize: s,
    stroke: props.stroke,
  };
});
const isUrl = computed(() => isExternal(props.name));
const urlIconStyle = computed(() => {
  return {
    width: s,
    height: s,
    mask: `url(${props.name}) no-repeat 50% 50%`,
    "-webkit-mask": `url(${props.name}) no-repeat 50% 50%`,
  };
});
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
}
</style>
