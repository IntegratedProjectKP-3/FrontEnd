<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
const tasks = ref([])
let create
let timeZone = ref()
let reFormatCreate = ref()
let update
let reFormatUpdate = ref()
onMounted(async () => {
  const route = useRoute()
  const path = Object.values(route)[0]
  const data = await fetch("http://localhost:8080/itb-kk" + path)
  tasks.value = await data.json()
  create = new Date(tasks.value.createdOn)
  update = new Date(tasks.value.updatedOn)
  console.log(update)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  console.log(tz)
  timeZone.value = tz
  reFormatCreate.value = create.toLocaleString("en-GB", {
    timeZone: `${tz}`
  })
  reFormatUpdate.value = update.toLocaleString("en-GB", {
    timeZone: `${tz}`
  })
  console.log(reFormatUpdate.value)
})
</script>
<template>
  <div class="flex flex-col justify-center">
    <h1 class="p-2 border-b-black border-solid border-b-[1px]">
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
            {{ tasks.desc }}
          </p>
        </div>
      </div>
      <div class="p-3 flex flex-col">
        <h1 class="pb-2 text-sm">taskAssignees</h1>
        <div class="flex p-2 border-black border-solid border-[1px]">
          <p class="text-sm">
            {{ tasks.assignees }}
          </p>
        </div>
        <h1>taskStatus</h1>
        <div class="flex p-2 border-black border-solid border-[1px]">
          <p class="text-sm">
            {{ tasks.status }}
          </p>
        </div>
        <h1>TimeZone : {{ timeZone }}</h1>
        <h1>taskCreatedOn :</h1>
        {{ reFormatCreate }}
        <h1>taskUpdatedOn :</h1>
        {{ reFormatUpdate }}
        <br />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
