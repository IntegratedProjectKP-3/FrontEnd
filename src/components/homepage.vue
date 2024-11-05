<script setup>
import { useRoute } from "vue-router";
import { ref, onMounted,watch  } from "vue";
import router from "../router/index.js";
import { isAdd, newTitle, isEdit, refresh,page,getLocalStorage,saveLocalStorage } from "../stores/counter.js";
const isThisDelete = ref(false);
const tasks = ref([]);
const statuses = ref()
const status = ref()
const user = ref("")  
const route = useRoute()
let boardDetail = ref()
let boardVisiblity = ref()
let boardOwnerId = ref()
const visibilityModal = ref(false)
let ownerPermisson = ref()
let isLoggedIn = ref(false)
const isDisable = ref(false)

onMounted(async () => {
  console.log(`localStorage checkTaskCreate: ${getLocalStorage("checkTaskCreate")}`);

  console.log(getLocalStorage('token'))
  console.log("---------------tokens---------------------")
  console.log(getLocalStorage('refreshToken'))

  let response
  let decodedToken
  let Jsondecode

  if(getLocalStorage("token")){

    //area for putting in instant access code

















    isLoggedIn = true
    decodedToken = atob(getLocalStorage("token").split('.')[1])
    Jsondecode = JSON.parse(decodedToken)
    user.value = Jsondecode.name
    // console.log(`logged in account name: ${Jsondecode.name}`);

    response = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/tasks`,{   
          headers: {
            'Authorization': 'Bearer ' + getLocalStorage("token")
        }
    })
  }else if(!getLocalStorage("token")){
    isDisable.value = true
    isLoggedIn = false
    console.log("no token")
    response = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/tasks`)
  }



  if (response.ok) {
    const data = await response.json();
    if (data && Array.isArray(data) && data.length > 0) {
        // console.log('Tasks Data:', data);
        tasks.value = data
        let statusesData
        if(getLocalStorage("token")){
          statusesData = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/statuses`,{   
          headers: {
            'Authorization': 'Bearer ' + getLocalStorage("token")
          }
        })

        }else if(!getLocalStorage("token")){
          statusesData = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/statuses`)
        }

  
  statuses.value = await statusesData.json();
  datas = tasks.value
  // console.log(datas);
  // console.log(tasks.value);
    } else {
        console.log('No data available');
    }
  } else {
    console.error('Failed to fetch data:', response.status);
    router.replace('/login')
}

    let response2
    if(getLocalStorage("token")){
        response2 = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + getLocalStorage("token"),
          'Content-Type': 'application/json'
        }
    })

    }else if(!getLocalStorage("token")){
        response2 = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    boardDetail = await response2.json();
    console.log(boardDetail)
    console.log("-------under boarddetails")

    boardOwnerId = boardDetail.ownerId
    console.log(`board owner: ${boardOwnerId}`)
    console.log(`logged in as: ${user.value}`)

    boardVisiblity = boardDetail.visibility
    console.log(boardVisiblity)

    if(user.value == boardOwnerId){
      ownerPermisson = true
      console.log("user have permmission to change anything in the board")
    }
    else if(user.value !== boardOwnerId){
      console.log("user dont have permmission to change anything in the board")
      ownerPermisson = false
      isDisable.value = true
    }
    
    resetfilter()
})

async function toggleBoardVisibility(boardId) {
  if(boardVisiblity === "public"){
    boardVisiblity = "private"
  }else if(boardVisiblity === "private"){
    boardVisiblity = "public"
  }

  console.log(`changed visibility: ${boardVisiblity}`)

  fetch(
      import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}`,
      {method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + getLocalStorage("token")
      },
      body: JSON.stringify(
        {
          visibility: `${boardVisiblity}`,
        }
        
    )
  })

  resetfilter()
}




const message = ref("");
const DeleteTask = async (id) => {
  await fetch(`${import.meta.env.VITE_BASE_URL}/boards/${route.params.boardId}/tasks/${id}`, {
    method: "DELETE",   
    headers: {'Authorization': 'Bearer ' + getLocalStorage("token")}
  });
  const data = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/tasks`,{   
       headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token")
    }
});
  tasks.value = await data.json();
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
    router.replace({
      name: "task",
      params: { id: 2 },
      name: "add",
    });
  } else {
    router.replace({
      name: "task",
      params: { id: tasks.value[tasks.value.length - 1].id + 1 },
      name: "add",
    });
  }
}
function statusMapper(status) {
  let status1;
    status1 = status.split(" for" )[0];
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
    // const sortText = ref("");
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
    const data = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/tasks`,{   
       headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token")
    }
});
    tasks.value = await data.json();
    sortDirection.value = "CreateOn"
  } else {
      const data = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/tasks`,{   
       headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token")
    }
});
      tasks.value = await data.json()
      const statuses = tasks.value.filter((task) =>
        statusMapper(task.status.name).startsWith(name)
      );
      console.log(statuses)
      console.log(filterNoti.value)
      if (!filterNoti.value.includes(name)) {
      console.log("push")
      filterNoti.value.push(name)
}
      // if (filterNoti.value.filter((noti) => noti.value !== name)){
      //   console.log("push");
      //   filterNoti.value.push(name)
      // }
      console.log(name);
      console.log(statuses);
      console.log(`filter result : ${statuses}`);
      for (let status of statuses) {
        // if (status === undefined) {
        //   const data = await fetch(import.meta.env.VITE_BASE_URL + "/tasks");
        //   tasks.value = await data.json();
        //   console.log(status);
        //   datas = tasks.value
        //   console.log(datas);
        // } else {
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


function signOut(){
  // console.log("clicked logout")
  localStorage.removeItem('token');
  router.replace("/login")
}


function goToBoard(){
  router.replace("/board")
}

</script>






<template>
  <div>
    <h1
      class="flex justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-3xl p-10 w-full"
    >
      IT-Bangmod Kradan Kanban
    </h1>

    <button v-if="isLoggedIn" v-on:click="signOut()"  class="absolute top-1  right-1 bg-red-400 hover:bg-red-500 p-2 rounded-lg">Sign Out</button>
    <button v-if="isLoggedIn" v-on:click="goToBoard()"  class="absolute top-12 right-1 bg-red-400 hover:bg-red-500 p-2 rounded-lg">Board</button>


    <h1 v-if="isLoggedIn" class="itbkk-fullname">username : {{ user}}</h1>
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

    <div class="flex ">
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


        <!-- bimmer's code -->
        &ensp;
        <button class="itbkk-board-visibility bg-yellow-200 disabled:bg-gray-300 p-2 rounded-lg" :class="[isDisable ? 'disabled' : '']" :disabled="isDisable" v-on:click="visibilityModal = true">Status: {{ boardVisiblity }}</button> 

         <!-- //ใช้ได้  -->
         <!-- DaisyUI toggle -->   
        <!-- Modal -->
         
    <div v-if="visibilityModal" class="itbkk-modal-alert fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg border border-red-500 max-w-lg">
        <h2 v-if="user == boardOwnerId" class="text-xl font-semibold mb-4">Board visibility changed!</h2>
        <h2 v-if="user !== boardOwnerId" class="text-xl font-semibold mb-4">Unable to change board visibility</h2>

        <div v-if="user == boardOwnerId">
          <!-- แสดงข้อความตามสถานะ isPublic และ Private-->
          <p class="itbkk-message mb-6" v-if="boardVisiblity == 'public'">
            In public, anyone can view the board, task list, and task detail of tasks in the board.
            Do you want to change board visibility to private?
          </p>
          <p class="itbkk-message mb-6" v-if="boardVisiblity == 'private'">
            In private, only board owner can access/control board.
            Do you want to change board visibility to public?
          </p>
        </div>

      
        <div v-if="user !== boardOwnerId">
          <p class="itbkk-message mb-6">
              No permission! only board owner are allowed to change board visibility
          </p>
        </div>


        
        <!-- ปุ่มด้านในใช้ได้ -->
        <!-- <div class="flex items-center justify-center mb-6">
          <span class="mr-2">Public</span>
          <input type="checkbox" class="toggle toggle-success" v-model="isPublic" @change="toggleVisibility" />
          <span class="ml-2">Private</span>
        </div> -->


        <div v-if="user == boardOwnerId" class="flex justify-end space-x-4">
          <button
            class="itbkk-button-confirm bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            v-on:click="visibilityModal = false; toggleBoardVisibility(route.params.boardId)"
          >
            Confirm
          </button>
          <button
            class="itbkk-button-cancel bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            v-on:click="visibilityModal = false"
          >
            Cancel
          </button>

        </div>

        <div v-if="user !== boardOwnerId" class="flex justify-end space-x-4">

          <button
            class="itbkk-button-cancel bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            v-on:click="visibilityModal = false"
          >
            Ok
          </button>

        </div>

      </div>
    </div> 



      </div>

        <div v-for="filter in filterNoti" class="pt-[0.15]">
          <div class="pr-3 pb-3">
            <p class="p-2 bg-purple-400 rounded-lg">{{ filter }}</p>
          </div>
        </div>
        <button class="bg-orange-400 rounded-lg p-2 mx-2 itbkk-status-sort" @click="sort()">
          sort by status {{ sortDirection }}
        </button>
        <button
          class=" bg-gray-400 hover:bg-gray-500 rounded-lg p-2 itbkk-manage-status"
          @click="router.replace({ name: 'status' })"
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
      <th class="flex justify-center">
        <button class="flex justify-center itbkk-button-add" @click="addTask()" :class="[isDisable ? 'disabled' : '']" :disabled="isDisable">
          <img src="../assets/addIcon.png" class="w-[40%]" />
        </button>
      </th>
    </tr>
    <tr v-for="task in (arrayfilter.length === 0)?tasks:arrayfilter" class="itbkk-item" :num="task.id">
      <td
        class="w-[50%] hover:bg-sky-700 itbkk-title"
        @click="router.replace({ name: 'task', params: { id: task.id } })"
      >
        {{ task.title }}
      </td>

      <td class="w-[25%] itbkk-assignees">
        {{
          task.assignees !== null && task.assignees !== null && task.assignees !== "null"
            ? task.assignees
            : "Unassigned"
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
                :class="[isDisable ? 'disabled' : '']" :disabled="isDisable"
              >
                Delete
              </button>
            </li>
            <li>
              <button
                class="btn itbkk-button-edit"
                @click="router.replace({ name: 'edit', params: { id: task.id } })"
                :class="[isDisable ? 'disabled' : '']" :disabled="isDisable"
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



.relative {
    position: relative;
  }


</style>
