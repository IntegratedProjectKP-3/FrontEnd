<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import router from "../router/index.js"
const tasks = ref([])
let create
let timeZone = ref()
let reFormatCreate = ref()
let update
let reFormatUpdate = ref()
let is404 = ref(true)

onMounted(async () => {
  const route = useRoute()
  const path = Object.values(route)[0]
  console.log(route.params.id)
  try{
    // const data = await fetch(`http://ip23kp3.sit.kmutt.ac.th:8080/itb-kk/v2/tasks/${route.params.id}` )
    const data = await fetch(`http://localhost:8080/itb-kk/v2/tasks/${route.params.id}`)
    if(!data.ok){
      throw new Error(err)
    }
    is404.value = false
  tasks.value = await data.json()
  create = new Date(tasks.value.createdOn)
  update = new Date(tasks.value.updatedOn)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  timeZone.value = tz
  reFormatCreate.value = create.toLocaleString("en-GB", {
    timeZone: `${tz}`
  })
  reFormatUpdate.value = update.toLocaleString("en-GB", {
    timeZone: `${tz}`
  })
  }catch(err){
    console.log(path)
    window.alert("The requested task does not exist")
    router.push("/task")
  }})
</script>
<template>
  <div v-if="is404 === true">

 </div>
  <div class="flex flex-col justify-center" v-if="is404 === false">
    <h1 class="p-2 border-b-black border-solid border-b-[1px] itbkk-title">
      {{ tasks.title }}
    </h1>
    <div class="flex flex-row w-[60%] p-3 break-words">
      <div class="flex flex-col">
        <p class="p-3 text-sm justify-center">taskDescription</p>
        <div
          class="p-2 border-black border-solid border-[1px] min-h-[450px] min-w-[600px] rounded-md"
          style="word-break: break-word"
        >
          <p class="text-sm">
          <p v-if="tasks.description === null || tasks.description === ''" class=" italic text-gray-600 itbkk-description">
            No Description Provided
          </p>
          <p class="itbkk-description">
            {{ tasks.description }}
            </p>
          </p>
        </div>
      </div>
      <div class="p-3 flex flex-col">
        <h1 class="pb-2 text-sm">taskAssignees</h1>
        <div class="flex p-2 border-black border-solid border-[1px]">
          <p class="text-sm">
            <p v-if="tasks.assignees === null|| tasks.assignees === ''" class="italic text-gray-600 itbkk-assignees">
              Unassigned
            </p>
            <p class="itbkk-assignees">
            {{ tasks.assignees }}
          </p>
          </p>
        </div>
        <h1>taskStatus</h1>
        <div class="flex p-2 border-black border-solid border-[1px]">
          <p class="text-sm itbkk-status">
            {{ tasks.status }}
          </p>
        </div>
        <h1 class="itbkk-timezone">TimeZone : {{ timeZone }}</h1>
        <h1 >taskCreatedOn :</h1>
        <h1 class="itbkk-created-on">
          {{ reFormatCreate }}
        </h1>
        <h1 >taskUpdatedOn :</h1>
        <h1 class="itbkk-updated-on">
        {{ reFormatUpdate }}
        </h1>
        <br />
      </div>
      <div class="pt-[200px] flex justify-center">
        <div class="px-2">
        <button @click="router.push({name:'edit',params:{id:$route.params.id}})" class="bg-green-500 rounded-lg px-3 py-2 hover:bg-green-800 font-black itbkk-button-confirm">save</button>
        </div>
        <div class="px-2">
        <button class="bg-red-600 rounded-lg px-3 py-2 hover:bg-red-800 font-black itbkk-button-cacncel" @click="router.push('/')">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
th,
td {
  border: 1px solid #dddddd;
}
.itbkk-assignees {
  font-style: italic;
}
</style>
