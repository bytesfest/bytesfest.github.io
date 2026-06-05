<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { Code, FileText, Globe, Megaphone, ArrowUpRight, ArrowRight } from 'lucide-vue-next'
import { gsap } from 'gsap'
import Kompetisi from '@/data/kompetisi.json'

// Loading state
const isLoading = ref(true)

const iconMap = {
  Code: Code,
  FileText: FileText,
  Globe: Globe,
  Megaphone: Megaphone,
}

function getIconMap(icon: string) {
  return iconMap[icon as keyof typeof iconMap]
}

// there is no top-level await here; the await lives inside the setTimeout callback
onMounted(() => {
  // FIX Bug 1: GSAP moved inside setTimeout + after nextTick
  // so .daftar-fade elements exist in the DOM before GSAP targets them
  setTimeout(async () => {
    isLoading.value = false
    await nextTick()

    // Header elements fade in together first
    gsap.from('.daftar-fade', {
      opacity: 0,
      y: 30,
      duration: 0.5,
      stagger: 0.15,
      ease: 'power3.out',
    })

    // Hide all cards immediately before animating to prevent the flash-then-disappear glitch
    // that happens when gsap.from() snaps visible elements back to opacity:0
    gsap.set('.comp-card', { opacity: 0, y: 40 })

    // Cards animate one by one in reading order: top-left → top-right → bottom-left → bottom-right
    gsap.to('.comp-card', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 0.2,
    })
  }, 600)
})
</script>

<template>
  <div class="pt-28 font-meiland min-h-screen relative overflow-hidden">
    <!-- Ambient Blobs -->
    <div
      class="absolute -z-10 bottom-[10%] left-[25%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] rounded-full bg-brand-blue-light/26 blur-[120px] sm:blur-[150px] pointer-events-none orb-color-cycle"
    ></div>

    <template v-if="!isLoading">
      <!-- Header Section -->
      <section class="max-w-4xl mx-auto px-6 py-12 text-center flex flex-col items-center gap-5">
        <h1
          class="font-rexlia text-3xl sm:text-4xl md:text-5xl text-brand-navy tracking-wider uppercase leading-tight daftar-fade"
        >
          PILIH KOMPETISI
        </h1>

        <p class="text-brand-grey text-base md:text-lg max-w-xl leading-relaxed daftar-fade">
          Pilih cabang perlombaan BYTESFEST 2026 yang ingin Anda ikuti, siapkan tim Anda, dan
          daftarkan diri Anda segera!
        </p>
      </section>

      <!-- Cards Grid -->
      <section class="max-w-5xl mx-auto px-6 pb-24">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="comp in Object.entries(Kompetisi)"
            :key="comp[1].path"
            class="comp-card group flex flex-col justify-between p-8 rounded-[32px] border border-brand-blue/10 bg-white hover:shadow-xl hover:border-brand-blue/20 transition-all duration-300"
          >
            <div>
              <!-- Icon & Headings -->
              <div class="flex items-start justify-between gap-4">
                <div
                  :class="`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-105 ${comp[1].colorClass}`"
                >
                  <component :is="getIconMap(comp[1].icon)" class="w-7 h-7" />
                </div>

                <RouterLink
                  :to="comp[1].path"
                  class="w-10 h-10 rounded-full border border-brand-blue/15 flex items-center justify-center text-brand-grey hover:text-brand-blue hover:border-brand-blue hover:bg-brand-pale-teal/10 transition-all duration-300"
                  title="Lihat Detail Lomba"
                >
                  <ArrowRight class="w-4 h-4" />
                </RouterLink>
              </div>

              <div class="mt-6">
                <h3
                  class="font-rexlia text-xl text-brand-navy font-bold tracking-wide group-hover:text-brand-blue transition-colors duration-300"
                >
                  {{ comp[1].shortTitle }}
                </h3>
                <p
                  class="font-mono text-xs text-brand-blue-light/80 font-bold uppercase tracking-wider mt-1"
                >
                  {{ comp[1].subtitle }}
                </p>

                <p class="text-brand-grey text-xs sm:text-sm leading-relaxed mt-4">
                  {{ comp[1].shortDescription }}
                </p>
              </div>
            </div>

            <!-- Buttons -->
            <div class="mt-10 flex flex-col sm:flex-row gap-3">
              <a
                :href="comp[1].registrationLink"
                target="_blank"
                rel="noopener noreferrer"
                :class="`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-rexlia text-xs tracking-wider shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer ${comp[1].btnClass}`"
              >
                Daftar Sekarang
                <ArrowUpRight class="w-3.5 h-3.5" />
              </a>

              <RouterLink
                :to="comp[1].path"
                class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full border border-brand-blue/20 text-brand-blue font-rexlia text-xs tracking-wider hover:bg-brand-blue/5 hover:-translate-y-0.5 transition-all duration-300"
              >
                Detail Lomba
              </RouterLink>
            </div>
          </div>
        </div>
      </section>
    </template>

    <template v-else>
      <!-- Skeleton Header -->
      <section class="max-w-4xl mx-auto px-6 py-12 text-center flex flex-col items-center gap-5">
        <div class="skeleton h-14 w-3/4 rounded-lg"></div>
        <div class="skeleton h-4 w-full rounded mb-2"></div>
        <div class="skeleton h-4 w-2/3 rounded"></div>
      </section>

      <!-- Skeleton Cards Grid -->
      <section class="max-w-5xl mx-auto px-6 pb-24">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="i in Object.keys(Kompetisi).length"
            :key="i"
            class="flex flex-col justify-between p-8 rounded-[32px] border border-brand-blue/10 bg-white"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="skeleton w-14 h-14 rounded-2xl"></div>
              <div class="skeleton w-10 h-10 rounded-full"></div>
            </div>
            <div class="mt-6 flex flex-col gap-3">
              <div class="skeleton h-6 w-3/4 rounded"></div>
              <div class="skeleton h-3 w-1/2 rounded"></div>
              <div class="skeleton h-4 w-full rounded"></div>
              <div class="skeleton h-4 w-5/6 rounded"></div>
            </div>
            <div class="mt-10 flex gap-3">
              <div class="skeleton h-12 w-32 rounded-full"></div>
              <div class="skeleton h-12 w-32 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
    </template>
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
  animation: colorCycle 8s ease-in-out infinite;
}

@keyframes colorCycle {
  0%,
  100% {
    background-color: rgba(30, 136, 229, 0.26); /* Blue */
  }
  25% {
    background-color: rgba(0, 150, 136, 0.26); /* Green */
  }
  50% {
    background-color: rgba(0, 168, 204, 0.26); /* Bluish Green */
  }
  75% {
    background-color: rgba(147, 51, 234, 0.26); /* Purple */
  }
}
</style>
