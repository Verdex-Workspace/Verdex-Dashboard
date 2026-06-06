import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

/**
 * Routes des modules du dashboard. Les `name` correspondent aux `id` de la
 * navigation (src/data/navigation.ts) pour le surlignage et le fil d'Ariane.
 * Les vues sont chargées à la demande (code-splitting).
 */
const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/overview' },
  {
    path: '/overview',
    name: 'overview',
    component: () => import('@/views/OverviewView.vue'),
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsView.vue'),
  },
  {
    path: '/performance',
    name: 'performance',
    component: () => import('@/views/PerformanceView.vue'),
  },
  {
    path: '/logs',
    name: 'logs',
    component: () => import('@/views/LogsView.vue'),
  },
  {
    path: '/automations',
    name: 'automations',
    component: () => import('@/views/AutomationsView.vue'),
  },
  {
    path: '/ticketing',
    name: 'ticketing',
    component: () => import('@/views/TicketingView.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/AdminView.vue'),
  },
  {
    path: '/cyber',
    name: 'cyber',
    component: () => import('@/views/CyberView.vue'),
  },
  {
    path: '/proton',
    name: 'proton',
    component: () => import('@/views/ProtonView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
