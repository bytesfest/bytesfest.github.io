<script setup lang="ts">
import { Mail, Phone, Instagram } from 'lucide-vue-next'
import logoUns from '@/assets/logo_uns.webp'
import logoPtik from '@/assets/logo_ptik.webp'

interface Props {
  noMargin?: boolean
}

withDefaults(defineProps<Props>(), {
  noMargin: false
})
</script>

<template>
  <footer :class="['w-full bg-[#f2f3ff] border-t border-[#005ea4]/10 rounded-t-[40px] px-8 py-16 md:py-20 md:px-16 font-meiland', noMargin ? '' : 'mt-20']">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
      
      <!-- Brand & Mission (6 columns on desktop) -->
      <div class="col-span-1 md:col-span-6 flex flex-col gap-4">
        <h3 class="font-rexlia text-xl tracking-wider text-brand-blue-light ">
          BYTESFEST <span class="text-brand-navy font-bold">2026</span>
        </h3>
        <p class="text-brand-grey text-sm md:text-base max-w-md leading-relaxed">
          Program tahunan berskala nasional oleh HMP MIKROPTIK UNS. Wadah bagi pelajar, mahasiswa, dan masyarakat untuk menerapkan pengetahuan dan keterampilan teknologi dalam suasana kreatif, kolaboratif, dan kompetitif.
        </p>
      </div>

      <!-- Social Media Links (3 columns on desktop) -->
      <div class="col-span-1 md:col-span-3 flex flex-col gap-4">
        <h4 class="font-rexlia text-sm tracking-widest text-brand-navy uppercase">
          Media Sosial
        </h4>
        <div class="flex items-center gap-3">
          <a 
            href="https://instagram.com/bytesfest" 
            target="_blank" 
            rel="noopener noreferrer"
            class="w-11 h-11 rounded-full border border-brand-blue/20 bg-white flex items-center justify-center text-brand-navy hover:bg-brand-blue hover:text-white hover:border-brand-blue hover:-translate-y-1 transition-all duration-300 shadow-sm"
          >
            <Instagram class="w-5 h-5" />
          </a>
          <a 
            href="https://tiktok.com/@bytesfest" 
            target="_blank" 
            rel="noopener noreferrer"
            class="w-11 h-11 rounded-full border border-brand-blue/20 bg-white flex items-center justify-center text-brand-navy hover:bg-brand-blue hover:text-white hover:border-brand-blue hover:-translate-y-1 transition-all duration-300 shadow-sm"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Contact Info (3 columns on desktop) -->
      <div class="col-span-1 md:col-span-3 flex flex-col gap-4">
        <h4 class="font-rexlia text-sm tracking-widest text-brand-navy uppercase">
          Hubungi Kami
        </h4>
        <ul class="flex flex-col gap-2 text-sm text-brand-grey list-none m-0 p-0">
          <li class="flex items-center gap-3">
            <div class="w-8 h-8 min-w-[2rem] rounded-lg bg-white border border-brand-blue/10 flex items-center justify-center text-brand-blue flex-shrink-0">
              <Mail class="w-4 h-4" />
            </div>
            <a href="mailto:bytesfesthmpmikroptik@gmail.com" class="hover:text-brand-blue transition-colors duration-300 break-all leading-tight">
              bytesfesthmpmikroptik@gmail.com
            </a>
          </li>
          <li class="flex items-center gap-3">
            <div class="w-8 h-8 min-w-[2rem] rounded-lg bg-white border border-brand-blue/10 flex items-center justify-center text-brand-blue flex-shrink-0">
              <Phone class="w-4 h-4" />
            </div>
            <a href="https://wa.me/6282223533028" class="hover:text-brand-blue transition-colors duration-300 break-all leading-tight">
              +62 822-2353-3028
            </a>
          </li>
        </ul>
      </div>

    </div>

    <!-- Bottom Copyright -->
    <div class="max-w-7xl mx-auto mt-12 pt-6 border-t border-brand-blue/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-grey/70">
      <div class="flex items-center gap-4">
        <img :src="logoUns" alt="UNS Logo" class="h-10 w-auto object-contain" />
        <img :src="logoPtik" alt="PTIK Logo" class="h-10 w-auto object-contain" />
      </div>
      <p>&copy; 2026 BYTESFEST. All rights reserved.</p>
    </div>
  </footer>
</template>
