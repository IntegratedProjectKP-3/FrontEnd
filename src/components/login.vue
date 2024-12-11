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
  <div class="flex items-center justify-center min-h-screen flex-col">
    <h1 class="font-serif flex justify-center text-4xl p-2 ">Welcome To ITB-KK</h1>
    <h1 class="itbkk-message text-red-600" v-if="invalidUsername">invaid username</h1>
    <h1 class="itbkk-message text-red-600" v-if="invalidPassword">invaid password</h1>
    <h1 class="itbkk-message text-red-600" v-if="is401">Username or Password is incorrect</h1>
    <h3 class="font-serif flex justify-center p-2 text-xl">Username</h3>
    <div class=" flex justify-center p-2">
      <input class="itbkk-username  border-black border bg-white py-2 px-8" @keyup="limitUsername"
        @keydown="limitUsername" @keypress="limitUsername()" v-model="username">
    </div>
    <h3 class="font-serif flex justify-center text-xl">Password</h3>
    <div class=" flex justify-center p-2">
      <input class="itbkk-password" :type=passwordFieldType @keyup="limitPassword" @keydown="limitPassword"
        @keypress="limitPassword()" v-model="password">
      <button type="password" class="font-serif" @click="switchVisibility()">show / hide</button>
    </div>
    <div class="flex justify-center p-2">




      <button class="itbkk-button-signin font-serif bg-purple-500 rounded-lg px-20 py-2 text-black disabled:bg-gray-500"
        :class="[isDisable ? 'disabled' : '']" :disabled="isDisable" @click="login()">
        Login 
      </button>


    </div>
  </div>
</template>


<style>



</style>