
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

    const response = await fetch(import.meta.env.VITE_BASE_URL, {
      method: "GET",
      mode: 'no-cors', //remove no-cors later
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
    mode: 'no-cors', //remove no-cors later
    headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getLocalStorage("token")
      },

    body: JSON.stringify({ name: `${boardName.value.trim()}` }),
    }

    console.log(requestOptions)
    fetch(import.meta.env.VITE_BASE_URL, requestOptions)

}

//go to the clicked board using board id
function goToBoard(boardId){

  router.push('/task')
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
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="modalVisible = true">Create New Board</button>
      </div>

      <div v-if="modalVisible">
        <textarea placeholder="Enter board name..." class="min-w-[300px] min-h-[50px] rounded-lg p-2 itbkk-status-name" v-model="name"></textarea>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="modalVisible = false, addBoard()">confirm</button>
      </div>

      <div v-on:click="goToBoard()"> 
        {{ boards }}
      </div>


      <div class="mt-5">
        </div>
    </div>
  </template>
  