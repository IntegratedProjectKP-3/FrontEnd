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
} from "../stores/counter.js";

console.log(import.meta.env.VITE_BASE_URL);
console.log(getLocalStorage("token"));

const route = useRoute();
let boards = ref([]);
const user = ref("");
let modalVisible = ref(false);

onMounted(async () => {
  const route = useRoute();
  console.log(getLocalStorage("checkTaskCreate"));
  if (getLocalStorage("token") === null || getLocalStorage("token") === "") {
    console.log("token");
    page.value = route.path;
    router.replace("/login");
  } else {
    const decodedToken = atob(getLocalStorage("token").split(".")[1]);
    const Jsondecode = JSON.parse(decodedToken);
    user.value = Jsondecode.name;
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
      const data = await response.json();
      boards.value = data;
      console.log("board.value");
      // if (
      //   getLocalStorage(
      //     "checkTaskCreate") !== null &&
      //       getLocalStorage("checkTaskCreate") !== ""
        
      // ) {
      //   console.log("bId");
      //   const bId = boards.value.find(board => board.id);
      //   console.log(bId);
      //   router.replace(`/board/${bId.id}/task`);
      // }
    } else {
      console.error(`Error: ${response.status}`);
    }
  }
});
console.log("in board");
const boardName = ref(`${user.value} personal board`)

const addBoard = () => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getLocalStorage("token"),
    },
    body: JSON.stringify({ name: `${boardName.value.trim()}` }),
  };
  console.log(requestOptions);
  fetch(import.meta.env.VITE_BASE_URL + "/boards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getLocalStorage("token"),
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
      boards.value = data;
    }); 
};
function goToBoard(boardId) {
  router.replace(`/board/${boardId}/task`);
}

function signOut() {
  // console.log("clicked logout")
  localStorage.clear();
  window.location.reload();
}
const addTask = async (boardId) => {
  saveLocalStorage("boardId", boards.value[0]);
  console.log(getLocalStorage("boardId"));
  console.log(boardId);
  const tasks = ref();
  const data = await fetch(
    import.meta.env.VITE_BASE_URL + `/boards/${boardId}/tasks`,
    {
      headers: {
        Authorization: "Bearer " + getLocalStorage("token"),
      },
    }
  );
  tasks.value = await data.json();
  router.replace({ name: "task", params: { boardId: boardId }, name: "add" });
}

</script>

<template>
  <div>
    <h1
      class="flex justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-3xl p-10 w-full"
    >
      IT-Bangmod Kradan Kanban
    </h1>

    <button
      v-on:click="signOut()"
      class="absolute top-9 right-1 bg-red-400 hover:bg-red-500 p-2 rounded-lg"
    >
      Sign Out
    </button>
  </div>

  <div class="container mx-auto mt-10">

    <div class="justify-center">
      <h1 class="text-3xl font-bold text-center">{{ user }} Boards</h1>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded itbkk-button-create absolute top-40 right-12"
        @click="modalVisible = true"
      >
        Create New Board
      </button>
      <br>
      <br>

    </div>


    <!-- //modal -->
    <div v-if="modalVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 itbkk-modal-new">
      <div class="bg-white rounded-lg shadow-lg w-1/3 p-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800 text-center">Create a New Board</h2>
        
        <textarea placeholder="Enter board name..." 
          class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 itbkk-board-name" 
          v-model="boardName"></textarea>
        
        <div class="flex justify-end space-x-4 mt-4">
          <button 
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out itbkk-button-ok"
            v-on:click="modalVisible = false; addBoard()">
            Save
          </button>
          <button 
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out itbkk-button-cancel"
            v-on:click="modalVisible = false">
            Cancel
          </button>
        </div>
      </div>
    </div>


    <div class="border">
      <h1 class="text-2xl text-center">{{ user }} personal board</h1>
      <h class="bg-gray-300">Board name</h>
      <tr v-for="board in boards" class="itbkk-item">
        <div class="flex row">
          <div v-on:click="goToBoard(board.id)" class="">
            {{ board.name }} &ensp;
            {{ board.visibility }} &ensp;
          </div> 

          <div>
            <button
              class="itbkk-button-add flex justify-end" @click="addTask(board.id)">Add task
            </button>
          </div>

        </div>
      </tr>
    </div>

    <br><br>

    <div class="border">
      <h1 class="text-2xl text-center">Collab Board</h1>
      <h class="bg-gray-300">Board name</h>
      <p>"future feature area , no function yet"</p>
      <!-- <tr v-for="board in boards" class="itbkk-item">
        <div class="flex row">
          <div v-on:click="goToBoard(board.id)" class="">
            {{ board.name }} &ensp;
          </div>

          
        </div>
      </tr> -->
    </div>



  </div>


</template>


<style scoped>

</style>
