<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Status from "./status.vue";
import router from "@/router/index.js";
import { newStatus, isEdit } from "@/stores/counter.js";
const name = ref("");
const description = ref("");
const isStatusNull = ref(true);
const statuses = ref({});
const status = ref();
const route = useRoute();
const is404 = ref(true)
const defaultName = ref()
const defaultDescription = ref()
onMounted(async () => {
  try{
  const data = await fetch(`http://localhost:8080/itb-kk/v2/statuses`);
  if(!data.ok){
    is404.value = true
      console.log(is404.value);
      throw new Error(err)
    }
    else{
    console.log(is404.value);
    statuses.value = await data.json();
  status.value = statuses.value.find(
    (status) => status.statusId == route.params.id
  );
  defaultName.value = status.value.statusName;
  defaultDescription.value = status.value.statusDescription;
  name.value = status.value.statusName;
  description.value = status.value.statusDescription;
  is404.value = false
  console.log(name.value);
  console.log(description.value);
  console.log(route.params.id);
    }
  }catch(err){
    is404.value = true
    window.alert("An error has occurred, the status does not exist")
    router.push("/status")
  }
});
const editStatus = async () => {
  if (name.value === null || name.value === "") {
    isStatusNull.value = true;
    console.log(isStatusNull);
  } else {
    isStatusNull.value = false;
    console.log(isStatusNull.value);
    isEdit.value = true;
    newStatus.value = name.value;
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          statusId: route.params.id,
          statusName: name.value,
          statusDescription: description.value,
        }
      ])
    };
    fetch(
      `http://localhost:8080/itb-kk/v2/statuses/${route.params.id}`,
      requestOptions
    )
      // fetch(`http://ip23kp3.sit.kmutt.ac.th:8080/itb-kk/v2/tasks/${route.params.id}`,requestOptions)
      .then((Response) => Response.json());
    router.push("/status").then(() => {
      location.reload();
      location.reload();
    }
  );
  }
}

</script>
<template>
  <div class="itbkk-modal-status">
    <div v-if="is404 === true " >
      <p class="text-red-600 text-xl itbkk-message">An error has occurred, the status does not exist</p>
  </div>
    <div v-if="is404 === false">
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
          @click="editStatus()"
          class="bg-green-500 rounded-lg px-3 py-2 hover:bg-green-800 font-black itbkk-button-confirm disabled"
          :disabled="name === '' || name === null ||  (name === defaultName && description === defaultDescription) "
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
  </div>
</template>
<style></style>
