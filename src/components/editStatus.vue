<script setup>
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import router from "@/router/index.js"
import { newStatus, isEdit, getUsername, page, token, getLocalStorage } from "@/stores/counter.js"
import { tokenCheck } from "@/stores/tokenCheck.js";

const name = ref("")
const description = ref("")
const isStatusNull = ref(true)
const statuses = ref({})
const status = ref()
const route = useRoute()
const is404 = ref(true)
const defaultName = ref()
const defaultDescription = ref()


onMounted(async () => {
  const route = useRoute()
  if (!getLocalStorage("token")) {
    page.value = route.path
    // console.log(route.path)
    router.replace("/login")
  } else {
    //instant access code ↓
    tokenCheck()

    const statusResponse = await fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/statuses`, {
      headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token")
      }
    })

    if (statusResponse.ok) {
      const data = await statusResponse.json()
      if (data && Array.isArray(data) && data.length > 0) {
        // console.log('Data:', data)
        statuses.value = data
        status.value = statuses.value.find((status) => status.id == route.params.id)
        if (status.value) {
          defaultName.value = status.value.name
          defaultDescription.value = status.value.description
          name.value = status.value.name
          description.value = status.value.description
          is404.value = false
          // console.log(name.value)
          // console.log(description.value)
          // console.log(route.params.id)
        }
      } else {
        // console.log('No data available')
        router.replace('/login')
      }
    } else {
      console.error('Failed to fetch data:', statusResponse.status)
      router.replace('/login')
    }
  }
})




async function editStatus() {
  if (name.value === null || name.value === "") {
    isStatusNull.value = true;
    // console.log(isStatusNull);
  } else {
    isStatusNull.value = false;
    // console.log(isStatusNull.value);
    isEdit.value = true;
    newStatus.value = name.value;
    // console.log(name.value);
    // console.log(description.value);
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + getLocalStorage("token")
      },
      body: JSON.stringify(
        {
          // id: route.params.id,
          name: `${name.value} for ${route.params.boardId}}`,
          description: description.value,
        }
      )
    };
    // console.log(requestOptions);
    fetch(
      import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/statuses/${route.params.id}`,
      requestOptions
    )
      .then((Response) => Response.json());
    router.replace(`/board/${route.params.boardId}/status`)
      .then(() => {
        // location.reload()
        return fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/statuses`, {
          headers: {
            'Authorization': 'Bearer ' + getLocalStorage("token")
          }
        });
      })
      .then(response => response.json())
      .then(data => {
        location.reload()
        statuses.value = data;
      })
      .catch(error => {
        console.error("Error fetching statuses:", error);
      });
  }
}

</script>
<template>
  <div class="itbkk-modal-status">
    <div v-if="is404 === true">
      <p class="text-red-600 text-xl itbkk-message">An error has occurred, the status does not exist</p>
    </div>
    <div v-if="is404 === false">
      New Status
      <p>Status Name</p>
      <textarea placeholder="Enter status name..." class="min-w-[300px] min-h-[50px] rounded-lg p-2 itbkk-status-name"
        v-model="name"></textarea>
      <p class="mt-2 text-sm text-red-600 dark:text-red-500" v-if="isStatusNull">
        <span class="font-medium">Status name can't be empty</span> Please enter
        Status name.
      </p>
      <p class="pb-[10px]">Status Description</p>
      <textarea placeholder="Enter status description..."
        class="min-w-[1000px] min-h-[300px] rounded-lg p-2 itbkk-status-description" v-model="description"></textarea>
      <div class="pt-[200px] flex justify-center">
        <!-- <button class="bg-blue-500 px-3 py-2 rounded-lg" @click="checkJSON" >Check json</button> -->
        <div class="px-2">
          <button @click="editStatus()"
            class="bg-green-500 rounded-lg px-3 py-2 hover:bg-green-800 font-black itbkk-button-confirm disabled"
            :disabled="name === '' || name === null || (name === defaultName && description === defaultDescription)">
            Save
          </button>
        </div>
        <div class="px-2">
          <button class="bg-red-600 rounded-lg px-3 py-2 hover:bg-red-800 font-black itbkk-button-cancel"
            @click="router.replace(`/board/${route.params.boardId}/status`)">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
