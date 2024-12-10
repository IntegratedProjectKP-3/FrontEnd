import { getLocalStorage, saveLocalStorage } from "../stores/counter.js";


function signOut() {
  // console.log("clicked logout")
  localStorage.clear();
  window.location.reload();
}

export async function tokenCheck(){
    await fetch(import.meta.env.VITE_BASE_URL + "/auth/validate-token", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage("token"), //use this one when not testing

          //Authorization: "Bearer " + "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiU1RVREVOVCIsImlzcyI6Imh0dHA6Ly9pbnRwcm9qMjMuc2l0LmttdXR0LmFjLnRoL2twMy8iLCJuYW1lIjoiVE1QIEpQZGgxUmFLZXIiLCJvaWQiOiI3ZjU4Y2E5ZC1iYzMxLTRiYmQtYjQyZi05NDQyM2FiNGQ2NWQiLCJlbWFpbCI6InRtcC5KUGRoMVJhS2VyQGlwMjNmdC5zaXQua211dHQuYWMudGgiLCJzdWIiOiJ0bXAuSlBkaDFSYUtlciIsImlhdCI6MTczMDE5MjM4MCwiZXhwIjoxNzMwMjc4NzgwfQ.AfNhVkpLTkvAQg6XhT7UTyPHMpOZGCZImsjuJMwG0v4",  //for testing invalid token
          // for testing expired token                                 
        },
    
      })
      .then(async response => {
          if(response.ok){

            console.log("respond from fetching validate-token is OK")
            // console.log(response)
    
          } else {
            console.log("respond from fetching validate-token is NOT OK / invalid or expired")
            //Token is invalid or expired
    
            await fetch(import.meta.env.VITE_BASE_URL +'/auth/token', {
              method: "POST",
              headers: {
                Authorization: "Bearer " + getLocalStorage('refreshToken') , 
              },
            })
            .then(async response => {
              if (response.ok) {
                const newTokenResponse = await response.json()
                console.log(newTokenResponse)
    
                saveLocalStorage("token",newTokenResponse.access_token)
              } else {
                // Handle error, e.g., redirect to login
                signOut()
                router.replace("/login");
              }
            })
    
    
          }
      }) //then
}
