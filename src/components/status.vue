<script setup>
import router from "@/router";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { isAdd, isEdit, getUsername, page, getLocalStorage } from "@/stores/counter.js";
import { tokenCheck } from "@/stores/tokenCheck.js";
import { getCollabAccess } from "@/stores/checkCollabAccess.js";

const isThisDelete = ref(false);
const statuses = ref([]);
const limit = ref(1);
const isLimit = ref(false)
const transferStatus = ref()
const route = useRoute()
const status = ref()
const isDisable = ref(false)
let user = ref()
let boardDetail = ref()
let boardOwnerId = ref()
let collabWriteAccess = ref()

const atitle = ref("");
const aId = ref("");

function statusMapper(status) {
  let status1;
  status1 = status.split(" for ")[0];;
  return status1;
}


onMounted(async () => {
  let data
  let decodedToken
  let Jsondecode
  let response

  if (!getLocalStorage("token")) {
    response = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/statuses`)

  } else {
    //instant access code ↓
    tokenCheck()

    const boardCollabAccess = await getCollabAccess(route.params.boardId)
    if(boardCollabAccess == "write"){
      collabWriteAccess.value = true
    }

    decodedToken = atob(getLocalStorage("token").split('.')[1])
    Jsondecode = JSON.parse(decodedToken)
    user.value = Jsondecode.name

    response = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/statuses`, {
      headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token")
      }
    })
    console.log(`token response: ${response.value}`)

  };


  //look at the response with token or no token
  if (response.ok) {
    const data = await response.json();
    statuses.value = data
    console.log(statuses.value);
    console.log(localStorage.getItem("isEnable"));
    if (data && Array.isArray(data) && data.length > 0) {
      console.log('Data:', data);
    } else {
      console.log('No data available');
    }
  } else {
    console.error('Failed to fetch data:', response.status);
    router.replace('/login')
  }

  let response2
  if (getLocalStorage("token")) {
    response2 = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token"),
        'Content-Type': 'application/json'
      }
    })

  } else if (!getLocalStorage("token")) {
    response2 = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  boardDetail = await response2.json();
  boardOwnerId = boardDetail.ownerId

  console.log(`logged in user: ${user.value}`)
  console.log(`board owner: ${boardOwnerId}`)

  if (user.value == boardOwnerId) {
    isDisable.value = false
    console.log("isDisable is false")
  }
  else if (user.value !== boardOwnerId) {
    isDisable.value = true
    console.log("isDisable is true")
  }


})


function checklimit(name){
  limitModal.showModal()
  atitle.value = name
}
function checkDelete(name, id){
  deleteModal.showModal()
  atitle.value = name
  aId.value = id
}


async function DeleteStatus(id, transferStatus){

  await fetch(`${import.meta.env.VITE_BASE_URL}/boards/${route.params.boardId}/statuses/${id}/${transferStatus}`, {
    method: "DELETE",
    headers: {
      'Authorization': 'Bearer ' + getLocalStorage("token")
    }
  });
  const data = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/statuses`, {
    headers: {
      'Authorization': 'Bearer ' + getLocalStorage("token")
    }
  });
  statuses.value = await data.json();
  console.log(statuses.value);
  isThisDelete.value = true;
  console.log(isThisDelete.value);
}

function checkTransfer() {
  transferModal.showModal()
}

//for testing
function reloadPage() {
  location.reload()
}

function signOut() {
  // console.log("clicked logout")
  localStorage.removeItem('token');
  router.replace("/login")
}


</script>



<template>
  <h1
    class="font-serif flex justify-center bg-gradient-to-r from-green-400 via-teal-500 to-blue-400 text-white text-3xl p-10 w-full">
    Status
  </h1>

  <!-- user box area -->
  <div class="dropdown dropdown-hover absolute top-7 left-8">
    <label tabindex="0">
      <p class="border-2 text-white font-bold py-4 px-4 rounded-lg flex" v-if="user"> <img src="../assets/userIcon.png"
          class="w-6" /> &ensp; {{ user }} </p>

      <p class="border-2 text-white font-bold py-4 px-4 rounded-lg flex" v-if="!user"> <img src="../assets/userIcon.png"
          class="w-6" /> &ensp; Guest</p>
    </label>
    <ul tabindex="0" class="dropdown-content bg-red-400 hover:bg-red-500 rounded p-2 hover:font-bold " v-if="user"
      v-on:click="signOut()">
      <li><a>Sign Out</a></li>
    </ul>
    <ul tabindex="0" class="dropdown-content bg-blue-400 hover:bg-blue-500 rounded p-2 hover:font-bold " v-if="!user"
      v-on:click="signOut()">
      <li><a>Sign in</a></li>
    </ul>
  </div>

  <div>
    <button class="absolute top-9 right-5 border-2 hover:bg-gray-900/30 font-bold p-2 text-white rounded-lg"
      v-on:click="router.replace(`/board/${route.params.boardId}/task`)">Back To Task board</button>
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
    <tr class="bg-blue-100">
      <th class="w-[30%]">Status Name</th>
      <th class="w-[60%]">Status Description</th>
      <th class="w-[10%]">
        <button class="bg-green-300 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed p-2 rounded-lg itbkk-button-add"
          :disabled="isDisable && !collabWriteAccess"
          @click="router.replace(`/board/${route.params.boardId}/status/add`)">
          add status
        </button>
        <!-- <button @click="checklimit()">limit Status</button> -->
      </th>
    </tr>
    <tr class="itbkk-item" v-for="status in statuses" @click="">
      <td class="w-[25%] p-2 itbkk-status-name break-words">
        {{ statusMapper(status.name) }}
      </td>
      <td class="w-[55%] p-2 itbkk-status-description break-words" :class="{
        italic:
          status.description === null ||
          status.description === '',
      }">
        {{
        status.description === "" || status.description === null
        ? "No description is provided"
        : status.description
        }}
      </td>

      <td class="w-[10%]">
        <div class="flex justify-between">
          <div class="itbkk-button-action flex justify-left">
            &ensp;
            <button
              class="btn itbkk-button-edit bg-blue-200 hover:bg-blue-300 rounded-lg  flex justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
              :disabled="isDisable && !collabWriteAccess"
              @click="router.replace({ name: 'editStatus', params: { id: status.id, boardId: route.params.boardId } })">Edit</button>
            &ensp;

            <button
              class="btn itbkk-button-delete bg-red-300 hover:bg-red-400 disabled:bg-gray-300 p-2 flex justify-right disabled:cursor-not-allowed"
              :disabled="isDisable && !collabWriteAccess" @click="checkDelete(status.name, status.id)">
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
        Do you want to delete the {{ atitle }}? Please transfer status before delete.
      </p>
      <div class="modal-action">
        <form method="dialog">
          <select v-model="transferStatus" class="itbkk-status">
            <option v-for="status in statuses" :value="status">
              {{ status.name }}
            </option>
          </select>
          <button class="bg-red-600 hover:bg-red-800 btn itbkk-button-cancel">
            Cancel
          </button>
          <button class="bg-green-500 hover:bg-green-700 btn itbkk-button-confirm"
            @click="DeleteStatus(aId, transferStatus.id)">
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
          <button class="bg-gray-400 p-2 rounded-lg " :class="{ 'bg-green-400': isLimit === true }"
            @click="setEnableLimit">{{ isLimit === true ? "enable limit" : "disable limit" }}</button>
        </label>
      </div>
      <p class="py-4 itbkk-message">
        Do you want to limit the Status"{{ atitle }}"?
      </p>
      <label for="steps-range" class=" text-sm font-medium text-gray-900 dark:text-white">limit range</label>
      <input id="steps-range" v-model="limit" type="range" min="1" max="10" value="1" step="1"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700">
      <p>{{ limit }}</p>
      <div class="modal-action">
        <form method="dialog">
          <button class="bg-red-600 hover:bg-red-800 btn itbkk-button-cancel">
            Cancel
          </button>
          <button class="bg-green-500 hover:bg-green-700 btn " @click="checkTransfer()">
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
          <option v-for="status in statuses" :value="status">{{ status.name }}</option>
        </select>
        <!-- Do you want to delete the task number"{{ atitle }}"? -->
      </p>
      <div class="modal-action">
        <form method="dialog">
          <button class="bg-red-600 hover:bg-red-800 btn itbkk-button-cancel">
            Cancel
          </button>
          <!-- <button
            class="bg-green-500 hover:bg-green-700 btn itbkk-button-confirm"
            @click="DeleteStatus(aId)"
          >
            Confirm
          </button> -->

          <button class="bg-green-500 hover:bg-green-700 btn" @click="DeleteStatus(aId)">
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
  word-wrap: break-word;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
