import { createRouter, createWebHistory } from "vue-router"
import Homepage from "@/components/homepage.vue"
import tasks from "@/components/taskId.vue"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/task",
      name: "home",
      component: Homepage
    },
    {
      path: "/task/:id",
      name: "task",
      component: tasks
    }
  ]
})

export default router
