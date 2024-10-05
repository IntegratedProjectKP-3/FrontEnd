<script setup>
import { useRoute } from "vue-router"
import router from "../router/index.js";
import { ref,onMounted } from "vue";
import { isAdd,newTitle,refresh,getUsername,page,token,getLocalStorage,saveLocalStorage } from "@/stores/counter";
const route = useRoute()
const title = ref("")
const description = ref("")
const status = ref()
const assignees = ref("")
const isTitleNull = ref(false)
const statuses = ref({})
onMounted(async () => {
    const route = useRoute()
  if (getLocalStorage("token") === null || getLocalStorage("token") === ""){
    page.value = route.path
    console.log(route.path);
    router.replace("/login")
  }else{
    const dataStatus = await fetch(import.meta.env.VITE_BASE_URL +  `/boards/${route.params.boardId}/statuses`,{   
       headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token")
    }
} );
    statuses.value = await dataStatus.json()
    status.value = statuses.value.find(status => status.name.includes("No Status"));
    console.log(status.value);
    console.log(statuses.value);
    // localStorage.setItem(isEnable,ref(false))
}
})
const checkJSON = ()=>{
    console.log(status.id);
    console.log({ id:`${route.params.id}`,title: `${title.value}`,description:`${description.value}`,status:`${status.value}`,assignees:`${assignees.value}` });
    console.log(JSON.stringify([{title: `${title.value.trim()}`,description:`${description.value.trim()}`
    ,status:{        
        id: status.value.id,
        name: status.value.name,
        description: status.value.description
},assignees:`${assignees.value.trim()}`}]));
}
function statusMapper(status) {
  let status1;
    status1 = status.split(" for ")[0];;
  return status1;
}  
const AddTask = ()=>{
    if(title.value === null || title.value === ""){
         isTitleNull.value =true
    }else{
        refresh.value = true 
        isAdd.value = true  
        newTitle.value = title.value
    const requestOptions = {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
        ,'Authorization': 'Bearer ' + getLocalStorage("token"),
},
    body: JSON.stringify({
    title: `${title.value.trim()}`
    ,description:`${description.value.trim()}`
    ,status:`${status.value.id}`
    ,assignees:`${assignees.value.trim()}`
  })
  };
  fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/tasks`,requestOptions)
  .then(Response => Response.json())
  saveLocalStorage(`checkTaskCreate`,getLocalStorage("token") + " : taskCreated")
  console.log(getLocalStorage("checkTaskCreate"));
  router.replace(`/board/${route.params.boardId}/task`)
  .then(() => {
    const data =  fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/tasks`,{   
       headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token")
    }})  
//   location.reload();
})
}}
</script>
<template>
    <div class="itbkk-modal-task">
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
    <select v-model="status" class="itbkk-status">
  <option v-for="status in statuses" :value="status">{{ statusMapper(status.name) }}</option>
</select>
    <div class="pt-[200px] flex justify-center">
        <button class="bg-blue-500 px-3 py-2 rounded-lg" @click="checkJSON" >Check json</button>
        <div class="px-2">
        <button @click="AddTask()" class="bg-green-500 rounded-lg px-3 py-2 hover:bg-green-800 font-black itbkk-button-confirm disabled" :disabled="title === ''|| title === isTitleNull">Save</button>
        </div>
        <div class="px-2">
        <button class="bg-red-600 rounded-lg px-3 py-2 hover:bg-red-800 font-black itbkk-button-cancel" @click="router.replace(`/board/${route.params.boardId}/task`)">Cancel</button>
    </div>
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
