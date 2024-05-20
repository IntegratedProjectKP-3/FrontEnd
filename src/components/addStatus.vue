<script setup>
import { ref } from "vue";
import router from "@/router/index.js";
import { isAdd, refresh, newStatus } from "@/stores/counter.js";
const name = ref("");
const description = ref("");
const isStatusNull = ref(false);
let statuses1 ={}
let dataJson = {}
const isExist = ref(false)
const overlimitField = ref(false)
const AddStatus = async() => {
  if (name.value === null || name.value === "" ||name.value.trim() === "") {
    isStatusNull.value = true;
    isExist.value = false
    return;
  }
  const data = await fetch(`${import.meta.env.VITE_BASE_URL}/statuses`)
   dataJson = await data.json()
   statuses1 = dataJson
   console.log(statuses1);
  if (statuses1.some(status => status.statusName === name.value.trim())) {
    isExist.value = true
    isStatusNull.value = false;
    console.log(isExist.value);
    return;
  }
  console.log(`name length : ${name.value.length}`);
  console.log(`description length: ${description.value.length}`);
  const trimName = name.value.trim()
  const trimDescription = description.value.trim()
   if(trimName.length > 50 || trimDescription.length > 200){
        overlimitField.value = true
        console.log(overlimitField.value);
        return;
    }
  //  else if (name.value.trim.length <= 50 && description.value.trim.length <= 200){
    overlimitField.value =false
    isStatusNull.value = false;
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
    console.log(overlimitField.value);
    fetch(`${import.meta.env.VITE_BASE_URL}/statuses`, requestOptions)
      .then((Response) => Response.json());
    router.push("/status").then(() => {
      location.reload();
      isAdd.value = true;
      console.log(name.value);
      console.log(description.value);
    });
  }

</script>
<template>
  <div class="itbkk-modal-status">
    New Status
    <p class="text-red-600" v-if="isExist">status name is already exist</p>
    <p class="text-red-600" v-if="overlimitField">some field is overlimit char</p>
    <p>Status Name</p>
    <textarea
      placeholder="Enter status name..."
      class="min-w-[300px] min-h-[50px] rounded-lg p-2 itbkk-status-name"
      v-model="name"
    ></textarea>
    <p class="mt-2 text-sm text-red-600 dark:text-red-500" v-if="isStatusNull === true">
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
