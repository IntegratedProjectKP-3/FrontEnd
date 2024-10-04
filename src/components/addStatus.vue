<script setup>
import { useRoute } from "vue-router";
import { ref,onMounted,watchEffect } from "vue";
import router from "@/router/index.js";
import { isAdd, refresh, newStatus,getUsername,page,token,getLocalStorage } from "@/stores/counter.js";
const name = ref("");
const description = ref("");
const isStatusNull = ref(true); 
 const route = useRoute()
 const statuses = ref({})
onMounted(async () => {
  if (getLocalStorage("token") === null || getLocalStorage("token") === "") {
    page.value = route.path;
    console.log(route.path);
    router.push("/login");
  }
});
const AddStatus = () => {
  if (name.value === null || name.value.trim() === "") {
    isStatusNull.value = true;
  } else {
    console.log(getLocalStorage("token"));
    isStatusNull.value = false;
    newStatus.value = name.value.trim();
    console.log(newStatus.value);

    const requestOptions = {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + getLocalStorage("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `${name.value.trim()} for ${route.params.boardId}`,
        description: `${description.value.trim()}`,
      }),
    };

    fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/statuses`, requestOptions)
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(JSON.stringify(err));
          });
        }
        return response.json();
      })
      .then(data => {
        console.log("Status created:", data);
        fetchStatus(); 
      })
      .catch(error => {
        const err = JSON.parse(error.message);
        console.error("Validation error:", err);
                err.errors.forEach(e => {
          console.log(`Field: ${e.field}, Error: ${e.defaultMessage}`);
        });
      });

    console.log(`name: ${name.value.trim()}`);
    console.log(`description: ${description.value.trim()}`);
    console.log(requestOptions);
  }
};
function fetchStatus() {
  router.replace(`/board/${route.params.boardId}/status`)
    .then(() => {
      console.log('Navigation finished');
      return fetch(import.meta.env.VITE_BASE_URL + `/boards/${route.params.boardId}/statuses`, {
        headers: {
          'Authorization': 'Bearer ' + getLocalStorage("token")
        }
      });
    })
    .then(response => response.json())
    .then(data => {
      statuses.value = data;
    })
    .catch(error => {
      console.error("Error fetching statuses:", error);
    });
}
</script>
<template>
  <div class="itbkk-modal-status">
    New Status
    <p>Status Name</p>
    <textarea
      placeholder="Enter status name..."
      class="min-w-[300px] min-h-[50px] rounded-lg p-2 itbkk-status-name"
      v-model="name"
    ></textarea>
    <p class="mt-2 text-sm text-red-600 dark:text-red-500" v-if="isStatusNull">
      <span class="font-medium">Status name can't be empty</span> Please enter
      Status name.
    </p>
    <p class="pb-[10px]">Status Description</p>
    <textarea
      placeholder="Enter status description..."
      class="min-w-[1000px] min-h-[300px] rounded-lg p-2 itbkk-status-description"
      v-model="description"
    ></textarea>
    <div class="pt-[200px] flex justify-center">
      <!-- <button class="bg-blue-500 px-3 py-2 rounded-lg" @click="checkJSON" >Check json</button> -->
      <div class="px-2">
        <button
          @click="AddStatus()"
          class="bg-green-500 rounded-lg px-3 py-2 hover:bg-green-800 font-black itbkk-button-confirm disabled"
          :disabled="name === ''"
        >
          Save
        </button>
      </div>
      <div class="px-2">
        <button
          class="bg-red-600 rounded-lg px-3 py-2 hover:bg-red-800 font-black itbkk-button-cancel"
          @click="router.replace(`/board/${route.params.boardId}/status`)"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
<style></style>
