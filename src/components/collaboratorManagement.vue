<script setup>
import { useRoute } from "vue-router"
import router from "../router/index.js";
import { onMounted, ref } from 'vue';
import { getLocalStorage } from '@/stores/counter';
import { tokenCheck } from "@/stores/tokenCheck.js";


const route = useRoute()
const collaboratorEmail = ref("");
const collaboratorPermissionSelect = ref("read")


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
        accessRight: `${collaboratorPermissionSelect.value}`
      })
    })  
    .then((response) => {
        if(response.ok){
            console.log("respond ok")
        }

    })
}



</script>

<template>
    you are at manage Collaborator page
    <div>
        <input class="border-black border bg-white py-2 px-8"  v-model="collaboratorEmail"> {{ collaboratorEmail }}
        <button class="border" v-on:click="addCollaborator()">add</button> &ensp;
        <button class="border">cancel</button>

        &ensp;
        <select v-model="collaboratorPermissionSelect">
            <option >read</option>
            <option >write</option>
        </select> {{ collaboratorPermissionSelect }}
    </div>




</template>





<style scoped></style>
