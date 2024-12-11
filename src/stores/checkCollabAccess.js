import { ref } from "vue"
import { useRoute } from "vue-router"
import { getLocalStorage } from "./counter"

const route = useRoute()
const collabList = ref()
const user = ref()

export async function getCollabAccess(params) {

    let decodedToken = atob(getLocalStorage("token").split('.')[1])
    let Jsondecode = JSON.parse(decodedToken)
    user.value = Jsondecode.name

    await fetch(import.meta.env.VITE_BASE_URL + `/boards/${params}/collabs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getLocalStorage("token"),
        },
      })
      .then(async (response)=> {
          if(response.ok){
              let data = await response.json()
              collabList.value = data
          }
      })

      let tempCollab;

      collabList.value.forEach(collab => {
        // console.log(collab)

        if(collab.boardId == params && collab.name == user.value){
            console.log("collaborator board access is: " + collab.access)
  
            tempCollab = collab.access
        }
      })
      
      return tempCollab

}