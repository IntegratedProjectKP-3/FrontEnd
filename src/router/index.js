import { createRouter, createWebHistory } from "vue-router"
import Homepage from "@/components/homepage.vue"
import tasks from "@/components/taskId.vue"
import add from "@/components/addtask.vue"
import edittask from "@/components/edittask.vue"
import status from "@/components/status.vue"
import addStatus from "@/components/addStatus.vue"
import editStatus from  "@/components/editStatus.vue"
import login from "@/components/login.vue"
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
      redirect:"/login"
    },
    {
      path:"/task/:id/add",
      name: "add",
      component:add
    },{
      path:"/task/:id/edit",
      name:"edit",
      component:edittask
    },{
      path:"/status/:id/edit",
      name:"editStatus",
      component:editStatus
    },{
      path:"/status",
      name:"status",
      component:status
    },{
      path:"/status/add",
      name:"addStatus",
      component:addStatus
    }
    ,{
      path:"/login",
      name:"login",
      component:login
    }
  ]
})

export default router
