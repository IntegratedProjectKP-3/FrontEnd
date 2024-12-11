<script setup>
import { useRoute } from "vue-router";
import router from "../router/index.js";
import { onMounted, ref } from "vue";
import { getLocalStorage, page } from "@/stores/counter";
import { tokenCheck } from "@/stores/tokenCheck.js";

const route = useRoute()
const user = ref()
const boardName = ref()

const collaboratorEmail = ref("")
const collaboratorAccessSelect = ref("read")
const collabList = ref([])
const collaboratorEditAccess = ref() //drop down
const collaboratorEditAccessUser = ref()
const collaboratorEditAccessOid = ref()
const collaboratorDeleteUser = ref()
const collaboratorDeleteOid = ref()

const addCollabModal = ref(false);
const editCollabModal = ref(false);
const deleteCollabModal = ref(false);

onMounted(async () => {
    if (!getLocalStorage("token")) {
        console.log("no token")
        page.value = route.path;
        router.replace("/login");
    } else {
        console.log(getLocalStorage("token"));
        console.log("---------------tokens---------------------");
        console.log(getLocalStorage("refreshToken"));

        let decodedToken = atob(getLocalStorage("token").split(".")[1]);
        let Jsondecode = JSON.parse(decodedToken);
        user.value = Jsondecode.name;

        //instant access code ↓
        tokenCheck();
    }



    getCollaborators()

    getBoardDetails();
});

async function getCollaborators() {
    await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/collabs`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getLocalStorage("token"),
        },
    })
        .then(async (response) => {
            if (response.ok) {
                let data = await response.json()
                collabList.value = data

                console.log(collabList.value)
            }
        })
}

async function addCollaborator() {
    addCollabModal.value = false

    fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/collabs`, {
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
            if (response.ok) {
                console.log("respond ok")
                console.log(collaboratorEmail.value + "added to collab list")

                collaboratorEmail.value = ""
                collaboratorAccessSelect.value = "read"

                getCollaborators()
            } else if (response.status == 409) {
                console.log("user already in collab list")
            }

        })

}

async function cancelAddCollab() {
    addCollabModal.value = false
    collaboratorEmail.value = ""
    collaboratorAccessSelect.value = "read"
}

async function deleteCollab(collabId) {
    console.log("delete collab")

    console.log(route.params.boardId)
    console.log(collabId)

    fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/collabs/${collabId}`, {
        method: "Delete",
        headers: {
            "Content-Type": "application/json"
            , 'Authorization': 'Bearer ' + getLocalStorage("token"),
        }
    })
        .then((response) => {
            if (response.ok) {
                console.log(collabId + "is deleted")

                getCollaborators()
            }

        })
}

async function editCollabAccess(collabOid) {
    console.log("sent Id:" + collabOid)

    fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/collabs/${collabOid}`, {
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
            if (response.ok) {
                console.log("edited")

                getCollaborators()
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
    console.log(boardDetails);

    boardName.value = boardDetails.name


}

function signOut() {
    // console.log("clicked logout")
    localStorage.clear();
    window.location.reload();
}


</script>

<template>

    <h1
        class="font-serif flex justify-center bg-gradient-to-r from-green-400 via-teal-500 to-blue-400 text-white text-3xl p-10 w-full">
        {{ user }} {{ boardName }}
    </h1>

    <!-- user box area -->
    <div class="dropdown dropdown-hover absolute top-7 left-8">
        <label tabindex="0">
            <p class="border-2 text-white font-bold py-4 px-4 rounded-lg flex "> <img src="../assets/userIcon.png"
                    class="w-6" /> &ensp; {{ user }} </p>
        </label>
        <ul tabindex="0" class="dropdown-content bg-red-400 hover:bg-red-500 rounded p-2 hover:font-bold "
            v-on:click="signOut()">
            <li>
                <a>
                    Sign Out
                </a>
            </li>
        </ul>
    </div>


    <br><br>

    <div class="justify-center">
        <h1 class="text-3xl font-bold text-center">Manage {{ boardName }} Collaborators</h1>
        <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded itbkk-button-create absolute top-40 right-12"
            v-on:click="addCollabModal = true">
            Add Collaborator
        </button>
        <br>
    </div>


    <div>
        <button class="absolute top-9 right-5 border-2 hover:bg-gray-900/30 font-bold p-2 text-white rounded-lg"
            v-on:click="router.replace(`/board/${route.params.boardId}/task`)">Back To Task board</button>
    </div>

    <div class="p-10">
        <table class="table w-full border overflow-hidden">
            <thead>
                <tr>
                    <th scope="col" class="w-[35%] px-4 py-2 text-left border-blue-300 text-black  text-xl tracking-wider">
                        Name
                    </th>
                    <th scope="col" class="w-[30%] px-4 py-2 text-left border-blue-300 text-black  text-xl  tracking-wider">
                        Email
                    </th>
                    <th scope="col" class="w-[15%] px-4 py-2 text-left border-blue-300 text-black  text-xl  tracking-wider">
                        Access
                    </th>
                    <th scope="col" class="w-[35%] px-4 py-2 text-left border-blue-300 text-black  text-xl  tracking-wider">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="collaborator in collabList" :key="collaborator.oid">
                    <td class="px-4 py-2 whitespace-nowrap text-gray-900 border-b border-blue-300">
                        {{ collaborator.name }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-gray-900 border-b border-blue-300">
                        {{ collaborator.email }}
                    </td>
                    <td class="px-4 py-2 whitespace-nowrap text-gray-900 border-b border-blue-300">
                        {{ collaborator.access }}
                    </td>

                    <td class="px-4 py-2 whitespace-nowrap border-blue-300 ">
                        <button
                            v-on:click="editCollabModal = true, collaboratorEditAccess = collaborator.access, collaboratorEditAccessUser = collaborator.name, collaboratorEditAccessOid = collaborator.oid"
                            class="inline-flex items-left px-2 py-1 text-blue-500 font-bold hover:underline">
                            change access ✐
                        </button>
                        &ensp;&ensp;&ensp;&ensp; 
                        <button
                            v-on:click="deleteCollabModal = true, collaboratorDeleteUser = collaborator.name, collaboratorDeleteOid = collaborator.oid"
                            class="inline-flex items-left px-2 py-1 text-red-500 font-bold hover:underline">
                            Remove ❌
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>





    <!-- modal area ///////////////////////////////////////////////// -->
    <!-- add collab modal -->
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" v-if="addCollabModal">
        <div class="bg-white p-8 rounded-lg shadow-lg" style="width: 400px; max-width: 90%;">

            <h3 class="text-xl font-semibold mb-6">Add Collaborator</h3>

            <div class="mb-5">
                <label for="email" class="block text-base font-medium mb-2">Email</label>
                <input id="email" type="text" class="border border-gray-300 rounded w-full py-3 px-4 text-lg"
                    placeholder="email" v-model="collaboratorEmail" />
            </div>

            <div class="mb-5">
                <label for="access" class="block text-base font-medium mb-2">Access Level</label>
                <select id="access" class="border border-gray-300 rounded w-full py-3 px-4 text-lg"
                    v-model="collaboratorAccessSelect">
                    <option>read</option>
                    <option>write</option>
                </select>
            </div>

            <div class="flex justify-end space-x-4">
                <button class="bg-blue-500 text-white py-3 px-6 rounded text-lg hover:bg-blue-600"
                    v-on:click="addCollaborator">
                    Add
                </button>
                <button class="bg-red-500 text-white py-3 px-6 rounded text-lg hover:bg-red-600"
                    v-on:click="cancelAddCollab">
                    Cancel
                </button>
            </div>
        </div>
    </div>


    <!-- edit collab modal -->
    <div v-if="editCollabModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-90">
            <h2 class="text-3xl font-semibold mb-4 text-red-500">Change Access Rights</h2>
            <p class="text-xl mb-4">
                Do you want to change access right of
                <strong>{{ collaboratorEditAccessUser }}</strong> to:
                <span class="text-blue-600">{{ collaboratorEditAccess }}</span>
            </p>

            <div class="mb-4">
                <label for="access" class="block text-base font-medium text-gray-700 mb-1">Select Access:</label>
                <select id="access" v-model="collaboratorEditAccess"
                    class="w-full p-2 border border-gray-300 rounded-md text-base">
                    <option value="write">Write</option>
                    <option value="read">Read</option>
                </select>
            </div>


            <div class="flex justify-end space-x-4">
                <button class="bg-green-500 text-white px-4 py-2 rounded-md text-base hover:bg-green-600"
                    v-on:click="editCollabAccess(collaboratorEditAccessOid)">
                    Confirm
                </button>
                <button class="bg-red-500 text-white px-4 py-2 rounded-md text-base hover:bg-red-600"
                    v-on:click="editCollabModal = false">
                    Cancel
                </button>
            </div>
        </div>
    </div>

    <!-- delete collab modal -->
    <div v-if="deleteCollabModal" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div class="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 class="text-2xl font-semibold mb-6 text-red-500">
                Remove Collaborator
            </h2>
            <p class="text-lg mb-6">
                Do you want to remove
                <strong>{{ collaboratorDeleteUser }}</strong> from the board?
            </p>

            <div class="flex justify-end space-x-6">
                <button class="bg-green-500 text-white px-4 py-2 rounded-md text-lg hover:bg-green-600"
                    v-on:click="deleteCollab(collaboratorDeleteOid), deleteCollabModal = false">
                    Confirm
                </button>
                <button class="bg-red-500 text-white px-4 py-2 rounded-md text-lg hover:bg-red-600"
                    v-on:click="deleteCollabModal = false">
                    Cancel
                </button>
            </div>
        </div>
    </div>


</template>

<style scoped>
.placeholder {
    color: red;
}
</style>
