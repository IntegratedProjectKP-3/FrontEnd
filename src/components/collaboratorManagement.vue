<script setup>
import { useRoute } from "vue-router";
import router from "../router/index.js";
import { onMounted, ref } from "vue";
import { getLocalStorage } from "@/stores/counter";
import { tokenCheck } from "@/stores/tokenCheck.js";

const route = useRoute();
const collaboratorEmail = ref("");
const collaboratorAccessSelect = ref("read")
const collabList = ref([])
const collaboratorEditAccess = ref()
const collaboratorEditAccessUser = ref()
const collaboratorEditAccessOid = ref()
const collaboratorDeleteUser = ref()
const collaboratorDeleteOid = ref()

const user = ref();

const addCollabModal = ref(false);
const editCollabModal = ref(false);
const deleteCollabModal = ref(false);

onMounted(async () => {
  console.log(getLocalStorage("token"));
  console.log("---------------tokens---------------------");
  console.log(getLocalStorage("refreshToken"));

  let decodedToken = atob(getLocalStorage("token").split(".")[1]);
  let Jsondecode = JSON.parse(decodedToken);
  user.value = Jsondecode.name;

  if (!getLocalStorage("token")) {
    console.log("token");
    page.value = route.path;
    router.replace("/login");
  } else {
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
}
</script>

<template>

    <div class="border">
        <!-- Personal board area -->
        <h1 class="text-2xl text-center">{{ user }}'s {{ }} collaborators </h1>
    </div>

    <div>
        <div>
            <button class="border bg-orange-300 hover:bg-orange-500" v-on:click="addCollabModal = true">Add
                Collaborator</button>
        </div>

        <div>
            <button class="border" v-on:click="router.replace(`/board/${route.params.boardId}/task`)">Back To Task
                board</button>
        </div>



        <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" v-if="addCollabModal">
            <div class="bg-white p-8 rounded-lg shadow-lg" style="width: 400px; max-width: 90%;">
                <!-- Title -->
                <h3 class="text-xl font-semibold mb-6">Add Collaborator</h3>

                <!-- Email Input -->
                <div class="mb-5">
                    <label for="email" class="block text-base font-medium mb-2">Email</label>
                    <input id="email" type="text" class="border border-gray-300 rounded w-full py-3 px-4 text-lg"
                        placeholder="email" v-model="collaboratorEmail" />
                </div>

                <!-- Access Level Dropdown -->
                <div class="mb-5">
                    <label for="access" class="block text-base font-medium mb-2">Access Level</label>
                    <select id="access" class="border border-gray-300 rounded w-full py-3 px-4 text-lg"
                        v-model="collaboratorAccessSelect">
                        <option>read</option>
                        <option>write</option>
                    </select>
                </div>

                <!-- Action Buttons -->
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



      <div
        v-if="editCollabModal"
        class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg w-90">
          <h2 class="text-xl font-semibold mb-4">Change Access Rights</h2>
          <p class="text-base mb-4">
            Do you want to change access right of
            <strong>{{ collaboratorEditAccessUser }}</strong> to:
            <span class="text-blue-600">{{ collaboratorEditAccess }}</span>
          </p>

          <div class="mb-4">
            <label
              for="access"
              class="block text-base font-medium text-gray-700 mb-1"
              >Select Access:</label
            >
            <select
              id="access"
              v-model="collaboratorEditAccess"
              class="w-full p-2 border border-gray-300 rounded-md text-base"
            >
              <option value="read">Read</option>
              <option value="write">Write</option>
            </select>
          </div>

          <div class="flex justify-end space-x-4">
            <button
              class="bg-green-500 text-white px-4 py-2 rounded-md text-base hover:bg-green-600"
              v-on:click="editCollabAccess(collaboratorEditAccessOid)"
            >
              Confirm
            </button>
            <button
              class="bg-red-500 text-white px-4 py-2 rounded-md text-base hover:bg-red-600"
              v-on:click="editCollabModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="deleteCollabModal"
        class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div class="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 class="text-2xl font-semibold mb-6 text-red-600">
            Remove Collaborator
          </h2>
          <p class="text-lg mb-6">
            Do you want to remove
            <strong>{{ collaboratorDeleteUser }}</strong> from the board?
          </p>

          <div class="flex justify-end space-x-6">
            <button
              class="bg-green-500 text-white px-6 py-3 rounded-md text-lg hover:bg-green-600"
              v-on:click="deleteCollab(collaborator.oid)"
            >
              Confirm
            </button>
            <button
              class="bg-red-500 text-white px-6 py-3 rounded-md text-lg hover:bg-red-600"
              v-on:click="deleteCollabModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.placeholder {
  color: red;
}
</style>
