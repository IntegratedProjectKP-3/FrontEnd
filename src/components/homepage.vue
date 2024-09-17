<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted,watch  } from "vue";
import router from "../router/index.js";
import { isAdd, newTitle, isEdit, refresh,page,getLocalStorage } from "../stores/counter.js";
const isThisDelete = ref(false);
const tasks = ref([]);
const statuses = ref()
const status = ref()
const user = ref("")
onMounted(async () => {
  const route = useRoute()
  if (getLocalStorage("token") === null || getLocalStorage("token")  === ""){
    console.log("token");
    page.value = route.path
    console.log(route.path);
    router.push("/login")
  }else{
    const decodedToken = atob(getLocalStorage("token").split('.')[1])
    const Jsondecode = JSON.parse(decodedToken)
    user.value = Jsondecode.name
    console.log(Jsondecode.name);
    const data = await fetch(import.meta.env.VITE_BASE_URL + "/tasks",{   
       headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token")
    }
});
    tasks.value = await data.json();
  const statusesData = await fetch(import.meta.env.VITE_BASE_URL + "/statuses",{   
       headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token")
    }
})
  statuses.value = await statusesData.json();
  datas = tasks.value
  console.log(datas);
}
});
const message = ref("");
const DeleteTask = async (id) => {
  await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${id}`, {
    method: "DELETE",   
    headers: {'Authorization': 'Bearer ' + getLocalStorage("token")}
  });
  const data = await fetch(import.meta.env.VITE_BASE_URL + "/tasks",{   
       headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token")
    }
});
  tasks.value = await data.json();
  datas = await data.json();
  message.value = "success";
  isThisDelete.value = true;
};
const atitle = ref("");
const aId = ref(0);
const checkDelete = (title, id) => {
  my_modal_1.showModal();
  atitle.value = title;
  aId.value = id;
};
function addTask() {
  if (tasks.value.length === 0) {
    router.push({
      name: "task",
      params: { id: 2 },
      name: "add",
    });
  } else {
    router.push({
      name: "task",
      params: { id: tasks.value[tasks.value.length - 1].id + 1 },
      name: "add",
    });
  }
}
function statusMapper(status) {
  let status1;
  if (status === "NO_STATUS") {
    status1 = "No Status";
  } else if (status === "TO_DO") {
    status1 = "To Do";
  } else if (status === "DOING") {
    status1 = "Doing";
  } else if (status === "DONE") {
    status1 = "Done";
  } else {
    return status;
  }
  return status1;
}
const sortDirection = ref("CreateOn");
let sortConut = 0;
const sort = async () => {
  sortConut = sortConut + 1;
  console.log(tasks.value);
  if (sortConut % 3 === 1) {
    sortDirection.value = "desc";
    console.log(sortDirection.value);
    const sortText = ref("");
    tasks.value.sort(function(a, b) {
      return a.status.name.toLowerCase().localeCompare(b.status.name.toLowerCase());
    });
    arrayfilter.value.sort(function(a, b) {
      return a.status.name.toLowerCase().localeCompare(b.status.name.toLowerCase());
    });
    console.log(tasks.value);
  } else if (sortConut % 3 === 2) {
    sortDirection.value = "asc";
    console.log(sortDirection.value);
    tasks.value.sort(function(a, b) {
      return b.status.name.toLowerCase().localeCompare(a.status.name.toLowerCase());
    });
    arrayfilter.value.sort(function(a, b) {
      return b.status.name.toLowerCase().localeCompare(a.status.name.toLowerCase());
    });
  } else if (sortConut % 3 === 0) {
    sortDirection.value = "CreateOn";
    console.log(sortDirection.value);
    tasks.value.sort(function(a, b) {
    return a.id-b.id;
    });
    arrayfilter.value.sort(function(a, b) {
    return a.id-b.id;
    });

  }
};
let arrayfilter = ref([])
let datas
const isClick = ref(false)
const filterText = ref("");
const filterNoti = ref([])
const filter = async (name) => {
  isClick.value = true
  if (name === "") {
    const data = await fetch(import.meta.env.VITE_BASE_URL + "/tasks",{   
       headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token")
    }
});
    tasks.value = await data.json();
    sortDirection.value = "CreateOn"
  } else {
      const data = await fetch(import.meta.env.VITE_BASE_URL + "/tasks",{   
       headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token")
    }
});
      tasks.value = await data.json();
      const statuses = tasks.value.filter((task) =>
        statusMapper(task.status.name).startsWith(name)
      );
      // if (statuses.length > 0){
        filterNoti.value.push(name)
      // }
      console.log(name);
      console.log(statuses);
      console.log(`filter result : ${statuses}`);
      // if(statuses.length === 0){
      //   tasks.value = []
      // }
      // arrayfilter.value = [];
      for (let status of statuses) {
        // if (status === undefined) {
        //   const data = await fetch(import.meta.env.VITE_BASE_URL + "/tasks");
        //   tasks.value = await data.json();
        //   console.log(status);
        //   datas = tasks.value
        //   console.log(datas);
        // } else {
          const data = await fetch(
            import.meta.env.VITE_BASE_URL +
              "/tasks/filter/" +
              status.status.id
              ,{   
       headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token")
    }
});
          if (!arrayfilter.value.some(task => task.title === status.title)) {
          arrayfilter.value.push(status);
        }
        if(sortDirection.value === "desc")
        arrayfilter.value.sort(function(a, b) {
      return a.status.name.toLowerCase().localeCompare(b.status.name.toLowerCase());
    });
        else if(sortDirection.value === "asc"){
          arrayfilter.value.sort(function(a, b) {
      return b.status.name.toLowerCase().localeCompare(a.status.name.toLowerCase());
    })}
      else if(sortDirection.value === "CreateOn"){
      arrayfilter.value.sort(function(a, b) {
    return a.id-b.id;

    })
        }
        
          // tasks.value = await data.json();
          // datas = tasks.value
          // const data1 = await fetch(import.meta.env.VITE_BASE_URL + "/tasks");
          // tasks.value = await data1.json();
          // sortDirection.value = "CreateOn"
        }
      
    }
  }
  if(filterText === ''){
  // arrayfilter.value  = []
  // sortDirection.value = "CreateOn"
}
// };
watch(filterText, (newValue) => {
  if (newValue.length === 0) {
    // arrayfilter.value = [];
  }
});
const resetfilter = ()=>{
  arrayfilter.value = []
  filterNoti.value =[]
}
</script>

<template>
  <div>
    <h1
      class="flex justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-3xl p-10 w-full"
    >
      IT-Bangmod Kradan Kanban
    </h1>
    <h1 class="itbkk-fullname">username : {{ user}}</h1>
    <div v-if="isAdd || isThisDelete || isEdit" class="bg-green-400 font-black">
      <h3 class="font-bold text-lg">Success</h3>
      <p v-if="isAdd === true" :isThisDelete="false" class="itbkk-message">
        The task "{{ newTitle }}" is added successfully
      </p>
      <p v-if="isEdit === true" :isThisDelete="false" class="itbkk-message">
        The task "{{ newTitle }}" is edited successfully
      </p>
      <p v-if="isThisDelete === true" class="itbkk-message">
        The task has been deleted
      </p>
    </div>
    <div class="flex">
      <div class="p-2 mx-2 flex flex-row">
        <!-- <input
          class="bg-white rounded-lg p-2 mx-2 "
          type="text"
          placeholder="filter status ..."
          v-model="filterText"
        />
        <img
          src="../assets/serachIcon.png"
          @click="filter(filterText)"
          class="w-6 h-8 pt-2"
        /> -->
      </div>
      <p class="p-2">filter by status : </p>
      <div class="flex justify-end p-2 button itbkk-status-filter">
        <button v-for="status in statuses" class="bg-gray-300 p-2" @click="filter(statusMapper(status.name))">{{ statusMapper(status.name) }}</button>
        </div>
        <button class="bg-red-500 p-2 rounded-lg" @click="resetfilter">reset filter</button>
        <!-- <select v-model="status" class="pr-2 itbkk-status-filter">
  <option v-for="status in statuses" :value="statusMapper(status.statusName)">{{ statusMapper(status.statusName) }}</option>
</select>
<div class="pl-2 pr-2">
        <img
          src="../assets/serachIcon.png"
          @click="filter(status)"
          class="w-6 h-8 pt-2 button"
        /> -->
      </div>
        <div v-for="filter in filterNoti" class="pt-2">
          <div class="pr-3 pb-3">
            <p class="p-2 bg-purple-400 rounded-lg">{{ filter }}</p>
          </div>
        </div>
        <button class="bg-orange-400 rounded-lg p-2 mx-2 itbkk-status-sort" @click="sort()">
          sort by status {{ sortDirection }}
        </button>
        <button
          class="bg-gray-400 hover:bg-gray-500 rounded-lg p-2 itbkk-manage-status"
          @click="router.push({ name: 'status' })"
        >
          manage Status
        </button>
      </div>
    <!-- </div>
  </div> -->
  <table class="border-collapse border-black w-full">
    <tr>
      <th class="w-[50%]">Title</th>
      <th class="w-[25%]">Assignees</th>
      <th class="w-[20%]">Status</th>
      <th class="flex justify-center itbkk-button-add" @click="addTask()">
        <img src="../assets/addIcon.png" class="w-[40%]" />
      </th>
    </tr>
    <tr v-for="task in (arrayfilter.length === 0)?tasks:arrayfilter" class="itbkk-item" :num="task.id">
      <td
        class="w-[50%] hover:bg-sky-700 itbkk-title"
        @click="router.push({ name: 'task', params: { id: task.id } })"
      >
        {{ task.title }}
      </td>
      <td class="w-[25%] itbkk-assignees">
        {{
          task.assignees === null || task.assignees === ""
            ? "Unassigned"
            : task.assignees
        }}
      </td>
      <td class="w-[20%] itbkk-status">
        {{ statusMapper(task.status.name) }}
      </td>
      <div class="dropdown dropdown-left dropdown-hover">
        <div class="itbkk-button-action">
          <div tabindex="0" role="button" class="btn m-1">
            <img src="../assets/settingIcon.png" />
          </div>
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <button
                class="btn itbkk-button-delete"
                @click="checkDelete(task.title, task.id)"
              >๐
                Delete
              </button>
            </li>
            <li>
              <button
                class="btn itbkk-button-edit"
                @click="router.push({ name: 'edit', params: { id: task.id } })"
              >
                Edit
              </button>
            </li>
          </ul>
        </div>
      </div>
    </tr>
  </table>
  <!-- </div> -->
  <dialog id="my_modal_1" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Delete Task</h3>
      <p class="py-4 itbkk-message">
        Do you want to delete the task number "{{ atitle }}"?
      </p>
      <div class="modal-action">
        <form method="dialog">
          <button class="bg-red-600 hover:bg-red-800 btn itbkk-button-cancel">
            Cancel
          </button>
          <button
            class="bg-green-500 hover:bg-green-700 btn itbkk-button-confirm"
            @click="DeleteTask(aId)"
          >
            Confirm
          </button>
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
.itbkk-assignees {
  font-style: italic;
}
</style>
