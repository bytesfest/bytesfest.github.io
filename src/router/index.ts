import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // Scroll behavior to scroll back to top on route change
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // Add this block ↓
    if (from.path.startsWith('/kompetisi/') && to.path.startsWith('/kompetisi/')) {
      return false
    }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/tentang',
      name: 'tentang',
      component: () => import('../views/TentangView.vue'),
    },
    {
      path: '/kompetisi/:id',
      name: 'kompetisi-detail',
      component: () => import('../views/KompetisiDetailView.vue'),
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/FAQView.vue'),
    },
    {
      path: '/daftar',
      name: 'daftar',
      component: () => import('../views/DaftarView.vue'),
    },
    {
      path: '/countdown',
      name: 'countdown',
      component: () => import('../views/CountdownView.vue'),
    },
    // 404 Not Found page
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ],
})

// Reset scroll natively before each navigation hook to avoid GSAP content flash/jank
router.beforeEach((to, from, next) => {
  // Only reset scroll if not navigating between competition detail pages
  const isCompetitionDetailNav = 
    from.path.startsWith('/kompetisi/') && 
    to.path.startsWith('/kompetisi/')
  
  if (!isCompetitionDetailNav) {
    window.scrollTo(0, 0)
  }
  
  // Handle GitHub Pages 404 redirect
  const redirect = sessionStorage.getItem('redirect')
  if (redirect) {
    sessionStorage.removeItem('redirect')
    // Remove the base path from the redirect if present
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '') // Remove trailing slash
    let cleanPath = redirect
    if (redirect.startsWith(basePath)) {
      cleanPath = redirect.slice(basePath.length)
    }
    // Ensure cleanPath starts with /
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath
    }
    if (cleanPath !== to.path) {
      next(cleanPath || '/')
      return
    }
  }
  
  // Date-based access control for grand opening
  const indonesiaDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Jakarta'
  })
  const currentDate = new Date(indonesiaDate)
  const july5th2026 = new Date('2026-07-05T00:00:00.000Z')
  
  // Check if it's before, on, or after July 5th, 2026
  const isBeforeJuly5th = currentDate < july5th2026
  const isAfterJuly5th = currentDate > july5th2026
  
  // Before July 5th: Only allow countdown page
  if (isBeforeJuly5th) {
    if (to.name === 'countdown') {
      next()
      return
    }
    next({ name: 'countdown' })
    return
  }
  
  // After July 5th: Countdown page not accessible
  if (isAfterJuly5th) {
    if (to.name === 'countdown') {
      next({ name: 'home' })
      return
    }
    next()
    return
  }
  
  // On July 5th: Allow all pages
  next()
})

export default router
