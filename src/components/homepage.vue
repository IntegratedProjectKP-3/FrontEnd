<script setup>
import { RouterLink } from "vue-router"
import { ref, onMounted } from "vue"
import TaskId from "./taskId.vue"
import router from "../router/index.js";
const tasks = ref([])
onMounted(async () => {
  // const data = await fetch("http://ip23kp3.sit.kmutt.ac.th:8080/tasks")
  const data = await fetch("http://localhost:8080/itb-kk/v1/tasks")
  tasks.value = await data.json()
})
const count = ref(0)
</script>

<template>
  <div>
    <h1
      class="flex justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-3xl p-10 w-full"
    >
      TaskBoard
    </h1>
    <table class="border-collapse border-black w-full">
      <tr>
        <th class="w-[50%]">Title</th>
        <th class="w-[25%]">Assignees</th>
        <th class="w-[20%]">Status</th>
      </tr>
      <tr v-for="task in tasks" class="itbkk-item">
        <td class="w-[50%] hover:bg-sky-700 itbkk-title" @click="router.push({name:'task',params:{id:task.id}})"   
        >{{ task.title }}</td>
		    <td class="w-[25%] itbkk-assignees" >{{ task.assignees===null?"Unassigned":task.assignees }}</td>
        <td class="w-[20%] itbkk-status">{{ task.status }}</td>
      </tr>
    </table>
  </div>
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
