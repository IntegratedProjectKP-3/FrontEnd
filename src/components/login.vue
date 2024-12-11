<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import router from "@/router/index.js";
import { getUsername, token, saveLocalStorage, getLocalStorage } from "@/stores/counter";
import { isEmpty } from "lodash";
const invalidPassword = ref(false)
const invalidUsername = ref(false)
const username = ref("")
const password = ref("");
const passwordFieldType = ref("password");
const is401 = ref(false)
const isDisable = ref(false)


async function login() {
  
  if (username.value !== null || username.value.length !== 0 || username.value.length <= 50) {
    if (password.value !== null || password.value.length !== 0 || password.value.length <= 14) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            userName: `${username.value}`,
            password: `${password.value}`
          }
        ),
      };

      fetch(
        import.meta.env.VITE_BASE_URL + `/auth/login`, requestOptions
      )
        .then(response => {
          if (response.status === 401 || response.status === 400) {
            is401.value = true
            console.log('Unauthorized: Invalid credentials')
          } else {
            return response.json()
          }
        })
        .then(async (Token) => {
          if (Token) {
            
            console.log('----------------')
            console.log(Token)
            const accessToken = Token.access_token;
            const refreshToken = Token.refresh_token;

            const decodedToken = atob(accessToken.split('.')[1])
            const Jsondecode = JSON.parse(decodedToken)
            token.value = Token.access_token

            saveLocalStorage("token", accessToken)
            saveLocalStorage("refreshToken", refreshToken)
            getUsername.value = Jsondecode.name
            console.log('---------------------------------------------------')
            console.log(getLocalStorage("token"));
            console.log(getLocalStorage("refreshToken"));
            const boards = ref()
            router.replace(`/board`)

            fetch(import.meta.env.VITE_BASE_URL + "/boards", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getLocalStorage("token"),
              }
            })
              // .then(response => response.json()) 
              .then(data => {
                boards.value = data;
                console.log(boards.value);
                if (boards.value.length > 0) {
                  const lastItem = boards.value[boards.value.length - 1];
                  if (lastItem.id !== undefined) {
                    fetch(import.meta.env.VITE_BASE_URL + `/boards/${lastItem.id}/tasks`, {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + getLocalStorage("token"),
                      }
                    })
                      // .then(response => response.json()) 
                      .then(data => {
                        const AData = data
                        if (AData !== undefined && AData.length > 0) {
                          router.replace(`/board/${lastItem.id}/task`);
                        }
                        else {
                          console.log("AData === null");
                          if (
                            getLocalStorage(
                              "checkTaskCreate") !== null &&
                            getLocalStorage("checkTaskCreate") !== ""

                          ) {
                            console.log("bId");
                            const bId = boards.value.find(board => board.id);
                            console.log(bId);
                            router.replace(`/board/${bId.id}/task`);
                          }
                        }
                      })
                  } else {
                    console.log("last item === null");
                    router.replace(`/board`);
                  }
                } else {
                  router.replace(`/board`);
                }
              })
              .catch(error => {
                console.error("Error fetching boards:", error);
              });
          }
        })
      console.log("board.value else");
      router.replace(`/board`)
    }
    else {
      isDisable.value = true
    }
  }
  else {
    isDisable.value = true
  }
};


function switchVisibility() {
  if (passwordFieldType.value === "password") {
    passwordFieldType.value = "text"
  } else {
    passwordFieldType.value = "password"
  }
}


if (username.value === null || username.value.length === 0 || username.value.length > 50 || password.value === null || password.value.length === 0 || password.value.length > 14) {
  console.log("isDisable = true (username)");
  isDisable.value = true
} else {
  console.log("isDisable = false (username)");
  isDisable.value = false
}


function limitUsername() {
  const max = 50
  if (username.value.length > max) {
    username.value = username.value.substr(0, max)
  }
  if (username.value === null || username.value.length === 0 || username.value.length > 50 || password.value === null || password.value.length === 0 || password.value.length > 14) {
    isDisable.value = true
  } else {
    isDisable.value = false
  }

}


function limitPassword() {
  const max = 14
  if (password.value.length > max) {
    password.value = password.value.substr(0, max)
  }
  if (username.value === null || username.value.length === 0 || username.value.length > 50 || password.value === null || password.value.length === 0 || password.value.length > 14) {
    isDisable.value = true
  } else {
    isDisable.value = false
  }

}


</script>



<template>
  <div class="flex items-center justify-center min-h-screen flex-col bg-gradient-to-b from-blue-100 to-purple-200">
    <h1 class="font-serif text-4xl p-4 text-gray-800 font-bold">Welcome To ITB-KK</h1>
    <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
      <h1 class="itbkk-message text-red-600 text-center" v-if="invalidUsername">Invalid username</h1>
      <h1 class="itbkk-message text-red-600 text-center" v-if="invalidPassword">Invalid password</h1>
      <h1 class="itbkk-message text-red-600 text-center" v-if="is401">Username or Password is incorrect</h1>
      <div class="mb-4">
        <h3 class="font-serif text-xl text-gray-700 text-center mb-2">Username</h3>
        <input
          class="itbkk-username border border-gray-300 rounded-lg w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          @keyup="limitUsername" @keydown="limitUsername" @keypress="limitUsername()" v-model="username"
          placeholder="Enter your username">
      </div>
      <div class="mb-4">
        <h3 class="font-serif text-xl text-gray-700 text-center mb-2">Password</h3>
        <div class="relative">
          <input
            class="itbkk-password border border-gray-300 rounded-lg w-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            :type="passwordFieldType" @keyup="limitPassword" @keydown="limitPassword" @keypress="limitPassword()"
            v-model="password" placeholder="Enter your password">
          <button type="button" class="absolute right-3 top-2.5 text-gray-500 hover:text-gray-800"
            @click="switchVisibility()">

            {{ passwordFieldType === 'password' ? 'Show' : 'Hide' }}
          </button>
        </div>
      </div>
      <div class="flex justify-center mt-4">
        <button
          class="itbkk-button-signin bg-purple-500 text-white font-serif font-medium rounded-lg px-6 py-2 shadow-md hover:bg-purple-600 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          :class="[isDisable ? 'disabled' : '']" :disabled="isDisable" @click="login()">

          Login
        </button>
      </div>
    </div>
  </div>



</template>


<style>



</style>