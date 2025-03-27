<template>
  <div class="bg-white rounded-3xl py-[26.5px] px-6">
    <div class="flex items-center justify-between mb-8">
      <div class="flex gap-5 items-center">
        <div
          class="bg-[#F3F4F6] w-10 h-10 rounded-lg flex justify-center items-center cursor-pointer"
          @click="router.go(-1)"
        >
          <svg
            width="18"
            height="15"
            viewBox="0 0 18 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.7144 6.11608H4.39019L7.33817 2.90652C7.46096 2.7774 7.55891 2.62295 7.62629 2.45218C7.69367 2.28141 7.72913 2.09774 7.73061 1.91188C7.7321 1.72603 7.69957 1.54171 7.63492 1.36969C7.57028 1.19767 7.47482 1.04139 7.35411 0.909968C7.23339 0.778545 7.08985 0.674611 6.93185 0.604232C6.77385 0.533853 6.60456 0.498438 6.43385 0.500053C6.26314 0.501668 6.09444 0.540281 5.93759 0.613639C5.78073 0.686997 5.63887 0.793631 5.52027 0.927318L0.377706 6.5262C0.257979 6.65622 0.162988 6.81068 0.098175 6.98073C0.033362 7.15079 0 7.33309 0 7.5172C0 7.70131 0.033362 7.88361 0.098175 8.05367C0.162988 8.22372 0.257979 8.37818 0.377706 8.5082L5.52027 14.1071C5.76275 14.3621 6.0875 14.5031 6.42459 14.4999C6.76169 14.4968 7.08414 14.3496 7.32251 14.09C7.56088 13.8305 7.69609 13.4794 7.69902 13.1124C7.70195 12.7454 7.57236 12.3919 7.33817 12.1279L4.39019 8.91552H16.7144C17.0553 8.91552 17.3823 8.76805 17.6234 8.50555C17.8645 8.24305 18 7.88703 18 7.5158C18 7.14457 17.8645 6.78855 17.6234 6.52605C17.3823 6.26355 17.0553 6.11608 16.7144 6.11608Z"
              fill="#1F2A37"
            />
          </svg>
        </div>
        <h2 class="text-[#111928] text-2xl font-bold">
          {{ eventsOne?.module_info.title || eventsOne?.name || "No title" }}
          {{ `{ ${eventsOne?.module_info?.code} }` }}
        </h2>
        <el-tag
          v-if="eventsOne?.type == 'class'"
          class="!text-[#03543F] font-semibold text-sm rounded-md !w-[70px] !h-[33px] !border-none"
          color="#DEF7EC"
          >Class</el-tag
        >
        <el-tag
          v-if="eventsOne?.type == 'event'"
          class="!text-[#92400E] font-semibold text-sm rounded-md !w-[70px] !h-[33px] !border-none"
          color="#FDF6B2"
          >Event</el-tag
        >
        <el-tag
          v-if="eventsOne?.type == 'exam'"
          class="!text-[#9B1C1C] font-semibold text-sm rounded-md !w-[70px] !h-[33px] !border-none"
          color="#FDE8E8"
          >Exam</el-tag
        >
        <el-tag
          v-if="eventsOne?.type == 'practice'"
          class="!text-[#5521B5] font-semibold text-sm rounded-md !w-[70px] !h-[33px] !border-none"
          color="#EDEBFE"
          >Practice</el-tag
        >
      </div>
      <div class="flex items-center gap-5">
        <el-button
          type="borderRed"
          class="flex items-center gap-2"
          @click="confirmDelete(eventsOne?.event_id)"
        >
          <svg
            class="mr-2"
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.8333 3.67544V4.17544H11.3333H14.6667C14.7466 4.17544 14.8287 4.20861 14.8934 4.27674L15.2272 3.95969L14.8934 4.27674C14.959 4.34574 15 4.44455 15 4.55263C15 4.66071 14.959 4.75953 14.8934 4.82853L15.2559 5.1729L14.8934 4.82853C14.8287 4.89666 14.7466 4.92983 14.6667 4.92983H13.8333H13.3333V5.42983V15.0789C13.3333 15.4197 13.2045 15.7416 12.9827 15.9751C12.7617 16.2077 12.4676 16.3333 12.1667 16.3333H3.83333C3.53243 16.3333 3.23833 16.2077 3.01732 15.9751C2.79549 15.7416 2.66667 15.4197 2.66667 15.0789V5.42983V4.92983H2.16667H1.33333C1.25344 4.92983 1.1713 4.89666 1.10658 4.82853C1.04103 4.75953 1 4.66071 1 4.55263C1 4.44455 1.04103 4.34574 1.10658 4.27674L0.744078 3.93236L1.10658 4.27674C1.1713 4.20861 1.25344 4.17544 1.33333 4.17544H4.66667H5.16667V3.67544V1.92105C5.16667 1.58033 5.29549 1.2584 5.51732 1.02489C5.73833 0.792254 6.03243 0.666667 6.33333 0.666667H9.66667C9.96757 0.666667 10.2617 0.792254 10.4827 1.02489C10.7045 1.2584 10.8333 1.58033 10.8333 1.92105V3.67544ZM6.33333 1.42105H5.83333V1.92105V3.67544V4.17544H6.33333H9.66667H10.1667V3.67544V1.92105V1.42105H9.66667H6.33333ZM12.1667 15.5789H12.6667V15.0789V5.42983V4.92983H12.1667H3.83333H3.33333V5.42983V15.0789V15.5789H3.83333H12.1667ZM6.10658 6.90832C6.1713 6.84019 6.25344 6.80702 6.33333 6.80702C6.41322 6.80702 6.49537 6.84019 6.56009 6.90832C6.62564 6.97732 6.66667 7.07613 6.66667 7.18421V13.3246C6.66667 13.4326 6.62564 13.5315 6.56009 13.6005C6.49537 13.6686 6.41322 13.7018 6.33333 13.7018C6.25344 13.7018 6.1713 13.6686 6.10658 13.6005C6.04103 13.5315 6 13.4326 6 13.3246V7.18421C6 7.07613 6.04103 6.97732 6.10658 6.90832ZM9.43991 6.90832C9.50463 6.84019 9.58678 6.80702 9.66667 6.80702C9.74656 6.80702 9.8287 6.84019 9.89342 6.90832C9.95897 6.97732 10 7.07614 10 7.18421V13.3246C10 13.4326 9.95897 13.5315 9.89342 13.6005C9.8287 13.6686 9.74656 13.7018 9.66667 13.7018C9.58678 13.7018 9.50463 13.6686 9.43991 13.6005C9.37436 13.5315 9.33333 13.4326 9.33333 13.3246V7.18421C9.33333 7.07614 9.37436 6.97732 9.43991 6.90832Z"
              fill="#E02424"
              stroke="#E02424"
            />
          </svg>
          Delete field
        </el-button>
        <el-button type="borderPrimary" class="flex items-center gap-2">
          <svg
            class="mr-2"
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.24686 10.4957L4.93853 11.2051H2.33268H1.83268V11.7051V15.1239V15.6239H2.33268H15.666H16.166V15.1239V11.7051V11.2051H15.666H13.0602L13.7518 10.4957H15.666C15.9713 10.4957 16.2667 10.62 16.4865 10.8454C16.7068 11.0713 16.8327 11.3804 16.8327 11.7051V15.1239C16.8327 15.4487 16.7068 15.7577 16.4865 15.9836C16.2667 16.2091 15.9713 16.3333 15.666 16.3333H2.33268C2.02741 16.3333 1.732 16.2091 1.51217 15.9836L1.15417 16.3327L1.51217 15.9836C1.29193 15.7577 1.16602 15.4487 1.16602 15.1239V11.7051C1.16602 11.3803 1.29193 11.0713 1.51217 10.8455C1.732 10.62 2.02741 10.4957 2.33268 10.4957H4.24686ZM8.76779 10.6779L8.76735 10.6774L5.43485 7.2595L5.4349 7.25944L5.42873 7.25333C5.39632 7.22122 5.36978 7.18212 5.35128 7.13796C5.33278 7.09378 5.32287 7.04581 5.32246 6.99696C5.32204 6.94811 5.33114 6.89994 5.34891 6.85538C5.36668 6.81084 5.39259 6.7712 5.42452 6.73846C5.45642 6.70574 5.49365 6.68057 5.53369 6.66377L5.34022 6.20272L5.53369 6.66377C5.5737 6.64698 5.61611 6.6387 5.65856 6.63908C5.70102 6.63946 5.74332 6.64849 5.78309 6.66602C5.8229 6.68356 5.85977 6.70943 5.89117 6.74278L5.89112 6.74283L5.89718 6.74905L7.80802 8.70888L8.66602 9.58888V8.35983V1.02137C8.66602 0.923269 8.70413 0.831656 8.76809 0.766053C8.83164 0.70088 8.91509 0.666667 8.99935 0.666667C9.08361 0.666667 9.16706 0.70088 9.23061 0.766053C9.29457 0.831656 9.33268 0.923268 9.33268 1.02137V8.35983V9.58888L10.1907 8.70888L12.0986 6.75199C12.1621 6.69038 12.2438 6.6585 12.3261 6.65923C12.4094 6.65998 12.4917 6.69417 12.5545 6.75861L12.9125 6.40956L12.5545 6.75861C12.6178 6.82346 12.6558 6.91377 12.6566 7.01073C12.6574 7.1065 12.6218 7.19654 12.561 7.26244L9.23135 10.6774L9.23091 10.6779C9.19934 10.7104 9.16254 10.7354 9.12294 10.7523C9.08337 10.7691 9.04141 10.7776 8.99935 10.7776C8.95729 10.7776 8.91533 10.7691 8.87576 10.7523C8.83616 10.7354 8.79935 10.7104 8.76779 10.6779ZM13.4993 13.4145C13.4993 13.6224 13.3383 13.7692 13.166 13.7692C12.9938 13.7692 12.8327 13.6224 12.8327 13.4145C12.8327 13.2066 12.9938 13.0598 13.166 13.0598C13.3383 13.0598 13.4993 13.2066 13.4993 13.4145Z"
              fill="#7F56D9"
              stroke="#7F56D9"
            />
          </svg>
          Download
        </el-button>
        <!-- <pre>{{ eventsOne }}</pre> -->
        <el-button
          type="primary"
          class="flex items-center gap-2"
          v-if="route.params"
          @click="editSingle = true"
        >
          <el-icon class="font-bold !text-lg mr-2">
            <Edit :size="32" />
          </el-icon>
          Edit
        </el-button>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-3 w-10/12">
      <div class="border-b border-b-[#E5E7EB] pb-2 pt-1 w-full">
        <h2 class="text-[#111928] font-semibold text-sm mb-1">
          Faculty member
        </h2>
        <el-tooltip class="box-item" effect="dark" placement="top-start">
          <template #content>
            <div class="flex" v-if="eventsOne?.faculty_members?.length">
              <span
                v-for="(teacher, i) in eventsOne?.faculty_members"
                :key="i"
                class="text-sm font-normal flex cursor-pointer"
              >
                {{
                  teacher.first_name +
                    " " +
                    teacher.last_name +
                    `${
                      i == eventsOne?.faculty_members.length - 1 ? " " : ", "
                    }` || "-"
                }}
              </span>
            </div>
            <div v-else class="text-sm font-normal text-gray-500">-</div>
          </template>
          <div class="flex" v-if="eventsOne?.faculty_members?.length">
            <span
              v-for="(teacher, i) in eventsOne?.faculty_members?.slice(0, 2)"
              :key="i"
              class="mr-1 text-[#6B7280] text-sm font-normal flex cursor-pointer"
            >
              {{
                teacher.first_name +
                  " " +
                  teacher.last_name +
                  `${
                    i === 1 ||
                    i === eventsOne?.faculty_members?.slice(0, 2).length - 1
                      ? " "
                      : ", "
                  }` || "-"
              }}
            </span>
            <span
              v-if="eventsOne?.faculty_members?.length > 2"
              class="ml-1 cursor-pointer"
              >...</span
            >
          </div>
          <div v-else class="text-sm font-normal text-gray-500">-</div>
        </el-tooltip>
      </div>

      <div class="border-b border-b-[#E5E7EB] pb-2 pt-1 w-full">
        <h2 class="text-[#111928] font-semibold text-sm mb-1">Groups</h2>
        <el-tooltip class="box-item" effect="dark" placement="top-start">
          <template #content>
            <div class="flex" v-if="eventsOne?.groups?.length">
              <span
                v-for="(group, i) in eventsOne?.groups"
                :key="i"
                class="text-sm font-normal flex cursor-pointer"
              >
                {{
                  group.short_name +
                    `${i == eventsOne?.groups?.length - 1 ? " " : ", "}` || "-"
                }}
              </span>
            </div>
            <div v-else class="text-sm font-normal text-gray-500">-</div>
          </template>
          <div class="flex" v-if="eventsOne?.groups?.length">
            <span
              v-for="(group, i) in eventsOne?.groups?.slice(0, 2)"
              :key="i"
              class="mr-1 text-[#6B7280] text-sm font-normal flex cursor-pointer"
            >
              {{
                group.short_name +
                  `${
                    i === 1 || i === eventsOne?.groups?.slice(0, 2).length - 1
                      ? " "
                      : ", "
                  }` || "-"
              }}
            </span>
            <span
              v-if="eventsOne?.groups?.length > 2"
              class="ml-1 cursor-pointer"
              >...</span
            >
          </div>
          <div v-else class="text-sm font-normal text-gray-500">-</div>
        </el-tooltip>
      </div>

      <div class="border-b border-b-[#E5E7EB] pb-2 pt-1 w-full">
        <h2 class="text-[#111928] font-semibold text-sm mb-1">Room</h2>
        <p class="text-[#6B7280] text-sm font-normal">
          {{ eventsOne?.room_info?.code || "-" }}
        </p>
      </div>
      <div class="border-b border-b-[#E5E7EB] pb-2 pt-1 w-full">
        <h2 class="text-[#111928] font-semibold text-sm mb-1">
          Lesson type info
        </h2>
        <p class="text-[#6B7280] text-sm font-normal">
          {{ eventsOne?.lesson_type_info?.name || "-" }}
        </p>
      </div>

      <div class="border-b border-b-[#E5E7EB] pb-2 pt-1 w-full">
        <h2 class="text-[#111928] font-semibold text-sm mb-1">Date</h2>
        <p class="text-[#6B7280] text-sm font-normal">
          {{ eventsOne?.to_char || "-" }}
        </p>
      </div>

      <div class="border-b border-b-[#E5E7EB] pb-2 pt-1 w-full">
        <h2 class="text-[#111928] font-semibold text-sm mb-1">Duration</h2>
        <p class="text-[#6B7280] text-sm font-normal">
          {{ dayjs(eventsOne?.event_start).utc().format("HH:mm") }} -
          {{ dayjs(eventsOne?.event_end).utc().format("HH:mm") }}
        </p>
      </div>

      <div class="border-b border-b-[#E5E7EB] pb-2 pt-1 w-full">
        <h2 class="text-[#111928] font-semibold text-sm mb-1">
          Repeat frequency
        </h2>
        <p class="text-[#6B7280] text-sm font-normal capitalize">
          {{ eventsOne?.recurring_days?.join(", ") || "-" }}
        </p>
      </div>
    </div>

    <div
      class="grid grid-cols-1 border-b border-b-[#E5E7EB] pb-2 pt-1 w-10/12 my-3"
      v-if="eventsOne?.description"
    >
      <h2 class="text-[#111928] font-semibold text-sm mb-1">Description</h2>
      <p class="text-[#6B7280] text-sm font-normal">
        {{ eventsOne?.description }}
      </p>
    </div>
    <div class="my-4">
      <el-button
        v-if="!visibleCreateGroup"
        @click="visibleCreateGroup = true"
        type="primary"
        class="display-inline self-start"
        >+ Add group</el-button
      >
      <div v-else class="grid md:grid-cols-3 sm:grid-cols-2">
        <div class="flex items-center gap-2">
          <el-select
            v-model="groupsId"
            placeholder="Choose group"
            class="w-full"
            clearable
            filterable
          >
            <el-option
              v-for="(item, i) of filteredGroups"
              :key="i"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="flex items-center">
            <el-button
              :loading="loading"
              :icon="Check"
              size="small"
              color="#6941c6"
              @click="createGroupToEvent"
            />
            <el-button
              @click="visibleCreateGroup = false"
              :icon="Close"
              size="small"
              color="#44444F"
              class="!ml-2"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="grid md:grid-cols-6 sm:grid-cols-4 gap-4"
      v-if="eventsOne?.groups.length"
    >
      <div v-for="groups of eventsOne?.groups" :key="groups.value">
        <div class="degree pl-2" v-if="!groups.editable">
          <h1 class="p-4 text-xs">{{ groups.name }} {{ groups.short_name }}</h1>
          <div class="flex items-stretch">
            <div
              class="flex items-center p-3 cursor-pointer hover:bg-primary-300"
              @click="deleteGroupOne(groups.id)"
            >
              <el-icon>
                <Delete />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showError" class="error-message mt-3">
      <p class="my-2 text-red-600">{{ errorMessage }}</p>
      <el-button type="primary" @click="downloadEnrollCourse"
        >Download</el-button
      >
    </div>
    <div class="pt-5 mb-3">
      <h2 class="text-[#000000] text-xl font-semibold">Students</h2>
    </div>
    <div v-loading="loading">
      <el-table :data="tastStudentList.data" class="whiteStripe" stripe>
        <el-table-column
          label="Name"
          min-width="220"
          label-class-name="uppercase"
          prop="full_name"
        />
        <el-table-column
          prop="uid"
          label="ID"
          min-width="180"
          label-class-name="uppercase"
        />
        <el-table-column
          label="GROUPS"
          min-width="150"
          label-class-name="uppercase"
        >
          <template #default="{ row }">
            <div>
              <h1>{{ row.group_info.name }}</h1>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Programs"
          min-width="180"
          label-class-name="uppercase"
        >
          <template #default="{ row }">
            <div>
              <h1>{{ row.program_info.name }}</h1>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          label="E-mail"
          min-width="200"
          label-class-name="uppercase"
        />
        <el-table-column
          prop="study_year"
          label="Level"
          min-width="150"
          label-class-name="uppercase"
        />
      </el-table>
    </div>
    <div
      class="py-4 flex items-center justify-between gap-3"
      v-if="filter.limit < tastStudentList.pagination.total_items"
    >
      <div class="text-[#6B7280] text-sm font-normal">
        Showing
        <span class="font-semibold !text-[#000]">{{
          (filter.page - 1) * filter.limit + 1
        }}</span
        >-
        <span class="font-semibold !text-[#000]">{{
          Math.min(
            filter.page * filter.limit,
            tastStudentList.pagination.total_items
          )
        }}</span>
        of
        <span class="font-semibold !text-[#000]">{{
          tastStudentList.pagination.total_items
        }}</span>
      </div>
      <el-pagination
        background
        @current-change="onPaginationChange"
        class="pag-timetable"
        layout="prev, pager, next"
        :page-size="filter.limit"
        :total="tastStudentList.pagination.total_items"
      />
    </div>
    <el-dialog
      :title="`Edit ${eventsOne?.type}`"
      width="830px"
      class="custom-dialog"
      v-model="editSingle"
      v-loading="loading"
    >
      <SingleEditForm
        @close-dialog="editSingle = false"
        :data="eventsOne"
        @on-submit="handleSave($event)"
        :typeItem="eventsOne?.type"
      />
    </el-dialog>
    <el-dialog
      width="380px"
      class="custom-dialog"
      v-model="deleteSingle"
      v-loading="loading"
    >
      <div class="flex justify-center mx-auto mb-4">
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 3.5C17.5388 3.5 14.1554 4.52636 11.2775 6.44928C8.39967 8.37221 6.15665 11.1053 4.83212 14.303C3.50758 17.5007 3.16102 21.0194 3.83627 24.4141C4.51151 27.8087 6.17822 30.9269 8.62564 33.3744C11.0731 35.8218 14.1913 37.4885 17.5859 38.1637C20.9806 38.839 24.4993 38.4924 27.697 37.1679C30.8947 35.8433 33.6278 33.6003 35.5507 30.7225C37.4736 27.8446 38.5 24.4612 38.5 21C38.4949 16.3603 36.6495 11.912 33.3687 8.63126C30.088 5.35048 25.6397 3.5051 21 3.5ZM21 29.75C20.6539 29.75 20.3155 29.6474 20.0278 29.4551C19.74 29.2628 19.5157 28.9895 19.3832 28.6697C19.2508 28.3499 19.2161 27.9981 19.2836 27.6586C19.3512 27.3191 19.5178 27.0073 19.7626 26.7626C20.0073 26.5178 20.3191 26.3511 20.6586 26.2836C20.9981 26.2161 21.3499 26.2508 21.6697 26.3832C21.9895 26.5157 22.2628 26.74 22.4551 27.0277C22.6474 27.3155 22.75 27.6539 22.75 28C22.75 28.4641 22.5656 28.9092 22.2374 29.2374C21.9093 29.5656 21.4641 29.75 21 29.75ZM22.75 22.75C22.75 23.2141 22.5656 23.6592 22.2374 23.9874C21.9093 24.3156 21.4641 24.5 21 24.5C20.5359 24.5 20.0908 24.3156 19.7626 23.9874C19.4344 23.6592 19.25 23.2141 19.25 22.75V14C19.25 13.5359 19.4344 13.0907 19.7626 12.7626C20.0908 12.4344 20.5359 12.25 21 12.25C21.4641 12.25 21.9093 12.4344 22.2374 12.7626C22.5656 13.0907 22.75 13.5359 22.75 14V22.75Z"
            fill="#F05252"
          />
        </svg>
      </div>
      <div class="flex justify-center mb-5">
        <p
          class="w-[300px] text-center flex justify-center text-[#6B7280] text-base"
        >
          Are you sure you want to delete this subject?
        </p>
      </div>
      <div class="flex items-center gap-3">
        <el-button
          type="gray"
          size="large"
          class="w-full !h-[41px]"
          @click="deleteSingle = false"
        >
          Cancel
        </el-button>
        <el-button
          type="red"
          size="large"
          class="w-full !h-[41px]"
          @click="(deleteType = true), (deleteSingle = false)"
        >
          Yes, I’m sure
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="custom-dialog"
      title="Delete"
      width="360px"
      v-model="deleteType"
      v-loading="loading"
      @close-dialog="deleteType = false"
    >
      <div>
        <el-radio-group v-model="radio">
          <el-radio :label="'1'">This class</el-radio>
          <el-radio :label="'2'">This and following classes</el-radio>
          <el-radio :label="'3'">All classes</el-radio>
        </el-radio-group>
      </div>
      <div class="flex items-center gap-3 mt-4">
        <el-button type="gray" class="w-full" @click="deleteType = false"
          >Cancel</el-button
        >
        <el-button type="red" class="w-full">Delete</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Check, Close, Delete, Edit, EditPen } from "@element-plus/icons-vue";
import { computed, onMounted, reactive, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import SingleEditForm from "./components/SingleEditForm.vue";
import { useTimetableStore } from "@/stores/timetable";
import { dayjs, ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import utc from "dayjs/plugin/utc";
import { useTimeTableGroups } from "@/stores";
import { saveFile } from "@/utils/common";
dayjs.extend(utc as any);
const i18n = useI18n();
const loading = ref(false);
const router = useRouter();
const route = useRoute();
const visibleCount = 5;
const timetableStore = useTimetableStore();
const eventsOne = computed(() => timetableStore.eventsOne.data);
const tastStudentList = computed(() => timetableStore.eventStudentList);
const groupStore = useTimeTableGroups();
const editSingle = ref(false);
const deleteSingle = ref(false);
const deleteType = ref(false);
const createGroupOne = ref(false);
const removeGroupOne = ref(false);
const visibleCreateGroup = ref(false);
const radio = ref("2");
const groupsId = ref("");
const errorMessage = ref<string | null>(null);
const showError = ref(false);
const filter = reactive({
  page: 1,
  limit: 20,
});
const fetchList = async () => {
  await timetableStore.fetchCalendarEventId(route.params.single_id as string);
  if (eventsOne?.value?.event_id) {
    await timetableStore.fetchTaskEventStudentList(
      eventsOne?.value?.event_id as string,
      filter
    );
  }
};
const filteredGroups = computed(() => {
  const eventGroupIds =
    eventsOne.value?.groups.map((group: any) => group.id) || [];
  return groupStore.getTimetableGroupList.filter(
    (group: any) => !eventGroupIds.includes(group.value)
  );
});

onMounted(() => {
  fetchList();
});
const onPaginationChange = (event: number) => {
  filter.page = event;
  fetchList();
};
const handleSave = async (data: any) => {
  try {
    await timetableStore.editCalendarTask(eventsOne?.value?.event_id, {
      ...data,
      date: dayjs(data?.date).format("YYYY-MM-DD"),
    });
    ElMessage({
      message: "Updated",
      type: "success",
    });
    fetchList();
    editSingle.value = false;
  } catch (error: any) {
    console.log(error, "error");
  }
};
const confirmDelete = (id: string) => {
  router.push("");
  ElMessageBox.confirm(
    "This action cannot be undone. Continue?",
    i18n.t("shared.warning"),
    {
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      type: "warning",
      center: true,
    }
  )
    .then(async () => {
      try {
        loading.value = true;
        await timetableStore.deleteCalendarEvent(id);
        loading.value = false;
        router.go(-1);
        ElMessage({
          type: "success",
          message: i18n.t("shared.deleteCompleted"),
        });
      } catch (error: any) {
        loading.value = false;
        console.log("error", error);
      }
    })
    .catch(() => {});
};
const createGroupToEvent = async () => {
  if (!groupsId.value) {
    ElMessage({
      message: "Fill the field!",
      type: "warning",
      duration: 3 * 1000,
    });
    return;
  }
  if (eventsOne?.value?.is_recurring) {
    ElMessageBox.confirm(
      "This event is created recurring. If you add a group to this event, this group will be added to all events",
      "Warning",
      {
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        type: "warning",
        center: true,
      }
    )
      .then(async () => {
        try {
          loading.value = true;
          await groupStore.fetchAddGroupToEvent({
            group_id: groupsId.value,
            event_id: eventsOne?.value?.event_id as string,
            task_id: eventsOne?.value?.id as string,
          });
          groupsId.value = "";
          createGroupOne.value = false;
          visibleCreateGroup.value = false;
          ElMessage({
            message: `Group has successfully created!`,
            type: "success",
            duration: 5 * 1000,
          });
          fetchList();
          loading.value = false;
          showError.value = false;
        } catch (error: any) {
          loading.value = false;
          if (error?.response?.data?.error?.statusCode === 400) {
            errorMessage.value = error?.response?.data?.error?.message;
            showError.value = true;
          } else {
            console.log("error", error);
            showError.value = false;
          }
        }
      })
      .catch(() => {});
  } else {
    try {
      loading.value = true;
      await groupStore.fetchAddGroupToEvent({
        group_id: groupsId.value,
        event_id: eventsOne?.value?.event_id as string,
        task_id: eventsOne?.value?.id as string,
      });
      groupsId.value = "";
      createGroupOne.value = false;
      visibleCreateGroup.value = false;
      ElMessage({
        message: `Group has successfully created!`,
        type: "success",
        duration: 5 * 1000,
      });
      fetchList();
      loading.value = false;
      showError.value = false;
    } catch (error: any) {
      loading.value = false;
      if (error?.response?.data?.error?.statusCode === 400) {
        errorMessage.value = error?.response?.data?.error?.message;
        showError.value = true;
      } else {
        console.log("error", error);
        showError.value = false;
      }
    }
  }
};
const deleteGroupOne = (id: string) => {
  if (eventsOne?.value?.is_recurring) {
    ElMessageBox.confirm(
      "This event is created recurring.If you remove this group from this event, it will be removed from all events. You agree with that",
      "Warning",
      {
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        type: "warning",
        center: true,
      }
    )
      .then(async () => {
        try {
          loading.value = true;
          const data = {
            group_id: id as string,
            event_id: eventsOne?.value?.event_id as string,
            task_id: eventsOne?.value?.id as string,
          };
          await groupStore.fetchRemoveGroupOne(data);
          ElMessage({
            type: "success",
            message: i18n.t("shared.deleteCompleted"),
          });
          fetchList();
          loading.value = false;
        } catch (error: any) {
          loading.value = false;
          console.log("error", error);
        }
      })
      .catch(() => {});
  } else {
    ElMessageBox.confirm("This action cannot be undone. Continue?", "Warning", {
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      type: "warning",
      center: true,
    })
      .then(async () => {
        try {
          loading.value = true;
          const data = {
            group_id: id as string,
            event_id: eventsOne?.value?.event_id as string,
            task_id: eventsOne?.value?.id as string,
          };
          await groupStore.fetchRemoveGroupOne(data);
          ElMessage({
            type: "success",
            message: i18n.t("shared.deleteCompleted"),
          });
          fetchList();
          loading.value = false;
        } catch (error: any) {
          loading.value = false;
          console.log("error", error);
        }
      })
      .catch(() => {});
  }
};
const downloadEnrollCourse = async () => {
  try {
    loading.value = true;
    showError.value = false;
    const data = await timetableStore.fetchStudentDonwloadEnrollCourse({
      group_ids: [groupsId.value],
      assigned_course_id: eventsOne?.value?.module_info?.id,
    });
    saveFile(data, "Not enrollment course students list.xlsx");
    loading.value = false;
  } catch (error: any) {
    console.log("error", error?.message);
    showError.value = true;
    loading.value = false;
  }
};
onMounted(async () => {
  await groupStore.fetchTimetableGroupList({
    limit: 100,
    page: 1,
  });
});
</script>

<style lang="scss">
.custom-dialog {
  background: #fff !important;

  .el-dialog__close {
    background: white !important;
    color: var(--gray-400, #9ca3af) !important;
    font-size: 21px !important;
  }

  .el-input__wrapper {
    background-color: #f9fafb !important;
  }

  .el-select__wrapper {
    background-color: #f9fafb !important;
  }

  .el-select__caret {
    color: #6b7280;
  }
}

.degree {
  border-radius: 7.237px;
  background: #fff;
  box-shadow: 0px 0.72368px 3.61842px 0.72368px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr auto;

  &__title {
    font-size: 16.699px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
}
</style>
