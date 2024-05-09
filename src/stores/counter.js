// import { ref, computed } from 'vue'
// import { defineStore } from 'pinia'

// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(0)
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }

//   return { count, doubleCount, increment }
// })
import { ref } from "vue"
export let isAdd = ref(false)
export let isDelete = false
export let newTitle = ref("")
export let isEdit = ref(false)
export let refresh = ref(true)
