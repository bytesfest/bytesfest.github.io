<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const route = useRoute()
let lenisInstance: Lenis | null = null
let tickerHandler: ((time: number) => void) | null = null

// Hide navbar and footer on countdown page
const showNavbar = computed(() => route.name !== 'countdown')
const showFooter = computed(() => route.name !== 'countdown')

onMounted(() => {
  // Initialize Lenis smooth scroll
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom ease out expo
    smoothWheel: true,
  })

  // Synchronize ScrollTrigger with Lenis scroll events
  lenisInstance.on('scroll', ScrollTrigger.update)

  // Use GSAP ticker to drive Lenis's raf loop
  tickerHandler = (time: number) => {
    lenisInstance?.raf(time * 1000)
  }
  gsap.ticker.add(tickerHandler)
  gsap.ticker.lagSmoothing(0)

  // Listen to route changes to reset scroll position and refresh ScrollTrigger
  router.afterEach((to, from) => {
    const isCompetitionNav = from.path.startsWith('/kompetisi/') && to.path.startsWith('/kompetisi')

    if (!isCompetitionNav) {
      lenisInstance?.scrollTo(0, { immediate: true })
    }

    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
  })
})

onUnmounted(() => {
  if (tickerHandler) {
    gsap.ticker.remove(tickerHandler)
  }
  lenisInstance?.destroy()
  lenisInstance = null
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-brand-cream/10">
    <!-- Navigation Bar -->
    <Navbar v-if="showNavbar" />

    <!-- Main Content Area with Page Transitions -->
    <main class="flex-grow">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <Footer v-if="showFooter" :noMargin="route.name === 'kompetisi-detail'" />
  </div>
</template>

<style>
/* Base/Global transition animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
