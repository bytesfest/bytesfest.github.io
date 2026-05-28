<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { GraduationCap, Calendar, History, Code, FileText, Globe, Megaphone, ArrowRight } from 'lucide-vue-next'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Countdown from '@/components/Countdown.vue'
import SkeletonLoader from '@/components/SkeletonLoader.vue'
import logoUns from '@/assets/logo_uns.webp'
import logoPtik from '@/assets/logo_ptik.webp'

gsap.registerPlugin(ScrollTrigger)

// Loading state
const isLoading = ref(true)

// Calculate a dynamic target date for the countdown so that it always shows around 45 days in the future for demo purposes, or a fixed date.
const countdownTarget = '2026-06-30T16:34:00.000Z'

const targetSection = ref<HTMLElement | null>(null)
const categorySection = ref<HTMLElement | null>(null)
const timelineSection = ref<HTMLElement | null>(null)

// Store ScrollTrigger instances for cleanup
let scrollTriggers: any[] = []

onMounted(async () => {
  // Simulate loading
  setTimeout(async () => {
    isLoading.value = false
    await nextTick() // wait for Vue to render the real content

    // Hero Entrance Animations (using fromTo to prevent opacity locking bugs)
    gsap.fromTo('.hero-fade', 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      }
    )

    // Target Peserta Scroll Animations (using fromTo to resolve scroll-reset opacity bugs)
    if (targetSection.value) {
      const trigger = ScrollTrigger.create({
        trigger: targetSection.value,
        start: 'top 80%',
        toggleActions: 'play none none none'
      })
      scrollTriggers.push(trigger)
      
      gsap.fromTo('.target-card', 
        { opacity: 0, x: 50 },
        {
          scrollTrigger: trigger,
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out'
        }
      )
    }

    // Kategori Kompetisi Scroll Animations (using fromTo to resolve hidden category cards bug)
    if (categorySection.value) {
      const trigger = ScrollTrigger.create({
        trigger: categorySection.value,
        start: 'top 80%',
            toggleActions: 'play none none none'
      })
      scrollTriggers.push(trigger)
      
      gsap.fromTo('.category-card', 
        { opacity: 0, y: 50 },
        {
          scrollTrigger: trigger,
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out'
        }
      )
    }

    // Timeline Scroll Animations
    if (timelineSection.value) {
      // Desktop: Animate connecting line first (slide in from left)
      const lineTrigger = ScrollTrigger.create({
        trigger: timelineSection.value,
        start: 'top 80%',
        toggleActions: 'play none none none'
      })
      scrollTriggers.push(lineTrigger)
      
      gsap.fromTo('.timeline-line',
        { opacity: 0, scaleX: 0, transformOrigin: 'left center' },
        {
          scrollTrigger: lineTrigger,
          opacity: 1,
          scaleX: 1,
          duration: 0.8,
          ease: 'power3.out'
        }
      )

      // Desktop: Animate dots (scale up with slide)
      const dotTrigger = ScrollTrigger.create({
        trigger: timelineSection.value,
        start: 'top 80%',
        toggleActions: 'play none none none'
      })
      scrollTriggers.push(dotTrigger)
      
      gsap.fromTo('.timeline-dot',
        { opacity: 0, scale: 0, y: -20 },
        {
          scrollTrigger: dotTrigger,
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out'
        }
      )

      // Desktop: Animate cards (slide up with fade)
      const cardTrigger = ScrollTrigger.create({
        trigger: timelineSection.value,
        start: 'top 80%',
        toggleActions: 'play none none none'
      })
      scrollTriggers.push(cardTrigger)
      
      gsap.fromTo('.timeline-card',
        { opacity: 0, y: 40, scale: 0.95 },
        {
          scrollTrigger: cardTrigger,
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out'
        }
      )

      // Mobile: Animate vertical line (slide down)
      const verticalTrigger = ScrollTrigger.create({
        trigger: timelineSection.value,
        start: 'top 80%',
        toggleActions: 'play none none none'
      })
      scrollTriggers.push(verticalTrigger)
      
      gsap.fromTo('.timeline-vertical',
        { opacity: 0 },
        {
          scrollTrigger: verticalTrigger,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out'
        }
      )

      // Mobile: Animate dots (scale in)
      const dotMobileTrigger = ScrollTrigger.create({
        trigger: timelineSection.value,
        start: 'top 80%',
        toggleActions: 'play none none none'
      })
      scrollTriggers.push(dotMobileTrigger)
      
      gsap.fromTo('.timeline-dot-mobile',
        { opacity: 0, scale: 0 },
        {
          scrollTrigger: dotMobileTrigger,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power3.out'
        }
      )

      // Mobile: Animate cards (slide in from left)
      const cardMobileTrigger = ScrollTrigger.create({
        trigger: timelineSection.value,
        start: 'top 80%',
        toggleActions: 'play none none none'
      })
      scrollTriggers.push(cardMobileTrigger)
      
      gsap.fromTo('.timeline-card-mobile',
        { opacity: 0, x: -30, scale: 0.95 },
        {
          scrollTrigger: cardMobileTrigger,
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.12,
          ease: 'power3.out'
        }
      )
    }
  }, 800)
})

// Cleanup ScrollTrigger instances on unmount
onUnmounted(() => {
  scrollTriggers.forEach(trigger => trigger.kill())
  scrollTriggers = []
  ScrollTrigger.getAll().forEach(t => t.kill())
})

const categories = [
  {
    title: 'HACKATHON',
    description: 'Selesaikan masalah nyata dengan solusi teknologi dalam 48 jam.',
    icon: Code,
    color: 'text-brand-blue bg-brand-blue/10 border-brand-blue/20',
    path: '/kompetisi/hackathon'
  },
  {
    title: 'ESSAY',
    description: 'Tuangkan ide inovatifmu dalam tulisan akademis yang kritis.',
    icon: FileText,
    color: 'text-brand-teal bg-brand-teal/10 border-brand-teal/20',
    path: '/kompetisi/essay'
  },
  {
    title: 'CREATIVE WEB',
    description: 'Rancang pengalaman web yang interaktif dan estetis.',
    icon: Globe,
    color: 'text-brand-lime bg-brand-lime/10 border-brand-lime/20',
    path: '/kompetisi/creative-web'
  },
  {
    title: 'SDGs VISUAL CAMPAIGN',
    description: 'Kampanyekan tujuan pembangunan berkelanjutan melalui karya visual.',
    icon: Megaphone,
    color: 'text-purple-600 bg-purple-50 border-purple-100',
    path: '/kompetisi/sdgs-visual-campaign'
  }
]

const targetAudience = [
  {
    title: 'Mahasiswa S1/Sederajat',
    description: 'Mahasiswa aktif tingkat D3/D4/S1 seluruh perguruan tinggi di Indonesia.',
    icon: GraduationCap
  },
  {
    title: 'Siswa SMK/SMA Sederajat',
    description: 'Siswa aktif tingkat menengah atas/kejuruan se-Indonesia.',
    icon: Calendar
  },
  {
    title: 'Gap Year SMA Maksimal 1 Tahun',
    description: 'Lulusan SMA/SMK sederajat dengan maksimal gap-year 1 tahun.',
    icon: History
  }
]

const timelineItems = [
  {
    date: '5 Juni - 30 Juni',
    title: 'Pendaftaran Gelombang 1',
    description: 'Pembukaan registrasi awal kompetisi',
    highlight: true
  },
  {
    date: '16 Juni - 8 Juli',
    title: 'Pendaftaran Gelombang 2',
    description: 'Pembukaan registrasi gelombang kedua',
    highlight: false
  },
  {
    date: '15 Juli - 20 Juli',
    title: 'Pengumuman Finalis',
    description: 'Pengumuman finalis terpilih yang lolos seleksi',
    highlight: false
  },
  {
    date: '23 Juli - 24 Juli',
    title: 'Hackathon Day',
    description: '48 jam kompetisi hackathon secara offline',
    highlight: false
  },
  {
    date: '25 Juli',
    title: 'Main Event & Awarding',
    description: 'Awarding pemenang',
    highlight: false
  }
]

const sponsors = [
  { name: 'UNS', logo: logoUns },
  { name: 'PTIK', logo: logoPtik }
]
</script>

<template>
  <div class="pt-28 font-sans relative overflow-hidden">
    <!-- Dynamic Background -->
    <div class="absolute inset-0 -z-10 overflow-hidden">
      <!-- Dynamic gradient orbs -->
      <div 
        class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-blue/35 blur-[130px] animate-float-1 animate-pulse-rotate orb-color-cycle"
      ></div>
      <div 
        class="absolute top-[20%] right-[-5%] w-[450px] h-[450px] rounded-full bg-brand-teal/30 blur-[110px] animate-float-2 animate-pulse-rotate orb-color-cycle"
      ></div>
      <div 
        class="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-brand-blue-light/25 blur-[90px] animate-float-3 animate-pulse-rotate orb-color-cycle"
      ></div>
      <div 
        class="absolute bottom-[-5%] right-[15%] w-[480px] h-[480px] rounded-full bg-brand-teal-light/28 blur-[120px] animate-float-4 animate-pulse-rotate orb-color-cycle"
      ></div>
      <!-- Third blob on left side between target peserta and kategori kompetisi -->
      <div 
        class="absolute top-[45%] left-[-8%] w-[350px] h-[350px] rounded-full bg-purple-500/30 blur-[100px] animate-float-3 animate-pulse-rotate orb-color-cycle"
      ></div>
    </div>
    <!-- Hero Section -->
    <section v-if="!isLoading" class="max-w-6xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center justify-center min-h-[80vh] gap-10 py-12">
      <div class="flex flex-col gap-6 max-w-4xl">
        <h1 class="font-rexlia text-[11vw] sm:text-6xl md:text-7xl lg:text-8xl tracking-wider leading-none select-none hero-fade">
          <span class="bg-gradient-to-r from-brand-blue via-brand-blue-light to-brand-teal-light bg-clip-text text-transparent">BYTESFEST</span>
          <br>
          <span class="text-brand-navy">2026</span>
        </h1>
        
        <p class="text-brand-grey text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed hero-fade">
          Program tahunan berskala nasional yang diselenggarakan oleh HMP MIKROPTIK FKIP UNS.
        </p>
      </div>

      <!-- Countdown -->
      <div class="w-full hero-fade">
        <Countdown :targetDate="countdownTarget" />
      </div>

      <!-- CTA Buttons -->
      <div class="flex flex-wrap items-center justify-center gap-4 hero-fade">
        <RouterLink 
          to="/daftar" 
          class="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-brand-blue text-white font-rexlia text-sm tracking-wider hover:bg-brand-blue-light hover:shadow-lg hover:shadow-brand-blue/20 hover:-translate-y-0.5 transition-all duration-300"
        >
          Daftar Sekarang
        </RouterLink>
        <RouterLink 
          to="/tentang" 
          class="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-brand-blue text-brand-blue font-rexlia text-sm tracking-wider hover:bg-brand-blue/5 hover:-translate-y-0.5 transition-all duration-300"
        >
          Tentang BYTESFEST
        </RouterLink>
      </div>
    </section>

    <!-- Hero Skeleton -->
    <section v-else class="max-w-6xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center justify-center min-h-[80vh] gap-10 py-12">
      <SkeletonLoader type="hero" />
    </section>

    <!-- Target Peserta Section -->
    <section v-if="!isLoading" ref="targetSection" class="max-w-6xl mx-auto px-6 py-16 sm:py-24">
      <div class="w-full border border-brand-blue/15 rounded-[32px] bg-white p-8 md:p-12 flex flex-col md:flex-row gap-10 md:gap-16 items-center shadow-sm">
        <div class="w-full md:w-1/2 flex flex-col gap-4">
          <h2 class="font-rexlia text-3xl md:text-4xl text-brand-navy tracking-wide uppercase leading-tight">
            Target Peserta
          </h2>
          <p class="text-brand-grey text-sm md:text-base leading-relaxed">
            Kompetisi ini terbuka untuk seluruh talenta muda berbakat di Indonesia yang ingin menguji kemampuan teknis dan kreativitas mereka.
          </p>
        </div>
        
        <div class="w-full md:w-1/2 flex flex-col gap-4">
          <div 
            v-for="(target, idx) in targetAudience" 
            :key="idx" 
            class="target-card flex items-start gap-4 p-5 rounded-2xl border border-brand-blue/10 hover:border-brand-blue/30 bg-brand-pale-teal/10 hover:bg-white hover:shadow-md transition-all duration-300"
          >
            <div class="w-10 h-10 rounded-xl bg-white border border-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 shadow-sm">
              <component :is="target.icon" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-rexlia text-sm text-brand-navy font-bold tracking-wide mb-1">{{ target.title }}</h4>
              <p class="text-brand-grey text-xs md:text-sm leading-relaxed">{{ target.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Kategori Kompetisi Section -->
    <section v-if="!isLoading" ref="categorySection" class="max-w-6xl mx-auto px-6 py-16 sm:py-24 flex flex-col gap-12 sm:gap-16">
      <div class="text-center max-w-2xl mx-auto">
        <h2 class="font-rexlia text-3xl md:text-4xl text-brand-navy tracking-wide uppercase">
          Kategori Kompetisi
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <RouterLink 
          v-for="(cat, idx) in categories" 
          :key="idx" 
          :to="cat.path"
          class="category-card group flex flex-col justify-between p-6 rounded-3xl border border-brand-blue/10 hover:border-brand-blue/30 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div class="flex flex-col gap-6">
            <div :class="`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${cat.color} group-hover:scale-110 transition-transform duration-300`">
              <component :is="cat.icon" class="w-6 h-6" />
            </div>
            
            <div>
              <h3 class="font-rexlia text-base text-brand-navy font-bold tracking-wide mb-2 group-hover:text-brand-blue transition-colors duration-300">
                {{ cat.title }}
              </h3>
              <p class="text-brand-grey text-xs sm:text-sm leading-relaxed">
                {{ cat.description }}
              </p>
            </div>
          </div>
          
          <div class="mt-8 flex items-center gap-2 text-xs font-rexlia text-brand-blue font-bold group-hover:gap-3 transition-all duration-300">
            Detail Lomba <ArrowRight class="w-3.5 h-3.5" />
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- Timeline Section -->
    <section v-if="!isLoading" ref="timelineSection" class="max-w-6xl mx-auto px-6 py-16 sm:py-24 flex flex-col gap-12 sm:gap-16">
      <div class="text-center max-w-2xl mx-auto">
        <h2 class="font-rexlia text-3xl md:text-4xl text-brand-navy tracking-wide uppercase">
          Timeline Kegiatan
        </h2>
      </div>

      <!-- Horizontal Timeline (Desktop) -->
      <div class="relative hidden lg:block pt-16 pb-20">
        <!-- Connecting Line (Centered with the dots and responsive to N items) -->
        <div 
          class="timeline-line absolute h-[4px] bg-gradient-to-r from-brand-blue/30 via-brand-blue-light/70 to-brand-blue/30 rounded-full shadow-[0_0_8px_rgba(30,136,229,0.3)]"
          :style="{ 
            top: '114px', 
            left: (50 / timelineItems.length) + '%', 
            right: (50 / timelineItems.length) + '%' 
          }"
        ></div>
        
        <div 
          class="grid gap-6"
          :style="{ gridTemplateColumns: `repeat(${timelineItems.length}, minmax(0, 1fr))` }"
        >
          <div 
            v-for="(item, idx) in timelineItems" 
            :key="idx"
            class="timeline-item flex flex-col items-center text-center relative group"
          >
            <!-- Date above the line -->
            <span class="font-mono text-xs text-brand-blue-light font-bold tracking-wider mb-6 block">
              {{ item.date }}
            </span>

            <!-- Dot on the line -->
            <div 
              class="timeline-dot relative w-5 h-5 rounded-full border-2 border-white bg-brand-blue-light/10 shadow-md z-10 flex items-center justify-center transition-all duration-300 group-hover:scale-125 mb-6"
              :class="item.highlight ? 'bg-brand-teal-light border-brand-teal' : 'bg-brand-blue border-brand-blue-light'"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>

            <!-- Title & Description inside rounded card -->
            <div 
              class="timeline-card p-5 rounded-2xl border border-brand-blue/10 bg-white shadow-sm w-full max-w-xs transition-all duration-300 group-hover:shadow-md"
              :class="{ 'bg-brand-pale-teal/30 border-brand-teal-light shadow-md': item.highlight }"
            >
              <h4 class="font-rexlia text-xs text-brand-navy font-bold tracking-wide mb-1 leading-normal">
                {{ item.title }}
              </h4>
              <p class="text-brand-grey text-xs leading-relaxed">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Vertical Timeline (Mobile) -->
      <div class="timeline-vertical lg:hidden flex flex-col gap-6 relative pl-8 before:absolute before:top-2 before:bottom-2 before:left-[13px] before:w-[3px] before:bg-brand-blue-light/30 before:rounded-full">
        <div 
          v-for="(item, idx) in timelineItems" 
          :key="idx"
          class="timeline-item flex flex-col gap-2 relative"
        >
          <!-- Dot -->
          <div 
            class="timeline-dot-mobile absolute top-1.5 left-[-26px] w-4.5 h-4.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10"
            :class="item.highlight ? 'bg-brand-teal-light border-brand-teal' : 'bg-brand-blue border-brand-blue-light'"
          >
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
          
          <span class="font-mono text-xs text-brand-blue-light font-bold tracking-wider">
            {{ item.date }}
          </span>
          
          <div 
            class="timeline-card-mobile p-4 rounded-xl border border-brand-blue/10 bg-white w-full"
            :class="{ 'bg-brand-pale-teal/30 border-brand-teal-light shadow-sm': item.highlight }"
          >
            <h4 class="font-rexlia text-xs text-brand-navy font-bold tracking-wide mb-1 leading-normal">
              {{ item.title }}
            </h4>
            <p class="text-brand-grey text-xs leading-relaxed">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Sponsor Section -->
    <section v-if="!isLoading" class="w-full bg-[#f2f3ff] py-10 overflow-hidden border-y border-[#005ea4]/10 flex flex-col items-center gap-6">
      <span class="font-sans text-xs md:text-sm font-semibold italic text-brand-navy/60 tracking-wider">
        SPECIAL THANKS TO OUR SPONSORS
      </span>
      
      <!-- Static sponsor container -->
      <div class="w-full flex justify-center items-center gap-24 py-2">
        <img 
          v-for="(sp, idx) in sponsors" 
          :key="idx" 
          :src="sp.logo"
          :alt="sp.name"
          class="h-16 sm:h-20 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </section>

    <!-- Content Skeleton -->
    <section v-else class="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-16">
      <div class="w-full border border-brand-blue/15 rounded-[32px] bg-white p-8 md:p-12 flex flex-col md:flex-row gap-10 md:gap-16 items-center shadow-sm">
        <div class="w-full md:w-1/2 flex flex-col gap-4">
          <SkeletonLoader type="text" :count="2" height="2.5rem" />
          <SkeletonLoader type="text" :count="3" />
        </div>
        <div class="w-full md:w-1/2 flex flex-col gap-4">
          <SkeletonLoader type="card" v-for="i in 3" :key="i" />
        </div>
      </div>
      
      <div class="text-center max-w-2xl mx-auto">
        <SkeletonLoader type="text" height="2.5rem" />
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonLoader type="card" v-for="i in 4" :key="i" />
      </div>
      
      <div class="text-center max-w-2xl mx-auto">
        <SkeletonLoader type="text" height="2.5rem" />
      </div>
      
      <SkeletonLoader type="timeline" :count="5" />
    </section>
  </div>
</template>

<style scoped>
/* Infinite Marquee Styles */
.animate-marquee {
  animation: marquee 25s linear infinite;
}

.animate-marquee2 {
  animation: marquee2 25s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes marquee2 {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0%);
  }
}

/* Float Animations for Dynamic Background */
.animate-float-1 {
  animation: float1 20s ease-in-out infinite;
  will-change: transform;
}

.animate-float-2 {
  animation: float2 25s ease-in-out infinite;
  will-change: transform;
}

.animate-float-3 {
  animation: float3 18s ease-in-out infinite;
  will-change: transform;
}

.animate-float-4 {
  animation: float4 22s ease-in-out infinite;
  will-change: transform;
}

@keyframes float1 {
  0%, 100% {
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
  0%, 100% {
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
  0%, 100% {
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
  0%, 100% {
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
  animation: pulseRotate 8s ease-in-out infinite, colorCycle 8s ease-in-out infinite;
  will-change: transform, background-color;
}

/* Color Cycle Animation for Orbs */
@keyframes colorCycle {
  0%, 100% {
    background-color: rgba(30, 136, 229, 0.35); /* Blue */
  }
  25% {
    background-color: rgba(0, 150, 136, 0.30); /* Green */
  }
  50% {
    background-color: rgba(0, 168, 204, 0.28); /* Bluish Green */
  }
  75% {
    background-color: rgba(147, 51, 234, 0.30); /* Purple */
  }
}

@keyframes pulseRotate {
  0%, 100% {
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
