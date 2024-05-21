<script setup>
import router from "@/router";
import { onMounted, ref } from "vue";
import { isAdd, isEdit } from "@/stores/counter.js";
const isThisDelete = ref(false);
const statuses = ref([]);
const limit = ref(1);
const isLimit  = ref(false)
function statusMapper(status) {
  let status1;
  if (status === "NO_STATUS") {
    status1 = "No Status";
  } else if (status === "TO_DO") {
    status1 = "To Do";
  } else if (status === "DOING") {
    status1 = "Doing";
  } else if (status === "DONE") {
    status1 = "Done";
  } else {
    status1 = status;
  }
  return status1;
}
const status = ref()
onMounted(async () => {
  const data = await fetch(import.meta.env.VITE_BASE_URL +"/statuses");
  statuses.value = await data.json();
  console.log(statuses.value);
  console.log(localStorage.getItem("isEnable"));
  // saveLocalStorage("isEnable",isLimit.value)
  // console.log(getLocalStorage("isEnable"));
});
const checklimit = (name) => {
  limitModal.showModal();
  atitle.value = name;
}
const checkDelete = (name, id) => {
  deleteModal.showModal();
  atitle.value = name;
  aId.value = id;
};
const atitle = ref("");
const aId = ref("");
const DeleteStatus = async (id) => {
  await fetch(`${import.meta.env.VITE_BASE_URL}/statuses/${id}`, {
    method: "DELETE",
  });
  const data = await fetch(import.meta.env.VITE_BASE_URL + "/statuses");
  statuses.value = await data.json();
  console.log(statuses.value);
  isThisDelete.value = true;
  console.log(isThisDelete.value);
};
let isEnable2 = localStorage.getItem("isEnable") === 'true';
isLimit.value = isEnable2
function setEnableLimit(){
  let isEnable = localStorage.getItem("isEnable") === 'true';
  isEnable = !isEnable
  isLimit.value = isEnable
  localStorage.setItem("isEnable",isEnable)
  console.log(localStorage.getItem("isEnable"));
}
function checkTransfer(){
  transferModal.showModal()
}
</script>
<template>
  <h1
    class="flex justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-3xl p-10 w-full"
  >
    Status
  </h1>
  <div class="absolute top-3 left-3">
    <button @click="router.push('/task')" class="bg-gray-300 p-2 rounded-lg">
      home page
    </button>
  </div>
  <div v-if="isAdd || isThisDelete || isEdit" class="bg-green-400 font-black">
    <h3 class="font-bold text-lg">Success</h3>
    <p v-if="isAdd === true" :isThisDelete="false" class="itbkk-message">
      The status is added successfully
    </p>
    <p v-if="isEdit === true" :isThisDelete="false" class="itbkk-message">
      The status is edited successfully
    </p>
    <p v-if="isThisDelete === true" class="itbkk-message">
      The status has been deleted
    </p>
  </div>
  <table class="border-collapse border-black w-full">
    <tr>
      <th class="w-[30%]">Status Name</th>
      <th class="w-[60%]">Status Description</th>
      <th class="w-[10%]">
        <button
          class="bg-green-300 p-2 rounded-lg itbkk-button-add"
          @click="router.push({ name: 'addStatus' })"
        >
          add status
        </button>
        <button @click="checklimit()">limit Status</button>
      </th>
    </tr>
    <tr class="itbkk-item" v-for="status in statuses" @click="">
      <td class="w-[25%] p-2 itbkk-status-name break-words">
        {{ statusMapper(status.statusName) }}
      </td>
      <td
        class="w-[55%] p-2 itbkk-status-description break-words"
        :class="{
          italic:
            status.statusDescription === null ||
            status.statusDescription === '',
        }"
      >
        {{
          status.statusDescription === "" || status.statusDescription === null
            ? "No description is provided"
            : status.statusDescription
        }}
      </td>
      <td class="w-[10%]">
        <div class="dropdown dropdown-left dropdown-hover flex justify-center">
          <div class="itbkk-button-action">
        <button
          class="bg-blue-400 p-3 rounded-lg itbkk-button-edit flex justify-center disabled:bg-gray-300"
          :disabled="status.statusName == 'DONE'||  status.statusName == 'NO_STATUS' "
          @click="router.push({ name: 'editStatus', params: { id: status.statusId } })"
        >Edit</button>        
        <button
          class="btn itbkk-button-delete bg-red-500 disabled:bg-gray-300"
          :disabled="status.statusName == 'DONE'|| status.statusName == 'Done' || status.statusName == 'NO_STATUS' "
          @click="checkDelete(status.statusName, status.statusId)"
        >
          Delete
        </button>
        </div>
        </div>
      </td>
    </tr>
  </table>
  <dialog id="deleteModal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Delete Task</h3>
      <p class="py-4 itbkk-message">
        Do you want to delete the task number "{{ atitle }}"?
      </p>
      <div class="modal-action">
        <form method="dialog">
          <button class="bg-red-600 hover:bg-red-800 btn itbkk-button-cancel">
            Cancel
          </button>
          <button
            class="bg-green-500 hover:bg-green-700 btn itbkk-button-confirm"
            @click="DeleteStatus(aId)"
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog id="limitModal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">limit Status</h3>
        <div class="form-control absolute right-2 top-2">
          <label class="inline-flex items-center cursor-pointer">
            <button class="bg-gray-400 p-2 rounded-lg " :class="{'bg-green-400':isLimit === true}" @click="setEnableLimit">{{isLimit === true?"enable limit":"disable limit"}}</button>
</label>
  </div>
      <p class="py-4 itbkk-message">
        Do you want to limit the Status"{{ atitle }}"?
      </p>          
      <label for="steps-range" class=" text-sm font-medium text-gray-900 dark:text-white">limit range</label>
      <input id="steps-range" v-model="limit" type="range" min="1" max="10" value="1" step="1" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
      <p>{{ limit }}</p>
      <div class="modal-action">
        <form method="dialog">
          <button class="bg-red-600 hover:bg-red-800 btn itbkk-button-cancel">
            Cancel
          </button>
          <button
            class="bg-green-500 hover:bg-green-700 btn itbkk-button-confirm"
            @click="checkTransfer()"
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog id="transferModal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Transfer Status</h3>
      <p class="py-4 itbkk-message">
        <select v-model="status" class="itbkk-status">
  <option v-for="status in statuses" :value="status">{{ status.statusName }}</option>
</select>
        <!-- Do you want to delete the task number"{{ atitle }}"? -->
      </p>
      <div class="modal-action">
        <form method="dialog">
          <button class="bg-red-600 hover:bg-red-800 btn itbkk-button-cancel">
            Cancel
          </button>
          <button
            class="bg-green-500 hover:bg-green-700 btn itbkk-button-confirm"
            @click="DeleteStatus(aId)"
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  </dialog>
</template>
<style>
th,
td {
  border: 1px solid #dddddd;
}
.itbkk-status-description,
.itbkk-status-name {
  word-wrap: break-word; /* ทำให้ข้อความยาวถูกตัดขึ้นบรรทัดใหม่ */
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
