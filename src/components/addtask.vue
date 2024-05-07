<script setup>
import { useRoute } from "vue-router"
import router from "../router/index.js";
import { ref } from "vue";
import { isAdd,newTitle } from "@/stores/counter";
const route = useRoute()
const title = ref("")
const description = ref("")
const status = ref("No Status")
const assignees = ref("")
const isTitleNull = ref(false)
const setStatus = (input)=>{
    status.value = input
}
const checkJSON = ()=>{
    console.log({ id:`${route.params.id}`,title: `${title.value}`,description:`${description.value}`,status:`${status.value}`,assignees:`${assignees.value}` });
}
const AddTask = ()=>{
    if(title.value === null || title.value === ""){
         isTitleNull.value =true
    }else{
        isAdd.value = true
        newTitle.value = title.value
    const requestOptions = {
    method: "POST",
    headers: {
"Content-Type": "application/json" },
    body: JSON.stringify([{ id:`${route.params.id.trim()}`,title: `${title.value.trim()}`,description:`${description.value.trim()}`,status:`${status.value.trim()}`,assignees:`${assignees.value.trim()}`}])
  };
  fetch(`http://localhost:8080/itb-kk/v1/tasks`,requestOptions)
  .then(Response => Response.json())
    router.push("/")
}
}
</script>
<template>
    <div class="px-4">
    <h1 class="p-2 border-b-black border-solid border-b-[1px]">
        New Task
    </h1>
    <div class="flex flex-row p-3">
            <div class="flex flex-col">
    <p>Title</p>
    <textarea placeholder="Type Title..." class=" min-w-[300px] min-h-[50px] rounded-lg p-2 itbkk-title" v-model="title"></textarea>
    <p class="mt-2 text-sm text-red-600 dark:text-red-500" v-if="isTitleNull"><span class="font-medium">Title can't be empty</span> Please enter Title.</p>
       <p class="pb-[10px]">Description</p>
    <textarea placeholder="Type Desc..." class=" min-w-[1000px] min-h-[300px] rounded-lg p-2 itbkk-description" v-model="description"></textarea>
    </div>
    <div class="flex flex-col pl-3">
    <h1>Assignees</h1>
    <textarea placeholder="Type Assignees..." class="min-w-[300px] min-h-[50px] rounded-lg p-2 itbkk-assignees" v-model="assignees"></textarea>
    <br>
    <h1>Status</h1>
    <div class="dropdown dropdown-hover">
  <div tabindex="0" role="button" class="btn m-1 itbkk-status">{{ status }}</div>
  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
    <li><button @click="setStatus('No Status')">No Status</button></li>
        <li><button @click="setStatus('To Do')">To Do</button></li>
        <li><button @click="setStatus('Doing')">Doing</button></li>
        <li><button @click="setStatus('Done')">Done</button></li>
  </ul>
</div>
    <div class="pt-[200px] flex justify-center">
        <!-- <button class="bg-blue-500 px-3 py-2 rounded-lg" @click="checkJSON" >Check json</button> -->
        <div class="px-2">
        <button @click="AddTask()" class="bg-green-500 rounded-lg px-3 py-2 hover:bg-green-800 font-black itbkk-button-confirm @save" :disabled="title === ''|| title === isTitleNull">Save</button>
        </div>
        <div class="px-2">
        <button class="bg-red-600 rounded-lg px-3 py-2 hover:bg-red-800 font-black itbkk-button-cacncel" @click="router.push('/')">Cancel</button>
    </div>
        </div>
    </div>
    </div>
    </div>
</template>
<style>
.textarea{
     color: #000;;
}
</style>