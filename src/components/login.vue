<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import router from "@/router/index.js";
import { getUsername,token,saveLocalStorage,getLocalStorage } from "@/stores/counter";
const invalidPassword = ref(false)
const invalidUsername = ref(false)
const username = ref("")
const password = ref(""); 
const passwordFieldType = ref("password");
const is401 = ref(false)
const isDisable = ref(false)
console.log(import.meta.env.VITE_BASE_URL);
const login = async () => {
  console.log(username.value);
  // console.log(password.value);
  if(username.value !== null || username.value.length !== 0 || username.value.length <= 50){
       if (password.value !== null || password.value.length !== 0 || password.value.length <= 14){
      const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          userName:`${username.value}`,
          password:`${password.value}`
        }
      ),
    };
  fetch(
      import.meta.env.VITE_BASE_URL  + `/auth/login`,
      requestOptions
    )  
    .then(response => {
      console.log("fetching");
    if (response.status === 401 || response.status === 400) {
      is401.value = true
      console.log('Unauthorized: Invalid credentials')
    } else {
      return response.json()
    }
       })
       .then(Token => {
  if (Token) {
    console.log(Token);
    const accessToken = Token.access_token;
    const decodedToken = atob(accessToken.split('.')[1])
    const Jsondecode = JSON.parse(decodedToken)
    console.log(Jsondecode.name);
    token.value = Token.access_token
    saveLocalStorage("token",Token.access_token)
    getUsername.value = Jsondecode.name
    console.log(getLocalStorage("token"))
    router.push("/boards")
  }
})

  }
  else{
    isDisable.value = true
  }
  }
  else{
    isDisable.value = true
  }
};
function switchVisibility(){
  if(passwordFieldType.value === "password"){
    passwordFieldType.value = "text"
  }else{
    passwordFieldType.value = "password"
  }
}
if(username.value === null || username.value.length === 0 || username.value.length >50|| password.value === null || password.value.length === 0 || password.value.length > 14){
  console.log("isDisable = true (username)");
  isDisable.value = true
}else{
  console.log("isDisable = false (username)");
  isDisable.value = false
}
function limitUsername(){
  const max = 50
  if (username.value.length > max){
    username.value = username.value.substr(0,max) 
  }
  if(username.value === null || username.value.length === 0 || username.value.length >50 || password.value === null || password.value.length === 0 || password.value.length > 14){
  isDisable.value = true
}else{
  isDisable.value = false
}

}
function limitPassword(){
  const max = 14
  if (password.value.length > max){
    password.value = password.value.substr(0,max) 
  }
  if(username.value === null || username.value.length === 0 || username.value.length >50 || password.value === null || password.value.length === 0 || password.value.length > 14){
  isDisable.value = true
}else{
  isDisable.value = false
}

}
</script>
<template>
  <div class="flex items-center justify-center min-h-screen flex-col">
    <h1 class="flex justify-center text-3xl p-2">Welcome To ITB-KK</h1>
    <h1 class="itbkk-message text-red-600" v-if="invalidUsername">invaid username</h1>
    <h1 class="itbkk-message text-red-600" v-if="invalidPassword">invaid password</h1>
    <h1 class="itbkk-message text-red-600" v-if="is401">Username or Password is incorrect</h1>
    <h3 class="flex justify-center p-2">Username</h3>
    <div class=" flex justify-center p-2">
        <input class="itbkk-username bg-white py-2 px-8" @keyup="limitUsername" @keydown="limitUsername" @keypress="limitUsername()" v-model="username">
    </div>
    <h3 class="flex justify-center">Password</h3>
    <div class=" flex justify-center p-2">
        <input class="itbkk-password" :type=passwordFieldType @keyup="limitPassword" @keydown="limitPassword" @keypress="limitPassword()" v-model="password">
  <button type="password" class="" @click="switchVisibility()">show / hide</button>
    </div>
    <div class="flex justify-center p-2" >
    <!-- <button class="itbkk-button-signin bg-purple-500 rounded-lg px-20 py-2 text-black disabled:bg-gray-500 disabled:text-red-700" :class="[isDisabled ? ['disable', 'disabled'] : '']"
    @click="login()"
      :disabled="username === '' || username === null || password === '' || password === null"
    > -->
    <button class="itbkk-button-signin bg-purple-500 rounded-lg px-20 py-2 text-black disabled:bg-gray-500" 
    :class="[isDisable ? 'disabled' : '']" :disabled="isDisable" @click="login()" >
        login
    </button>
    </div>
  </div>
</template>
<style></style>