<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import Countdown from '@/components/Countdown.vue'

// Mouse tracking for interactive orbs
const mouseX = ref(0)
const mouseY = ref(0)
const orbPositions = ref([
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
])

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 2
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 2

  // Update orb positions based on mouse
  orbPositions.value = [
    { x: mouseX.value * 30, y: mouseY.value * 30 },
    { x: mouseX.value * -25, y: mouseY.value * 25 },
    { x: mouseX.value * 20, y: mouseY.value * -35 },
    { x: mouseX.value * -35, y: mouseY.value * -20 },
  ]
}

// Target date for grand opening: June 5, 2026
const countdownTarget = '2026-06-05T00:00:00.000Z'

const heroTitle = ref<HTMLElement | null>(null)

onMounted(() => {
  // Add mouse move listener
  window.addEventListener('mousemove', handleMouseMove)

  // Hero Entrance Animations
  gsap.fromTo(
    '.countdown-fade',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
    },
  )
})
</script>

<template>
  <div
    class="min-h-screen font-sans relative overflow-hidden flex items-center justify-center"
    @mousemove="handleMouseMove"
  >
    <!-- Dynamic Background -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <!-- Interactive gradient orbs -->
      <div
        class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-blue/35 blur-[130px] animate-float-1 animate-pulse-rotate cursor-pointer transition-all duration-500 hover:bg-brand-blue/45 hover:scale-110"
        :style="{
          transform: `translate(${orbPositions[0]?.x ?? 0}px, ${orbPositions[0]?.y ?? 0}px)`,
        }"
        @click="orbPositions[0] = { x: 0, y: 0 }"
      ></div>
      <div
        class="absolute top-[20%] right-[-5%] w-[450px] h-[450px] rounded-full bg-brand-teal/30 blur-[110px] animate-float-2 animate-pulse-rotate cursor-pointer transition-all duration-500 hover:bg-brand-teal/40 hover:scale-110"
        :style="{
          transform: `translate(${orbPositions[1]?.x ?? 0}px, ${orbPositions[1]?.y ?? 0}px)`,
        }"
        @click="orbPositions[1] = { x: 0, y: 0 }"
      ></div>
      <div
        class="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-brand-blue-light/25 blur-[90px] animate-float-3 animate-pulse-rotate cursor-pointer transition-all duration-500 hover:bg-brand-blue-light/35 hover:scale-110"
        :style="{
          transform: `translate(${orbPositions[2]?.x ?? 0}px, ${orbPositions[2]?.y ?? 0}px)`,
        }"
        @click="orbPositions[2] = { x: 0, y: 0 }"
      ></div>
      <div
        class="absolute bottom-[-5%] right-[15%] w-[480px] h-[480px] rounded-full bg-brand-teal-light/28 blur-[120px] animate-float-4 animate-pulse-rotate cursor-pointer transition-all duration-500 hover:bg-brand-teal-light/38 hover:scale-110"
        :style="{
          transform: `translate(${orbPositions[3]?.x ?? 0}px, ${orbPositions[3]?.y ?? 0}px)`,
        }"
        @click="orbPositions[3] = { x: 0, y: 0 }"
      ></div>

      <!-- Grid pattern overlay -->
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMMCAwTDQwIDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwNWVhNCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"
      ></div>
    </div>

    <!-- Main Content -->
    <div
      class="max-w-6xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center justify-center gap-12 py-12"
    >
      <div ref="heroTitle" class="flex flex-col gap-6 max-w-4xl">
        <h1
          class="font-rexlia text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider leading-none select-none countdown-fade"
        >
          <span
            class="bg-gradient-to-r from-brand-blue via-brand-blue-light to-brand-teal-light bg-clip-text text-transparent"
            >PREPARE</span
          >
          <br />
          <span class="text-brand-navy">YOURSELF</span>
        </h1>

        <p
          class="text-brand-grey text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed countdown-fade"
        >
          BYTESFEST 2026 akan segera dibuka. Siapkan diri Anda untuk kompetisi tahunan berskala
          nasional yang diselenggarakan oleh HMP MIKROPTIK FKIP UNS.
        </p>
      </div>

      <!-- Countdown -->
      <div class="w-full countdown-fade">
        <Countdown :targetDate="countdownTarget" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Float Animations for Dynamic Background */
.animate-float-1 {
  animation: float1 20s ease-in-out infinite;
}

.animate-float-2 {
  animation: float2 25s ease-in-out infinite;
}

.animate-float-3 {
  animation: float3 18s ease-in-out infinite;
}

.animate-float-4 {
  animation: float4 22s ease-in-out infinite;
}

@keyframes float1 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes float2 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(-40px, 30px) scale(1.05);
  }
  66% {
    transform: translate(20px, -40px) scale(0.95);
  }
}

@keyframes float3 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(25px, 40px) scale(1.08);
  }
  66% {
    transform: translate(-35px, -25px) scale(0.92);
  }
}

@keyframes float4 {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(-30px, -35px) scale(1.1);
  }
  66% {
    transform: translate(45px, 25px) scale(0.9);
  }
}

/* Pulse and Rotate Animation */
.animate-pulse-rotate {
  animation: pulseRotate 8s ease-in-out infinite;
}

@keyframes pulseRotate {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.05) rotate(5deg);
  }
  50% {
    transform: scale(1.1) rotate(0deg);
  }
  75% {
    transform: scale(1.05) rotate(-5deg);
  }
}
</style>
