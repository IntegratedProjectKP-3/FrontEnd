<script setup>
import { ref } from "vue";
import router from "@/router/index.js";
import { isAdd, refresh, newStatus } from "@/stores/counter.js";
const name = ref("");
const description = ref("");
const isStatusNull = ref(true);
const AddStatus = () => {
  if (name === null || name === "") {
    isStatusNull === true;
  } else {
    isStatusNull === false;
    newStatus.value = name.value;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          statusName: `${name.value.trim()}`,
          statusDescription: `${description.value.trim()}`,
        },
      ]),
    };
    fetch(import.meta.env.VITE_BASE_URL  + `/statuses`, requestOptions)
      // fetch(`http://ip23kp3.sit.kmutt.ac.th:8080/itb-kk/v2/statuses`,requestOptions)
      .then((Response) => Response.json());
    router.push("/status").then(() => {
      location.reload();
      isAdd.value = true;
      console.log(name.value);
      console.log(description.value);
    });
  }
};
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
          @click="router.push('/status')"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
<style></style>
