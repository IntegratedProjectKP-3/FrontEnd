<script setup>
import { useRoute } from "vue-router"
import router from "../router/index.js";
import { onMounted, ref } from 'vue';
import { getLocalStorage } from '@/stores/counter';
import { tokenCheck } from "@/stores/tokenCheck.js";


const route = useRoute()
const collaboratorEmail = ref("");
const collaboratorAccessSelect = ref("read")
const collabList = ref([])
const collaboratorEditAccess = ref()
const collaboratorEditAccessUser = ref()
const collaboratorEditAccessOid = ref()
const collaboratorDeleteUser = ref()

const user = ref()


const addCollabModal = ref(false)
const editCollabModal = ref(false)
const deleteCollabModal = ref(false)

onMounted(async () => {
    console.log(getLocalStorage('token'))
    console.log("---------------tokens---------------------")
    console.log(getLocalStorage('refreshToken'))

    let decodedToken = atob(getLocalStorage("token").split('.')[1])
    let Jsondecode = JSON.parse(decodedToken)
    user.value = Jsondecode.name

    if (!getLocalStorage("token")) {
        console.log("token");
        page.value = route.path;
        router.replace("/login");
    } else {
        //instant access code ↓
        tokenCheck()
    }

    getCollaborators() 

    getBoardDetails()

})

async function getCollaborators() {
    await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/collabs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getLocalStorage("token"),
      },
    })
    .then(async (response)=> {
        if(response.ok){
            let data = await response.json()
            collabList.value = data

            console.log(collabList.value)
        }
    })
}

async function addCollaborator(){
    addCollabModal.value = false
    
    fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/collabs`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        , 'Authorization': 'Bearer ' + getLocalStorage("token"),
      },
      body: JSON.stringify({
        email: `${collaboratorEmail.value.trim()}`, 
        accessRight: `${collaboratorAccessSelect.value}`
      })
    })  
    .then((response) => {
        if(response.ok){
            console.log("respond ok")
            console.log(collaboratorEmail.value + "added to collab list")

            collaboratorEmail.value = ""
            collaboratorAccessSelect.value = "read"
        }else if(response.status == 409){
            console.log("user already in collab list")
        }

    })

}

async function cancelAddCollab(){
    addCollabModal.value = false
    collaboratorEmail.value = ""
    collaboratorAccessSelect.value = "read"
}


async function deleteCollab(collabId){
    console.log("delete collab")
    fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/collabs/${collabId}`,{
      method: "Delete",
      headers: {
        "Content-Type": "application/json"
        , 'Authorization': 'Bearer ' + getLocalStorage("token"),
      }
    })  
    .then((response) => {
        if(response.ok){
            console.log(collabId + "is deleted")
        }

    })
}

async function editCollabAccess(collabOid){
    console.log("sent Id:" + collabOid)

    fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/collabs/${collabOid}`,{
        method: "Put",
        headers: {
            "Content-Type": "application/json"
            , 'Authorization': 'Bearer ' + getLocalStorage("token"),
        },
        body: JSON.stringify({
            accessRight: `${collaboratorEditAccess.value}`
        })
    })  
    .then((response) => {
        if(response.ok){
            console.log("edited")
        }

    })

}

async function getBoardDetails() {
    let response = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token"),
        'Content-Type': 'application/json'
      }
    })

    let boardDetails = await response.json();
    console.log(boardDetails)
}


</script>

<template>
    
    <div class="border">
    <!-- Personal board area -->
    <h1 class="text-2xl text-center">{{ user }} {{  }} collaborators </h1>
    <div class="personal-board-container">

    </div>
    </div>

    <div>
        <div>
            <button class="border bg-orange-300 hover:bg-orange-500" v-on:click="addCollabModal = true">Add Collaborator</button>
        </div>

        <div>
            <button class="border" v-on:click="router.replace(`/board/${route.params.boardId}/task`)">Back To Task board</button>
        </div>


        <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" v-if="addCollabModal" >
            <input class="border-black border bg-white py-2 px-8" placeholder="email"  v-model="collaboratorEmail"> {{ collaboratorEmail }}

            &ensp;
            <select v-model="collaboratorAccessSelect">
                <option >read</option>
                <option >write</option>
            </select> {{ collaboratorAccessSelect }} &ensp;

            <button class="border" v-on:click="addCollaborator()">add</button> &ensp;
            <button class="border" v-on:click="cancelAddCollab()">cancel</button>
        </div>

        <br>


        <div class="border">
            <p>name | email | access</p>
            <tr v-for="collaborator in collabList" class="">
                <div class="flex row">
                <div class="">
                    {{ collaborator.name }} &ensp;
                    {{ collaborator.email }} &ensp;

                    <button class="border" v-on:click="editCollabModal = true 
                    , collaboratorEditAccess = collaborator.access 
                    , collaboratorEditAccessUser = collaborator.name
                    , collaboratorEditAccessOid = collaborator.id " >{{ collaborator.access }} </button> &ensp;
                </div> 

                <div>
                    <button class="border" v-on:click="deleteCollabModal = true , collaboratorDeleteUser = collaborator.name">Remove</button>
                </div>


                </div>
            </tr>

            <div v-if="editCollabModal" class="border">
                do you want to change access right of {{ collaboratorEditAccessUser }} to: {{ collaboratorEditAccess }}

                <select v-model="collaboratorEditAccess">
                        <option >read</option>
                        <option >write</option>
                </select>

                <button class="bg-green-400" v-on:click="editCollabAccess(collaboratorEditAccessOid)">confirm</button>
                <button class="bg-red-400" v-on:click="editCollabModal = false">cancel</button>
            </div>


            <div v-if="deleteCollabModal" class="border">
                do you want to remove {{ collaboratorDeleteUser }} from the board?

                <button class="bg-green-400" v-on:click="deleteCollab(collaborator.oid)">confirm</button>
                <button class="bg-red-400" v-on:click="deleteCollabModal = false">cancel</button>
            </div>


        </div>




    </div>


</template>





<style scoped>
.placeholder{
    color: red;
}
</style>
