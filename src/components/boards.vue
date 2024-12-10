<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import router from "@/router/index.js";
import {
  isAdd,
  newTitle,
  isEdit,
  refresh,
  page,
  getLocalStorage,
  token,
  saveLocalStorage,
  refreshToken,
} from "../stores/counter.js";
import { tokenCheck } from "@/stores/tokenCheck.js";
import { forEach } from "lodash";

console.log(import.meta.env.VITE_BASE_URL)
// console.log(getLocalStorage("token"))

const route = useRoute();
const personalBoards = ref([]);
const collabBoards = ref([]);
const user = ref("");
const modalVisible = ref(false);

const leaveBoardModal = ref(false)
const deleteCollabBoardId = ref()
const deleteCollabBoardName = ref()



onMounted(async () => {
  const route = useRoute();
  console.log(`localStorage checkTaskCreate: ${getLocalStorage("checkTaskCreate")}`);
  console.log(getLocalStorage('token'))
  console.log("---------------tokens---------------------")
  console.log(getLocalStorage('refreshToken'))

  if (!getLocalStorage("token")) {
    console.log("token");
    page.value = route.path;
    router.replace("/login");
  } else if (getLocalStorage("token")) {
    //instant access code ↓
    tokenCheck()

    const decodedToken = atob(getLocalStorage("token").split(".")[1]);
    const Jsondecode = JSON.parse(decodedToken);
    user.value = Jsondecode.name;

    getBoards()
  }

})


const boardName = ref(`${user.value} personal board`)

async function getBoards() {
  //getting all boards
  const response = await fetch(import.meta.env.VITE_BASE_URL + "/boards", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getLocalStorage("token"),
    },
  });
  if (response.status === 401) {
    router.replace("/login");
  } else if (response.ok) {
    const data = await response.json()
    console.log(data)

    personalBoards.value = data.boards
    collabBoards.value = data.invites
    console.log(personalBoards.value)
    console.log(collabBoards.value)
  } else {
    console.error(`Error: ${response.status}`)
  }
}


function addBoard() {
  fetch(import.meta.env.VITE_BASE_URL + "/boards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getLocalStorage("token"), //required , can use refreshToken
    },
    body: JSON.stringify({ name: boardName.value.trim() }),
  })
    .then((response) => {
      if (response.status === 401) {
        router.replace("/login");

      } else if (response.ok) {
        return response.json();
      } else {
        console.error(`Error: ${response.status}`);
      }
    })

    .then(async () => {
      const response = await fetch(import.meta.env.VITE_BASE_URL + "/boards", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage("token"),
        },
      });

      const data = await response.json();
      console.log(data)
      personalBoards.value = data.boards;
    });
}

async function leaveCollabBoard() {
  console.log("leave collab board")
  let tempCollabList = ref()

  await fetch(import.meta.env.VITE_BASE_URL + `/boards/${deleteCollabBoardId.value}/collabs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getLocalStorage("token"),
    },
  })
    .then(async (response) => {
      if (response.ok) {
        let data = await response.json()
        tempCollabList.value = data

        console.log(tempCollabList.value)
      }
    })


  tempCollabList.value.forEach(async collab => {

    // console.log(collab)

    if (deleteCollabBoardId.value == collab.boardId && user.value == collab.name) {
      // console.log("found the collab to delete")

      fetch(import.meta.env.VITE_BASE_URL + `/boards/${deleteCollabBoardId.value}/collabs/${collab.oid}`, {
        method: "Delete",
        headers: {
          "Content-Type": "application/json"
          , 'Authorization': 'Bearer ' + getLocalStorage("token"),
        }
      })
        .then((response) => {
          if (response.ok) {
            console.log(collabId + "is deleted")
          }

        })
    }

  })



}

function goToBoard(boardId) {
  router.replace(`/board/${boardId}/task`);
}

function signOut() {
  // console.log("clicked logout")
  localStorage.clear();
  window.location.reload();
}


</script>

<template>
  <div>
    <div>
      <h1
        class="font-serif flex justify-center bg-gradient-to-r from-green-400 via-teal-500 to-blue-400 text-white text-3xl p-10 w-full">
        IT-Bangmod Kradan Kanban
      </h1>

      <!-- user box area -->
      <div class="dropdown dropdown-hover absolute top-7 left-8">
        <label tabindex="0">
          <p class="border-2 text-white font-bold py-4 px-4 rounded-lg flex "> <img src="../assets/userIcon.png"
              class="w-6" /> &ensp; {{ user }}  </p> 
        </label>
        <ul tabindex="0" class="dropdown-content bg-red-400 hover:bg-red-500 rounded p-2 hover:font-bold " v-on:click="signOut()">
          <li>
            <a>
              Sign Out
            </a>
          </li>
        </ul>
      </div>


    </div>

  </div>

  <div class="container mx-auto mt-10">

    <div class="justify-center">
      <h1 class="text-3xl font-bold text-center">{{ user }} Boards</h1>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded itbkk-button-create absolute top-40 right-9"
        @click="modalVisible = true">
        Create New Board
      </button>
      <br>
      <br>

    </div>


    <div class="border p-3 pb-5 pt-5 rounded">
      <!-- Personal board area -->
      <h1 class="text-2xl text-left ">&ensp; {{ user }} personal board </h1>
      <br>
      <div class="personal-board-container">
        <div v-for="board in personalBoards" :key="board.id" class="itbkk-item">
          <div class="board-content">
            <div v-on:click="goToBoard(board.id)">
              <p class="board-title">{{ board.name }}</p>
              <p class="board-owner">owner: {{ board.ownerId }}</p>
              <p class="board-createdOn">created on:{{ board.createdOn }}</p>

              <br><br>
              <p class="board-visibility">visibility: {{ board.visibility }}</p>
            </div>

          </div>
        </div>
      </div>
    </div>

    <br><br>

    <div class="border p-3 pb-5 pt-5 rounded">
      <h1 class="text-2xl text-left">&ensp; {{ user }} Collab board </h1>
      <br>
      <div class="personal-board-container">
        <div v-for="board in collabBoards" :key="board.id" class="itbkk-item">
          <div class="board-content">
            <div v-on:click="goToBoard(board.id)">
              <p class="board-title">{{ board.name }}</p>
              <p class="board-owner">owner: {{ board.ownerId }}</p>
              <p class="board-createdOn">created on: {{ board.createdOn }}</p>
              <br><br>

            </div>
            <p class="board-visibility flex">visibility: {{ board.visibility }} &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-0 px-2 rounded"
                v-on:click="leaveBoardModal = true, deleteCollabBoardId = board.id, deleteCollabBoardName = board.name">Leave
                Board</button>
            </p>
          </div>
        </div>
      </div>
    </div>



  </div>

  <!-- create new board modal -->
  <div v-if="modalVisible"
    class="itbkk-modal-new fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-8 rounded-lg shadow-lg" style="width: 400px; max-width: 90%;">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800 text-center">Create a New Board</h2>

      <textarea placeholder="Enter board name..."
        class="itbkk-board-name w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        v-model="boardName"></textarea>

      <div class="flex justify-end space-x-4 mt-4">
        <button class="itbkk-button-ok bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          v-on:click="modalVisible = false; addBoard()">
          Save
        </button>
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          v-on:click="modalVisible = false">
          Cancel
        </button>
      </div>
    </div>
  </div>


  <!-- leave collab board modal -->
  <div v-if="leaveBoardModal"
    class="itbkk-modal-new fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg border-red-500 shadow-lg w-1/3 p-6">
      <h1>Are you sure you want to leave "{{ deleteCollabBoardName }}" board?</h1>


      <div class="flex justify-front space-x-4 mt-4">
        <button class="itbkk-button-ok bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
          v-on:click="leaveBoardModal = false; leaveCollabBoard()">
          confirm

        </button>
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
          v-on:click="leaveBoardModal = false">
          Cancel
        </button>
      </div>
    </div>
  </div>




</template>


<style scoped>
/* Container for the personal boards */
.personal-board-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 10px;
  gap: 10px;
  /* Space between items */
}

/* Style each item */
.itbkk-item {
  flex: 0 0 auto;
  /* Prevent shrinking */
  width: 300px;
  /* Width of each item */
  height: 175px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  background-color: #f9f9f9;
  /* Background color */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.itbkk-item:hover {
  background-color: #e8f3ff;
  cursor: pointer;
}

.board-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.board-title {
  font-size: 1.4em;
  font-weight: bold;
}

.board-owner {
  font-size: 1em;
}

.board-createdOn {
  font-size: 0.8em
}

.board-visibility {
  font-size: 1em;
  color: rgb(0, 0, 0);
}

/* Custom scrollbar for the container
.personal-board-container::-webkit-scrollbar {
  height: 8px;
}

.personal-board-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.personal-board-container::-webkit-scrollbar-thumb:hover {
  background: #555;
} */
</style>
