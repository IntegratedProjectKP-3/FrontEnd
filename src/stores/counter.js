import { ref } from "vue"
export let isAdd = ref(false)
export let isDelete = false
export let newTitle = ref("")
export let isEdit = ref(false)
export let refresh = ref(true)
export let newStatus = ref("")
export let sortConut = ref(0)
export const saveLocalStorage = (isEnable,value)=>{
    localStorage.setItem(isEnable,value)
}
export const getLocalStorage = (isEnable)=>{
    return localStorage.getItem(isEnable)
}
