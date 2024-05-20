<script setup>
import { RouterLink } from "vue-router";
import { ref, onMounted } from "vue";
import router from "../router/index.js";
import { isAdd, newTitle, isEdit, refresh } from "../stores/counter.js";
const isThisDelete = ref(false);
const tasks = ref([]);
onMounted(async () => {
  const data = await fetch(import.meta.env.VITE_BASE_URL + "/tasks");
  tasks.value = await data.json();
  console.log(tasks.value);
  console.log(isThisDelete.value);
  console.log(tasks.value.length);
});
const message = ref("");
const DeleteTask = async (id) => {
  await fetch(`${import.meta.env.VITE_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  const data = await fetch(import.meta.env.VITE_BASE_URL + "/tasks");
  tasks.value = await data.json();
  datas = await data.json();
  message.value = "success";
  console.log(tasks.value.id);
  // location.reload();
  isThisDelete.value = true;
};
const atitle = ref("");
const aId = ref(0);
const checkDelete = (title, id) => {
  my_modal_1.showModal();
  atitle.value = title;
  aId.value = id;
};     
  function addTask(){
    if (tasks.value.length === 0){
      router.push({
              name: 'task',
              params: { id: 2 },
              name: 'add',
            })
    }  
    else{
      router.push({
              name: 'task',
              params: { id: tasks.value[tasks.value.length - 1].id + 1 },
              name: 'add',
            })
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
      return a.status.statusName.toLowerCase().localeCompare(b.status.statusName.toLowerCase());
    });
    arrayfilter.value.sort(function(a, b) {
      return a.status.statusName.toLowerCase().localeCompare(b.status.statusName.toLowerCase());
    });
    console.log(tasks.value);
  } else if (sortConut % 3 === 2) {
    sortDirection.value = "asc";
    console.log(sortDirection.value);
    tasks.value.sort(function(a, b) {
      return b.status.statusName.toLowerCase().localeCompare(a.status.statusName.toLowerCase());
    });
    arrayfilter.value.sort(function(a, b) {
      return b.status.statusName.toLowerCase().localeCompare(a.status.statusName.toLowerCase());
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
const filterText = ref("");
const isfilter = ref(false)
const filter = async (statusName) => {
  if (statusName === "") {
    const data = await fetch(import.meta.env.VITE_BASE_URL + "/tasks");
    tasks.value = await data.json();
    sortDirection.value = "CreateOn"
  } else {
      const data = await fetch(import.meta.env.VITE_BASE_URL + "/tasks");
      tasks.value = await data.json();
      const statuses = tasks.value.filter((task) =>
        statusMapper(task.status.statusName).startsWith(statusName)
      );
      console.log(statuses);
      arrayfilter.value = [];
      for (let status of statuses) {
        if (status === undefined) {
          const data = await fetch(import.meta.env.VITE_BASE_URL + "/tasks");
          tasks.value = await data.json();
          console.log(status);
          datas = await data.json();
          console.log(datas);
        } else {
          const data = await fetch(
            import.meta.env.VITE_BASE_URL +
              "/tasks/filter/" +
              status.status.statusId
          );
          if (!arrayfilter.value.some(task => task.title === status.title)) {
          arrayfilter.value.push(status);
        }
          tasks.value = await data.json();
          datas = tasks.value
          const data1 = await fetch(import.meta.env.VITE_BASE_URL + "/tasks");
          tasks.value = await data1.json();
          sortDirection.value = "CreateOn"
        }
      
    }
  }
  if(filterText === ''){
  arrayfilter.value  = []
  sortDirection.value = "CreateOn"
}
};

</script>

<template>
  <div>
    <h1
      class="flex justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-3xl p-10 w-full"
    >
      IT-Bangmod Kradan Kanban
    </h1>
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
    <div class="flex justify-end">
      <button class=" bg-gray-400 hover:bg-gray-500 rounded-lg p-2 itbkk-manage-status" @click="router.push({name: 'status'})">manage Status</button>
    </div>
    <table class="border-collapse border-black w-full">
      <tr>
        <th class="w-[50%]">Title</th>
        <th class="w-[25%]">Assignees</th>
        <th class="w-[20%]">Status</th>
        <th
          class="flex justify-center itbkk-button-add"
          @click="
          addTask()
"        >
          <img src="../assets/addIcon.png" class="w-[40%]" />
        </th>
      </tr>
      <tr v-for="task in tasks" class="itbkk-item" :num="task.id">
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
        <td class="w-[20%] itbkk-status">{{ statusMapper(task.status.statusName) }}</td>
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
                >
                  Delete
                </button>
              </li>
              <li>
                <button
                  class="btn itbkk-button-edit"
                  @click="
                    router.push({ name: 'edit', params: { id: task.id } })
                  "
                >
                  Edit
                </button>
              </li>
            </ul>
          </div>
        </div>
      </tr>
    </table>
  </div>
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
