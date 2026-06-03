<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import {
  GraduationCap,
  Users,
  Shield,
  BookOpen,
  Code,
  Megaphone,
  FileText,
  Globe,
} from 'lucide-vue-next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Countdown from '@/components/Countdown.vue'
import kompetisiData from '@/data/kompetisi.json'

const BASE_URL = import.meta.env.BASE_URL

gsap.registerPlugin(ScrollTrigger)

// Loading state
const isLoading = ref(true)

const route = useRoute()

// Map string keys to Lucide component references to avoid Vue 3 computed proxy issues
const iconMap: Record<string, any> = {
  GraduationCap,
  Users,
  Shield,
  BookOpen,
  Code,
  Megaphone,
  FileText,
  Globe,
}

const compId = computed(() => {
  // Read last segment of route path, e.g., 'hackathon'
  return route.path.split('/').pop() || 'creative-web'
})

const compData = computed(() => {
  return kompetisiData[compId.value as keyof typeof kompetisiData] || kompetisiData['creative-web']
})

const initAnimations = () => {
  gsap.fromTo(
    '.detail-fade',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    },
  )

  gsap.fromTo(
    '.criteria-card',
    { opacity: 0, y: 40 },
    {
      scrollTrigger: {
        trigger: '.criteria-grid',
        start: 'top 95%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
    },
  )

  // Desktop: Animate connecting line first (slide in from left)
  gsap.fromTo(
    '.timeline-line',
    { opacity: 0, scaleX: 0, transformOrigin: 'left center' },
    {
      scrollTrigger: {
        trigger: '.timeline-grid',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      scaleX: 1,
      duration: 0.8,
      ease: 'power2.out',
    },
  )

  // Desktop: Animate dots (scale up with slide)
  gsap.fromTo(
    '.timeline-dot',
    { opacity: 0, scale: 0, y: -20 },
    {
      scrollTrigger: {
        trigger: '.timeline-grid',
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.5)',
    },
  )

  // Desktop: Animate cards (slide up with fade)
  gsap.fromTo(
    '.timeline-card',
    { opacity: 0, y: 40, scale: 0.95 },
    {
      scrollTrigger: {
        trigger: '.timeline-grid',
        start: 'top 65%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power3.out',
    },
  )

  // Mobile: Animate vertical line (fade in)
  gsap.fromTo(
    '.timeline-vertical',
    { opacity: 0 },
    {
      scrollTrigger: {
        trigger: '.timeline-grid',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    },
  )

  // Mobile: Animate dots (scale in)
  gsap.fromTo(
    '.timeline-dot-mobile',
    { opacity: 0, scale: 0 },
    {
      scrollTrigger: {
        trigger: '.timeline-grid',
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      scale: 1,
      duration: 0.4,
      stagger: 0.1,
      ease: 'back.out(1.5)',
    },
  )

  // Mobile: Animate cards (slide in from left)
  gsap.fromTo(
    '.timeline-card-mobile',
    { opacity: 0, x: -30, scale: 0.95 },
    {
      scrollTrigger: {
        trigger: '.timeline-grid',
        start: 'top 65%',
        toggleActions: 'play none none none',
      },
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.5,
      stagger: 0.12,
      ease: 'power3.out',
    },
  )
}

onMounted(async () => {
  // Simulate loading
  setTimeout(async () => {
    isLoading.value = false
    await nextTick() // wait for Vue to render the real content
    initAnimations()
  }, 600)
})

// Watch for route changes to reset loading state when navigating between competitions
watch(
  () => route.path,
  async (newPath, oldPath) => {
    if (newPath !== oldPath) {
      // Cleanup existing ScrollTriggers before re-initializing
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      await nextTick()
      initAnimations()
    }
  },
)
</script>

<template>
  <div class="pt-28 font-meiland min-h-screen relative overflow-hidden">
    <!-- Ambient Blobs (Static Colors) -->
    <div
      class="absolute -z-10 top-[10%] left-[-10%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-brand-blue-light/28 blur-[100px] sm:blur-[130px] pointer-events-none"
      :class="compId === 'sdgs-visual-campaign' ? 'orb-purple-static' : 'orb-color-cycle'"
    ></div>

    <!-- Hero / Header Section -->
    <section v-if="!isLoading" class="max-w-6xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <!-- Title & description (6 cols) -->
        <div class="lg:col-span-6 flex flex-col gap-6">
          <h1
            class="font-rexlia text-4xl sm:text-5xl md:text-6xl tracking-wider leading-none select-none detail-fade"
          >
            <span class="bg-gradient-to-r bg-clip-text text-transparent" :class="compData.color">
              {{ compData.title.split(' ')[0] }}
            </span>
            <br />
            <span class="text-brand-navy">
              {{ compData.title.split(' ').slice(1).join(' ') }}
            </span>
          </h1>

          <p class="text-brand-grey text-base md:text-lg leading-relaxed max-w-xl detail-fade">
            {{ compData.description }}
          </p>

          <!-- Buttons -->
          <div class="flex flex-wrap items-center gap-4 detail-fade mt-2">
            <a
              :href="BASE_URL + compData.registrationLink"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-blue text-white font-rexlia text-sm tracking-wider hover:bg-brand-blue-light hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5 transition-all duration-300 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
              </svg>
              Pendaftaran
            </a>
            <a
              :href="compData.guideBookLink"
              target="_blank"
              class="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-brand-blue text-brand-blue font-rexlia text-sm tracking-wider hover:bg-brand-blue/5 hover:-translate-y-0.5 transition-all duration-300"
            >
              <BookOpen class="w-4 h-4" />
              Buku Panduan
            </a>
          </div>
        </div>

        <!-- Countdown Panel (6 cols) -->
        <div class="lg:col-span-6 detail-fade lg:pl-8">
          <Countdown :targetDate="compData.countdownTarget" :title="compData.countdownTitle" />
        </div>
      </div>
    </section>

    <!-- Skeleton for Hero -->
    <section v-else class="max-w-6xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div class="lg:col-span-6 flex flex-col gap-6">
          <div class="skeleton h-16 w-3/4 rounded-lg"></div>
          <div class="skeleton h-4 w-full rounded"></div>
          <div class="skeleton h-4 w-5/6 rounded mb-2"></div>
          <div class="skeleton h-4 w-4/5 rounded mb-2"></div>
          <div class="skeleton h-4 w-3/4 rounded"></div>
          <div class="flex gap-4 mt-2">
            <div class="skeleton h-12 w-40 rounded-full"></div>
            <div class="skeleton h-12 w-40 rounded-full"></div>
          </div>
        </div>
        <div class="lg:col-span-6 lg:pl-8">
          <div class="p-8 rounded-3xl border border-brand-blue/10 bg-white">
            <div class="skeleton h-8 w-3/4 rounded mb-4"></div>
            <!-- Countdown skeleton -->
            <div class="skeleton h-16 w-64 sm:w-80 rounded-xl"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Kriteria Umum Section -->
    <section v-if="!isLoading" class="max-w-6xl mx-auto px-6 py-16">
      <div class="inline-block border-b-4 border-brand-blue pb-1 mb-10">
        <h2
          class="font-rexlia text-xl md:text-2xl text-brand-navy tracking-wider uppercase font-bold"
        >
          Kriteria Umum
        </h2>
      </div>

      <div class="criteria-grid grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(crit, idx) in compData.criteria"
          :key="idx"
          class="criteria-card flex flex-col gap-4 p-6 rounded-3xl border border-brand-blue/10 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:border-brand-blue/30"
        >
          <div
            class="w-10 h-10 rounded-xl bg-brand-pale-teal/20 flex items-center justify-center text-brand-blue shrink-0 shadow-sm"
          >
            <component :is="iconMap[crit.icon]" class="w-5 h-5" />
          </div>
          <div>
            <h4 class="font-rexlia text-sm text-brand-navy font-bold tracking-wide mb-2">
              {{ crit.title }}
            </h4>
            <p class="text-brand-grey text-xs sm:text-sm leading-relaxed">
              {{ crit.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Skeleton for Kriteria -->
    <section v-else class="max-w-6xl mx-auto px-6 py-16">
      <div class="inline-block border-b-4 border-brand-blue pb-1 mb-10">
        <div class="skeleton h-8 w-48 rounded"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex flex-col gap-4 p-6 rounded-3xl border border-brand-blue/10 bg-white">
          <div class="skeleton w-10 h-10 rounded-xl"></div>
          <div class="skeleton h-5 w-3/4 rounded"></div>
          <div class="skeleton h-4 w-full rounded mb-2"></div>
          <div class="skeleton h-4 w-5/6 rounded"></div>
        </div>
        <div class="flex flex-col gap-4 p-6 rounded-3xl border border-brand-blue/10 bg-white">
          <div class="skeleton w-10 h-10 rounded-xl"></div>
          <div class="skeleton h-5 w-3/4 rounded"></div>
          <div class="skeleton h-4 w-full rounded mb-2"></div>
          <div class="skeleton h-4 w-5/6 rounded"></div>
        </div>
        <div class="flex flex-col gap-4 p-6 rounded-3xl border border-brand-blue/10 bg-white">
          <div class="skeleton w-10 h-10 rounded-xl"></div>
          <div class="skeleton h-5 w-3/4 rounded"></div>
          <div class="skeleton h-4 w-full rounded mb-2"></div>
          <div class="skeleton h-4 w-5/6 rounded"></div>
        </div>
      </div>
    </section>

    <!-- Timeline Kompetisi Section -->
    <section
      v-if="!isLoading"
      class="max-w-6xl mx-auto px-6 py-16 sm:py-24 flex flex-col gap-12 sm:gap-16 relative"
    >
      <!-- Timeline Blobs (Left side) -->
      <div
        class="absolute -z-10 top-[20%] left-[-8%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-brand-blue/25 blur-[90px] sm:blur-[110px] pointer-events-none"
        :class="compId === 'sdgs-visual-campaign' ? 'orb-purple-static' : 'orb-color-cycle'"
      ></div>
      <div
        class="absolute -z-10 top-[50%] left-[-5%] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full bg-brand-teal/20 blur-[80px] sm:blur-[100px] pointer-events-none"
        :class="compId === 'sdgs-visual-campaign' ? 'orb-purple-static' : 'orb-color-cycle'"
      ></div>

      <div class="text-center max-w-2xl mx-auto">
        <h2
          class="font-rexlia text-xl md:text-2xl text-brand-navy tracking-wide uppercase font-bold"
        >
          Timeline Kompetisi
        </h2>
      </div>

      <!-- Horizontal Timeline (Desktop) -->
      <div class="timeline-grid relative hidden lg:block pt-16 pb-20 mb-16">
        <!-- Connecting Line (Centered with the dots and responsive to N items) -->
        <div
          class="timeline-line absolute h-[4px] bg-gradient-to-r from-brand-blue/30 via-brand-blue-light/70 to-brand-blue/30 rounded-full shadow-[0_0_8px_rgba(30,136,229,0.3)]"
          :style="{
            top: '114px',
            left: 50 / compData.timeline.length + '%',
            right: 50 / compData.timeline.length + '%',
          }"
        ></div>

        <div
          class="grid gap-6"
          :style="{ gridTemplateColumns: `repeat(${compData.timeline.length}, minmax(0, 1fr))` }"
        >
          <div
            v-for="(step, idx) in compData.timeline"
            :key="idx"
            class="timeline-item flex flex-col items-center text-center relative group"
          >
            <!-- Date above the line -->
            <span
              class="font-mono text-xs text-brand-blue-light font-bold tracking-wider mb-6 block"
            >
              {{ step.date }}
            </span>

            <!-- Dot on the line -->
            <div
              class="timeline-dot relative w-5 h-5 rounded-full border-2 border-white bg-brand-blue-light/10 shadow-md z-10 flex items-center justify-center transition-all duration-300 group-hover:scale-125 mb-6"
              :class="
                step.highlight
                  ? 'bg-brand-teal-light border-brand-teal'
                  : 'bg-brand-blue border-brand-blue-light'
              "
            >
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>

            <!-- Title & Description inside rounded card -->
            <div
              class="timeline-card p-5 rounded-2xl border border-brand-blue/10 bg-white shadow-sm w-full max-w-xs transition-all duration-300 group-hover:shadow-md"
              :class="{ 'bg-brand-pale-teal/30 border-brand-teal-light shadow-md': step.highlight }"
            >
              <h4
                class="font-rexlia text-xs text-brand-navy font-bold tracking-wide mb-1 leading-normal"
              >
                {{ step.title }}
              </h4>
              <p class="text-brand-grey text-xs leading-relaxed">
                {{ step.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Vertical Timeline (Mobile) -->
      <div
        class="timeline-vertical lg:hidden flex flex-col gap-6 relative pl-8 before:absolute before:top-2 before:bottom-2 before:left-[13.5px] before:w-[3px] before:bg-brand-blue-light/30 before:rounded-full mb-16"
      >
        <div
          v-for="(step, idx) in compData.timeline"
          :key="idx"
          class="timeline-item flex flex-col gap-2 relative"
        >
          <!-- Dot -->
          <div
            class="timeline-dot-mobile absolute top-1.5 left-[-26px] w-4.5 h-4.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10"
            :class="
              step.highlight
                ? 'bg-brand-teal-light border-brand-teal'
                : 'bg-brand-blue border-brand-blue-light'
            "
          >
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>

          <span class="font-mono text-xs text-brand-blue-light font-bold tracking-wider">
            {{ step.date }}
          </span>

          <div
            class="timeline-card-mobile p-4 rounded-xl border border-brand-blue/10 bg-white w-full"
            :class="{ 'bg-brand-pale-teal/30 border-brand-teal-light shadow-sm': step.highlight }"
          >
            <h4
              class="font-rexlia text-xs text-brand-navy font-bold tracking-wide mb-1 leading-normal"
            >
              {{ step.title }}
            </h4>
            <p class="text-brand-grey text-xs leading-relaxed">
              {{ step.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Skeleton for Timeline -->
    <section v-else class="max-w-6xl mx-auto px-6 py-16 sm:py-24 flex flex-col gap-12 sm:gap-16">
      <div class="text-center max-w-2xl mx-auto">
        <div class="skeleton h-8 w-56 rounded"></div>
      </div>

      <!-- Horizontal Timeline Skeleton (Desktop) -->
      <div class="relative hidden lg:block pt-16 pb-20">
        <!-- Connecting Line Skeleton -->
        <div
          class="absolute h-[4px] bg-gradient-to-r from-brand-blue/30 via-brand-blue-light/70 to-brand-blue/30 rounded-full skeleton"
          :style="{
            top: '114px',
            left: 50 / 4 + '%',
            right: 50 / 4 + '%',
          }"
        ></div>

        <div
          class="grid gap-6"
          :style="{ gridTemplateColumns: `repeat(${compData.timeline.length}, minmax(0, 1fr))` }"
        >
          <div
            v-for="i in compData.timeline.length"
            :key="i"
            class="flex flex-col items-center text-center relative"
          >
            <!-- Date skeleton -->
            <div class="skeleton w-20 h-4 rounded mb-6"></div>
            <!-- Dot skeleton -->
            <div
              class="w-5 h-5 rounded-full border-2 border-white bg-brand-blue-light/10 shadow-md z-10 mb-6 skeleton"
            ></div>
            <!-- Card skeleton -->
            <div
              class="p-5 rounded-2xl border border-brand-blue/10 bg-white shadow-sm w-full max-w-xs"
            >
              <div class="skeleton h-5 w-3/4 rounded mb-2"></div>
              <div class="skeleton h-4 w-full rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Vertical Timeline Skeleton (Mobile) -->
      <div
        class="lg:hidden flex flex-col gap-6 relative pl-8 before:absolute before:top-2 before:bottom-2 before:left-[13.5px] before:w-[3px] before:bg-brand-blue-light/30 before:rounded-full"
      >
        <div v-for="i in compData.timeline.length" :key="i" class="flex flex-col gap-2 relative">
          <div
            class="absolute top-1.5 left-[-26px] w-4.5 h-4.5 rounded-full border-2 border-white shadow-sm skeleton"
          ></div>
          <div class="skeleton w-20 h-4 rounded"></div>
          <div class="p-4 rounded-xl border border-brand-blue/10 bg-white w-full">
            <div class="skeleton h-5 w-3/4 rounded mb-2"></div>
            <div class="skeleton h-4 w-full rounded"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Skeleton Animation */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Color Cycle Animation for Orbs */
.orb-color-cycle {
  animation: colorCycle 24s ease-in-out infinite;
}

@keyframes colorCycle {
  0%,
  100% {
    background-color: rgba(30, 136, 229, 0.28); /* Blue */
  }
  25% {
    background-color: rgba(0, 150, 136, 0.28); /* Green */
  }
  50% {
    background-color: rgba(0, 168, 204, 0.28); /* Bluish Green */
  }
  75% {
    background-color: rgba(147, 51, 234, 0.28); /* Purple */
  }
}

/* Static Purple for SDG Visual Campaign */
.orb-purple-static {
  background-color: rgba(147, 51, 234, 0.28) !important;
}
</style>
