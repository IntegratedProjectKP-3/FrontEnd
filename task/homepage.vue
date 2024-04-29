<script setup>
import { RouterLink } from "vue-router"
import { ref, onMounted } from "vue"
import TaskId from "./taskId.vue"
const tasks = ref([])
onMounted(async () => {
  const data = await fetch("http://localhost:8080/itb-kk/tasks")
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
        <!-- <th class="w-[5%]"></th> -->
        <th class="w-[5%]">Id</th>
        <th class="w-[50%]">Title</th>
        <th class="w-[25%]">Assignees</th>
        <th class="w-[20%]">Status</th>
      </tr>
      <tr v-for="task in tasks">
        <router-link :to="{name:'task',params:{id:task.id}}">
          <td class="w-[5%] text-center">
            {{ task.id }}
          </td>
        </router-link>
        <td class="w-[50%]">{{ task.title }}</td>
        <td class="w-[25%]">{{ task.assignees }}</td>
        <td class="w-[20%]">{{ task.status }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
th,
td {
  border: 1px solid #dddddd;
}
</style>
