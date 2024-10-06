<script setup>
import { ref,onMounted } from 'vue'
import { useRoute } from 'vue-router'
import router from "@/router/index.js";
import { isAdd, newTitle, isEdit, refresh,page,getLocalStorage, token } from "../stores/counter.js";

console.log(import.meta.env.VITE_BASE_URL);
console.log(getLocalStorage("token"))

const route = useRoute()
let boards = ref([])
const user = ref('')
const boardName = ref('')
let modalVisible = ref(false)

let boardCount = 1

  
onMounted(async () => {
  const route = useRoute()
  if (getLocalStorage("token") === null || getLocalStorage("token")  === ""){
    console.log("token");
    page.value = route.path
    router.push("/login")
  }
  else{
    const decodedToken = atob(getLocalStorage("token").split('.')[1])
    const Jsondecode = JSON.parse(decodedToken)
    user.value = Jsondecode.name
    const response = await fetch(import.meta.env.VITE_BASE_URL + "/boards", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getLocalStorage("token"),
      },
    })
    const data = await response.json();
    boards.value = data;
  }
})


const addBoard = ()=>{
  const requestOptions = {
    method: "POST",
    headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getLocalStorage("token")
      },
    body: JSON.stringify({name: `${boardName.value.trim()}` })
    }
    console.log(requestOptions)
    fetch(import.meta.env.VITE_BASE_URL + "/boards", requestOptions)

    window.location.reload()
}

//go to the clicked board using board id
function goToBoard(boardId){
  router.push(`/${boardId}/task`)
}
  








function signOut(){
  // console.log("clicked logout")
  localStorage.clear()
  window.location.reload()
}






  </script>
  
  
<template>
  <div>
    <h1
      class="flex justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-3xl p-10 w-full"
    >
      IT-Bangmod Kradan Kanban
    </h1>

    <button v-on:click="signOut()"  class="absolute top-9 right-5 bg-red-400 hover:bg-red-500 p-2 rounded-lg">Sign Out</button>
  </div>

    
    <div class="container mx-auto mt-10 border">

  
        <div class="flex justify-center" >
        <h1 class="text-3xl font-bold text-center">{{user}} Boards</h1> 
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" v-on:click="modalVisible = true">Create New Board</button>
        
        </div>




<!-- //modal -->
  <div v-if="modalVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
  <div class="bg-white rounded-lg shadow-lg w-1/3 p-6">
    <h2 class="text-2xl font-semibold mb-4 text-gray-800 text-center">Create a New Board</h2>
    
    <textarea placeholder="Enter board name..." 
      class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
      v-model="boardName"></textarea>
    
    <div class="flex justify-end space-x-4 mt-4">
      <button 
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        v-on:click="modalVisible = false; addBoard()">
        Save
      </button>
      <button 
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        v-on:click="modalVisible = false">
        Cancel
      </button>
    </div>
  </div>
</div>









    </div>

  </template>
  