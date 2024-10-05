<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import router from "@/router/index.js";
import { newTitle, isEdit,getUsername,page,token,getLocalStorage } from "@/stores/counter";
import { replace } from "lodash";
const task = ref([]);
const route = useRoute();
const title = ref("");
const description = ref("");
const status = ref();
const assignees = ref("");
let timeZone = ref();
const isTitleNull = ref(false);
const statuses = ref([]);
let create;
let update;
let prevCreatedOn = ref();
let prevUpdatedOn = ref();
const setStatus = (input) => {
  status.value = input;
  console.log(status.value);
};
function statusMapper(status) {
  let status1;
    status1 = status.split(" for ")[0];;
  return status1;
}
onMounted(async () => {
  // location.reload;
  const route = useRoute()
  if (getLocalStorage("token") === null || getLocalStorage("token") === ""){
    page.value = route.path
    console.log(route.path);
    router.replace("/login")
  }else{
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/tasks/${route.params.id}`,{
       headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token")
    }
  })
    if (response.ok) {
      console.log("response.ok");
    const data = await response.json();
    console.log(data);
    // if (data && Array.isArray(data) && data.length > 0) {
      console.log("data && Array.isArray(data) && data.length > 0");
        console.log('Data:', data)
        task.value =  data
      const dataStatus = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/statuses`,{
       headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token")
    }
});
  statuses.value = await dataStatus.json();
  console.log("statuses.value :" +statuses.value);
  // if (!data.ok) {
  //   console.log("")
  //   // router.replace("/");
  // }
  title.value = task.value.title;
  description.value = task.value.description;
  status.value = task.value.status;
  assignees.value = task.value.assignees;
  console.log(task.value.createdOn);
  create = new Date(task.value.createdOn);
  update = new Date(task.value.updatedOn);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  timeZone.value = tz;
  prevCreatedOn.value = create.toLocaleString("en-GB", {
    timeZone: `${tz}`,
  });
  prevUpdatedOn.value = update.toLocaleString("en-GB", {
    timeZone: `${tz}`,
  });
  console.log(prevCreatedOn.value);
    // } else {
    //     console.log('No data available')
    // }
} else {
    console.error('Failed to fetch data:', response.status);
    router.replace("/login")
}
//   task.value = await data.json();
//   const dataStatus = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/statuses`,{
//        headers: {
//         'Authorization': 'Bearer ' + getLocalStorage("token")
//     }
// });
//   statuses.value = await dataStatus.json();
//   if (!data.ok) {
//     router.replace("/task");
//   }
//   title.value = task.value.title;
//   description.value = task.value.description;
//   status.value = task.value.status;
//   assignees.value = task.value.assignees;
//   console.log(task.value.createdOn);
//   create = new Date(task.value.createdOn);
//   update = new Date(task.value.updatedOn);
//   const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
//   timeZone.value = tz;
//   prevCreatedOn.value = create.toLocaleString("en-GB", {
//     timeZone: `${tz}`,
//   });
//   prevUpdatedOn.value = update.toLocaleString("en-GB", {
//     timeZone: `${tz}`,
//   });
}});
const edit = async () => {
  if (title.value === null || title.value === "") {
    isTitleNull.value = true;
  } else {
    if (!token) {
      const token = getLocalStorage("token");
  console.log("No token found in localStorage");
    }
    isEdit.value = true;
    newTitle.value = title.value;
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + getLocalStorage("token")
      },
      body: JSON.stringify(
        {
          title: `${title.value.trim()}`,
          description: `${description.value}`,
          status: `${status.value.id}`,
          // status: {
          //   id: `${status.value.id}`,
          //   name: `${status.value.name}`,
          //   description: `${status.value.description}`,
          // },
          assignees: `${assignees.value}`,
        },
      ),
    };
    console.log(requestOptions);
    fetch(
      import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/tasks/${route.params.id}`,
      requestOptions
    )
      .then((Response) => Response.json());
      router.replace(`/board/${route.params.boardId}/task`)
  }
};
console.log(task.value.id);
const Push = () => {
  router.replace(`/board/${route.params.boardId}/task`);
};
</script>
<template>
  <div class="px-4 itbkk-modal-task">
    <h1 class="p-2 border-b-black border-solid border-b-[1px]">
      Edit Task : {{ task.id }}
    </h1>
    <div class="flex flex-row p-3">
      <div class="flex flex-col">
        <p>Title</p>
        <textarea
          placeholder="Type Title..."
          class="min-w-[300px] min-h-[50px] rounded-lg p-2 itbkk-title"
          v-model="title"
        ></textarea>
        <p
          class="mt-2 text-sm text-red-600 dark:text-red-500"
          v-if="isTitleNull"
        >
          <span class="font-medium">Title can't be empty</span> Please enter
          Title.
        </p>
        <p class="pb-[10px]">Description</p>
        <textarea
          placeholder="Type Desc..."
          class="min-w-[1000px] min-h-[300px] rounded-lg p-2 itbkk-description"
          v-model="description"
        ></textarea>
      </div>
      <div class="flex flex-col pl-3">
        <h1>Assignees</h1>
        <textarea
          placeholder="Type Assignees..."
          class="min-w-[300px] min-h-[50px] rounded-lg p-2 itbkk-assignees"
          v-model="assignees"
        ></textarea>
        <br />
        <h1>Status</h1>
        <!-- <select v-model="status" class="itbkk-status">
          <option v-for="status in statuses" :value="status.statusId">
            {{ status.statusName }}
          </option>
        </select> -->
        <select v-model="status" class="itbkk-status">
          <option
            class="bg-gray-300"
            :value="task.status"
            v-if="task && task.status"
          >
            {{ statusMapper(task.status.name) }}
          </option>
          <option v-for="status in statuses" :value="status">
            {{ statusMapper(status.name) }}
          </option>
        </select>
        <p class="itbkk-created-on">{{ prevCreatedOn }}</p>
        <p class="itbkk-updated-on">{{ prevUpdatedOn }}</p>
        <div class="pt-[200px] flex justify-center">
          <!-- <button class="bg-blue-500 px-3 py-2 rounded-lg" @click="checkJSON" >Check json</button> -->
          <div class="px-2">
            <button
              @click="edit()"
              class="bg-green-500 rounded-lg px-3 py-2 hover:bg-green-800 font-black itbkk-button-confirm disabled:bg-gray-500 disabled save"
              :disabled="title === '' || title === isTitleNull"
            >
              save
            </button>
          </div>
          <div class="px-2">
            <button
              class="bg-red-600 rounded-lg px-3 py-2 hover:bg-red-800 font-black itbkk-button-cancel"
              @click="router.replace(`/board/${route.params.boardId}/task`)"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
