import { ref } from "vue"
export let isAdd = ref(false)
export let isDelete = false
export let newTitle = ref("")
export let isEdit = ref(false)
export let refresh = ref(true)
export let newStatus = ref("")
export let getUsername = ref("")
export let token = ref("")
export let sortConut = ref(0)
export let page = ref("")
export const saveLocalStorage = (Localtoken,value)=>{
    localStorage.setItem(Localtoken,value)
}
export const getLocalStorage = (token)=>{
    return localStorage.getItem(token)
}