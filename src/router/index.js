import { createRouter, createWebHistory } from "vue-router"
import Homepage from "@/components/homepage.vue"
import tasks from "@/components/taskId.vue"
import add from "@/components/addtask.vue"
import edittask from "@/components/edittask.vue"
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
    },
    {
      path:"/",
      redirect:"/task"
    },
    {
      path:"/task/:id/add",
      name: "add",
      component:add
    },{
      path:"/task/:id/edit",
      name:"edit",
      component:edittask
    }
  ]
})

export default router
