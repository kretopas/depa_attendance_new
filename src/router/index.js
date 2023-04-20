import { createRouter, createWebHistory } from 'vue-router'
import AttendancePage from '@/views/AttendancePage.vue';
import HistoryPage from '@/views/HistoryPage.vue';

const routes = [
  {
    path: '/',
    name: 'attendancePage',
    component: AttendancePage,
    meta: {
      requiresUser: true
    }
  },
  {
    path: '/history',
    name: 'historyPage',
    component: HistoryPage,
    meta: {
      requiresUser: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
