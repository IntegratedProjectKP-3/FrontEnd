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
const boardName = ref(`${user.value} personal board`);
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
};
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
      class="absolute top-9 right-5 bg-red-400 hover:bg-red-500 p-2 rounded-lg"
    >
      Sign Out
    </button>
  </div>

  <div class="container mx-auto mt-10 border">
    <div class="flex justify-center">
      <h1 class="text-3xl font-bold text-center">{{ user }} Boards</h1>
      <h1>{{ user }} personal board</h1>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded itbkk-button-create"
        @click="modalVisible = true"
      >
        Create New Board
      </button>
    </div>

    <div v-if="modalVisible" class="itbkk-modal-new">
      <textarea
        placeholder="Enter board name..."
        class="min-w-[300px] min-h-[50px] rounded-lg p-2 itbkk-status-name itbkk-board-name"
        v-model="boardName"
      ></textarea>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded itbkk-button-ok"
        @click="(modalVisible = false), addBoard()"
      >
        confirm
      </button>
    </div>
    <h class="bg-gray-300">Board name</h>
    <tr v-for="board in boards" class="itbkk-item">
      <div class="flex row">
        <div v-on:click="goToBoard(board.id)" class="">
          {{ board.name }}
        </div>
        <button
          class="itbkk-button-add flex justify-end"
          @click="addTask(board.id)"
        >
          Add task
        </button>
      </div>
    </tr>
  </div>
</template>
