import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * Routes des modules du dashboard. Les `name` correspondent aux `id` de la
 * navigation (src/data/navigation.ts) pour le surlignage et le fil d'Ariane.
 * Les vues sont chargées à la demande (code-splitting).
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { blank: true, public: true },
  },
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

/**
 * Garde d'authentification. En mode démo (Supabase non configuré), tout est
 * ouvert. Sinon, les routes privées exigent une session ; `/login` redirige
 * vers l'accueil si déjà connecté.
 */
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.init()

  if (auth.demoMode) {
    if (to.name === 'login') return { name: 'overview' }
    return true
  }

  if (!to.meta.public && !auth.isAuthenticated) return { name: 'login' }
  if (to.name === 'login' && auth.isAuthenticated) return { name: 'overview' }
  return true
})
