<script setup>
import { onMounted,ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router/index.js';
import { newTitle,isEdit} from '@/stores/counter';
const task = ref([])
const route = useRoute()
const title = ref("")
const description = ref("")
const status = ref("No Status")
const assignees = ref("")
let timeZone = ref()
const isTitleNull = ref(false)
let create
let update
let prevCreatedOn = ref()
let prevUpdatedOn = ref()
const setStatus = (input)=>{
    status.value = input
    console.log(status.value);
}
onMounted(async () => {
  location.reload 
 const data = await fetch(`http://ip23kp3.sit.kmutt.ac.th:8080/tasks/${route.params.id}`)
  // const data = await fetch(`http://localhost:8080/itb-kk/v1/tasks/${route.params.id}`)
  task.value = await data.json()
  if(!data.ok){
      router.push("/task")
  }
  title.value = task.value.title
  description.value = task.value.description
  status.value = task.value.status
  assignees.value = task.value.assignees
  console.log(task.value.createdOn);
  create = new Date(task.value.createdOn)
  update = new Date(task.value.updatedOn)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  timeZone.value = tz
  prevCreatedOn.value = create.toLocaleString("en-GB", {
    timeZone: `${tz}`
  })
  prevUpdatedOn.value = update.toLocaleString("en-GB", {
    timeZone: `${tz}`
  })
})
  console.log(prevCreatedOn.value);
const edit = async() =>{
  if(title.value === null || title.value === ""){
         isTitleNull.value =true
    }else{
        isEdit.value = true
        newTitle.value = title.value
    const requestOptions = {
    method: "PUT",
    headers: {
"Content-Type": "application/json" },
    body: JSON.stringify([{ id:`${route.params.id.trim()}`,title: `${title.value.trim()}`,description:`${description.value.trim()}`,status:`${status.value.trim()}`,assignees:`${assignees.value.trim()}`}])
  };
  fetch(`http://ip23kp3.sit.kmutt.ac.th:8080/itb-kk/v1/tasks/${route.params.id}`,requestOptions)
  .then(Response => Response.json())
  router.push('/task').then(() => {
  location.reload();
});
}
}
console.log(task.value.id);
const Push = ()=>{
   router.push('/')
}
</script>
<template>
      <div class="px-4">
    <h1 class="p-2 border-b-black border-solid border-b-[1px]">
        Edit Task : {{ task.id }}
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
  <option value="No Status">No Status</option>
  <option value='To Do'>To Do</option>
  <option value='Doing'>Doing</option>
  <option value='Done'>Done</option>
</select>
    <p class="itbkk-created-on">{{ prevCreatedOn }}</p>
    <p class="itbkk-updated-on">{{ prevUpdatedOn }}</p>
    <div class="pt-[200px] flex justify-center">
        <!-- <button class="bg-blue-500 px-3 py-2 rounded-lg" @click="checkJSON" >Check json</button> -->
        <div class="px-2">
        <button @click="edit()" class="bg-green-500 rounded-lg px-3 py-2 hover:bg-green-800 font-black itbkk-button-confirm disabled:bg-gray-500 disabled save" :disabled="title === ''|| title === isTitleNull">save</button>
        </div>
        <div class="px-2">
        <button class="bg-red-600 rounded-lg px-3 py-2 hover:bg-red-800 font-black itbkk-button-cancel" @click="Push()">Cancel</button>
    </div>
        </div>
    </div>
    </div>
    </div>
</template>
<style>
</style>
