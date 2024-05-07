<script setup>
import { RouterLink } from "vue-router"
import { ref, onMounted } from "vue"
import TaskId from "./taskId.vue"
import router from "../router/index.js";
import {isAdd,newTitle} from "../stores/counter.js"
const tasks = ref([])
console.log(isAdd.value);
onMounted(async () => {
  location.reload
 // const data = await fetch("http://ip23kp3.sit.kmutt.ac.th:8080/tasks")
  const data = await fetch("http://localhost:8080/itb-kk/v1/tasks")
  tasks.value = await data.json()
})
const isDelete = ref(false)
const message = ref("")
const DeleteTask = (id)=>{
  fetch(`http://localhost:8080/itb-kk/v1/tasks/${id}`, { method: 'DELETE' })
    .then(() => this.status = 'Delete successful');
    message.value = "success"
    location.reload();
  isDelete.value = true
}
const atitle = ref("")
const aId = ref(0)
const checkDelete = (title,id)=>{
  my_modal_1.showModal()
  atitle.value = title
  aId.value = id
}
</script>

<template>
  <div>
    <h1
      class="flex justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-3xl p-10 w-full"
    >
      TaskBoard
    </h1>
    <div v-if="isAdd" class="bg-green-400 font-black">
      <h3 class="font-bold text-lg">Success</h3>
      <p class="itbkk-message">The task "{{ newTitle }}" is added successfully </p>
    </div>
    <table class="border-collapse border-black w-full">
      <tr>
        <th class="w-[50%]">Title</th>
        <th class="w-[25%]">Assignees</th>
        <th class="w-[20%]">Status</th>
        <th class="flex justify-center itbkk-button-add" @click="router.push({name:'task',params:{id:tasks[tasks.length -1].id+1},name:'add'})"><img src="../assets/addIcon.png" class="w-[40%]"></th>
      </tr>
      <tr v-for="task in tasks"  class="itbkk-item" :num="task.id">
        <td class="w-[50%] hover:bg-sky-700 itbkk-title" @click="router.push({name:'task',params:{id:task.id}})"  
        >{{ task.title }}</td>
		    <td class="w-[25%] itbkk-assignees" >{{ task.assignees===null||task.assignees===""?"Unassigned":task.assignees }}</td>
        <td class="w-[20%] itbkk-status">{{ task.status }}</td>
      <div class="dropdown dropdown-left dropdown-hover">
      <div tabindex="0" role="button" class="btn m-1 itbkk-button-action"><img src="../assets/settingIcon.png"></div>
        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          <li><button class="btn itbkk-button-delete" @click="checkDelete(task.title,task.id)">Delete</button></li>
          <li><button class="btn">Edit</button></li>
        </ul>
      </div>
      </tr>
    </table>
  </div>
  <dialog id="my_modal_1" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Delete Task</h3>
    <p class="py-4 itbkk-message">Do you want to delete the task "{{ atitle }}"?</p>
    <div class="modal-action">
      <form method="dialog">
        <button class=" bg-red-600 hover:bg-red-800 btn itbkk-button-cancel">Close</button>
        <button class=" bg-green-500  hover:bg-green-700 btn itbkk-button-confirm"@click="DeleteTask(aId)">Comfirm</button>
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
.itbkk-assignees{
  font-style: italic;
}
</style>
