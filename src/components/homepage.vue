<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";
import router from "../router/index.js";
import { isAdd, newTitle, isEdit, refresh, page, getLocalStorage, saveLocalStorage } from "../stores/counter.js";
import { tokenCheck } from "@/stores/tokenCheck.js";
import { getCollabAccess } from "@/stores/checkCollabAccess.js";

const isThisDelete = ref(false);
const tasks = ref([]);
const statuses = ref()
const status = ref()
const user = ref("")
const route = useRoute()

let boardDetail = ref()
let boardVisiblity = ref()
let boardOwnerId = ref()

const visibilityModal = ref(false)
let ownerPermisson = ref()
let collabWriteAccess = ref()
let isLoggedIn = ref(false)
const isDisable = ref(false)
const boardCollabAccess = ref()

const message = ref("");

let arrayfilter = ref([])
let datas
const isClick = ref(false)
const filterText = ref("")
const filterNoti = ref([])

const atitle = ref("");
const aId = ref(0);

onMounted(async () => {
  // console.log(`localStorage checkTaskCreate: ${getLocalStorage("checkTaskCreate")}`);

  // console.log(getLocalStorage('token'))
  // console.log("---------------tokens---------------------")
  // console.log(getLocalStorage('refreshToken'))

  let response
  let decodedToken
  let Jsondecode

  if (getLocalStorage("token")) {
    //instant access code ↓
    tokenCheck()

    boardCollabAccess.value = await getCollabAccess(route.params.boardId)
    if (boardCollabAccess.value == "write") {
      collabWriteAccess.value = true
    }


    isLoggedIn = true
    decodedToken = atob(getLocalStorage("token").split('.')[1])
    Jsondecode = JSON.parse(decodedToken)
    user.value = Jsondecode.name
    // console.log(`logged in account name: ${user.value}`)

    response = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/tasks`, {
      headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token")
      }
    })

  } else if (!getLocalStorage("token")) {
    isDisable.value = true
    isLoggedIn = false
    // console.log("no token")

    response = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/tasks`)
  }

  if (response.ok) {
    const data = await response.json();
    // console.log(data)

    if (data && Array.isArray(data) && data.length > 0) {
      // console.log('Tasks Data:', data);
      tasks.value = data
      let statusesData

      if (getLocalStorage("token")) {
        statusesData = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/statuses`, {
          headers: {
            'Authorization': 'Bearer ' + getLocalStorage("token")
          }
        })
      }else if(!getLocalStorage("token")){
        statusesData = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/statuses`)
      }

      statuses.value = await statusesData.json();
      datas = tasks.value

    } else {
      // console.log('No data available');
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
  // console.log(boardDetail)
  // console.log("-------under boarddetails")

  boardOwnerId = boardDetail.ownerId
  // console.log(`board owner: ${boardOwnerId}`)
  // console.log(`logged in as: ${user.value}`)

  boardVisiblity = boardDetail.visibility
  // console.log(boardVisiblity)

  if (user.value == boardOwnerId) {
    ownerPermisson = true
    // console.log("user have permmission to change anything in the board")
  }
  else if (user.value !== boardOwnerId) {
    // console.log("user dont have permmission to change anything in the board")
    ownerPermisson = false
    isDisable.value = true
  }

  resetfilter()
})


async function toggleBoardVisibility() {
  if (boardVisiblity === "public") {
    boardVisiblity = "private"
  } else if (boardVisiblity === "private") {
    boardVisiblity = "public"
  }

  // console.log(`changed visibility: ${boardVisiblity}`)

  fetch(
    import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + getLocalStorage("token")
      },
      body: JSON.stringify(
        {
          visibility: `${boardVisiblity}`,
        }

      )
    })

  resetfilter()
}


async function DeleteTask(id) {
  await fetch(`${import.meta.env.VITE_BASE_URL}/boards/${route.params.boardId}/tasks/${id}`, {
    method: "DELETE",
    headers: { 'Authorization': 'Bearer ' + getLocalStorage("token") }
  });
  const data = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/tasks`, {
    headers: {
      'Authorization': 'Bearer ' + getLocalStorage("token")
    }
  });
  tasks.value = await data.json();
  message.value = "success";
  isThisDelete.value = true;
};


function checkDelete(title, id) {
  my_modal_1.showModal();
  atitle.value = title;
  aId.value = id;
};

function addTask() {
  if (tasks.value.length === 0) {
    router.replace({
      name: "task",
      params: { id: 2 },
      name: "add",
    });
  } else {
    router.replace({
      name: "task",
      params: { id: tasks.value[tasks.value.length - 1].id + 1 },
      name: "add",
    });
  }
}
function statusMapper(status) {
  let status1;
  status1 = status.split(" for")[0];
  return status1;
}

const sortDirection = ref("CreateOn");
let sortConut = 0;

async function sort(){
  sortConut = sortConut + 1;
  // console.log(tasks.value);

  if (sortConut % 3 === 1) {
    sortDirection.value = "desc";
    // console.log(sortDirection.value);
    // const sortText = ref("");
    tasks.value.sort(function (a, b) {
      return a.status.name.toLowerCase().localeCompare(b.status.name.toLowerCase());
    });
    arrayfilter.value.sort(function (a, b) {
      return a.status.name.toLowerCase().localeCompare(b.status.name.toLowerCase());
    });
    // console.log(tasks.value);
  } else if (sortConut % 3 === 2) {
    sortDirection.value = "asc";
    // console.log(sortDirection.value);
    tasks.value.sort(function (a, b) {
      return b.status.name.toLowerCase().localeCompare(a.status.name.toLowerCase());
    });
    arrayfilter.value.sort(function (a, b) {
      return b.status.name.toLowerCase().localeCompare(a.status.name.toLowerCase());
    });
  } else if (sortConut % 3 === 0) {
    sortDirection.value = "CreateOn";
    // console.log(sortDirection.value);
    tasks.value.sort(function (a, b) {
      return a.id - b.id;
    });
    arrayfilter.value.sort(function (a, b) {
      return a.id - b.id;
    });
  }
}


async function filter(name) {
  isClick.value = true

  if (name === "") {
    let data1
    if (getLocalStorage('token')) {
      data1 = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/tasks`,
        {
          headers: {
            'Authorization': 'Bearer ' + getLocalStorage("token")
          }
        })
    } else if (!getLocalStorage('token')) {
      data1 = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/tasks`)
    }

    tasks.value = await data1.json();
    sortDirection.value = "CreateOn"

  } else {
    let data2
    if (getLocalStorage('token')) {
      data2 = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/tasks`,
        {
          headers: {
            'Authorization': 'Bearer ' + getLocalStorage("token")
          }
        })
    } else {
      data2 = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/tasks`)
    }

    tasks.value = await data2.json()
    // console.log(tasks.value)
    const statuses = tasks.value.filter((task) =>
      statusMapper(task.status.name).startsWith(name)
    );
    // console.log(statuses)
    // console.log(filterNoti.value)
    if (!filterNoti.value.includes(name)) {
      // console.log("push")
      filterNoti.value.push(name)
    }

    // console.log(name);
    // console.log(statuses);
    // console.log(`filter result : ${statuses}`);
    for (let status of statuses) {
      if (!arrayfilter.value.some(task => task.title === status.title)) {
        arrayfilter.value.push(status);
      }
      if (sortDirection.value === "desc")
        arrayfilter.value.sort(function (a, b) {
          return a.status.name.toLowerCase().localeCompare(b.status.name.toLowerCase());
        });
      else if (sortDirection.value === "asc") {
        arrayfilter.value.sort(function (a, b) {
          return b.status.name.toLowerCase().localeCompare(a.status.name.toLowerCase());
        })
      }
      else if (sortDirection.value === "CreateOn") {
        arrayfilter.value.sort(function (a, b) {
          return a.id - b.id;

        })
      }

    }

  }
}
if (filterText === '') {
  // arrayfilter.value  = []
  // sortDirection.value = "CreateOn"
}
// };
watch(filterText, (newValue) => {
  if (newValue.length === 0) {
    // arrayfilter.value = [];
  }
});
const resetfilter = () => {
  arrayfilter.value = []
  filterNoti.value = []
}


function signOut() {
  localStorage.removeItem('token');
  router.replace("/login")
}


function goToBoard() {
  router.replace("/board")
}

function goToCollaboratorManagement(boardId) {
  router.replace(`/board/${boardId}/collab`);
}


</script>



<template>
  <div>
    <h1
      class="font-serif flex justify-center bg-gradient-to-r from-green-400 via-teal-500 to-blue-400 text-white text-3xl p-10 w-full">
      IT-Bangmod Kradan Kanban
    </h1>

    <button v-if="isLoggedIn" v-on:click="goToBoard()"
      class="absolute top-9 right-5 border-2 hover:bg-gray-900/30 font-bold p-2 text-white rounded-lg">Back to
      boards</button>

    <!-- user box area -->
    <div class="dropdown dropdown-hover absolute top-7 left-8">
      <label tabindex="0">
        <p class="border-2 text-white font-bold py-4 px-4 rounded-lg flex" v-if="user"> <img
            src="../assets/userIcon.png" class="w-6" /> &ensp; {{ user }} <h1 v-if="boardCollabAccess">&ensp; (collab: {{boardCollabAccess}}) </h1> </p> 
        
        

        <p class="border-2 text-white font-bold py-4 px-4 rounded-lg flex" v-if="!user"> <img
            src="../assets/userIcon.png" class="w-6" /> &ensp; Guest</p>
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

    <br>
    <div v-if="isAdd || isThisDelete || isEdit" class="bg-green-400 font-black">
      <h3 class="font-bold text-lg">Success</h3>
      <p v-if="isAdd === true" :isThisDelete="false" class="itbkk-message">
        The task "{{ newTitle }}" is added successfully
      </p>
      <p v-if="isEdit === true" :isThisDelete="false" class="itbkk-message">
        The task "{{ newTitle }}" is edited successfully
      </p>
      <p v-if="isThisDelete === true" class="itbkk-message">
        The task has been deleted
      </p>
    </div>

    <!-- buttons area -->
    <div class="flex justify-between">
      <div class="flex justify-start">
        &ensp;&ensp;&ensp;&ensp;
        <div class="dropdown dropdown-hover">
          <label tabindex="0" class="cursor-pointer">
            <p
              class="border-2 font-bold py-2 px-4 rounded-lg flex items-center justify-between bg-white shadow-lg hover:shadow-xl transition-all duration-200">
              Filter by status
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                class="w-5 h-5 ml-2">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </p>
          </label>
          <ul tabindex="0" class="dropdown-content absolute bg-gray-100 p-2 mt-2 rounded-lg shadow-lg w-48">
            <li v-for="status in statuses" class=" last:mb-0">
              <button
                class="hover:font-bold border w-full text-left py-2 px-3 rounded-md bg-white hover:bg-gray-200 transition-all duration-200"
                v-on:click="filter(statusMapper(status.name))">
                • {{ statusMapper(status.name) }}
              </button>
            </li>

            <button
              class="hover:font-bold border w-full text-left py-2 px-3 rounded-md bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
              @click="resetfilter">reset filter</button>
          </ul>
        </div>

        &ensp;&ensp;

        <button
          class="itbkk-status-sort border-2 font-bold py-2 px-4 rounded-lg flex items-center justify-between bg-white shadow-lg hover:shadow-xl hover:bg-gray-100"
          @click="sort()">
          sort by status ⇅ {{ sortDirection }}
        </button>
      </div>


      <div class="flex justify-end">
        
        <button
          class="border-2 font-bold py-2 px-4 rounded-lg flex items-center justify-center  bg-green-200 shadow-lg hover:shadow-xl hover:bg-green-300 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          :disabled="isDisable" v-on:click="visibilityModal = true"
          v-if="boardVisiblity == 'public'">
          🔧 Change Visibility: {{ boardVisiblity }} 
        </button>

        <button
          class="border-2 font-bold py-2 px-4 rounded-lg flex items-center justify-center  bg-orange-200 shadow-lg hover:shadow-xl hover:bg-orange-300 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          :disabled="isDisable" v-on:click="visibilityModal = true"
          v-if="boardVisiblity == 'private'">
          🔧 Change Visibility: {{ boardVisiblity }} 
        </button>

        &ensp;&ensp;

        <button
          class="border-2 font-bold py-2 px-4 rounded-lg flex items-center justify-center bg-purple-200 shadow-lg hover:shadow-xl hover:bg-purple-300 transition-all duration-200"
          @click="router.replace({ name: 'status' })">
          ⚙️ Manage Status
        </button>
        
        &ensp;&ensp;

        <button
          class="border-2 font-bold py-2 px-4 rounded-lg flex items-center justify-center bg-sky-200 shadow-lg hover:shadow-xl hover:bg-sky-300 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          :disabled="isDisable" v-on:click="goToCollaboratorManagement(route.params.boardId)">
          👤 Manage Collaborator 
        </button>
        &ensp;&ensp;

      </div>


    </div>
    
    <div v-for="filter in filterNoti" class="pt-[0.15]">
      <br>
        <p class="p-2 bg-yellow-200 rounded-lg">{{ filter }}</p>
    </div>

  </div>


  <br>
  <table class="border-collapse border-black w-full">
    <tr class="bg-blue-100">
      <th class="w-[50%]">Title</th>
      <th class="w-[25%]">Assignees</th>
      <th class="w-[20%]">Status</th>
      <th class="flex justify-center">
        <button class="flex justify-center itbkk-button-add" @click="addTask()"
          :disabled="isDisable && !collabWriteAccess">
          <img src="../assets/addIcon.png" class="w-[40%]" />
        </button>
      </th>
    </tr>

    <tr v-for="task in (arrayfilter.length === 0) ? tasks : arrayfilter" class="itbkk-item" :num="task.id">
      <td class="w-[50%] hover:bg-sky-200 itbkk-title"
        @click="router.replace({ name: 'task', params: { id: task.id } })">
        &ensp; {{ task.title }}
      </td>

      <td class="w-[25%] itbkk-assignees">
        &ensp;
        {{
        task.assignees !== null && task.assignees !== null && task.assignees !== "null"
        ? task.assignees
        : "Unassigned"
        }}
      </td>
      <td class="w-[20%] itbkk-status">
        &ensp;
        {{ statusMapper(task.status.name) }}
      </td>
      <div class="dropdown dropdown-left dropdown-hover">
        <div class="itbkk-button-action">
          <div tabindex="0" role="button" class="btn m-1 ">
            <img src="../assets/settingIcon.png" />
          </div>

          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 ">
            <li>
              <button class="btn itbkk-button-delete disabled:cursor-not-allowed" @click="checkDelete(task.title, task.id)"
                :disabled="isDisable && !collabWriteAccess">
                Delete
              </button>
            </li>
            <li>
              <button class="btn itbkk-button-edit disabled:cursor-not-allowed" @click="router.replace({ name: 'edit', params: { id: task.id } })"
                :disabled="isDisable && !collabWriteAccess">
                Edit
              </button>
            </li>
          </ul>
        </div>
      </div>
    </tr>



    <!-- modal area -->
    <div v-if="visibilityModal" class="itbkk-modal-alert fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg border border-red-500 max-w-lg">
        <h2 v-if="user == boardOwnerId" class="text-xl font-semibold mb-4">Board visibility changed!</h2>
        <h2 v-if="user !== boardOwnerId" class="text-xl font-semibold mb-4">Unable to change board visibility</h2>

        <div v-if="user == boardOwnerId">
          <!-- แสดงข้อความตามสถานะ isPublic และ Private-->
          <p class="itbkk-message mb-6" v-if="boardVisiblity == 'public'">
            In public, anyone can view the board, task list, and task detail of tasks in the board.
            Do you want to change board visibility to private?
          </p>
          <p class="itbkk-message mb-6" v-if="boardVisiblity == 'private'">
            In private, only board owner can access/control board.
            Do you want to change board visibility to public?
          </p>
        </div>


        <div v-if="user !== boardOwnerId">
          <p class="itbkk-message mb-6">
            No permission! only board owner are allowed to change board visibility
          </p>
        </div>


        <div v-if="user == boardOwnerId" class="flex justify-end space-x-4">
          <button class="itbkk-button-confirm bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            v-on:click="visibilityModal = false; toggleBoardVisibility(route.params.boardId)">
            Confirm
          </button>
          <button class="itbkk-button-cancel bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            v-on:click="visibilityModal = false">
            Cancel
          </button>

        </div>

        <div v-if="user !== boardOwnerId" class="flex justify-end space-x-4">

          <button class="itbkk-button-cancel bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            v-on:click="visibilityModal = false">
            Ok
          </button>

        </div>

      </div>
    </div>
  </table>


  <dialog id="my_modal_1" class="modal">
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
          <button class="bg-green-500 hover:bg-green-700 btn itbkk-button-confirm" @click="DeleteTask(aId)">
            Confirm
          </button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
th,
td {
  border: 1px solid #dddddd;
}

.itbkk-assignees {
  font-style: italic;
}



.relative {
  position: relative;
}
</style>
