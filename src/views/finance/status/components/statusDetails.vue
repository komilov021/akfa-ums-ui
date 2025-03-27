<template>
  <div class="flex flex-col gap-1">
    <p class="text-sm">ID: <span class="text-primary">220211</span></p>
    <p class="text-sm">Name: <span class="text-primary">Tom Hohland</span></p>
    <p class="text-sm">
      Program: <span class="text-primary">Medical School</span>
    </p>
    <p class="text-sm">Study Year:<span class="text-primary">1</span></p>
    <p class="text-sm">Foreign: <span class="text-primary">yes</span></p>
    <p class="text-sm mt-3">2023 SPRING:</p>
    <div class="flex flex-col gap-1 ml-5">
      <p class="text-sm flex items-center gap-2">
        Total tuition: <span class="text-primary">22,000,000</span>
        <span
          ><svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_1377_19599)">
              <path
                d="M1.1977 7.54961C1.21684 7.37732 1.22641 7.29118 1.25248 7.21066C1.27561 7.13922 1.30828 7.07124 1.34961 7.00856C1.39621 6.93791 1.45749 6.87662 1.58007 6.75404L7.08269 1.25143C7.54293 0.791191 8.28912 0.791191 8.74936 1.25143C9.2096 1.71167 9.2096 2.45786 8.74936 2.9181L3.24673 8.42071C3.12416 8.54329 3.06287 8.60457 2.99222 8.65116C2.92954 8.6925 2.86155 8.72517 2.79012 8.7483C2.7096 8.77436 2.62346 8.78394 2.45117 8.80308L1.04102 8.95976L1.1977 7.54961Z"
                stroke="#475467"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_1377_19599">
                <rect width="10" height="10" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </span>
      </p>
      <p class="text-sm">
        Amount paid: <span class="text-primary">22,000,000</span>
      </p>
      <p class="text-sm">Debt: <span class="text-primary">22,000,000</span></p>
    </div>
    <p class="text-sm mt-3">All time:</p>
    <div class="flex flex-col gap-1 ml-5">
      <p class="text-sm">
        Total debt: <span class="text-primary">15,000,000</span>
      </p>
      <p class="text-sm">
        Total prepayment: <span class="text-primary">22,000,000</span>
      </p>
    </div>
    <p class="text-sm mt-5">
      Payment deadline: <span class="text-primary">22/02/2023</span>
    </p>
    <p class="text-sm">Payment status:<span class="text-primary">Paid</span></p>
    <p class="text-sm">
      Student status: <span class="text-primary">Active</span>
    </p>
    <div class="flex items-center justify-between mt-6">
      <el-button>
        <DeleteFilled class="h-4 w-4 dot-icon mr-3" />
        Delete
      </el-button>
      <el-button type="primary"> Sumbit </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { EditPen, DeleteFilled } from "@element-plus/icons-vue";

// const props = defineProps({
//   student: {
//     type: Array,
//     default: [],
//   },
// });
</script>
