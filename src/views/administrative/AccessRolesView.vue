<template>
  <div class="px-10 flex flex-col h-full">
    <h4 class="text-lg font-semibold">Access and users</h4>
    <div class="mt-8">
      <h6 class="text-sm font-semibold">All users</h6>
      <p class="text-sm">Manage your existing users and change roles</p>
      <el-input
        class="mt-2 max-w-[390px]"
        size="large"
        :prefix-icon="Search"
      ></el-input>
    </div>
    <div class="mt-6 flex-1" v-loading="loading">
      <el-table :data="['']" style="width: 100%" class="whiteStripe">
        <el-table-column prop="uid" label="Name" min-width="200" align="left">
          <div class="flex items-center gap-2">
            <div
              class="h-10 w-10 flex items-center justify-center bg-slate-500 border border-black rounded-full"
            >
              <User class="w-6 h-6" color="white"></User>
            </div>
            <div>
              <h6 class="font-medium text-black">Olivia Rhye</h6>
              <p>olivia@untitledui.com</p>
            </div>
          </div>
        </el-table-column>
        <el-table-column prop="" label="Role" width="200" align="left">
          <template #default="{ row }"> Professor{{ row }} </template>
        </el-table-column>
        <el-table-column
          prop="is_enroll_completed"
          label="Level"
          width="200"
          align="left"
        >
          <template #default="{}">
            <el-button @click="dialogVisible = true" type="primary" plain>
              <Message class="w-5 h-5 mt-[-4px] mr-2"></Message>
              Send invite
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="waiting"
          label="Action"
          width="250"
          align="center"
        >
          <template #default="{}">
            <el-button size="large" @click="dialogVisible1 = true">
              <Delete class="w-6 h-6"></Delete>
            </el-button>
            <el-button size="large" @click="dialogVisible = true">
              <Edit class="w-6 h-6"></Edit>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pb-2 px-4">
      <el-divider />
      <el-pagination
        background
        layout="prev, pager, next"
        next-text="Next ->"
        prev-text="<- Previous"
        :page-size="30"
        :total="30"
      />
    </div>
    <el-dialog
      v-model="dialogVisible"
      title="Providing access for user Olivia Rhye."
      width="400"
    >
      <span
        >Are you sure you want to provide access to the chosen employee? This
        action cannot be undone.</span
      >
      <el-select class="w-full !mt-3" placeholder="Select">
        <el-option
          v-for="item in ['Professor', 'Nusrat']"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="w-[48%]" @click="dialogVisible = false"
            >Cancel</el-button
          >
          <el-button
            class="w-[48%]"
            type="primary"
            @click="dialogVisible = false"
          >
            Add
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialogVisible1"
      title="Denying access for user Olivia Rhye."
      width="400"
    >
      <span
        >Are you sure you want to provide access to the chosen employee? This
        action cannot be undone.</span
      >
      <template #footer>
        <span class="dialog-footer">
          <el-button class="w-[48%]" @click="dialogVisible1 = false"
            >Cancel</el-button
          >
          <el-button
            class="w-[48%]"
            type="danger"
            @click="dialogVisible1 = false"
          >
            Deny
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { Search, User, Message, Delete, Edit } from "@element-plus/icons-vue";
import { ref } from "vue";
const dialogVisible = ref(false);
const dialogVisible1 = ref(false);
const loading = ref(false);
</script>
