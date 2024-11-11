import { createRouter, createWebHistory } from "vue-router"
import Homepage from "@/components/homepage.vue"
import tasks from "@/components/taskId.vue"
import add from "@/components/addtask.vue"
import edittask from "@/components/edittask.vue"
import status from "@/components/status.vue"
import addStatus from "@/components/addStatus.vue"
import editStatus from  "@/components/editStatus.vue"
import login from "@/components/login.vue"
import boards from "@/components/boards.vue"
import collaboratorManagement from "@/components/collaboratorManagement.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/board/:boardId/task",
      name: "home",
      component: Homepage
    },
    {
      path: "/board/:boardId",
      name: "tasks",
      component: Homepage
    },
    {
      path: '/board',
      name: 'boards',
      component: boards
    },
    {
      path: "/boards/:boardId/task/:id",
      name: "task",
      component: tasks
    },
    {
      path:"/",
      redirect:"/login"
    },
    {
      // path:"/boards/:boardId/task/:id/add",
      path:"/board/:boardId/task/add",
      name: "add",
      component:add
    },{
      path:"/board/:boardId/task/:id/edit",
      name:"edit",
      component:edittask
    },{
      path:"/board/:boardId/status/:id/edit",
      name:"editStatus",
      component:editStatus
    },{
      path:"/board/:boardId/status",
      name:"status",
      component:status
    },{
      path:"/board/:boardId/status/add",
      name:"addStatus",
      component:addStatus
    },{
      path:"/board/:boardId/collab",
      name:"collaboratorManagement",
      component:collaboratorManagement
    },{
      path:"/login",
      name:"login",
      component:login
    }
  ]
})

export default router
