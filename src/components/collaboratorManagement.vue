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

const collaboratorEditAccess = ref("")
const collaboratorAccess = ref("read"|"write")

const addCollabModal = ref(false)
const editCollabModal = ref(false)

onMounted(async () => {
    console.log(getLocalStorage('token'))
    console.log("---------------tokens---------------------")
    console.log(getLocalStorage('refreshToken'))

    if (!getLocalStorage("token")) {
        console.log("token");
        page.value = route.path;
        router.replace("/login");
    } else {
        //instant access code ↓
        tokenCheck()
    }

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

})

function addCollaborator(){
    
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

async function editCollabAccess(collabId){

    fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/collabs/${collabId}`,{
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



</script>

<template>
    you are at manage Collaborator page

    <div>
        <div>
            <button class="border bg-orange-300 hover:bg-orange-500" v-on:click="addCollabModal = true">Add Collaborator</button>
        </div>


        <div class="border" v-if="addCollabModal" >
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

                    {{ collaborator.access }} &ensp;

                    
                </div> 

                <div>
                    <button class="border" v-if(editCollabAccess(collaborator.oid))> temp collaborator access button </button>  &ensp;
                    <button class="border" v-if(deleteCollab(collaborator.oid))>Delete</button>
                </div>


                </div>
            </tr>
        </div>





    </div>


</template>





<style scoped>
.placeholder{
    color: red;
}
</style>
