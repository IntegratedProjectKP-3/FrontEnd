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
  } else if(getLocalStorage("token")) {
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

async function leaveCollabBoard(){
  console.log("leave collab board")
  let tempCollabList = ref()

  await fetch(import.meta.env.VITE_BASE_URL + `/boards/${deleteCollabBoardId.value}/collabs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getLocalStorage("token"),
      },
    })
    .then(async (response)=> {
        if(response.ok){
            let data = await response.json()
            tempCollabList.value = data

            console.log(tempCollabList.value)
        }
    })
    

  tempCollabList.value.forEach(async collab =>{

    // console.log(collab)

    if(deleteCollabBoardId.value == collab.boardId && user.value == collab.name){
      // console.log("found the collab to delete")

      fetch(import.meta.env.VITE_BASE_URL + `/boards/${deleteCollabBoardId.value}/collabs/${collab.oid}`,{
      method: "Delete",
      headers: {
        "Content-Type": "application/json"
        , 'Authorization': 'Bearer ' + getLocalStorage("token"),
      }
      })  
      .then((response) => {
          if(response.ok){
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
    <h1
      class="font-serif flex justify-center bg-gradient-to-r from-green-400 via-teal-500 to-blue-400 text-white text-3xl p-10 w-full">
      IT-Bangmod Kradan Kanban
    </h1>


    <button v-on:click="signOut()"
      class="absolute top-9 right-1 bg-red-400 hover:bg-red-500 p-2 rounded-lg hover:font-bold">
      Sign Out
    </button>
  </div>

  <div class="container mx-auto mt-10">

    <div class="justify-center">
      <h1 class="text-3xl font-bold text-center">{{ user }} Boards</h1>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded itbkk-button-create absolute top-40 right-12"
        @click="modalVisible = true">
        Create New Board
      </button>
      <br>
      <br>

    </div>


    <div class="border">
      <!-- Personal board area -->
      <h1 class="text-2xl text-center">{{ user }} personal board</h1>
      <div class="personal-board-container">
        <div v-for="board in personalBoards" :key="board.id" class="itbkk-item">
          <div class="board-content">
            <div v-on:click="goToBoard(board.id)">
              <h2 class="board-title">{{ board.name }}</h2>
              <p class="board-visibility">{{ board.visibility }}</p>
            </div>

          </div>
        </div>
      </div>
    </div>

    <br><br>

    <div class="border">
      <h1 class="text-2xl text-center">{{ user }} Collab board</h1>
      <div class="personal-board-container">
        <div v-for="board in collabBoards" :key="board.id" class="itbkk-item">
          <div class="board-content">
            <div v-on:click="goToBoard(board.id)">
              <h2 class="board-title">{{ board.name }}</h2>
              <p class="board-visibility">{{ board.visibility }}</p>
            </div>

            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              v-on:click="leaveBoardModal = true, deleteCollabBoardId = board.id, deleteCollabBoardName = board.name">Leave</button>
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
    <div class="bg-white rounded-lg shadow-lg w-1/3 p-6">
      <h3>Are you sure you want to leave {{ deleteCollabBoardName }} board?</h3>


      <div class="flex justify-end space-x-4 mt-4">
        <button class="itbkk-button-ok bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          v-on:click="leaveBoardModal = false; leaveCollabBoard()">
          confirm

        </button>
        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
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
  width: 200px;
  /* Width of each item */
  height: 150px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  background-color: #f9f9f9;
  /* Background color */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.itbkk-item:hover {
  background-color: #e0e0e0;
  cursor: pointer;
}

.board-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.board-title {
  font-size: 1.2em;
  font-weight: bold;
}

.board-visibility {
  font-size: 0.9em;
  color: gray;
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
